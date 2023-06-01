import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: 'src/index.ts',
        output: {
            dir: 'dist/cjs',
            format: 'cjs',
        },
        plugins: [
            typescript({
                exclude: ['**/*.test.ts'],
                outDir: 'dist/cjs',
            }),
        ],
    },
    {
        input: 'src/index.ts',
        output: {
            dir: 'dist/esm',
            format: 'esm',
        },
        plugins: [
            typescript({
                exclude: ['**/*.test.ts'],
                outDir: 'dist/esm',
            }),
        ],
    },
];
