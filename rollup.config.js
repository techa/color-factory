import commonjs    from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'

import svelte from 'rollup-plugin-svelte'

import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import savelicense from 'uglify-save-license'

const env = (process.env.NODE_ENV || 'development').trim()
const suffix = (env === 'production') ? '.min' : ''

export default {
  input: 'src/index.js',
  output: {
    file: `dist/bundle${suffix}.js`,
    // https://github.com/rollup/rollup/wiki/JavaScript-API#format
    format: 'iife', // es(default),cjs,iife
  },
  sourcemap: true,
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
    svelte(),
    (env === 'production' && buble()),
    (env === 'production' && uglify({
      compress: {
        dead_code: true,
        global_defs: {
          DEBUG: false
        },
        drop_console: true
      },
      output: {
        comments: savelicense
      }
    })),
  ],
}
