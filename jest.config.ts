export {};
const path = require('path');
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testRegex: '(/app/.*\\.test)\\.(tsx?|ts?)$',
  moduleDirectories: ['node_modules', path.join(__dirname, './app')],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/app/__mocks__/fileMock.ts',
    '^.+\\.(css|less|scss|sass)$': '<rootDir>/app/__mocks__/styleMock.ts',
    '(assets|models|services)': '<rootDir>/app/__mocks__/fileMock.ts',
    '^@components/(.*)$': '<rootDir>/app/components/$1',
    '^@containers/(.*)$': '<rootDir>/app/containers/$1',
    '^@utils/(.*)$': '<rootDir>/app/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/app/hooks/$1',
    '^@contexts/(.*)$': '<rootDir>/app/contexts/$1',
    '^@assets/(.*)$': '<rootDir>/app/assets/$1',
    '^@store/(.*)$': '<rootDir>/app/store/$1',
  },
  // setupFiles: ["./set-env.ts"],
  setupFilesAfterEnv: ['./setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  modulePaths: ['<rootDir>'],
  testEnvironment: 'jsdom',
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/', '/public/', '/dist', '<rootDir>/app/__mocks__/'],
  collectCoverageFrom: [
    'app/**/*.js',
    'app/**/*.ts',
    'app/**/*.tsx',
    '!app/**/*/Loadable.{ts,tsx}',
    '!app/**/*/messages.ts',
    '!app/**/*.stories.{ts,tsx}',
    '!app/**/queries.ts',
    '!app/index.tsx',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/app/msw/'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 40,
      lines: 57,
      statements: 57,
    },
  },
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
};
