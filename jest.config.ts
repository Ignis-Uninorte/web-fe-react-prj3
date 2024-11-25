import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS imports
    '\\.(svg|jpg|jpeg|png|gif|eot|otf|webp|woff|woff2|ttf|mp4|mp3|wav|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js', // Mock static files
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Jest DOM setup
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config;
