import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
// import { visualizer } from "rollup-plugin-visualizer";
import postcss from "rollup-plugin-postcss";
import alias from "@rollup/plugin-alias";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  input: "./src/main.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/index.min.js",
      format: "iife",
      name: "Stepflow",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    babel({
      babelHelpers: "bundled",
      presets: ["@babel/preset-env"],
    }),
    // sass(),
    postcss({
      extract: true, // Extracts CSS to a separate file
      minimize: true, // Minifies output
      sourceMap: true, // Enables sourcemaps
      modules: false, // Not using CSS Modules
      use: ["sass"], // Enables SCSS support
    }),
    alias({
      entries: [{ find: "@stepflow", replacement: path.resolve(__dirname, "src") }],
    }),
  ],
};
