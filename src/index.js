/* eslint  no-new: 0 */
import App from './svelte/app.html'
import store from './store/store.js'
// import './Color-ex'

new App({
  target: document.querySelector('#root'),
  store,
})
