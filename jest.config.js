module.exports = {
  verbose: true,
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
};
