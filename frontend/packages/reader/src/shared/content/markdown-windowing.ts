// 把 Markdown 原文按「顶层空行」边界切成可独立渲染的块；代码围栏内不切，
// 避免把代码块 / 表格 / 公式劈开。
//
// 返回 null 表示当前缓冲还不足以切出一个 >= minChars 的完整块（需要更多文本）。
// 调用方在 EOF 时把剩余文本直接渲染即可。

export function takeCompleteMarkdownChunk(
  text: string,
  { minChars = 16384 }: { minChars?: number } = {},
): { complete: string; rest: string } | null {
  if (!text) return null;
  let fence = "";
  let i = 0;
  const len = text.length;
  while (i < len) {
    const newlineIndex = text.indexOf("\n", i);
    const lineEnd = newlineIndex === -1 ? len : newlineIndex;
    const line = text.slice(i, lineEnd);
    const trimmed = line.trim();
    const fenceMatch = trimmed.match(/^(`{3,}|~{3,})/);
    if (fenceMatch) {
      const char = fenceMatch[1][0];
      if (!fence) fence = char;
      else if (fence === char) fence = "";
    }
    // 顶层空行 = 块边界（围栏内不算）
    if (!fence && trimmed === "") {
      const boundary = newlineIndex === -1 ? len : newlineIndex + 1;
      if (boundary >= minChars) {
        return { complete: text.slice(0, boundary), rest: text.slice(boundary) };
      }
    }
    if (newlineIndex === -1) break;
    i = newlineIndex + 1;
  }
  return null;
}
