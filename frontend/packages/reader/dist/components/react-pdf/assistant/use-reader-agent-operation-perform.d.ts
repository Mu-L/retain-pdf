import { type Dispatch, type MutableRefObject, type SetStateAction } from "react";
import { type AgentOperationView } from "@retainpdf/api/document-operations";
import { type ReaderAgentOperationEntry, type ReaderAgentOperationPerformOptions } from "./reader-agent-operation-model.js";
export declare function useReaderAgentOperationPerform({ refresh, upsert, setEntriesById, inFlightRef, }: {
    refresh: (operationId: string, settlePending?: boolean) => Promise<void>;
    upsert: (operation: AgentOperationView, settlePending?: boolean) => void;
    setEntriesById: Dispatch<SetStateAction<Record<string, ReaderAgentOperationEntry>>>;
    inFlightRef: MutableRefObject<Set<string>>;
}): {
    perform: (action: "run" | "cancel" | "commit" | "retry", operation: AgentOperationView, options?: ReaderAgentOperationPerformOptions) => Promise<void>;
};
//# sourceMappingURL=use-reader-agent-operation-perform.d.ts.map