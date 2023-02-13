function createConfig({ name, path }) {
  return {
    displayName: name,
    setupFilesAfterEnv: [`<rootDir>/jestSetupFiles.js`],
    testMatch: [
      `<rootDir>/packages/${path}/src/**/__tests__/**/*.{js,jsx}`,
      `<rootDir>/packages/${path}/src/**/*.{spec,test}.{js,jsx}`
    ],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
      [`^@${path}/(.*)$`]: `<rootDir>/packages/${path}/src/$1`,
      '\\.(css|less|scss)$': 'identity-obj-proxy'
    },
    moduleFileExtensions: ['js', 'jsx', 'json'],
    testTimeout: 20000,
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
      '.+\\.(png|jpg|svg)$': 'jest-transform-stub'
    },
    transformIgnorePatterns: ['node_modules/(?!@wagmi|wagmi).*/']
  }
}

const config = {
  projects: [
    createConfig({ name: 'UI', path: 'ui' }),
  ]
}

module.exports = config
