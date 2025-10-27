import type { Config } from 'jest'

const config: Config = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.csv\\?raw$': '<rootDir>/tests/__mocks__/rawTextLoader.ts',
  },
}

export default config
