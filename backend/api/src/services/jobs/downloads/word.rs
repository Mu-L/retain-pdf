use retain_core::storage_paths::resolve_job_root;

use crate::error::AppError;
use crate::services::derived_artifacts;
use crate::services::derived_artifacts::word::LayoutDocxOptions;
use crate::storage_paths::{resolve_output_pdf, resolve_source_pdf};

use super::artifact_deps::derived_artifact_deps;
use super::DownloadJobsDeps;
use super::FileDownload;
use crate::services::jobs::query::load_supported_job;

pub(super) const DOCX_CONTENT_TYPE: &str =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

pub(super) fn layout_docx_download(
    deps: &DownloadJobsDeps<'_>,
    job_id: &str,
    options: LayoutDocxOptions,
) -> Result<FileDownload, AppError> {
    let job = load_supported_job(deps.db, deps.data_root, job_id)?;
    let job_root = resolve_job_root(&job, deps.data_root)
        .ok_or_else(|| AppError::not_found(format!("job root not ready: {}", job.job_id)))?;
    let source_pdf = resolve_source_pdf(&job, deps.data_root)
        .ok_or_else(|| AppError::not_found(format!("source pdf not ready: {}", job.job_id)))?;
    // 译文 PDF 不只是新鲜度依据——收敛后的字号和行距要从它里面读回来。没有它导出仍能
    // 跑完，但会退回 spec 的上界，正文会溢出框外；与其给一份排坏的 Word，不如说没准备好。
    let translated_pdf = resolve_output_pdf(&job, deps.data_root)
        .ok_or_else(|| AppError::not_found(format!("translated pdf not ready: {}", job.job_id)))?;
    if !source_pdf.is_file() {
        return Err(AppError::not_found(format!(
            "source pdf not found: {}",
            job.job_id
        )));
    }
    if !translated_pdf.is_file() {
        return Err(AppError::not_found(format!(
            "translated pdf not found: {}",
            job.job_id
        )));
    }

    let output_docx = derived_artifacts::word::ensure_layout_docx(
        derived_artifact_deps(deps),
        deps.data_root,
        &job,
        &job_root,
        &source_pdf,
        &translated_pdf,
        options,
    )?;
    Ok(FileDownload::new(
        output_docx,
        DOCX_CONTENT_TYPE,
        Some(format!("{}-layout.docx", job.job_id)),
    ))
}
