module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: [],
  moduleDirectories: ['node_modules'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  verbose: true
};