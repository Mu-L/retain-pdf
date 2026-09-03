use crate::config::WorkerCommandRuntimeConfig;
use std::path::Path;

// console-mode 唯一入口：retainpdf-pipeline 各子命令。

use super::command_builder::CommandBuilder;

#[cfg(test)]
pub(super) fn provider_case_command(
    config: &WorkerCommandRuntimeConfig<'_>,
    spec_path: &Path,
) -> Vec<String> {
    let mut cmd = CommandBuilder::new(config.pipeline_command, "provider-case");
    cmd.path_arg("--spec", spec_path);
    cmd.finish()
}

pub(super) fn provider_ocr_command(
    config: &WorkerCommandRuntimeConfig<'_>,
    spec_path: &Path,
) -> Vec<String> {
    let mut cmd = CommandBuilder::new(config.pipeline_command, "provider-ocr");
    cmd.path_arg("--spec", spec_path);
    cmd.finish()
}

pub(super) fn translate_only_command(
    config: &WorkerCommandRuntimeConfig<'_>,
    spec_path: &Path,
) -> Vec<String> {
    let mut cmd = CommandBuilder::new(config.pipeline_command, "translate-only");
    cmd.path_arg("--spec", spec_path);
    cmd.finish()
}

pub(super) fn render_only_command(
    config: &WorkerCommandRuntimeConfig<'_>,
    spec_path: &Path,
) -> Vec<String> {
    let mut cmd = CommandBuilder::new(config.pipeline_command, "render-only");
    cmd.path_arg("--spec", spec_path);
    cmd.finish()
}

pub(super) fn normalize_ocr_command(
    config: &WorkerCommandRuntimeConfig<'_>,
    spec_path: &Path,
) -> Vec<String> {
    let mut cmd = CommandBuilder::new(config.pipeline_command, "normalize-ocr");
    cmd.path_arg("--spec", spec_path);
    cmd.finish()
}
