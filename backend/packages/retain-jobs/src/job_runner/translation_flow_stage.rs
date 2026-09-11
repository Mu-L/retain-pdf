use std::path::{Path, PathBuf};

use anyhow::Result;

use crate::job_events::{
    persist_runtime_job_with_resources, record_custom_runtime_event_with_resources,
};
use crate::models::domain::{
    job_stage_detail, job_stage_str, now_iso, JobRuntimeState, JobStage, JobStatusKind,
};
use crate::storage_paths::JobPaths;
use crate::storage_paths::TRANSLATION_CHECKPOINT_FILE_NAME;
use crate::worker_command::{build_worker_stage_command, WorkerStageCommand};

use crate::job_runner::{
    clear_job_failure, execute_process_job, execute_process_job_stage, sync_runtime_state,
    ProcessRuntimeDeps, ProcessStageKind,
};

use crate::job_runner::stage_contract::{
    ensure_translations_dir_ready, ocr_ready_inputs_for_translation,
};

pub(super) struct TranslationStageResult {
    pub(super) job: JobRuntimeState,
    pub(super) source_pdf_path: PathBuf,
}

pub(super) fn record_ocr_child_finished(
    deps: &ProcessRuntimeDeps,
    parent_job: &JobRuntimeState,
    ocr_finished: &JobRuntimeState,
) {
    let ocr_finished_status = ocr_finished.status.clone();
    record_custom_runtime_event_with_resources(
        deps.persist.db.as_ref(),
        &deps.persist.data_root,
        &deps.persist.output_root,
        &parent_job.snapshot(),
        if matches!(ocr_finished_status, JobStatusKind::Failed) {
            "error"
        } else {
            "info"
        },
        "ocr_child_finished",
        format!("OCR 子任务结束，状态={:?}", ocr_finished_status),
        Some(serde_json::json!({
            "ocr_job_id": ocr_finished.job_id.clone(),
            "status": format!("{:?}", ocr_finished_status).to_ascii_lowercase(),
        })),
    );
}

pub(super) async fn run_translation_stage(
    deps: &ProcessRuntimeDeps,
    mut parent_job: JobRuntimeState,
    parent_job_paths: &JobPaths,
) -> Result<TranslationStageResult> {
    let translate_inputs = ocr_ready_inputs_for_translation(&parent_job, &deps.persist.data_root)?;
    let normalized_path = translate_inputs.normalized_path;
    let source_pdf_path = translate_inputs.source_pdf_path;
    let layout_json_path = translate_inputs.layout_json_path;
    prepare_translation_stage(
        deps,
        &mut parent_job,
        parent_job_paths,
        &normalized_path,
        &source_pdf_path,
        layout_json_path.as_deref(),
    )?;
    // 翻译跑完后面一定还有渲染——四个调用方(book / translate / 两条 artifacts
    // 复用路径)无一例外。所以这一步成功时不能落终态,否则 stage_history 会多出
    // 一条 finished/succeeded 夹在 translating 与 rendering 之间。
    let job = execute_process_job_stage(
        deps.clone(),
        parent_job,
        &[],
        ProcessStageKind::Intermediate,
    )
    .await?;
    Ok(TranslationStageResult {
        job,
        source_pdf_path,
    })
}

fn prepare_translation_stage(
    deps: &ProcessRuntimeDeps,
    parent_job: &mut JobRuntimeState,
    parent_job_paths: &JobPaths,
    normalized_path: &Path,
    source_pdf_path: &Path,
    layout_json_path: Option<&Path>,
) -> Result<()> {
    let checkpoint_path = parent_job_paths
        .translated_dir
        .join(TRANSLATION_CHECKPOINT_FILE_NAME)
        .to_string_lossy()
        .to_string();
    parent_job
        .artifacts
        .get_or_insert_with(Default::default)
        .translation_checkpoint_json = Some(checkpoint_path);
    parent_job.command = build_worker_stage_command(
        &deps.worker_command_runtime(),
        &parent_job.request_payload,
        parent_job_paths,
        WorkerStageCommand::Translate {
            source_json_path: normalized_path,
            source_pdf_path,
            layout_json_path,
        },
    )?;
    parent_job.stage = Some(job_stage_str(JobStage::Translating).to_string());
    parent_job.stage_detail = Some(job_stage_detail(JobStage::Translating).to_string());
    parent_job.progress_current = None;
    parent_job.progress_total = None;
    parent_job.updated_at = now_iso();
    sync_runtime_state(parent_job);
    persist_runtime_job_with_resources(
        deps.persist.db.as_ref(),
        &deps.persist.data_root,
        &deps.persist.output_root,
        parent_job,
    )?;

    Ok(())
}

pub(super) async fn run_render_stage_after_translation(
    deps: ProcessRuntimeDeps,
    mut job: JobRuntimeState,
    job_paths: &JobPaths,
    source_pdf_path: &Path,
) -> Result<JobRuntimeState> {
    ensure_translations_dir_ready(&job_paths.translated_dir, &job.job_id)?;
    job.command = build_worker_stage_command(
        &deps.worker_command_runtime(),
        &job.request_payload,
        job_paths,
        WorkerStageCommand::Render {
            source_pdf_path,
            translations_dir: &job_paths.translated_dir,
        },
    )?;
    job.status = JobStatusKind::Running;
    job.stage = Some(job_stage_str(JobStage::Rendering).to_string());
    job.stage_detail = Some(job_stage_detail(JobStage::Rendering).to_string());
    // 进入新阶段就把进度清零,和 `prepare_translation_stage` 对称。
    //
    // 这对字段是 job 级的、跨阶段不自动重置。渲染阶段的进度走的是 stage
    // snapshot(stages.render 那个 2/3),从不写 job.progress_*,于是它整段都
    // 停在翻译留下的值上——stage_history 把渲染和 finished 两条都归档成了
    // 「59/59」,而那是翻译的块数,不是渲染的页数。
    job.progress_current = None;
    job.progress_total = None;
    job.updated_at = now_iso();
    clear_job_failure(&mut job);
    sync_runtime_state(&mut job);
    persist_runtime_job_with_resources(
        deps.persist.db.as_ref(),
        &deps.persist.data_root,
        &deps.persist.output_root,
        &job,
    )?;
    execute_process_job(deps, job, &[]).await
}

#[cfg(test)]
mod stage_kind_contract {
    /// 翻译阶段必须以「中间阶段」跑,这条锁的是调用点本身。
    ///
    /// 单测只能锁住 `apply_process_completion` 在收到 `Intermediate` 时的行为;
    /// 把这里的调用改回 `Final`,那些单测照样全绿——实测过。真正会坏的是
    /// stage_history 的顺序,而那要跑完整的 book 流程才看得出来,单元测试够不着。
    /// 所以这里直接盯调用点。
    #[test]
    fn translation_stage_runs_as_an_intermediate_step() {
        let source = include_str!("translation_flow_stage.rs");
        let call = source
            .find("execute_process_job_stage(")
            .expect("翻译阶段必须走 execute_process_job_stage");
        let tail = &source[call..];
        let end = tail.find(").await").expect("调用应当被 await");
        assert!(
            tail[..end].contains("ProcessStageKind::Intermediate"),
            "翻译跑完后面还有渲染：这一步落终态会让 stage_history 出现 finished 夹在 rendering 前面"
        );
    }
}
