import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";

const html = await readFile("index.html", "utf8");

test("has a language, a title and a description", () => {
  assert.match(html, /<html lang="[a-z-]+"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+"/);
});

test("has exactly one h1", () => {
  const count = (html.match(/<h1[\s>]/g) ?? []).length;
  assert.equal(count, 1);
});

test("every image has alt text", () => {
  const imgs = html.match(/<img\b[^>]*>/g) ?? [];
  for (const tag of imgs) assert.match(tag, /\balt="/, `Missing alt: ${tag}`);
});

test("local files referenced by the page exist", async () => {
  const refs = [...html.matchAll(/(?:href|src)="([^"#:]+)"/g)].map((m) => m[1]);
  for (const ref of refs) await access(ref);
});

test("contains the build stamp placeholders", () => {
  assert.ok(html.includes("__COMMIT__"));
  assert.ok(html.includes("__BUILT_AT__"));
});
