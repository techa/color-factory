// npm i -D rollup-plugin-riot
import riot from 'rollup-plugin-riot'
// npm i -D rollup rollup-plugin-node-resolve rollup-plugin-commonjs
import commonjs    from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
// npm i -D rollup-plugin-babel babel-preset-es2015-rollup
// import babel       from 'rollup-plugin-babel'
// npm i -D rollup-plugin-postcss postcss-cssnext
// import postcss from 'rollup-plugin-postcss'
// import cssnext from 'postcss-cssnext' // http://cssnext.io/

// npm i -D rollup-plugin-json
import json from 'rollup-plugin-json'

// npm i -D rollup-plugin-uglify
// import uglify from 'rollup-plugin-uglify'

import fs from 'fs'
const {name} = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
// NODE_ENV=production, development
const DEBUG = !(process.env.NODE_ENV === 'production')

export default {
  entry: 'src/index.js',
  dest: `dist/bundle.js`,
  // https://github.com/rollup/rollup/wiki/JavaScript-API#format
  format: 'iife', // es(default),cjs,iife
  // moduleName: name,
  // Note: The riot-compiler does not currently generate sourcemaps
  // so rollup will throw a warning about the sourcemap likely being incorrect
  sourceMap: true,
  // http://qiita.com/cognitom/items/e3ac0da00241f427dad6#appendix
  plugins: [
    commonjs(), // CommonJSモジュールをES6に変換
    // postcss({
    //   extensions: ['.css', '.sss'],
    //   extract: './dist/css/main.css', // css書き出し
    //   sourceMap: true,
    //   plugins: [
    //     cssnext(),
    //   ],
    // }),
    json({
      preferConst: true
    }),
    riot({
      include: [
        './src/components/**.tag',
      ],
    }),
    nodeResolve({
      jsnext: true, // if provided in ES6
      main: true, // if provided in CommonJS
      browser: true, // if provided for browsers
    }), // npmモジュールを`node_modules`から読み込む
  ],
}
