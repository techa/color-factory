// node scripts/create-xkcd.json.js
const Color = require('Color')
const fs = require('fs-extra')

const obj = []
fs.readFileSync(`./docs/xkcd-colors.txt`, 'utf8')
  .replace(/[/]/, ' ')
  .replace(/([\w' ]+)\t(#\w{6})/g, (match, name, hex) => {
    obj.push([camelCase(name), Color(hex).hsl().round().object()])
  })

function capitalize (str) {
  return str[0].toUpperCase() + str.substr(1).toLowerCase()
}

function camelCase (str) {
  return str.split(' ').map((s) => capitalize(s)).join('')
}

fs.writeJson(`./src/constants/xkcd.json`, obj.sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0))
