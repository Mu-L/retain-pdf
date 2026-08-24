use crate::services::derived_artifacts::DerivedArtifactDeps;

use super::super::creation::context::QueryJobsDeps;

pub(super) fn derived_artifact_deps<'a>(deps: &'a QueryJobsDeps<'a>) -> DerivedArtifactDeps<'a> {
    DerivedArtifactDeps::with_pipeline_command(
        deps.replay.scripts_dir,
        deps.replay.python_bin,
        deps.replay.pipeline_command,
        deps.replay.python_entrypoint_mode,
    )
}
