use std::path::Path;

use crate::app::AppState;

pub struct CredentialRouteDeps<'a> {
    pub data_root: &'a Path,
}

pub fn build_credential_route_deps(state: &AppState) -> CredentialRouteDeps<'_> {
    CredentialRouteDeps {
        data_root: &state.config.data_root,
    }
}
