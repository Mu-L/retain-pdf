from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys

import pytest


SCRIPTS_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS_ROOT))

from resolve_backend_source import (
    REQUIRED_PATHS,
    backend_checkout_metadata,
    resolve_backend_source,
)


def _git(root: Path, *args: str) -> str:
    return subprocess.run(
        ["git", *args],
        cwd=root,
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()


def _write_backend_layout(root: Path) -> None:
    for relative in REQUIRED_PATHS:
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(f"fixture for {relative}\n", encoding="utf-8")


def _commit_repo(root: Path) -> None:
    _git(root, "init", "-q")
    _git(root, "add", ".")
    _git(
        root,
        "-c",
        "user.name=RetainPDF Test",
        "-c",
        "user.email=test@example.invalid",
        "commit",
        "-qm",
        "fixture",
    )


def _product_repo(tmp_path: Path) -> tuple[Path, str]:
    repo_root = tmp_path / "product"
    services_root = repo_root / "services"
    _write_backend_layout(services_root)
    _commit_repo(repo_root)
    source_tree = _git(repo_root, "rev-parse", "HEAD:services")
    (repo_root / "backend-source.lock.json").write_text(
        json.dumps(
            {
                "schema_version": 1,
                "repository": None,
                "revision": None,
                "source_tree": source_tree,
                "embedded_path": "services",
                "checkout_path": ".backend/retainpdf-services",
            }
        ),
        encoding="utf-8",
    )
    return repo_root, source_tree


def _rewrite_lock(repo_root: Path, **updates: object) -> None:
    lock_path = repo_root / "backend-source.lock.json"
    payload = json.loads(lock_path.read_text(encoding="utf-8"))
    payload.update(updates)
    lock_path.write_text(json.dumps(payload), encoding="utf-8")


def test_resolves_verified_embedded_backend(tmp_path: Path, monkeypatch) -> None:
    repo_root, source_tree = _product_repo(tmp_path)
    monkeypatch.delenv("RETAIN_PDF_SERVICES_ROOT", raising=False)

    resolved = resolve_backend_source(repo_root)

    assert resolved == {
        "path": str((repo_root / "services").resolve()),
        "kind": "embedded",
        "revision": "",
        "tree": source_tree,
    }

    assert backend_checkout_metadata(repo_root) == {
        "external": "false",
        "repository": "",
        "revision": "",
        "checkout_path": ".backend/retainpdf-services",
        "source_tree": source_tree,
    }


def test_null_lock_ignores_stale_checkout_and_uses_embedded(
    tmp_path: Path,
    monkeypatch,
) -> None:
    repo_root, source_tree = _product_repo(tmp_path)
    checkout = repo_root / ".backend" / "retainpdf-services"
    _write_backend_layout(checkout)
    _commit_repo(checkout)
    monkeypatch.delenv("RETAIN_PDF_SERVICES_ROOT", raising=False)

    resolved = resolve_backend_source(repo_root)

    assert resolved["kind"] == "embedded"
    assert resolved["path"] == str((repo_root / "services").resolve())
    assert resolved["tree"] == source_tree


def test_external_lock_requires_and_resolves_exact_checkout(
    tmp_path: Path,
    monkeypatch,
) -> None:
    repo_root, source_tree = _product_repo(tmp_path)
    checkout = repo_root / ".backend" / "retainpdf-services"
    _write_backend_layout(checkout)
    _commit_repo(checkout)
    revision = _git(checkout, "rev-parse", "HEAD")
    _rewrite_lock(
        repo_root,
        repository="retainpdf/backend",
        revision=revision,
    )
    monkeypatch.delenv("RETAIN_PDF_SERVICES_ROOT", raising=False)

    resolved = resolve_backend_source(repo_root)

    assert resolved["kind"] == "checkout"
    assert resolved["path"] == str(checkout.resolve())
    assert resolved["revision"] == revision
    assert resolved["tree"] == source_tree


def test_external_lock_does_not_fall_back_to_embedded(
    tmp_path: Path,
    monkeypatch,
) -> None:
    repo_root, _source_tree = _product_repo(tmp_path)
    _rewrite_lock(
        repo_root,
        repository="retainpdf/backend",
        revision="a" * 40,
    )
    monkeypatch.delenv("RETAIN_PDF_SERVICES_ROOT", raising=False)

    with pytest.raises(RuntimeError, match="backend source directory is unavailable"):
        resolve_backend_source(repo_root)


def test_rejects_override_at_unlocked_tree(tmp_path: Path, monkeypatch) -> None:
    repo_root, _source_tree = _product_repo(tmp_path)
    override = tmp_path / "backend"
    _write_backend_layout(override)
    (override / "extra.txt").write_text("changes the root tree\n", encoding="utf-8")
    _commit_repo(override)
    monkeypatch.setenv("RETAIN_PDF_SERVICES_ROOT", str(override))

    with pytest.raises(RuntimeError, match="does not match"):
        resolve_backend_source(repo_root)


def test_rejects_dirty_tracked_backend_by_default(tmp_path: Path, monkeypatch) -> None:
    repo_root, source_tree = _product_repo(tmp_path)
    monkeypatch.delenv("RETAIN_PDF_SERVICES_ROOT", raising=False)
    (repo_root / "services" / "pyproject.toml").write_text("dirty\n", encoding="utf-8")

    with pytest.raises(RuntimeError, match="tracked backend source changes"):
        resolve_backend_source(repo_root)

    assert resolve_backend_source(repo_root, allow_dirty=True)["tree"] == source_tree


def test_rejects_repository_without_revision(tmp_path: Path, monkeypatch) -> None:
    repo_root, _source_tree = _product_repo(tmp_path)
    _rewrite_lock(repo_root, repository="retainpdf/backend")
    monkeypatch.delenv("RETAIN_PDF_SERVICES_ROOT", raising=False)

    with pytest.raises(RuntimeError, match="must both be set or null"):
        resolve_backend_source(repo_root)


def test_rejects_checkout_at_different_commit_with_same_tree(
    tmp_path: Path,
    monkeypatch,
) -> None:
    repo_root, source_tree = _product_repo(tmp_path)
    checkout = repo_root / ".backend" / "retainpdf-services"
    _write_backend_layout(checkout)
    _commit_repo(checkout)
    locked_revision = _git(checkout, "rev-parse", "HEAD")
    _git(
        checkout,
        "-c",
        "user.name=RetainPDF Test",
        "-c",
        "user.email=test@example.invalid",
        "commit",
        "--allow-empty",
        "-qm",
        "different commit with the same tree",
    )
    assert _git(checkout, "rev-parse", "HEAD^{tree}") == source_tree
    _rewrite_lock(
        repo_root,
        repository="retainpdf/backend",
        revision=locked_revision,
    )
    monkeypatch.delenv("RETAIN_PDF_SERVICES_ROOT", raising=False)

    with pytest.raises(RuntimeError, match="checkout revision does not match"):
        resolve_backend_source(repo_root)


def test_emits_validated_external_checkout_metadata(tmp_path: Path) -> None:
    repo_root, source_tree = _product_repo(tmp_path)
    revision = "a" * 40
    _rewrite_lock(
        repo_root,
        repository="retainpdf/backend",
        revision=revision,
    )

    assert backend_checkout_metadata(repo_root) == {
        "external": "true",
        "repository": "retainpdf/backend",
        "revision": revision,
        "checkout_path": ".backend/retainpdf-services",
        "source_tree": source_tree,
    }


@pytest.mark.parametrize("unsafe_path", ["../backend", "/tmp/backend", "a\\backend"])
def test_rejects_unsafe_checkout_path(
    tmp_path: Path,
    monkeypatch,
    unsafe_path: str,
) -> None:
    repo_root, _source_tree = _product_repo(tmp_path)
    _rewrite_lock(repo_root, checkout_path=unsafe_path)
    monkeypatch.delenv("RETAIN_PDF_SERVICES_ROOT", raising=False)

    with pytest.raises(RuntimeError, match="safe repository-relative path"):
        resolve_backend_source(repo_root)
