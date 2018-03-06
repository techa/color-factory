import defaultpalette from '../constants/defaultpalette'
import Histore from './svelte-store-ex.js'
import Color from 'color'
import '../Color-ex'
// storage.clear()
const store = new Histore(defaultpalette, {
  storage: 'test', // store3000
  // immutable: true,
  init (state) {
    if (state.cards) {
      for (let i = 0; i < state.cards.length; i++) {
        const card = state.cards[i]
        card.color = Color(card.color)
        card.index = i
        card.zIndex = card.zIndex == null ? i : card.zIndex
      }
    }
    state.bgColor = Color(state.bgColor)
    console.log('Color, Color()', state)
  }
})
// store.observe('bgColor', (bgColor) => {
//   store.set({bgColor: Color(bgColor)})
// })
// store.onchange((state, changed) => {
//   for (const key of Object.keys(changed)) {
//     const value = state[key]
//     switch (key) {
//       case 'bgColor':
//         state[key] = Color(value)
//         break
//       default:
//         break
//     }
//   }
//   console.log('onchange')
// })

// Events
store.on('cards.ADD_CARD', (card, memo) => {
  store.set({cards: (cards) => {
    card.color = Color(card.color)
    card.zIndex = cards.length
    return [...cards, card]
  }}, memo)
})
store.on('cards.DUPLICATE_CARD', (index, memo) => {
  let newCard = typeof index === 'number' ? store.get('cards')[index] : index
  newCard = Object.assign({}, newCard)
  newCard.left += 10
  newCard.top += 10
  store.fire('cards.ADD_CARD', newCard, memo)
})

store.on('cards.EDIT_CARD', (index, param, memo) => {
  store.set({cards: (cards) => {
    const card = cards[index]
    Object.assign(card, param)
    return cards
  }}, memo)
})

store.on('cards.TOGGLE_TEXTMODE', (index, bool, memo) => {
  store.set({cards: (cards) => {
    const card = cards[index]
    card.textMode = typeof bool === 'boolean' ? bool : !card.textMode
    return cards
  }}, memo)
})

store.on('cards.REMOVE_CARD', (index, memo) => {
  store.set({cards: (cards) => {
    // cards.splice(index, 1)
    return cards.slice(0, index).concat(cards.slice(index + 1))
  }}, memo)
})
store.on('cards.REMOVE_SELECT_CARDS', (memo) => {
  store.set({cards: (cards) => {
    return cards.filter((card) => !card.selected)
  }}, memo)
})
store.on('cards.CARD_FORWARD', (index, memo) => {
  store.set({cards: (cards) => {
    const currIndex = +cards[index].zIndex
    cards.forEach((card, i) => {
      if (i === index) {
        card.zIndex = cards.length - 1
      } else if (card.zIndex > currIndex) {
        --card.zIndex
      }
    })
    return cards
  }}, memo)
})

export default store
