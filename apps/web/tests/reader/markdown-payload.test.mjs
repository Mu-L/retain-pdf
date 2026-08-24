import assert from "node:assert/strict";
import test from "node:test";

import {
  hasMarkdownContent,
  loadMarkdownPayloadWithFallback,
  normalizeMarkdownPayload,
} from "../../../../packages/reader/src/shared/data/markdown-payload.ts";


test("normalizeMarkdownPayload accepts structured, legacy, and envelope payloads", () => {
  assert.deepEqual(
    normalizeMarkdownPayload({
      ready: true,
      content_with_absolute_image_urls: "# Structured",
      images_base_url: "/images/",
    }),
    {
      payload: {
        ready: true,
        content_with_absolute_image_urls: "# Structured",
        images_base_url: "/images/",
      },
      content: "# Structured",
      imagesBaseUrl: "/images/",
      ready: true,
    },
  );
  assert.equal(normalizeMarkdownPayload({ markdown: "# Legacy" }).content, "# Legacy");
  assert.equal(normalizeMarkdownPayload({ data: { content: "# Envelope" } }).content, "# Envelope");
  assert.equal(hasMarkdownContent({ ready: true, content: "   " }), false);
});


test("empty structured Markdown falls back to the legacy endpoint", async () => {
  const calls = [];
  const payload = await loadMarkdownPayloadWithFallback(
    async () => {
      calls.push("document");
      return { ready: false, content: "" };
    },
    async () => {
      calls.push("legacy");
      return { markdown: "# Recovered" };
    },
  );

  assert.deepEqual(calls, ["document", "legacy"]);
  assert.equal(normalizeMarkdownPayload(payload).content, "# Recovered");
});


test("non-empty structured Markdown avoids a redundant legacy request", async () => {
  let legacyCalls = 0;
  const payload = await loadMarkdownPayloadWithFallback(
    async () => ({ content: "# Current" }),
    async () => {
      legacyCalls += 1;
      return { content: "# Old" };
    },
  );

  assert.equal(normalizeMarkdownPayload(payload).content, "# Current");
  assert.equal(legacyCalls, 0);
});
