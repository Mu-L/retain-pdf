/**
 * 任务展示谓词的装配：从 composition 注入的 jobPresentationPort 取
 * normalizeJobPayload / isTerminalStatus / isJobTerminal，缺失时回落到内置默认实现。
 * 这些谓词被轮询引擎与重试动作共用，集中一处便于注入与单测。
 */
export function createJobPresentation({ jobPresentationPort }: any = {}) {
  const normalizeJobPayload =
    jobPresentationPort?.normalizeJobPayload || ((value: any) => value || {});
  const isTerminalStatus =
    jobPresentationPort?.isTerminalStatus ||
    ((status: any) => status === "failed" || status === "canceled");
  const isJobTerminal =
    jobPresentationPort?.isJobTerminal ||
    ((value: any = {}) => isTerminalStatus(value?.status || value));
  return { normalizeJobPayload, isTerminalStatus, isJobTerminal };
}
