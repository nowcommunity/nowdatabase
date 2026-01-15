module.exports = {
    testPathIgnorePatterns: [
        "<rootDir>/build",
        "<rootDir>/node_modules",
        "<rootDir>/../src/api-tests",
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
