"""工具注册表:name + JSON Schema + handler 的标准形状。

约定与主流 agent 框架同构——将来若迁移到某个 SDK,工具定义原样搬走,
只换循环外壳。每个工具返回可 JSON 序列化的 dict;检索类结果统一带
(document_id, job_id, page_idx, block_id) 锚点,并由 agent 层编号成
可引用的 ref。
"""

from __future__ import annotations

import re
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import quote, unquote

from .blocks import Block, load_job_blocks, read_page_blocks
from .config import Settings
from .markdown import (
    MarkdownChunk,
    find_markdown_chunk,
    load_markdown_chunks,
    markdown_text_for_model,
    search_markdown_chunks,
)
from .rust_client import RustApiClient

# job_id 白名单：字母数字开头 + [-._] 组成，禁止路径分隔符/..。
# 关键安全边界——job_id 来自模型工具参数（上下文含文档内容 = 提示注入面），
# 直接拼进 data_root/jobs/<job_id> 前必须过这道闸，否则可目录穿越。
_SAFE_JOB_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")


def _safe_job_root(settings: Settings, job_id: str) -> Path | None:
    """job_id 合法则返回 jobs 根下的目录，否则 None（调用方按任务不存在处理）。"""
    if not _SAFE_JOB_ID_RE.fullmatch(job_id) or ".." in job_id:
        return None
    return settings.data_root / "jobs" / job_id


def _markdown_asset_url(
    job_root: Path,
    job_id: str,
    page_idx: int,
    asset_id: str,
    asset_uri: str = "",
) -> str:
    """Resolve one normalized asset ID to its authenticated Markdown image URL."""
    normalized = str(asset_uri or asset_id or "").replace("\\", "/").lstrip("/")
    while normalized.startswith("./"):
        normalized = normalized[2:]
    for prefix in ("md/images/", "images/"):
        if normalized.startswith(prefix):
            normalized = normalized[len(prefix) :]
            break
    encoded_parts = [part for part in normalized.split("/") if part]
    try:
        parts = [unquote(part) for part in encoded_parts]
    except (TypeError, ValueError):
        return ""
    if not parts or any(
        part in {".", ".."} or "/" in part or "\\" in part or "\x00" in part
        for part in parts
    ):
        return ""
    images_root = job_root / "md" / "images"
    if re.fullmatch(r"page-\d+", parts[0], flags=re.IGNORECASE):
        path = images_root / Path(*parts)
    else:
        # Compatibility with document.v1 <= 1.1 artifacts whose IDs were only
        # relative to their page-local image directory.
        path = images_root / f"page-{int(page_idx) + 1}" / Path(*parts)
    try:
        rel = path.resolve().relative_to(images_root.resolve()).as_posix()
    except (OSError, ValueError):
        return ""
    if not path.is_file():
        return ""
    encoded = "/".join(quote(part, safe="") for part in rel.split("/"))
    return f"/api/v1/jobs/{job_id}/markdown/images/{encoded}"


def _markdown_chunk_assets(
    job_root: Path, job_id: str, chunk: MarkdownChunk
) -> list[dict[str, str]]:
    assets: list[dict[str, str]] = []
    seen: set[str] = set()
    for image in chunk.images:
        url = _markdown_asset_url(job_root, job_id, 0, image.path, image.path)
        if not url or url in seen:
            continue
        seen.add(url)
        assets.append({"image_url": url, "alt": image.alt})
    return assets


def _block_asset_urls(job_root: Path, job_id: str, block: Block) -> list[str]:
    urls: list[str] = []
    for index, asset_id in enumerate(block.asset_ids):
        asset_uri = block.asset_uris[index] if index < len(block.asset_uris) else ""
        url = _markdown_asset_url(
            job_root,
            job_id,
            block.page_idx,
            asset_id,
            asset_uri,
        )
        if url and url not in urls:
            urls.append(url)
    return urls


def _canonical_block_id(value: str) -> str:
    match = re.fullmatch(r"(p\d+)-b(\d+)", str(value or "").strip(), flags=re.IGNORECASE)
    if match is None:
        return str(value or "").strip()
    return f"{match.group(1).lower()}-b{int(match.group(2)):04d}"


@dataclass(frozen=True)
class Tool:
    name: str
    description: str
    parameters: dict[str, Any]
    handler: Callable[[dict[str, Any]], dict[str, Any]]

    def as_openai_tool(self) -> dict[str, Any]:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters,
            },
        }


class ToolRegistry:
    def __init__(self, tools: list[Tool]) -> None:
        self._tools = {tool.name: tool for tool in tools}

    def specs(self, names: set[str] | frozenset[str] | None = None) -> list[dict[str, Any]]:
        return [
            tool.as_openai_tool()
            for tool in self._tools.values()
            if names is None or tool.name in names
        ]

    def invoke(self, name: str, arguments: dict[str, Any]) -> dict[str, Any]:
        tool = self._tools.get(name)
        if tool is None:
            return {"error": f"unknown tool: {name}"}
        try:
            return tool.handler(arguments)
        except Exception as exc:  # 工具失败作为结果反馈给模型,不中断循环
            return {"error": f"{type(exc).__name__}: {exc}"}


def build_default_registry(settings: Settings, rust: RustApiClient) -> ToolRegistry:
    def markdown_scope(arguments: dict[str, Any]) -> tuple[str, str, Path] | dict[str, Any]:
        document_id = str(arguments.get("document_id") or "").strip()
        job_id = str(arguments.get("job_id") or "").strip()
        if not job_id and document_id:
            document = rust.get_document(document_id)
            job_id = str(document.get("active_job_id") or "").strip()
        if job_id:
            document = rust.get_document_by_job(job_id)
            if not isinstance(document, dict) or not document:
                return {"error": "job_id does not belong to an accessible document"}
            resolved_document_id = str(
                document.get("document_id") or ""
            ).strip()
            if not resolved_document_id:
                return {"error": "job_id is missing its document association"}
            if document_id and resolved_document_id and document_id != resolved_document_id:
                return {"error": "document_id and job_id do not refer to the same document"}
            if resolved_document_id:
                document_id = resolved_document_id
        if not job_id:
            return {"error": "当前文档没有可读取的 Markdown job"}
        job_root = _safe_job_root(settings, job_id)
        if job_root is None:
            return {"error": f"invalid job_id: {job_id!r}"}
        return document_id, job_id, job_root

    def search_markdown(arguments: dict[str, Any]) -> dict[str, Any]:
        query = str(arguments.get("query") or "").strip()
        if not query:
            return {"error": "query must not be empty"}
        scope = markdown_scope(arguments)
        if isinstance(scope, dict):
            return scope
        document_id, job_id, job_root = scope
        chunks = load_markdown_chunks(job_root)
        ranked = search_markdown_chunks(
            chunks,
            query,
            limit=max(1, min(int(arguments.get("limit") or 8), 12)),
        )
        hits = []
        for chunk, score in ranked:
            assets = _markdown_chunk_assets(job_root, job_id, chunk)
            hits.append({
                "document_id": document_id,
                "job_id": job_id,
                "page_idx": None,
                "block_id": chunk.chunk_id,
                "chunk_id": chunk.chunk_id,
                "heading": chunk.heading,
                "char_start": chunk.char_start,
                "char_end": chunk.char_end,
                "source_snippet": markdown_text_for_model(chunk.text)[:1200],
                "assets": assets,
                "score": score,
                "source": "markdown",
            })
        payload: dict[str, Any] = {
            "document_id": document_id,
            "job_id": job_id,
            "hits": hits,
        }
        if not hits:
            payload["hint"] = (
                "当前 Markdown 中没有匹配片段。可换用文献中的英文术语或更短关键词；"
                "仍无结果时请明确说明 Markdown 未提供证据。"
            )
        return payload

    def read_markdown_chunk(arguments: dict[str, Any]) -> dict[str, Any]:
        chunk_id = str(arguments.get("chunk_id") or "").strip()
        if not chunk_id:
            return {"error": "chunk_id is required"}
        scope = markdown_scope(arguments)
        if isinstance(scope, dict):
            return scope
        document_id, job_id, job_root = scope
        chunk = find_markdown_chunk(load_markdown_chunks(job_root), chunk_id)
        if chunk is None:
            return {"error": f"Markdown chunk not found: {chunk_id}"}
        max_chars = max(400, min(int(arguments.get("max_chars") or 4000), 8000))
        return {
            "document_id": document_id,
            "job_id": job_id,
            "page_idx": None,
            # Reuse the anchored block result shape so the existing citation
            # pipeline remains stable while its evidence is Markdown-only.
            "blocks": [
                {
                    "block_id": chunk.chunk_id,
                    "chunk_id": chunk.chunk_id,
                    "heading": chunk.heading,
                    "source_text": markdown_text_for_model(chunk.text)[:max_chars],
                    "assets": _markdown_chunk_assets(job_root, job_id, chunk),
                    "translated_text": "",
                    "char_start": chunk.char_start,
                    "source_text_length": len(chunk.text),
                    "translated_text_length": 0,
                    "source_has_more": len(chunk.text) > max_chars,
                    "translated_has_more": False,
                    "source": "markdown",
                }
            ],
        }

    def search_fulltext(arguments: dict[str, Any]) -> dict[str, Any]:
        query = str(arguments.get("query") or "").strip()
        if not query:
            return {"error": "query must not be empty"}
        limit = int(arguments.get("limit") or 10)
        document_id = str(arguments.get("document_id") or "").strip()
        hits = rust.search_fulltext(
            query,
            limit=max(1, min(limit, 30)),
            document_id=document_id,
        )
        # 只使用命中 block 在 document.v1 中的精确资产关系。无法解析关系时
        # 宁可不返回图片，也不按页枚举并把同页无关图片挂到命中上。
        enriched_hits: list[dict[str, Any]] = []
        block_cache: dict[str, dict[str, Block]] = {}
        for hit in hits:
            if not isinstance(hit, dict):
                continue
            item = dict(hit)
            hit_job_id = str(item.get("job_id") or "").strip()
            if hit_job_id:
                job_root = _safe_job_root(settings, hit_job_id)
                if job_root is not None:
                    block_map = block_cache.get(hit_job_id)
                    if block_map is None:
                        try:
                            block_map = {
                                _canonical_block_id(block.block_id): block
                                for block in load_job_blocks(job_root)
                            }
                        except (OSError, ValueError, TypeError):
                            block_map = {}
                        block_cache[hit_job_id] = block_map
                    block = block_map.get(_canonical_block_id(str(item.get("block_id") or "")))
                    images: list[str] = []
                    if block is not None:
                        images = _block_asset_urls(job_root, hit_job_id, block)
                        item.update(
                            {
                                "bbox": list(block.bbox) if block.bbox is not None else None,
                                "bbox_unit": "pdf_point",
                                "bbox_origin": "top_left",
                                "block_type": block.block_type,
                                "asset_id": block.asset_id or None,
                                "asset_ids": list(block.asset_ids),
                                "asset_image_urls": images,
                            }
                        )
                    if images:
                        item["image_urls"] = images
            enriched_hits.append(item)
        payload: dict[str, Any] = {"hits": enriched_hits}
        if document_id:
            payload["document_id"] = document_id
        if document_id and not enriched_hits:
            payload["hint"] = (
                "该文档全文索引无命中：可能尚未建立 blocks_fts，"
                "或关键词不在原文/译文中。可换关键词，或说明暂无证据。"
            )
        return payload

    def list_documents(arguments: dict[str, Any]) -> dict[str, Any]:
        # 整本问答会话会注入 document_id：只返回当前文档，避免跨库噪声
        scoped_id = str(arguments.get("document_id") or "").strip()
        if scoped_id:
            try:
                document = rust.get_document(scoped_id)
            except Exception as exc:
                return {"error": f"{type(exc).__name__}: {exc}", "documents": []}
            return {
                "documents": [
                    {
                        "document_id": document.get("document_id"),
                        "title": document.get("title"),
                        "page_count": document.get("page_count"),
                        "tags": document.get("tags"),
                        "reading_status": document.get("reading_status"),
                    }
                ]
            }
        documents = rust.list_documents(
            tag=str(arguments.get("tag") or ""),
            reading_status=str(arguments.get("reading_status") or ""),
            limit=int(arguments.get("limit") or 50),
        )
        # 只回模型需要的字段,别把整条记录灌进上下文
        return {
            "documents": [
                {
                    "document_id": document.get("document_id"),
                    "title": document.get("title"),
                    "page_count": document.get("page_count"),
                    "tags": document.get("tags"),
                    "reading_status": document.get("reading_status"),
                }
                for document in documents
            ]
        }

    def read_blocks(arguments: dict[str, Any]) -> dict[str, Any]:
        document_id = str(arguments.get("document_id") or "").strip()
        page_idx = arguments.get("page_idx")
        if not document_id or page_idx is None:
            return {"error": "document_id and page_idx are required"}
        # 优先请求里的 job_id（当前阅读任务，含历史 run），再回退 active_job_id
        job_id = str(arguments.get("job_id") or "").strip()
        if not job_id:
            document = rust.get_document(document_id)
            job_id = str(document.get("active_job_id") or "")
        if not job_id:
            return {"error": f"document {document_id} has no active job"}
        job_root = _safe_job_root(settings, job_id)
        if job_root is None:
            return {"error": f"invalid job_id: {job_id!r}"}
        page_i = int(page_idx)
        blocks = read_page_blocks(
            job_root,
            page_i,
            around_block_id=str(arguments.get("around_block_id") or ""),
            max_blocks=int(arguments.get("max_blocks") or 12),
        )
        char_start = max(0, int(arguments.get("char_start") or 0))
        char_limit = max(200, min(int(arguments.get("char_limit") or 2000), 8000))
        block_asset_urls = {
            block.block_id: _block_asset_urls(job_root, job_id, block) for block in blocks
        }
        exact_image_urls: list[str] = []
        for block in blocks:
            for image_url in block_asset_urls[block.block_id]:
                if image_url not in exact_image_urls:
                    exact_image_urls.append(image_url)
        return {
            "document_id": document_id,
            "job_id": job_id,
            "page_idx": page_i,
            "blocks": [
                {
                    "block_id": block.block_id,
                    "source_text": block.source_text[char_start : char_start + char_limit],
                    "translated_text": block.translated_text[char_start : char_start + char_limit],
                    "char_start": char_start,
                    "source_text_length": len(block.source_text),
                    "translated_text_length": len(block.translated_text),
                    "source_has_more": len(block.source_text) > char_start + char_limit,
                    "translated_has_more": len(block.translated_text) > char_start + char_limit,
                    "bbox": list(block.bbox) if block.bbox is not None else None,
                    "bbox_unit": "pdf_point",
                    "bbox_origin": "top_left",
                    "block_type": block.block_type,
                    "asset_id": block.asset_id or None,
                    "asset_ids": list(block.asset_ids),
                    "image_url": (block_asset_urls[block.block_id] or [None])[0],
                    "asset_image_urls": block_asset_urls[block.block_id],
                }
                for block in blocks
            ],
            "image_urls": exact_image_urls,
        }

    def search_favorites(arguments: dict[str, Any]) -> dict[str, Any]:
        keyword = str(arguments.get("keyword") or "").strip().lower()
        favorites = rust.list_favorites(str(arguments.get("document_id") or ""))
        if keyword:
            favorites = [
                favorite
                for favorite in favorites
                if keyword in str(favorite.get("quote_text", "")).lower()
                or keyword in str(favorite.get("translated_quote_text", "")).lower()
                or keyword in str(favorite.get("note", "")).lower()
            ]
        return {
            "favorites": [
                {
                    "favorite_id": favorite.get("favorite_id"),
                    "document_id": favorite.get("document_id"),
                    "job_id": favorite.get("job_id"),
                    "page_idx": favorite.get("page_idx"),
                    "block_id": favorite.get("block_id"),
                    "kind": favorite.get("kind"),
                    "quote_text": favorite.get("quote_text"),
                    "translated_quote_text": favorite.get("translated_quote_text"),
                    "note": favorite.get("note"),
                }
                for favorite in favorites[:30]
            ]
        }

    return ToolRegistry(
        [
            Tool(
                name="search_markdown",
                description=(
                    "只检索当前文档的 md/full.md，按 Markdown 标题和段落返回相关片段。"
                    "这是回答文档内容时的唯一搜索工具；若中文无命中，请改用文献中的英文术语。"
                ),
                parameters={
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "关键词、短语或英文术语"},
                        "document_id": {"type": "string"},
                        "job_id": {"type": "string"},
                        "limit": {"type": "integer", "minimum": 1, "maximum": 12},
                    },
                    "required": ["query"],
                },
                handler=search_markdown,
            ),
            Tool(
                name="read_markdown_chunk",
                description=(
                    "读取 search_markdown 返回的一个 Markdown chunk 完整上下文。"
                    "只能读取当前文档 md/full.md 中的片段。"
                ),
                parameters={
                    "type": "object",
                    "properties": {
                        "chunk_id": {"type": "string", "description": "例如 md-0003"},
                        "document_id": {"type": "string"},
                        "job_id": {"type": "string"},
                        "max_chars": {"type": "integer", "minimum": 400, "maximum": 8000},
                    },
                    "required": ["chunk_id"],
                },
                handler=read_markdown_chunk,
            ),
            Tool(
                name="list_documents",
                description="列出图书馆中的文档(标题、标签、阅读状态)。回答涉及'哪篇文档/我的库里'时先用它确认范围。",
                parameters={
                    "type": "object",
                    "properties": {
                        "tag": {"type": "string", "description": "按标签过滤,可选"},
                        "reading_status": {
                            "type": "string",
                            "enum": ["unread", "reading", "done"],
                            "description": "按阅读状态过滤,可选",
                        },
                        "limit": {"type": "integer", "minimum": 1, "maximum": 200},
                    },
                },
                handler=list_documents,
            ),
            Tool(
                name="search_fulltext",
                description=(
                    "全文检索(中英文均可),返回带 (document_id, job_id, page_idx, block_id) 锚点的命中片段;"
                    "命中块若关联 OCR 资产会附精确 asset_ids/image_urls(可嵌入回答的 Markdown 图片路径)。"
                    "这是找证据的主要工具,可多次换关键词调用。"
                    "若会话已限定文档,请务必传 document_id,只在该文档内检索。"
                ),
                parameters={
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "检索关键词或短语"},
                        "document_id": {
                            "type": "string",
                            "description": "限定单文档;整本问答时必传当前 document_id",
                        },
                        "limit": {"type": "integer", "minimum": 1, "maximum": 30},
                    },
                    "required": ["query"],
                },
                handler=search_fulltext,
            ),
            Tool(
                name="read_blocks",
                description=(
                    "读取某文档某页的原文与译文块,并附带返回块精确关联的 asset_ids/image_urls。"
                    "用于查看检索命中处的完整上下文(传 around_block_id 以命中块为中心取窗口);"
                    "回答图表相关问题时用 image_urls 嵌入 Markdown 图片。"
                ),
                parameters={
                    "type": "object",
                    "properties": {
                        "document_id": {"type": "string"},
                        "page_idx": {"type": "integer", "minimum": 0},
                        "job_id": {
                            "type": "string",
                            "description": "优先读该任务产物;缺省用文档 active_job_id",
                        },
                        "around_block_id": {"type": "string", "description": "以此块为中心取上下文,可选"},
                        "max_blocks": {"type": "integer", "minimum": 1, "maximum": 30},
                        "char_start": {
                            "type": "integer",
                            "minimum": 0,
                            "description": "每个块从此字符偏移开始读取,用于继续读取长块",
                        },
                        "char_limit": {
                            "type": "integer",
                            "minimum": 200,
                            "maximum": 8000,
                            "description": "每个块最多返回字符数,默认 2000",
                        },
                    },
                    "required": ["document_id", "page_idx"],
                },
                handler=read_blocks,
            ),
            Tool(
                name="search_favorites",
                description="检索用户收藏过的句子/数据(可按关键词与文档过滤)。问题涉及'我收藏的/我标记过的'内容时使用。",
                parameters={
                    "type": "object",
                    "properties": {
                        "keyword": {"type": "string", "description": "在引文与备注里做关键词过滤,可选"},
                        "document_id": {"type": "string", "description": "限定某文档,可选"},
                    },
                },
                handler=search_favorites,
            ),
        ]
    )
