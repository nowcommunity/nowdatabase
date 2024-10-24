module.exports = {
    testPathIgnorePatterns: [
        "<rootDir>/build",
        "<rootDir>/node_modules",
    ],
    collectCoverageFrom: [
        "./src/**",
        "!./src/api-tests/**"
    ],
    roots: [
        "./src"
    ],
    coverageReporters: [
        "text",
        "lcov"
    ]
}
