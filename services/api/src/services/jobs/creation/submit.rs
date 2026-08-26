use crate::db::PipelineDispatchRecord;
use crate::error::AppError;
use crate::models::domain::JobSnapshot;
use crate::models::request::CreateJobInput;
use crate::services::job_launcher::start_job_execution;
use serde_json::Value;

use super::context::JobSubmitDeps;
use super::job_builders::{build_ocr_job_snapshot, build_translation_job_snapshot};
use super::upload::{store_pdf_upload, UploadedPdfInput};

pub(crate) fn create_translation_job(
    deps: &JobSubmitDeps<'_>,
    input: &CreateJobInput,
) -> Result<JobSnapshot, AppError> {
    let job = build_translation_job_snapshot(&deps.snapshot, input)?;
    start_job_execution(&deps.launcher, job)
}

pub(crate) fn create_ocr_ambiguity_recovery_job(
    deps: &JobSubmitDeps<'_>,
    input: &CreateJobInput,
    source_dispatch: &PipelineDispatchRecord,
    resolution: &str,
    receipt: Option<&Value>,
) -> Result<JobSnapshot, AppError> {
    let job = build_translation_job_snapshot(&deps.snapshot, input)?;
    if !deps.launcher.db.create_ocr_recovery_job_state(
        source_dispatch,
        &job,
        resolution,
        receipt,
    )? {
        return Err(AppError::conflict(
            "OCR ambiguity was already resolved by another request",
        ));
    }
    deps.launcher.runtime.launch(job.job_id.clone());
    Ok(job)
}

pub(crate) async fn create_ocr_job_from_upload(
    deps: &JobSubmitDeps<'_>,
    input: &CreateJobInput,
    upload: Option<UploadedPdfInput>,
) -> Result<JobSnapshot, AppError> {
    let stored = match upload {
        Some(upload) => Some(
            store_pdf_upload(
                deps.uploads.db,
                deps.uploads.uploads_dir,
                deps.uploads.upload_max_bytes,
                deps.uploads.upload_max_pages,
                deps.uploads.python_bin,
                upload,
            )
            .await?,
        ),
        None => None,
    };
    let job = build_ocr_job_snapshot(&deps.snapshot, input, stored.as_ref())?;
    start_job_execution(&deps.launcher, job)
}
