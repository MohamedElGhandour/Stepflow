import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import autoprefixer from "autoprefixer";
import path from "path";
import normalize from "postcss-normalize";
import filesize from "rollup-plugin-filesize";
import postcss from "rollup-plugin-postcss";
import progress from "rollup-plugin-progress";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from "url";
import terser from "@rollup/plugin-terser";
import { createRequire } from "node:module";

const _require = createRequire(import.meta.url);
const pkg = _require("./package.json");

const inputPath = "./src";
const outputPath = "./dist";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const now = new Date();

export const banner = `/*!
 * Stepflow v${pkg.version}
 * Repository: https://github.com/MohamedElGhandour/Stepflow
 *
 * Built by Mohamed Elghandour
 * © 2025-${now.getFullYear()} All rights reserved.
 *
 * Build Date: ${now.toUTCString()}
 *
 * Enjoy building with Stepflow!
 */
`;

const extensions = [".ts", ".js", ".scss"];

const postCSSPlugins = [autoprefixer, normalize];

// Shared plugins for consistency across builds
const commonPlugins = [
  json(),
  progress(),
  filesize({
    showGzippedSize: true,
  }),
  resolve({ extensions }), // Resolve node_modules imports
  commonjs(), // Convert CommonJS to ESM
  typescript({ tsconfig: "./tsconfig.json" }), // TypeScript support
  babel({
    babelHelpers: "bundled",
    extensions,
    presets: [["@babel/preset-env", { targets: "> 0.25%, not dead" }]], // Modern browser support
  }),
  alias({
    entries: [{ find: "@stepflow", replacement: path.resolve(__dirname, "src") }],
  }),
  visualizer({ filename: "analyze/stats.html" }), // Bundle analysis
];

export default [
  // Configuration for regular (non-minified) CSS
  {
    input: `${inputPath}/styles/stepflow.scss`,
    output: {
      file: path.resolve(`${outputPath}/styles/stepflow.css`),
      format: "es",
    },
    plugins: [
      postcss({
        extract: path.resolve(`${outputPath}/styles/stepflow.css`), // explicitly extract to this file
        sourceMap: true,
        use: {
          sass: { silenceDeprecations: ["legacy-js-api"] },
          stylus: {},
          less: {},
        },
        plugins: postCSSPlugins,
      }),
    ],
  },
  // Configuration for minified CSS
  {
    input: `${inputPath}/styles/stepflow.scss`,
    output: {
      file: path.resolve(`${outputPath}/styles/stepflow.min.css`),
      format: "es",
    },
    plugins: [
      postcss({
        extensions: [".css", ".scss"],
        extract: path.resolve(`${outputPath}/styles/stepflow.min.css`),
        sourceMap: true,
        minimize: true,
        use: {
          sass: { silenceDeprecations: ["legacy-js-api"] },
          stylus: {},
          less: {},
        },
        plugins: postCSSPlugins,
      }),
    ],
  },
  // Configuration for CJS build
  {
    input: `${inputPath}/index.ts`,
    output: [
      {
        dir: "dist",
        entryFileNames: `cjs/${pkg.main}`,
        format: "cjs",
        banner,
        sourcemap: true,
        name: "Stepflow",
        inlineDynamicImports: true,
      },
      {
        dir: "dist",
        entryFileNames: `cjs/${pkg.main.replace(/\.js$/, ".min.js")}`,
        format: "cjs",
        sourcemap: true,
        banner,
        plugins: [terser()],
        name: "Stepflow",
        inlineDynamicImports: true,
      },
    ],
    plugins: commonPlugins,
  },
  // Configuration for ESM build
  {
    input: `${inputPath}/index.ts`,
    output: [
      {
        dir: "dist",
        entryFileNames: `esm/${pkg.module}`,
        format: "esm",
        banner,
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        dir: "dist",
        entryFileNames: `esm/${pkg.module.replace(/\.js$/, ".min.js")}`,
        format: "esm",
        banner,
        sourcemap: true,
        plugins: [terser()],
        inlineDynamicImports: true,
      },
    ],
    plugins: commonPlugins,
  },
  //  IIFE build (browser)
  {
    input: `${inputPath}/index.ts`,
    output: [
      {
        dir: "dist",
        entryFileNames: `iife/${pkg.browser}`,
        format: "iife",
        name: "Stepflow",
        banner,
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        dir: "dist",
        entryFileNames: `iife/${pkg.browser.replace(/\.js$/, ".min.js")}`,
        format: "iife",
        name: "Stepflow",
        banner,
        sourcemap: true,
        plugins: [terser()],
        inlineDynamicImports: true,
      },
    ],
    plugins: commonPlugins,
  },
  //  UMD build
  {
    input: `${inputPath}/index.ts`,
    output: [
      {
        dir: "dist",
        entryFileNames: `umd/${pkg.unpkg}`,
        format: "umd",
        banner,
        sourcemap: true,
        inlineDynamicImports: true,
        name: "Stepflow", // Added name property
      },
      {
        dir: "dist",
        entryFileNames: `umd/${pkg.unpkg.replace(/\.js$/, ".min.js")}`,
        format: "umd",
        banner,
        sourcemap: true,
        plugins: [terser()],
        inlineDynamicImports: true,
        name: "Stepflow", // Added name property
      },
    ],
    plugins: commonPlugins,
  },
];
