export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@stepflow/(.*)$": "<rootDir>/src/$1",
    "\\.(scss|css)$": "<rootDir>/tests/__mocks__/styleMock.ts",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
};
