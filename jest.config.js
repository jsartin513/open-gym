module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: [],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
}
};