import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
// import { visualizer } from "rollup-plugin-visualizer";
import postcss from 'rollup-plugin-postcss'

export default  {
    input: './src/main.ts',
    output:[
        {
            file: 'dist/index.cjs.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true,
        },
        {
            file: 'dist/index.min.js',
            format: 'iife',
            name: 'Stepflow',
            sourcemap: true,
            plugins: [terser()]
        }

    ],
    plugins:[
        resolve(),
        commonjs(),
        // visualizer({ open: true }),
        typescript({ tsconfig: './tsconfig.json' }),
        babel({
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env']
        }),
        postcss({
            extract: true,
            minimize: true,
            sourceMap: true,
            modules: true,
            use: ['sass']
        })
    ]
}