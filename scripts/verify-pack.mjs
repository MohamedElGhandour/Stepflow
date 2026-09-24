/**
 * Packs the tarball, installs it into a throwaway project, and proves a real
 * consumer can reach it three ways: require(), import(), and tsc.
 *
 * v1.0.2 shipped three times with every entry path pointing at a file the build
 * never wrote. Nothing caught it because nothing ever consumed the tarball.
 * This does.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const run = (cmd, args, cwd = root) =>
  execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

const pkg = JSON.parse(run("cat", ["package.json"]));
const fail = [];

// 1. Every path the manifest advertises must exist on disk.
const declared = new Set();
const walk = (value) => {
  if (typeof value === "string" && value.startsWith("./")) declared.add(value);
  else if (value && typeof value === "object") Object.values(value).forEach(walk);
};
walk(pkg.exports);
for (const field of ["main", "module", "types"]) if (pkg[field]) declared.add(pkg[field]);

for (const path of declared) {
  if (path === "./package.json") continue;
  if (!existsSync(join(root, path))) fail.push(`manifest points at a missing file: ${path}`);
}
if (fail.length) {
  console.error("verify-pack FAILED\n  " + fail.join("\n  "));
  process.exit(1);
}
console.log(`✓ ${declared.size} declared paths all exist`);

// 2. Install the real tarball into a clean project and consume it.
const tarball = run("npm", ["pack", "--silent", "--pack-destination", tmpdir()]).trim();
const tarPath = join(tmpdir(), tarball);
const dir = mkdtempSync(join(tmpdir(), "stepflow-verify-"));

try {
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "consumer", private: true }));
  run("npm", ["install", "--no-audit", "--no-fund", tarPath, "react", "react-dom"], dir);
  // Types come from the consumer side, as they do in any real React + TS app.
  run("npm", ["install", "--no-audit", "--no-fund", "-D", "typescript", "@types/react", "@types/react-dom"], dir);

  // require() from CommonJS
  writeFileSync(
    join(dir, "cjs.cjs"),
    `const m = require("${pkg.name}");
     if (typeof m.Stepflow !== "function") throw new Error("Stepflow missing from CJS build");`
  );
  run("node", ["cjs.cjs"], dir);
  console.log("✓ require() resolves and exports Stepflow");

  // import() from ESM
  writeFileSync(
    join(dir, "esm.mjs"),
    `const m = await import("${pkg.name}");
     if (typeof m.Stepflow !== "function") throw new Error("Stepflow missing from ESM build");`
  );
  run("node", ["esm.mjs"], dir);
  console.log("✓ import() resolves and exports Stepflow");

  // The stylesheet subpath must be reachable, not just present in the tarball.
  writeFileSync(
    join(dir, "css.mjs"),
    `import { createRequire } from "node:module";
     createRequire("${dir}/").resolve("${pkg.name}/styles.css");`
  );
  run("node", ["css.mjs"], dir);
  console.log("✓ ./styles.css subpath is exported");

  // Types, under the resolution mode modern React apps actually use.
  writeFileSync(
    join(dir, "app.tsx"),
    `import { Stepflow, type Step } from "${pkg.name}";
     const steps: Step[] = [{ title: "Hi", content: "There" }];
     export const App = () => <Stepflow run steps={steps} />;`
  );
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        strict: true,
        noEmit: true,
        jsx: "react-jsx",
        module: "ESNext",
        moduleResolution: "Bundler",
        skipLibCheck: false,
        lib: ["ES2020", "DOM"],
      },
      include: ["app.tsx"],
    })
  );
  run("npx", ["tsc", "-p", "tsconfig.json"], dir);
  console.log("✓ tsc resolves types under moduleResolution: Bundler");

  console.log("\nverify-pack PASSED");
} catch (error) {
  console.error("\nverify-pack FAILED\n");
  console.error(error.stdout?.toString() || "");
  console.error(error.stderr?.toString() || error.message);
  process.exit(1);
} finally {
  rmSync(dir, { recursive: true, force: true });
  rmSync(tarPath, { force: true });
}
