module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputName: 'junit-TEST.xml',
      },
    ],
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/*.{js,ts}'
  ],
  coveragePathIgnorePatterns: [
    "server.ts"
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  setupFiles: ['./jest.setup-file.ts'],
};
