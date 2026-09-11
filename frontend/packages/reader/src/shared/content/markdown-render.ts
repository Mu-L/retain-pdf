// Markdown 渲染共享：marked 懒加载、HTML 消毒、把渲染结果挂载到容器并转交图片懒加载。

import { resolveMarkdownAssetUrl } from "../../external.js";

let markedModulePromise: Promise<typeof import("marked")> | null = null;

export function loadMarked() {
  if (!markedModulePromise) {
    markedModulePromise = import("marked").catch((err) => {
      markedModulePromise = null;
      throw err;
    });
  }
  return markedModulePromise;
}

export function sanitizeRenderedMarkdown(container: ParentNode) {
  container
    .querySelectorAll("script, iframe, object, embed, style, link, meta, base, form, input, button, textarea, select")
    .forEach((node) => node.remove());
  container.querySelectorAll("*").forEach((node) => {
    for (const attribute of [...(node as Element).attributes]) {
      if (/^on/i.test(attribute.name)) {
        (node as Element).removeAttribute(attribute.name);
      }
    }
  });
  container.querySelectorAll("a[href]").forEach((anchor) => {
    const el = anchor as HTMLAnchorElement;
    if (/^\s*javascript:/i.test(el.getAttribute("href") || "")) {
      el.removeAttribute("href");
    }
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
}

export function mountRenderedMarkdown(
  container: HTMLElement,
  html: string,
  imagesBaseUrl: string,
): HTMLImageElement[] {
  const template = container.ownerDocument.createElement("template");
  template.innerHTML = html;
  sanitizeRenderedMarkdown(template.content);
  template.content.querySelectorAll("img[src]").forEach((img) => {
    const raw = img.getAttribute("src") || "";
    const resolved = resolveMarkdownAssetUrl(imagesBaseUrl, raw) || raw;
    img.setAttribute("data-reader-md-src", resolved);
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
    img.removeAttribute("src");
  });
  container.replaceChildren(template.content);
  container.classList.remove("hidden");
  return [...container.querySelectorAll<HTMLImageElement>("img[data-reader-md-src]")];
}
