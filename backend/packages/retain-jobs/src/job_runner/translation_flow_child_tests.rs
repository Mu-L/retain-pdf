//! OCR 子任务必须写入 `jobs.document_id`，否则它的产物永远无法被复用。
//!
//! 现象：一体化任务（book）在翻译/渲染阶段失败后，重试仍要整本重跑 OCR，
//! 尽管 OCR 子任务本身是 succeeded 的。
//!
//! 根因在**列表查询**，不在单条查询：
//!   * `get_document_by_job_id` 有 COALESCE 回退（document_id 为空时用
//!     upload_id 反查 uploads.content_hash），所以后端的复用校验本来就能过；
//!   * 但 `list_jobs_for_document` 是裸的 `WHERE jobs.document_id = ?1`，
//!     **没有回退**。子任务的 document_id 是 NULL，于是它压根不出现在该文档的
//!     任务列表里；前端 `selectReusableOcrJob` 只能从这个列表里挑复用候选，
//!     自然永远挑不到——用户看不到「复用已有 OCR」这个选项。
//!
//! 主任务的归属由 `lifecycle.rs` 的 `update_document_after_job` 在终态时补上，
//! 而 OCR 子任务由 `translation_flow_child.rs` 独立创建并直接落库，从不经过
//! 那条流程。
//!
//! 注：`ocr_stage_succeeded` 本身很宽容（父任务失败也认子任务的 succeeded），
//! MinerU 也不在排除名单里——卡住复用的只是这个归属缺口。

use super::{create_ocr_child_job, TranslationUploadSource};
use crate::job_runner::ProcessRuntimeDeps;
use crate::models::domain::JobSnapshot;
use crate::models::domain::UploadRecord;
use crate::models::request::CreateJobInput;
use crate::storage_paths::JobPaths;

fn seed_upload(deps: &ProcessRuntimeDeps, upload_id: &str, content_hash: &str) {
    let stored = deps.persist.data_root.join(format!("{upload_id}.pdf"));
    std::fs::create_dir_all(&deps.persist.data_root).unwrap();
    std::fs::write(&stored, b"%PDF-1.4\n").unwrap();
    deps.db
        .save_upload_with_document(&UploadRecord {
            upload_id: upload_id.to_string(),
            filename: "sample.pdf".to_string(),
            stored_path: stored.to_string_lossy().to_string(),
            bytes: 9,
            page_count: 1,
            uploaded_at: crate::models::domain::now_iso(),
            developer_mode: false,
            content_hash: content_hash.to_string(),
        })
        .unwrap();
}

#[test]
fn ocr_child_job_inherits_document_ownership() {
    let deps = crate::job_runner::process_runner::tests::test_runtime_deps(1);
    let upload_id = "upload-ocr-child";
    let content_hash = "doc-hash-ocr-child";
    seed_upload(&deps, upload_id, content_hash);

    let mut parent_snapshot = JobSnapshot::new(
        "job-parent".to_string(),
        CreateJobInput::default(),
        vec!["python".to_string()],
    );
    parent_snapshot.upload_id = Some(upload_id.to_string());
    deps.db.save_job(&parent_snapshot).unwrap();
    let mut parent = parent_snapshot.into_runtime();
    // 父任务的归属走既有路径（等价于 lifecycle 终态时的补齐）
    deps.db
        .link_job_to_document(&parent.job_id, upload_id)
        .unwrap();

    let paths = JobPaths::for_job(&deps.persist.data_root, &parent.job_id);
    let source = TranslationUploadSource {
        upload_id: upload_id.to_string(),
    };
    create_ocr_child_job(&deps, &mut parent, &paths, &source).unwrap();

    let child_id = format!("{}-ocr", parent.job_id);
    let document_id = deps
        .db
        .get_document_by_job_id(&parent.job_id)
        .expect("query parent document")
        .expect("parent must be linked")
        .document_id;

    // 关键契约：子任务要出现在该文档的任务列表里。
    // 这条列表查询是裸的 `WHERE jobs.document_id = ?1`，没有 COALESCE 回退，
    // 所以只有真正写入了 document_id 才看得见——前端的复用候选正是从这里挑。
    let jobs = deps
        .db
        .list_jobs_for_document(&document_id, 50, 0)
        .expect("list jobs for document");
    let child_visible = jobs.iter().any(|job| job.job_id == child_id);

    assert!(
        child_visible,
        "OCR 子任务必须出现在文档任务列表中，否则前端 selectReusableOcrJob 永远挑不到它，\
         表现为「OCR 成功了但重试仍要整本重跑」。当前列表：{:?}",
        jobs.iter().map(|job| job.job_id.as_str()).collect::<Vec<_>>(),
    );
}
