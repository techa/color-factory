/* eslint  no-new: 0 */
import App from './svelte/app.html'
import store from './store/store.js'
import defaultpalette from './constants/newwebcolor'
import './Color-ex'

// Load defaultpalette
if (!window.localStorage.getItem(defaultpalette.paletteName)) {
  store.save(defaultpalette.paletteName, defaultpalette)
}

new App({
  target: document.querySelector('#root'),
  store,
})
