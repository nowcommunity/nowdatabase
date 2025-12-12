export default {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/table$': '<rootDir>/src/components/table',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@util/(.*)$': '<rootDir>/src/util/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  testEnvironment: 'jsdom',
}
