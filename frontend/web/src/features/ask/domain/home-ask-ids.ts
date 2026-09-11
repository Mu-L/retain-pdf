// 本地乐观消息 id（服务端会在 done 回传权威 id 前先有占位）

export function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
