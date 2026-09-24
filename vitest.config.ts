import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    environment: "happy-dom",
    globals: false,
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      // The component is exercised through the DOM; the math and the state
      // machine are the parts a regression can hide in.
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
});
