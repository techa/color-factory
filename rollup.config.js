import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

import css from 'rollup-plugin-css-asset'
import json from 'rollup-plugin-json'

import svelte from 'rollup-plugin-svelte'

import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    // https://github.com/rollup/rollup/wiki/JavaScript-API#format
    format: 'iife', // es(default),cjs,iife
    sourcemap: !production,
    // Bundled CSS will observe configured name pattern for emitted assets.
    // 'assets/[name]-[hash][extname]'
    assetFileNames: '[name].css',
  },
  // http://qiita.com/cognitom/items/e3ac0da00241f427dad6#appendix
  plugins: [
    svelte({
      dev: !production,
      css: css => {
        css.write('dist/svelte.css', /* sourcemap */ !production)
      },
      store: true,
    }),

    css(),
    json({ preferConst: true }),

    nodeResolve({
      browser: true, // if provided for browsers options.mainFields,
      dedupe: ['svelte'],
    }), // npmモジュールを`node_modules`から読み込む
    commonjs(), // CommonJSモジュールをES6に変換

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
                'safari >= 7',
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
        drop_console: true,
      },
    })),

    !production && serve('dist'),
    !production && livereload('dist'),
  ],
}
