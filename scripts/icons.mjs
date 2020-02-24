/**
 * SVG Sprite
 * node --experimental-modules scripts/icons.mjs
 * @example
<svg class="">
  <use xlink:href="#circle"/>
</svg>
 */

import fs from 'fs'

import feather from 'feather-icons'

const useIconList = new Set([
  'square',
  'check-square',
  'eye',
  'eye-off',
  'x',
  'trash',
  'shuffle',
  'rotate-ccw',
  'rotate-cw',
  'plus',
  'filter',
  'edit',
  'copy',
  'clipboard',
  'refresh-cw',
  'hard-drive',
  'type', // T
  'droplet',
  'github',
])

let html = '<svg xmlns="http://www.w3.org/2000/svg"><defs>'
useIconList.forEach((id) => {
  let icon
  switch (id) {
    case 'trash':
      icon = feather.icons['trash-2']
      break

    default:
      icon = feather.icons[id]
      break
  }
  if (icon) {
    html += `<symbol id="${id}" viewBox="0 0 24 24">${icon.contents}</symbol>`
  } else {
    console.error(`!!! Wrong ID  - ${id}`)
  }
})
html += '</defs></svg>'

fs.writeFileSync('./src/svelte/icons.html', html)
