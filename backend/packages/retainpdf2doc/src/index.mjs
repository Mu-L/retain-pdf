/**
 * retainpdf2doc —— RetainPDF 排版规格 → 保留排版的 Word 文档。
 *
 * 缝在哪:排版规格由 Python 侧的 `retainpdf_pipeline` 算（`build_render_page_specs`
 * 那套逻辑搬不动也不该搬），这个包只负责把规格变成 .docx。规格的形状见 `spec.mjs`。
 *
 * 为什么要有这个包（而不是继续用 Python 的 python-docx 版）:公式。旧版手写的
 * LaTeX→OMML 转换器有一张 47 条的符号表，实测全仓 32.3% 的公式会把命令名当字母印出来
 * （`\mathbf{2a}` → `mathbf2a`）。这边走 MathJax → MathML → OMML，没有这个问题。
 */

import { readFile } from "node:fs/promises";
import path from "node:path";

import { createDocxTheme } from "../vendor/visualtex/office/docx/config/index.ts";
import { buildDocxPackage } from "../vendor/visualtex/office/docx/package/packageParts.ts";
import { validateDocxPackage } from "../vendor/visualtex/office/docx/package/validatePackage.ts";
import { buildBody } from "./body.mjs";
import { parseSpec } from "./spec.mjs";

const IMAGE_CONTENT_TYPES = new Map([
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
]);

const TWIPS_PER_POINT = 20;

async function loadBackgrounds(spec, baseDir) {
  const media = [];
  const byPageIndex = new Map();
  for (const page of spec.pages) {
    if (!page.background) continue;
    const absolute = path.resolve(baseDir, page.background.path);
    const extension = path.extname(absolute).toLowerCase();
    const contentType = IMAGE_CONTENT_TYPES.get(extension);
    if (!contentType) {
      throw new Error(`第 ${page.pageIndex + 1} 页的背景图格式不支持：${extension || "(无扩展名)"}（只收 png/jpg）`);
    }
    let bytes;
    try {
      bytes = new Uint8Array(await readFile(absolute));
    } catch (cause) {
      throw new Error(`第 ${page.pageIndex + 1} 页的背景图读不到：${absolute}`, { cause });
    }
    const entry = {
      relationshipId: `rIdBg${page.pageIndex}`,
      fileName: `page-${String(page.pageIndex + 1).padStart(4, "0")}${extension === ".jpeg" ? ".jpg" : extension}`,
      contentType,
      bytes,
    };
    media.push(entry);
    byPageIndex.set(page.pageIndex, entry);
  }
  return { media, byPageIndex };
}

/**
 * @param {object} rawSpec 规格对象（见 spec.mjs）
 * @param {object} options
 * @param {string} options.baseDir 背景图相对路径的基准目录
 */
export async function buildLayoutDocx(rawSpec, { baseDir = process.cwd() } = {}) {
  const spec = parseSpec(rawSpec);
  const { media, byPageIndex } = await loadBackgrounds(spec, baseDir);
  const { body, errors, textboxCount, formulaCount } = buildBody(spec, byPageIndex);

  // 主题只用来定最后一页的 sectPr 和基础样式。页面尺寸取最后一页——前面每一页的
  // 尺寸由 body 里各自的分节符给出（源 PDF 各页尺寸可以不同）。
  const lastPage = spec.pages[spec.pages.length - 1];
  const theme = createDocxTheme({
    page: {
      widthTwips: Math.round(lastPage.widthPt * TWIPS_PER_POINT),
      heightTwips: Math.round(lastPage.heightPt * TWIPS_PER_POINT),
      marginTopTwips: 0,
      marginRightTwips: 0,
      marginBottomTwips: 0,
      marginLeftTwips: 0,
      headerTwips: 0,
      footerTwips: 0,
    },
  });

  const bytes = buildDocxPackage(
    body,
    spec.font.mathFamily,
    {
      title: spec.job.title || "RetainPDF 保留排版译文",
      creator: "RetainPDF",
      description: "RetainPDF layout-preserving translation with native Office Math.",
    },
    theme,
    undefined,
    // 保留排版的导出不要页眉页脚:它们会把绝对定位的内容整体挤走。
    { media, includeHeaderFooter: false },
  );

  return {
    bytes,
    pageCount: spec.pages.length,
    textboxCount,
    formulaCount,
    formulaErrors: errors,
  };
}

export { parseSpec, validateDocxPackage };
