import typescript from "@rollup/plugin-typescript";
import { createRequire } from "node:module";

const pkg = createRequire(import.meta.url)("./package.json");

const banner = `/*! Stepflow v${pkg.version} | MIT | https://github.com/MohamedElGhandour/Stepflow */`;

// React and its runtime always come from the host app. Bundling them would be
// both wrong (two copies of React) and enormous.
const external = [/^react($|\/)/, /^react-dom($|\/)/];

const plugins = [
  typescript({
    tsconfig: "./tsconfig.json",
    // Declarations are emitted by `tsc -p tsconfig.build.json`, not here.
    declaration: false,
    declarationMap: false,
    emitDeclarationOnly: false,
    noEmit: false,
    outDir: undefined,
  }),
];

export default [
  {
    input: "src/index.ts",
    external,
    plugins,
    output: { file: "dist/esm/stepflow.js", format: "esm", banner, sourcemap: true },
  },
  {
    input: "src/index.ts",
    external,
    plugins,
    output: {
      file: "dist/cjs/stepflow.cjs",
      format: "cjs",
      banner,
      sourcemap: true,
      exports: "named",
      interop: "auto",
    },
  },
];
