import commonjs    from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

import json from 'rollup-plugin-json'

import replace from 'rollup-plugin-replace'
import svelte from 'rollup-plugin-svelte'

export default {
  entry: 'src/svelte.js',
  dest: `dist/bundle.svelte.js`,
  // https://github.com/rollup/rollup/wiki/JavaScript-API#format
  format: 'iife', // es(default),cjs,iife
  sourceMap: true,
  // http://qiita.com/cognitom/items/e3ac0da00241f427dad6#appendix
  plugins: [
    commonjs(), // CommonJSモジュールをES6に変換
    json({
      preferConst: true
    }),
    svelte({
      include: [
        './src/svelte/**.html',
      ],
    }),
    nodeResolve({
      jsnext: true, // if provided in ES6
      main: true, // if provided in CommonJS
      browser: true, // if provided for browsers
    }), // npmモジュールを`node_modules`から読み込む
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ],
}
