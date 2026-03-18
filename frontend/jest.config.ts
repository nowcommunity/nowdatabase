export default {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    '^.+\\.css$': '<rootDir>/src/tests/mocks/styleMock.ts',
    '^.+\\.(svg|png|jpe?g|gif|webp)$': '<rootDir>/src/tests/mocks/fileMock.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/Table$': '<rootDir>/src/components/table',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@util/(.*)$': '<rootDir>/src/util/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
}
