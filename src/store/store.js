import defaultpalette from '../constants/newwebcolor'
import Histore from './svelte-store-ex.js'
import Color from 'color'

const store = new Histore(
  Object.assign({
    grayscale: false,
    textvisible: true,
    cardViewModels: {
      hex: true,
      rgb: false,
      hsl: true,
      hsv: false,
      hcg: false,
      hwb: false,
      cmyk: false,
      contrast: true,
    },
  }, defaultpalette),
  {
    storageKey: '$color-factory',
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
  }
)

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

store.on('cards.EDIT_CARD', (index, param) => {
  store.set({cards: (cards) => {
    const card = cards[index]
    Object.assign(card, param)
    return cards
  }})
})
// @params {array} indexs
store.on('cards.DUPLICATE_CARD', (indexs) => {
  store.set({cards: (cards) => {
    const newCards = indexs.map((index, i) => {
      const card = Object.assign({}, cards[index])
      card.color = Color(card.color)
      card.zIndex = cards.length + i
      card.index = cards.length + i
      card.left += 30
      card.top += 30
      return store.cardPosition(card)
    })
    return cards.concat(newCards)
  }})
  store.memo()
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
