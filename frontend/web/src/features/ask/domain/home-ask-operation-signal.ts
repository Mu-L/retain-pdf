// Agent 操作变更信号：一次 Agent turn 可能创建/触碰多个 operation，
// 用带 revision 的信号日志（而非 last-write-wins 标量）驱动 operations 刷新。

export type HomeAgentOperationSignal = {
  operationId: string;
  conversationId: string;
  revision: number;
  dedupeKey: string;
};
