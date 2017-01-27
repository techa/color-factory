// npm i -D rollup-plugin-babel babel-preset-es2015-rollup
// import babel       from 'rollup-plugin-babel'
// npm i -D rollup-plugin-postcss postcss-cssnext
// import postcss from 'rollup-plugin-postcss'
// import cssnext from 'postcss-cssnext' // http://cssnext.io/

// npm i -D rollup-plugin-uglify
// npm i -D https://github.com/mishoo/UglifyJS2.git#harmony
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-js'

import config from './rollup.config.js'

import fs from 'fs'
const {name} = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
Object.assign(config, {
  dest: 'dist/bundle.min.js',
  sourceMap: false,
})
config.plugins.push(uglify({
  compress: {
    dead_code: true,
    global_defs: {
      DEBUG: false
    }
  },
  output: {
    comments: function (node, comment) {
      var text = comment.value
      var type = comment.type
      if (type === 'comment2') {
        // multiline comment
        return /@preserve|@license|@cc_on/i.test(text)
      }
    }
  }
}, minify))
export default config
