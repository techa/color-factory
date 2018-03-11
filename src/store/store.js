import defaultpalette from '../constants/defaultpalette'
import Histore from './svelte-store-ex.js'
import Color from 'color'
// storage.clear()

const store = new Histore(defaultpalette, {
  storageKey: 'palette',
  keymaps: [
    {
      key: 'ctrl+z',
      action: 'undo',
    },
    {
      key: 'ctrl+shift+z',
      action: 'redo',
    },
    {
      key: 'ctrl+a',
      action: 'selectAll',
    },
  ],
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

// Events
store.on('cards.ADD_CARD', (card) => {
  store.set({cards: (cards) => {
    card.color = Color(card.color)
    card.zIndex = cards.length
    card.index = cards.length
    return [...cards, store.cardPosition(card)]
  }})
  store.memo()
})
store.on('cards.DUPLICATE_CARD', (index) => {
  let newCard = typeof index === 'number' ? store.get('cards')[index] : index
  newCard = Object.assign({}, newCard)
  newCard.left += 10
  newCard.top += 10
  store.fire('cards.ADD_CARD', newCard)
})

store.on('cards.EDIT_CARD', (index, param) => {
  store.set({cards: (cards) => {
    const card = cards[index]
    Object.assign(card, param)
    return cards
  }})
})
// @params {array} indexs
store.on('cards.TOGGLE_TEXTMODE', (indexs, bool) => {
  store.set({cards: (cards) => {
    indexs.map((index) => {
      const card = cards[index]
      card.textMode = typeof bool === 'boolean' ? bool : !card.textMode
    })
    return cards
  }})
  store.memo()
})

// @params {array} indexs
store.on('cards.REMOVE_CARD', (indexs) => {
  store.set({cards: (cards) => {
    return cards.filter((card, i) => !~indexs.indexOf(i))
  }})
  store.memo()
})

store.on('cards.CARD_FORWARD', (index) => {
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
  }})
})

export default store
