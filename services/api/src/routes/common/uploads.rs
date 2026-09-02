use std::num::NonZeroU64;
use std::path::Path;

use retain_core::config::effective_upload_max_bytes;

use crate::app::AppState;
use crate::db::Db;

pub struct UploadRouteDeps<'a> {
    pub db: &'a Db,
    pub uploads_dir: &'a Path,
    pub upload_max_bytes: NonZeroU64,
    pub upload_max_pages: u32,
    pub python_bin: &'a str,
}

pub fn build_upload_route_deps(state: &AppState) -> UploadRouteDeps<'_> {
    UploadRouteDeps {
        db: state.db.as_ref(),
        uploads_dir: &state.config.uploads_dir,
        upload_max_bytes: effective_upload_max_bytes(state.config.upload_max_bytes),
        upload_max_pages: state.config.upload_max_pages,
        python_bin: &state.config.python_bin,
    }
}
