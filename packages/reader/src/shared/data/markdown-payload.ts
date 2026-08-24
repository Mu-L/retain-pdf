export type NormalizedMarkdownPayload = {
  payload: any;
  content: string;
  imagesBaseUrl: string;
  ready: boolean;
};

function unwrapPayload(payload: any): any {
  if (
    payload
    && typeof payload === "object"
    && payload.data
    && typeof payload.data === "object"
    && !Array.isArray(payload.data)
  ) {
    return payload.data;
  }
  return payload;
}

export function normalizeMarkdownPayload(payload: any): NormalizedMarkdownPayload {
  const value = unwrapPayload(payload) || {};
  const content = `${
    value.content_with_absolute_image_urls
    || value.content
    || value.markdown
    || ""
  }`;
  return {
    payload: value,
    content,
    imagesBaseUrl: `${value.images_base_url || value.images_base_path || ""}`.trim(),
    ready: value.ready !== false && Boolean(content.trim()),
  };
}

export function hasMarkdownContent(payload: any): boolean {
  return Boolean(normalizeMarkdownPayload(payload).content.trim());
}

export async function loadMarkdownPayloadWithFallback(
  loadDocument: () => Promise<any>,
  loadLegacy: () => Promise<any>,
): Promise<any> {
  let documentPayload: any = null;
  try {
    documentPayload = await loadDocument();
    if (hasMarkdownContent(documentPayload)) {
      return documentPayload;
    }
  } catch {
    // Older APIs may not expose /markdown/document; use the legacy payload.
  }
  const legacyPayload = await loadLegacy();
  if (hasMarkdownContent(legacyPayload)) {
    return legacyPayload;
  }
  return documentPayload ?? legacyPayload;
}
