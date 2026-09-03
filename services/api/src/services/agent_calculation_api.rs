//! Stable application facade for durable Agent calculation APIs.

use crate::config::AppConfig;
use crate::db::Db;
use crate::error::AppError;

pub use super::agent_calculations::{
    AgentCalculationArtifactDownload, AgentCalculationListQuery, AgentCalculationListView,
    AgentCalculationView, CompleteAgentCalculationInput, CreateAgentCalculationInput,
    FailAgentCalculationInput,
};

pub struct AgentCalculationApiDeps<'a> {
    db: &'a Db,
    config: &'a AppConfig,
}

impl<'a> AgentCalculationApiDeps<'a> {
    pub fn new(db: &'a Db, config: &'a AppConfig) -> Self {
        Self { db, config }
    }
}

pub fn create_agent_calculation(
    deps: &AgentCalculationApiDeps<'_>,
    input: &CreateAgentCalculationInput,
) -> Result<AgentCalculationView, AppError> {
    super::agent_calculations::create_agent_calculation(deps.db, input)
}

pub fn complete_agent_calculation(
    deps: &AgentCalculationApiDeps<'_>,
    calculation_id: &str,
    input: &CompleteAgentCalculationInput,
) -> Result<AgentCalculationView, AppError> {
    super::agent_calculations::complete_agent_calculation(
        deps.db,
        deps.config,
        calculation_id,
        input,
    )
}

pub fn fail_agent_calculation(
    deps: &AgentCalculationApiDeps<'_>,
    calculation_id: &str,
    input: &FailAgentCalculationInput,
) -> Result<AgentCalculationView, AppError> {
    super::agent_calculations::fail_agent_calculation(deps.db, calculation_id, input)
}

pub fn get_agent_calculation(
    deps: &AgentCalculationApiDeps<'_>,
    calculation_id: &str,
) -> Result<AgentCalculationView, AppError> {
    super::agent_calculations::get_agent_calculation(deps.db, calculation_id)
}

pub fn list_agent_calculations(
    deps: &AgentCalculationApiDeps<'_>,
    conversation_id: &str,
    query: &AgentCalculationListQuery,
) -> Result<AgentCalculationListView, AppError> {
    super::agent_calculations::list_agent_calculations(deps.db, conversation_id, query)
}

pub fn agent_calculation_artifact_download(
    deps: &AgentCalculationApiDeps<'_>,
    calculation_id: &str,
    artifact_id: &str,
) -> Result<AgentCalculationArtifactDownload, AppError> {
    super::agent_calculations::agent_calculation_artifact_download(
        deps.db,
        deps.config,
        calculation_id,
        artifact_id,
    )
}
