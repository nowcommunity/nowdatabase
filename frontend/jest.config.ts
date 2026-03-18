export default {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: '<rootDir>/tsconfig.jest.json',
      },
    ],
  },
  moduleNameMapper: {
    '^.+\\.css$': '<rootDir>/src/tests/mocks/styleMock.ts',
    '^lodash-es$': '<rootDir>/src/tests/mocks/lodashEs.ts',
    '^@/util/config$': '<rootDir>/src/tests/mocks/config.ts',
    '^\\.\\.?/util/config$': '<rootDir>/src/tests/mocks/config.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/Table$': '<rootDir>/src/components/table',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@util/(.*)$': '<rootDir>/src/util/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
}
