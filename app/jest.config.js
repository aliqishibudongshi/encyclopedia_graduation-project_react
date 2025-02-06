module.exports = {
    testEnvironment: 'jsdom',
    moduleDirectories: ["node_modules", "src"],
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy' // 处理样式文件
    },
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
        '\\.(css|less|scss|sass)$': 'jest-transform-css'
    },
    transformIgnorePatterns: [
        'node_modules/(?!(axios)/)' // 允许转换axios模块
    ],
    testTimeout: 10000,

    testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"], // Ensure Jest finds test files
};
