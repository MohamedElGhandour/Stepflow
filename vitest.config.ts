import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      reporter: ["text", "html", "lcov"],
    },
  },
  resolve: {
    alias: [
      { find: /^@stepflow\/(.*)$/, replacement: path.resolve(__dirname, "src/$1") },
      { find: "@stepflow", replacement: path.resolve(__dirname, "src") },
    ],
  },
});
