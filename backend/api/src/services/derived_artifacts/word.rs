use std::path::{Path, PathBuf};
use std::time::Duration;

use crate::error::AppError;
use crate::models::domain::JobSnapshot;

use super::{cached_output_is_fresh, job_artifacts_dir, DerivedArtifactDeps};

/// 比 side-by-side 宽：每页都要把源 PDF 渲成背景位图，整本几百页时这是大头。
const BUILD_TIMEOUT: Duration = Duration::from_secs(600);

pub(crate) const DEFAULT_BACKGROUND_DPI: u32 = 180;

#[derive(Clone, Copy)]
pub(crate) struct LayoutDocxOptions {
    pub(crate) dpi: u32,
}

impl Default for LayoutDocxOptions {
    fn default() -> Self {
        Self {
            dpi: DEFAULT_BACKGROUND_DPI,
        }
    }
}

impl LayoutDocxOptions {
    /// 缓存键的一部分：换了 DPI 就是另一份产物，不能命中上一份。
    pub(crate) fn cache_suffix(&self) -> String {
        format!("dpi{}", self.dpi)
    }
}

pub(crate) fn ensure_layout_docx(
    deps: DerivedArtifactDeps<'_>,
    data_root: &Path,
    job: &JobSnapshot,
    job_root: &Path,
    source_pdf: &Path,
    translated_pdf: &Path,
    options: LayoutDocxOptions,
) -> Result<PathBuf, AppError> {
    let output_dir = job_artifacts_dir(data_root, job)?;
    let output_docx = output_dir.join(format!(
        "{}-layout-{}.docx",
        job.job_id,
        options.cache_suffix()
    ));
    // 译文 PDF 也算输入：收敛后的字号和行距是从它里面读回来的（见 Python 侧
    // `typography_readback`），它一重渲染，这份 docx 就过期了。
    if !cached_output_is_fresh(&output_docx, &[source_pdf, translated_pdf])? {
        super::side_by_side::build_with_command(
            &output_docx,
            "layout-docx",
            BUILD_TIMEOUT,
            |temporary| {
                let mut command = std::process::Command::new(deps.pipeline_command);
                command
                    .arg("layout-docx")
                    .arg("--job-root")
                    .arg(job_root)
                    .arg("--output-docx")
                    .arg(temporary)
                    .arg("--dpi")
                    .arg(options.dpi.to_string());
                command
            },
        )?;
    }
    Ok(output_docx)
}

#[cfg(test)]
#[path = "word_tests.rs"]
mod tests;
