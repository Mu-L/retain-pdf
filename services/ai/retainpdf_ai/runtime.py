"""Compatibility facade for RetainPDF agent runtimes.

Runtime implementations live in :mod:`retainpdf_ai.runtimes`. Keep this module
as the stable import boundary for the API service and downstream callers.
"""

from .runtimes import (
    FX_RUNTIME_ID,
    AgentRuntime,
    FxAcpRuntime,
    FxCapability,
    PythonAgentRuntime,
    build_agent_runtime,
    probe_fx_gateway_endpoint,
)

__all__ = [
    "FX_RUNTIME_ID",
    "AgentRuntime",
    "FxAcpRuntime",
    "FxCapability",
    "PythonAgentRuntime",
    "build_agent_runtime",
    "probe_fx_gateway_endpoint",
]
