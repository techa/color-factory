import commonjs    from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'

import svelte from 'rollup-plugin-svelte'

import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const env = (process.env.NODE_ENV || 'development').trim()
const suffix = (env === 'production') ? '.min' : ''

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
    commonjs(), // CommonJSモジュールをES6に変換
    json({preferConst: true}),
    nodeResolve({
      jsnext: true, // if provided in ES6
      main: true, // if provided in CommonJS
      browser: true, // if provided for browsers
    }), // npmモジュールを`node_modules`から読み込む
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    svelte({
      css: css => {
        css.write('dist/bundle.css')
      },
      store: true,
    }),
    (env === 'production' && babel()),
    (env === 'production' && uglify({
      compress: {
        dead_code: true,
        global_defs: {
          DEBUG: false
        },
        drop_console: true
      },
    })),
  ],
}
