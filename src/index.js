/* eslint  no-new: 0 */
import './Color-ex'
import App from './svelte/app.html'
import store from './store/store.js'

new App({
  target: document.querySelector('#root'),
  store,
})
