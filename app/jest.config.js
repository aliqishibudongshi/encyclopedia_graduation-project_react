// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
        '\\.(css|less|scss|sass)$': 'jest-transform-css'
    },
    transformIgnorePatterns: [
        'node_modules/(?!(axios)/)' // 允许转换axios模块
    ],
    testTimeout: 10000
};