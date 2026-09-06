use std::path::{Path, PathBuf};
use std::sync::Arc;

use crate::services::download_generation::DownloadGeneration;

use crate::config::{JobRunnerConfig, JobSnapshotRuntimeConfig};
use crate::db::Db;
use crate::services::job_launcher::JobLaunchDeps;
use crate::services::runtime_gateway::{JobRuntime, RuntimeControl};

#[derive(Clone)]
pub(crate) struct SnapshotBuildDeps<'a> {
    pub(crate) db: &'a Db,
    pub(crate) config: JobSnapshotRuntimeConfig<'a>,
}

impl<'a> SnapshotBuildDeps<'a> {
    pub(crate) fn new(db: &'a Db, config: JobSnapshotRuntimeConfig<'a>) -> Self {
        Self { db, config }
    }
}

#[derive(Clone)]
pub(crate) struct UploadStoreDeps<'a> {
    pub(crate) db: &'a Db,
    pub(crate) uploads_dir: &'a Path,
    pub(crate) upload_max_bytes: u64,
    pub(crate) upload_max_pages: u32,
    pub(crate) python_bin: &'a str,
}

impl<'a> UploadStoreDeps<'a> {
    pub(crate) fn new(
        db: &'a Db,
        uploads_dir: &'a Path,
        upload_max_bytes: u64,
        upload_max_pages: u32,
        python_bin: &'a str,
    ) -> Self {
        Self {
            db,
            uploads_dir,
            upload_max_bytes,
            upload_max_pages,
            python_bin,
        }
    }
}

#[derive(Clone)]
pub(crate) struct JobSubmitDeps<'a> {
    pub(crate) snapshot: SnapshotBuildDeps<'a>,
    pub(crate) uploads: UploadStoreDeps<'a>,
    pub(crate) launcher: JobLaunchDeps<'a>,
}

impl<'a> JobSubmitDeps<'a> {
    pub(crate) fn new(
        snapshot: SnapshotBuildDeps<'a>,
        uploads: UploadStoreDeps<'a>,
        launcher: JobLaunchDeps<'a>,
    ) -> Self {
        Self {
            snapshot,
            uploads,
            launcher,
        }
    }
}

#[derive(Clone)]
pub(crate) struct BundleBuildDeps<'a> {
    pub(crate) submit: JobSubmitDeps<'a>,
}

impl<'a> BundleBuildDeps<'a> {}

#[derive(Clone)]
pub(crate) struct ControlDeps<'a> {
    pub(crate) db: &'a Db,
    pub(crate) job_runner: &'a JobRunnerConfig,
    pub(crate) data_root: &'a Path,
    pub(crate) output_root: &'a Path,
    pub(crate) runtime: RuntimeControl<'a>,
}

impl<'a> ControlDeps<'a> {
    pub(crate) fn new(
        db: &'a Db,
        job_runner: &'a JobRunnerConfig,
        data_root: &'a Path,
        output_root: &'a Path,
        job_runtime: &'a JobRuntime,
    ) -> Self {
        Self {
            db,
            job_runner,
            data_root,
            output_root,
            runtime: RuntimeControl::new(job_runtime),
        }
    }
}

#[derive(Clone)]
pub(crate) struct ReplayDeps<'a> {
    pub(crate) project_root: &'a Path,
    pub(crate) scripts_dir: &'a Path,
    pub(crate) python_bin: &'a str,
    pub(crate) pipeline_command: &'a str,
    pub(crate) data_root: &'a Path,
}

impl<'a> ReplayDeps<'a> {
    pub(crate) fn new(
        project_root: &'a Path,
        scripts_dir: &'a Path,
        python_bin: &'a str,
        pipeline_command: &'a str,
        data_root: &'a Path,
    ) -> Self {
        Self {
            project_root,
            scripts_dir,
            python_bin,
            pipeline_command,
            data_root,
        }
    }
}

#[derive(Clone)]
pub(crate) struct QueryJobsDeps<'a> {
    pub(crate) db: &'a Db,
    pub(crate) data_root: &'a Path,
    pub(crate) downloads_dir: &'a Path,
    pub(crate) download_generation: &'a Arc<DownloadGeneration>,
    pub(crate) replay: ReplayDeps<'a>,
}

impl<'a> QueryJobsDeps<'a> {
    pub(crate) fn new(
        db: &'a Db,
        data_root: &'a Path,
        downloads_dir: &'a Path,
        download_generation: &'a Arc<DownloadGeneration>,
        replay: ReplayDeps<'a>,
    ) -> Self {
        Self {
            db,
            data_root,
            downloads_dir,
            download_generation,
            replay,
        }
    }
}

/// Owned snapshot for a blocking download task; never captures borrowed facade
/// state or reconstructs runtime paths from environment variables.
pub(crate) struct OwnedQueryJobsDeps {
    db: Db,
    data_root: PathBuf,
    downloads_dir: PathBuf,
    download_generation: Arc<DownloadGeneration>,
    project_root: PathBuf,
    scripts_dir: PathBuf,
    python_bin: String,
    pipeline_command: String,
    replay_data_root: PathBuf,
}

impl QueryJobsDeps<'_> {
    pub(crate) fn owned(&self) -> OwnedQueryJobsDeps {
        OwnedQueryJobsDeps {
            db: self.db.clone(),
            data_root: self.data_root.into(),
            downloads_dir: self.downloads_dir.into(),
            download_generation: self.download_generation.clone(),
            project_root: self.replay.project_root.into(),
            scripts_dir: self.replay.scripts_dir.into(),
            python_bin: self.replay.python_bin.into(),
            pipeline_command: self.replay.pipeline_command.into(),
            replay_data_root: self.replay.data_root.into(),
        }
    }
}

impl OwnedQueryJobsDeps {
    pub(crate) fn borrowed(&self) -> QueryJobsDeps<'_> {
        QueryJobsDeps::new(
            &self.db,
            &self.data_root,
            &self.downloads_dir,
            &self.download_generation,
            ReplayDeps::new(
                &self.project_root,
                &self.scripts_dir,
                &self.python_bin,
                &self.pipeline_command,
                &self.replay_data_root,
            ),
        )
    }
}

#[derive(Clone)]
pub(crate) struct CommandJobsDeps<'a> {
    pub(crate) db: &'a Db,
    pub(crate) submit: JobSubmitDeps<'a>,
    pub(crate) control: ControlDeps<'a>,
}

impl<'a> CommandJobsDeps<'a> {
    pub(crate) fn new(db: &'a Db, submit: JobSubmitDeps<'a>, control: ControlDeps<'a>) -> Self {
        Self {
            db,
            submit,
            control,
        }
    }
}
