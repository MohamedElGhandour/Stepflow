import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { visualizer } from "rollup-plugin-visualizer";
import alias from "@rollup/plugin-alias";
import path from "path";
import { fileURLToPath } from "url";
import postcss from "rollup-plugin-postcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared plugins for consistency across builds
const commonPlugins = [
  resolve(), // Resolve node_modules imports
  commonjs(), // Convert CommonJS to ESM
  typescript({ tsconfig: "./tsconfig.json" }), // TypeScript support
  babel({
    babelHelpers: "bundled",
    presets: [["@babel/preset-env", { targets: "> 0.25%, not dead" }]], // Modern browser support
  }),
  alias({
    entries: [{ find: "@stepflow", replacement: path.resolve(__dirname, "src") }],
  }),
  visualizer({ filename: "analyze/stats.html" }), // Bundle analysis
];

export default [
  // Modern builds with code-splitting for Node.js and bundlers
  {
    input: "./src/index.ts",
    output: [
      {
        dir: "dist",
        format: "cjs",
        entryFileNames: "stepflow.cjs.js", // Consistent naming
        chunkFileNames: "[name]-[hash].cjs.js",
        sourcemap: true,
      },
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "stepflow.esm.js",
        chunkFileNames: "[name]-[hash].esm.js",
        sourcemap: true,
      },
      {
        dir: "dist",
        format: "cjs",
        entryFileNames: "stepflow.cjs.min.js",
        chunkFileNames: "[name]-[hash].cjs.min.js",
        sourcemap: true,
        plugins: [terser()], // Minified variant
      },
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "stepflow.esm.min.js",
        chunkFileNames: "[name]-[hash].esm.min.js",
        sourcemap: true,
        plugins: [terser()], // Minified variant
      },
    ],
    plugins: [
      ...commonPlugins,
      postcss({
        extract: "stepflow.min.css",
        minimize: true,
        sourceMap: true,
        modules: false,
        use: ["sass"],
      }),
    ],
  },
  // Legacy browser build (single file)
  {
    input: "./src/index.ts",
    output: [
      {
        file: "dist/stepflow.iife.js",
        format: "iife",
        name: "Stepflow", // Global variable for browser
        sourcemap: true,
        inlineDynamicImports: true,
      },
      {
        file: "dist/stepflow.iife.min.js",
        format: "iife",
        name: "Stepflow",
        sourcemap: true,
        inlineDynamicImports: true,
        plugins: [terser()], // Minified variant
      },
    ],
    plugins: [
      ...commonPlugins,
      postcss({
        extract: "stepflow.css",
        minimize: false,
        sourceMap: true,
        modules: false,
        use: ["sass"],
      }),
    ],
  },
];
