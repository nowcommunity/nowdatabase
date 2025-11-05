export default {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@util/(.*)$': '<rootDir>/src/util/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  testEnvironment: 'jsdom',
}
