const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    // Add mocks for components
    '^@/components/ui/dialog$': '<rootDir>/__mocks__/components/ui/dialog.tsx',
    '^@/components/ui/button$': '<rootDir>/__mocks__/components/ui/button.tsx',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  // Use the mocks defined in __mocks__ directory
  moduleDirectories: ['node_modules', '__mocks__'],
  // Set this to false to allow for explicit mocks in jest.setup.js
  automock: false,
  // Run all test suites
  testMatch: ['<rootDir>/__tests__/**/*.test.(ts|tsx)'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig); 