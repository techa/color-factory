import commonjs    from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

import json from 'rollup-plugin-json'

import svelte from 'rollup-plugin-svelte'

import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH
const suffix = (production) ? '.min' : ''

export default {
  input: 'src/index.js',
  output: {
    file: `dist/bundle${suffix}.js`,
    // https://github.com/rollup/rollup/wiki/JavaScript-API#format
    format: 'iife', // es(default),cjs,iife
    sourcemap: true,
  },
  // http://qiita.com/cognitom/items/e3ac0da00241f427dad6#appendix
  plugins: [
    svelte({
      dev: !production,
      css: css => {
        css.write('dist/bundle.css')
      },
      store: true,
    }),
    commonjs(), // CommonJSモジュールをES6に変換
    json({ preferConst: true }),
    nodeResolve({
      jsnext: true, // if provided in ES6
      main: true, // if provided in CommonJS
      browser: true, // if provided for browsers
    }), // npmモジュールを`node_modules`から読み込む
    (production && babel({
      // https://github.com/rollup/rollup-plugin-babel/issues/120
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: [
                'last 2 versions',
                'safari >= 7'
              ],
            },
            // https://github.com/babel/babel/tree/master/packages/babel-preset-env#modules
            modules: false,
          },
        ],
      ],
      // plugins: [
      //   '@babel/plugin-external-helpers',
      // ],
      // // https://github.com/rollup/rollup-plugin-babel#configuring-babel
      // externalHelpers: true,
    })),
    (production && terser({
      compress: {
        // https://github.com/mishoo/UglifyJS2/blob/master/README.md#compress-options
        drop_console: true
      },
    })),
  ],
  watch: {
    chokidar: false,
    include: 'src/**'
  },
}
