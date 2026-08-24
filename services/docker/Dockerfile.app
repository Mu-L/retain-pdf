FROM rust:1.89-slim-bookworm AS builder

ARG TYPST_VERSION=0.14.2
ARG CMARKER_VERSION=0.1.8
ARG MITEX_VERSION=0.2.6

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    pkg-config \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY api/Cargo.toml api/Cargo.lock api/build.rs ./api/
COPY api/crates ./api/crates
COPY api/src ./api/src

WORKDIR /build/api
RUN cargo build --release --locked --workspace --bins

FROM python:3.11-slim-bookworm AS python-lock

COPY --from=ghcr.io/astral-sh/uv:0.11.19 /uv /uvx /bin/

WORKDIR /workspace

COPY pyproject.toml uv.lock ./
COPY ai/pyproject.toml ai/pyproject.toml
COPY pipeline/pyproject.toml pipeline/pyproject.toml

RUN uv export \
    --locked \
    --no-dev \
    --no-emit-workspace \
    --format requirements-txt \
    --output-file /requirements-backend.txt

FROM python:3.11-slim-bookworm AS typstsrc

ARG TYPST_VERSION=0.14.2
ARG CMARKER_VERSION=0.1.8
ARG MITEX_VERSION=0.2.6

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    tar \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /tmp/typst /opt/typst/bin /opt/typst-packages/preview

RUN set -eux; \
    ARCH="$(uname -m)"; \
    case "$ARCH" in \
      x86_64) TYPST_ARCH="x86_64" ;; \
      aarch64) TYPST_ARCH="aarch64" ;; \
      *) echo "Unsupported architecture: $ARCH"; exit 1 ;; \
    esac; \
    curl -fsSL "https://github.com/typst/typst/releases/download/v${TYPST_VERSION}/typst-${TYPST_ARCH}-unknown-linux-musl.tar.xz" \
    -o /tmp/typst/typst.tar.xz \
    && tar -xJf /tmp/typst/typst.tar.xz -C /tmp/typst \
    && cp /tmp/typst/typst-${TYPST_ARCH}-unknown-linux-musl/typst /opt/typst/bin/typst

RUN set -eux; \
    for pkg in cmarker:${CMARKER_VERSION} mitex:${MITEX_VERSION}; do \
      name="${pkg%%:*}"; \
      version="${pkg##*:}"; \
      mkdir -p "/tmp/typst/${name}" "/opt/typst-packages/preview/${name}/${version}"; \
      curl -fsSL "https://packages.typst.org/preview/${name}-${version}.tar.gz" \
        -o "/tmp/typst/${name}.tar.gz"; \
      tar -xzf "/tmp/typst/${name}.tar.gz" -C "/tmp/typst/${name}"; \
      cp -R "/tmp/typst/${name}/." "/opt/typst-packages/preview/${name}/${version}/"; \
    done

FROM python:3.11-slim-bookworm AS runtime

ARG CMARKER_VERSION=0.1.8
ARG MITEX_VERSION=0.2.6

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PROJECT_ROOT=/app \
    RUST_API_ROOT=/app/services/api \
    RUST_API_DATA_ROOT=/data \
    OUTPUT_ROOT=/data/jobs \
    PYTHON_BIN=python3 \
    RETAIN_OCR_PROVIDER_CONFIG=/app/services/config/ocr_providers.json \
    TYPST_BIN=/usr/local/bin/typst \
    TYPST_PACKAGE_PATH=/app/backend/typst-packages \
    TYPST_PACKAGE_CACHE_PATH=/data/typst-package-cache \
    RETAIN_PDF_FONT_PATH=/usr/local/share/fonts/source-han-serif/SourceHanSerifSC-Regular.otf \
    RETAIN_PDF_TITLE_BOLD_FONT_PATH=/usr/local/share/fonts/source-han-serif/SourceHanSerifSC-Bold.otf \
    RETAIN_PDF_TYPST_FONT_DIRS=/usr/local/share/fonts/source-han-serif \
    RETAIN_PDF_TYPST_FONT_FAMILY="Source Han Serif SC" \
    RUST_API_AI_SUPERVISE=1 \
    RUST_API_AI_COMMAND=python3 \
    RUST_API_AI_ARGS="-m retainpdf_ai" \
    RUST_API_AI_CWD=/app/services/ai \
    RETAIN_AI_FX_AGENT_CLI_COMMAND=/usr/local/bin/retainpdf-agent \
    CMARKER_VERSION=${CMARKER_VERSION} \
    MITEX_VERSION=${MITEX_VERSION} \
    RUST_API_BIND_HOST=0.0.0.0 \
    RUST_API_PORT=41000 \
    RUST_API_SIMPLE_PORT=42000

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    fontconfig \
    fonts-noto-cjk \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

COPY --from=typstsrc /opt/typst/bin/typst /usr/local/bin/typst
COPY --from=typstsrc /opt/typst-packages /app/backend/typst-packages

RUN mkdir -p /usr/local/share/fonts/source-han-serif

COPY fonts /usr/local/share/fonts/source-han-serif
COPY docker/fontconfig/65-source-han-serif-alias.conf /etc/fonts/conf.d/65-source-han-serif-alias.conf

RUN fc-scan /usr/local/share/fonts/source-han-serif/SourceHanSerifSC-Regular.otf >/dev/null \
    && fc-scan /usr/local/share/fonts/source-han-serif/SourceHanSerifSC-Bold.otf >/dev/null \
    && fc-cache -f

COPY --from=python-lock /requirements-backend.txt /tmp/requirements-backend.txt
RUN pip install --no-cache-dir --require-hashes -r /tmp/requirements-backend.txt

COPY --from=builder /build/api/target/release/rust_api /usr/local/bin/rust_api
COPY --from=builder /build/api/target/release/retain-jobsd /usr/local/bin/retain-jobsd
COPY --from=builder /build/api/target/release/retainpdf-agent /usr/local/bin/retainpdf-agent
COPY config /app/services/config
COPY pipeline /app/services/pipeline
COPY ai /app/services/ai
RUN pip install --no-cache-dir --no-deps /app/services/pipeline /app/services/ai
# 兼容旧路径（过渡期）
RUN mkdir -p /app/backend/scripts && cp -r /app/services/pipeline/* /app/backend/scripts/ 2>/dev/null || true
COPY api/auth.local.example.json /app/services/api/auth.local.example.json
COPY docker/entrypoint-app.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh \
    && mkdir -p /app/services/api /app/backend/scripts /data/uploads /data/downloads /data/db /data/jobs /data/typst-package-cache

VOLUME ["/data"]

EXPOSE 41000 42000

ENTRYPOINT ["/entrypoint.sh"]
