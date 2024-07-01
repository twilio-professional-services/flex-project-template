module.exports = {
  clearMocks: true,
  automock: false,
  testResultsProcessor: 'jest-junit',
  testEnvironment: 'jsdom',
  reporters: ['default', 'jest-junit'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
  globalSetup: '<rootDir>/globalSetupTests.js',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
};
