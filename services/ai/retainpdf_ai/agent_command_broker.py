"""Runtime-neutral import boundary for the host-owned Agent command broker.

The implementation originally landed with the fx adapter. Keep that module as
a compatibility location while new runtimes depend on this neutral boundary.
"""

from .fx_command_broker import BrokerScope, FxCommandBroker

AgentCommandBroker = FxCommandBroker

__all__ = ["AgentCommandBroker", "BrokerScope"]
