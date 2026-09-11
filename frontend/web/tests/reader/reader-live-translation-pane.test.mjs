import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// 实时译文叠加的回归约束（本轮新行为）：
//
// - 流式实时译文只叠加在 source 栏，且仅当 overlayOnSource 为真
//   （实时译文可用、最终译文 PDF 未就绪）；不再另开第二块「源 PDF + 叠加」
//   的实时画布（去掉 liveTranslationPair 双栏 / 双叠）。
// - 译文 PDF 栏永远是最终译文本身，绝不叠加流式画布。
// - 最终译文就绪后 liveTranslationAvailable=false → overlayOnSource=false，
//   source 栏恢复纯原文，正常左右对照（旧「左右都是中文」bug 不回归）。

const GRID = new URL(
  "../../../../frontend/packages/reader/src/components/react-pdf/ReaderCompareGrid.tsx",
  import.meta.url,
);

function paneBlock(source, pane) {
  const start = source.indexOf(`pane="${pane}"`);
  assert.ok(start >= 0, `ReaderCompareGrid 必须渲染 pane="${pane}"`);
  const end = source.indexOf("/>", start);
  return source.slice(start, end < 0 ? source.length : end);
}

test("source 栏按 overlayOnSource 决定是否叠加实时译文", () => {
  const source = readFileSync(GRID, "utf8");
  const sourcePane = paneBlock(source, "source");

  assert.match(sourcePane, /liveTranslation=\{overlayOnSource \? liveTranslation : undefined\}/);
  assert.match(sourcePane, /showLiveTranslation=\{overlayOnSource\}/);
  // 不再有「源栏永不叠加」的旧硬编码，也不能再把叠加开关接到 pair 上。
  assert.doesNotMatch(sourcePane, /liveTranslation=\{undefined\}/);
  assert.doesNotMatch(sourcePane, /showLiveTranslation=\{false\}/);
  assert.doesNotMatch(source, /liveTranslationPair/);
});

test("不再挂第二块「源 PDF + 叠加」实时画布，译文 PDF 栏绝不叠加", () => {
  const source = readFileSync(GRID, "utf8");
  const translatedPane = paneBlock(source, "translated");

  // 译文 PDF 栏渲染的是 translatedUrl，且无任何流式叠加。
  assert.match(translatedPane, /url=\{translatedUrl\}/);
  assert.match(translatedPane, /liveTranslation=\{undefined\}/);
  assert.match(translatedPane, /showLiveTranslation=\{false\}/);
  assert.match(source, /mountTranslated && !overlayOnSource/);
});
