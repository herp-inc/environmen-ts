module.exports = {
    env: {
        es6: true,
    },
    extends: ['@herp-inc'],
    parser: '@typescript-eslint/parser',
    overrides: [
        {
            extends: ['@herp-inc/eslint-config-jest'],
            files: ['*.test.ts'],
        },
    ],
    parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
    },
};
