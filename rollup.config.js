import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json'
import pkg from './package.json';
import image from '@rollup/plugin-image';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const external = Object.keys(pkg.dependencies);

external.push('styled-components');
external.push('@carbon/icons-react');

const banner = `/* ${pkg.name} version : ${pkg.version} */`;

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'es',
    sourcemap: true,
    name: 'rocketChart',
    banner,
  },
  external: external,
  plugins: [
    json(),
    postcss({
      extract: false,
      minimize: production,
    }),
    typescript(),
    // 处理 svg 等
    image(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['@babel/env', { loose: true, modules: false }], '@babel/react'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      babelHelpers: 'runtime',
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            helpers: true,
            regenerator: true,
          },
        ],
      ],
    }),

    commonjs({}),
    nodeResolve(),
    // minify, but only in production
    production &&
      terser({
        compress: {
          drop_console: true,
        },
        output: {
          comments: new RegExp(pkg.name.replace(/\//g, '\\/')),
        },
      }),
  ],
};
