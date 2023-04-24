/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  extensionsToTreatAsEsm: [
    '.ts'
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/jest-setup.ts'
  ],
  testEnvironment: 'jsdom',
  transform: {
    '\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json'
      }
    ]
  }
};