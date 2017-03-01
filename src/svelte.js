/* eslint  no-new: 0 */
import store from './store'

import App from './svelte/app.html'
import defaultpalette from './constants/defaultpalette'

const storage = window.sessionStorage

const app = new App({
  target: document.querySelector('#root'),
  data: store.get()
})

store.subscribe((data) => {
  app.set(data)
})


// testing
// const histore = Histore(store.getState())
// console.log('histore', histore)
// console.log('histore', histore.get())
// console.log('histore.get(cards)1', histore.get('cards'))


// histore.one('cards.add_card', (param) => {
//   const cards = histore.get('cards')
//   param.color = param.color
//   param.zIndex = cards.length
//   histore.push('cards', (cards) => {
//     return [...cards, param]
//   })
// })
// histore.trigger('add_card', {
//   color: '#456456',
//   name: 'sdsvfe'
// })
// histore.trigger('add_card', {
//   color: '#852855',
//   name: 'kijjk,'
// })

// console.log('histore.get(cards)2', histore.get('cards'))

// histore.undo()
// console.log('histore.get(cards)3', histore.get('cards'))

// histore.redo()
// console.log('histore.get(cards)3', histore.get('cards'))

// console.log('JSON.stringify(histore)', JSON.stringify(histore))
