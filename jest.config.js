/* global module */
module.exports = {
  preset: "ts-jest", // Use ts-jest for TypeScript
  testEnvironment: "jsdom", // For DOM-related tests (e.g., overlay)
  roots: ["<rootDir>/tests"], // Look for tests in tests/
  testMatch: ["**/*.tests.ts"], // Match *.tests.ts files
  moduleNameMapper: {
    "^@stepflow/(.*)$": "<rootDir>/src/$1", // Match your alias
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"], // Optional setup
};
