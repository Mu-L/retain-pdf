use std::collections::{BTreeMap, HashSet};
use std::path::{Path, PathBuf};
use std::process::Command;

use axum::extract::{Multipart, State};
use axum::Json;
use serde::Serialize;

use crate::error::AppError;
use crate::models::api::ApiResponse;
use crate::routes::common::build_fonts_route_deps;
use crate::AppState;

#[derive(Debug, Clone, Serialize)]
pub struct FontInfo {
    pub family: String,
    pub files: Vec<String>,
    pub available: bool,
}

const FONT_EXTS: &[&str] = &["otf", "ttf", "ttc", "otc", "woff", "woff2"];

fn resolve_font_dirs(project_root: &Path, data_root: &Path) -> Vec<PathBuf> {
    let mut dirs: Vec<PathBuf> = Vec::new();
    let mut seen: HashSet<String> = HashSet::new();

    let push_dir = |p: PathBuf, dirs: &mut Vec<PathBuf>, seen: &mut HashSet<String>| {
        let key = p.to_string_lossy().to_string();
        if seen.insert(key) {
            dirs.push(p);
        }
    };

    // Env: RETAIN_PDF_FONTS_DIR (comma-separated) and RETAIN_PDF_TYPST_FONT_DIRS (pathsep)
    for env_name in ["RETAIN_PDF_FONTS_DIR", "RETAIN_PDF_TYPST_FONT_DIRS"] {
        if let Ok(raw) = std::env::var(env_name) {
            let raw = raw.trim().to_string();
            if raw.is_empty() {
                continue;
            }
            // Normalize both comma/semicolon/pathsep to comma then split
            let sep = if cfg!(windows) { ";" } else { ":" };
            let normalized = raw.replace(';', ",").replace(sep, ",");
            for part in normalized.split(',') {
                let part = part.trim();
                if part.is_empty() {
                    continue;
                }
                let p = PathBuf::from(part);
                // Expand ~ not needed; keep as-is
                push_dir(p, &mut dirs, &mut seen);
            }
        }
    }

    // Always include data/fonts for uploaded fonts if exists or as candidate
    let data_fonts = data_root.join("fonts");
    // Include project infra/fonts fallback
    let infra_fonts = project_root.join("infra").join("fonts");

    if dirs.is_empty() {
        push_dir(infra_fonts.clone(), &mut dirs, &mut seen);
        // also include data_fonts as secondary
        push_dir(data_fonts.clone(), &mut dirs, &mut seen);
    } else {
        if !dirs.iter().any(|p| p == &infra_fonts) {
            push_dir(infra_fonts, &mut dirs, &mut seen);
        }
        if !dirs.iter().any(|p| p == &data_fonts) {
            push_dir(data_fonts, &mut dirs, &mut seen);
        }
    }

    dirs
}

fn family_from_filename(path: &Path) -> String {
    let stem = path
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or_default()
        .to_string();
    // Strip style suffix like -Bold, -Regular etc.
    let style_re = [
        "-Bold", "-Regular", "-Medium", "-Light", "-Heavy", "-Thin", "-Black",
    ];
    let mut base = stem.clone();
    for suffix in style_re {
        if base
            .to_ascii_lowercase()
            .ends_with(&suffix.to_ascii_lowercase())
        {
            base = base[..base.len() - suffix.len()].to_string();
            break;
        }
    }
    // Known mapping
    if base.contains("SourceHanSerifSC") || base.contains("SourceHanSerif") {
        return "Source Han Serif SC".to_string();
    }
    if base.contains("SourceHanSansSC") || base.contains("SourceHanSans") {
        return "Source Han Sans SC".to_string();
    }
    if base.contains(' ') {
        return base;
    }
    base.replace(['_', '-'], " ").trim().to_string()
}

fn family_from_file(path: &Path) -> Option<String> {
    // Try fc-query / fc-scan
    for bin in ["fc-query", "fc-scan"] {
        let output = Command::new(bin)
            .arg("--format")
            .arg("%{family[0]}\n")
            .arg(path)
            .output();
        if let Ok(out) = output {
            if out.status.success() {
                let s = String::from_utf8_lossy(&out.stdout).trim().to_string();
                if !s.is_empty() {
                    let first = s.split(',').next().unwrap_or(&s).trim().to_string();
                    if !first.is_empty() {
                        return Some(first);
                    }
                }
            }
        }
    }
    None
}

fn scan_fonts(dirs: &[PathBuf]) -> Vec<FontInfo> {
    let mut family_to_files: BTreeMap<String, Vec<String>> = BTreeMap::new();

    // Optional: fc-list supplement limited to our dirs
    if let Ok(output) = Command::new("fc-list")
        .arg("-f")
        .arg("%{family[0]}:%{file}\n")
        .output()
    {
        if output.status.success() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                let line = line.trim();
                if line.is_empty() || !line.contains(':') {
                    continue;
                }
                let mut parts = line.splitn(2, ':');
                let family_part = parts.next().unwrap_or("").trim();
                let file_part = parts.next().unwrap_or("").trim();
                if family_part.is_empty() || file_part.is_empty() {
                    continue;
                }
                let family = family_part
                    .split(',')
                    .next()
                    .unwrap_or(family_part)
                    .trim()
                    .to_string();
                for d in dirs {
                    if file_part.starts_with(d.to_string_lossy().as_ref()) {
                        family_to_files
                            .entry(family.clone())
                            .or_default()
                            .push(file_part.to_string());
                        break;
                    }
                }
            }
        }
    }

    // Filesystem scan authoritative
    for dir in dirs {
        if !dir.exists() || !dir.is_dir() {
            continue;
        }
        // Walk recursively (non-recursive walk if deeply nested, but use walkdir)
        let walker = walkdir::WalkDir::new(dir)
            .max_depth(4)
            .into_iter()
            .filter_map(|e| e.ok());
        for entry in walker {
            let path = entry.path();
            if !path.is_file() {
                continue;
            }
            let ext = path
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or_default()
                .to_ascii_lowercase();
            if !FONT_EXTS.contains(&ext.as_str()) {
                continue;
            }
            let family = family_from_file(path).unwrap_or_else(|| family_from_filename(path));
            let family = family.trim().to_string();
            if family.is_empty() {
                continue;
            }
            let files = family_to_files.entry(family).or_default();
            let s = path.to_string_lossy().to_string();
            if !files.contains(&s) {
                files.push(s);
            }
        }
    }

    let mut out: Vec<FontInfo> = Vec::new();
    for (family, mut files) in family_to_files {
        files.sort();
        files.dedup();
        let available = files.iter().any(|f| Path::new(f).exists());
        out.push(FontInfo {
            family,
            files,
            available,
        });
    }

    // Ensure Source Han Serif SC appears if bundled files exist
    if !out.iter().any(|info| info.family == "Source Han Serif SC") {
        let mut candidate_files: Vec<String> = Vec::new();
        for dir in dirs {
            for name in ["SourceHanSerifSC-Bold.otf", "SourceHanSerifSC-Regular.otf"] {
                let p = dir.join(name);
                if p.exists() {
                    candidate_files.push(p.to_string_lossy().to_string());
                }
            }
        }
        if !candidate_files.is_empty() {
            candidate_files.sort();
            candidate_files.dedup();
            out.push(FontInfo {
                family: "Source Han Serif SC".to_string(),
                files: candidate_files,
                available: true,
            });
            out.sort_by(|a, b| a.family.cmp(&b.family));
        }
    } else {
        out.sort_by(|a, b| a.family.cmp(&b.family));
    }

    out
}

pub async fn list_fonts(
    State(state): State<AppState>,
) -> Result<Json<ApiResponse<Vec<FontInfo>>>, AppError> {
    let deps = build_fonts_route_deps(&state);
    let dirs = resolve_font_dirs(deps.project_root, deps.data_root);
    let fonts = scan_fonts(&dirs);
    Ok(Json(ApiResponse::ok(fonts)))
}

pub async fn upload_font(
    State(state): State<AppState>,
    mut multipart: Multipart,
) -> Result<Json<ApiResponse<FontInfo>>, AppError> {
    let mut file_name: Option<String> = None;
    let mut file_bytes: Option<Vec<u8>> = None;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| AppError::bad_request(e.to_string()))?
    {
        let name = field.name().unwrap_or_default().to_string();
        if name == "file" || name == "font" {
            let filename = field
                .file_name()
                .map(|s| s.to_string())
                .unwrap_or_else(|| "upload.otf".to_string());
            let data = field
                .bytes()
                .await
                .map_err(|e| AppError::bad_request(e.to_string()))?;
            file_name = Some(filename);
            file_bytes = Some(data.to_vec());
        }
    }

    let filename =
        file_name.ok_or_else(|| AppError::bad_request("missing multipart field: file"))?;
    let bytes = file_bytes.ok_or_else(|| AppError::bad_request("empty upload"))?;

    // Validate extension
    let ext = Path::new(&filename)
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or_default()
        .to_ascii_lowercase();
    if !FONT_EXTS.contains(&ext.as_str()) {
        return Err(AppError::bad_request(format!(
            "unsupported font extension .{ext}; allowed: {}",
            FONT_EXTS.join(", ")
        )));
    }

    // Sanitize filename (prevent path traversal)
    let sanitized = Path::new(&filename)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("upload.otf")
        .replace(['/', '\\'], "_");
    let deps = build_fonts_route_deps(&state);
    let data_fonts_dir = deps.data_root.join("fonts");
    std::fs::create_dir_all(&data_fonts_dir).map_err(|e| AppError::internal(e.to_string()))?;
    let dest = data_fonts_dir.join(&sanitized);
    std::fs::write(&dest, &bytes).map_err(|e| AppError::internal(e.to_string()))?;

    // Refresh fontconfig cache for this dir (best-effort)
    let _ = Command::new("fc-cache")
        .arg("-f")
        .arg(&data_fonts_dir)
        .output();

    let family = family_from_file(&dest).unwrap_or_else(|| family_from_filename(&dest));
    let info = FontInfo {
        family: family.trim().to_string(),
        files: vec![dest.to_string_lossy().to_string()],
        available: true,
    };
    Ok(Json(ApiResponse::ok(info)))
}
