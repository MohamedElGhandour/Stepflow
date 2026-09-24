/**
 * Stages files that live at the repo root (where GitHub expects them) into doc/
 * so the docs site can serve them too. The copies are gitignored — the root
 * files stay the single source of truth.
 */
import { copyFileSync, mkdirSync, cpSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dirname, "..");
const doc = join(root, "doc");

for (const file of ["MIGRATION.md", "CHANGELOG.md"]) {
  copyFileSync(join(root, file), join(doc, file));
}

// The interactive demo ships alongside the docs at /demo/. It needs the built
// bundle, so run `npm run build` first.
const assets = join(doc, "public");
mkdirSync(assets, { recursive: true });
copyFileSync(join(root, "public/asset/favicon.svg"), join(assets, "favicon.svg"));
if (existsSync(join(root, "public/vendor/stepflow.js"))) {
  cpSync(join(root, "public"), join(assets, "demo"), { recursive: true });
} else {
  console.warn("! public/vendor is empty — run `npm run build` first or /demo/ will be broken");
}

console.log("docs assets staged into doc/");
