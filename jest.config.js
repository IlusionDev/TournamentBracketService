module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    "collectCoverage": true,
    "collectCoverageFrom": [
        "**/*.{ts,tsx}",
        "!**/node_modules/**",
        "!**/vendor/**"
    ],
    "modulePathIgnorePatterns": [
        "<rootDir>/public/"
    ],
    "coverageDirectory": "coverage",
    "moduleNameMapper": {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "transformIgnorePatterns": [
        "node_modules/(?!(flickity)/)"
    ]
}
