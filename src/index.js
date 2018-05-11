/* eslint  no-new: 0 */
import 'babel-polyfill'
import store from './store/store.js'
import App from './svelte/app.html'

new App({
  target: document.querySelector('#root'),
  store,
})
