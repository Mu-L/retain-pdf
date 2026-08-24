export declare function fetchJobDiagnostics(jobId: string, apiPrefix?: string): Promise<any>;
export declare function fetchResumePlan(jobId: string, apiPrefix?: string): Promise<any>;
export declare function resumeJob(jobId: string, apiPrefix?: string): Promise<any>;
export declare function fetchJobStageActions(jobId: string, apiPrefix?: string): Promise<any>;
export declare function retryJobStage(jobId: string, apiPrefix: string | undefined, stage: string, payload?: Record<string, unknown>): Promise<any>;
export declare function rerunJob(actionUrl: string): Promise<any>;
