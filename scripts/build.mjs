// Copies the site into dist/ and stamps it with the commit and build time.
// In GitHub Actions, GITHUB_SHA is set automatically. Locally it falls back to "local".
import { mkdir, readFile, writeFile, copyFile, rm } from "node:fs/promises";

const commit = (process.env.GITHUB_SHA ?? "local").slice(0, 7);
const builtAt = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

const html = (await readFile("index.html", "utf8"))
  .replaceAll("__COMMIT__", commit)
  .replaceAll("__BUILT_AT__", builtAt);

if (html.includes("__COMMIT__") || html.includes("__BUILT_AT__")) {
  throw new Error("Build stamp placeholders were not replaced");
}

await writeFile("dist/index.html", html);
await copyFile("styles.css", "dist/styles.css");
await copyFile("profile.jpg", "dist/profile.jpg").catch(() => {
  throw new Error('profile.jpg not found. Add a photo named "profile.jpg" to the project root before building.');
});
await writeFile("dist/.nojekyll", "");

console.log(`Built dist/ (commit ${commit}, ${builtAt})`);
