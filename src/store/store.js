import defaultpalette from '../constants/newwebcolor'
import Histore from './svelte-store-ex.js'
import Color from '../Colorx.js'
import {objectToUrl, searchToObject} from '../url.js'

const store = new Histore(
  Object.assign({
    pickermodel: 'hsl',
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
          card.color = new Color(card.color)
          card.index = i
          card.zIndex = card.zIndex == null ? i : card.zIndex
        }
      }
      state.bgColor = new Color(state.bgColor)
      console.log('Color, new Color()', state)
    }
  }
)


const query = searchToObject()
const keys = Object.keys(defaultpalette)
if (query.data) {
  const key = query.data.paletteName || 'Imported palette'
  query.data.paletteName = key
  query.data.imported = true
  store.set(query.data, true)
  store.save(key, keys)
  store.load(key)
} else if (!window.localStorage.getItem(defaultpalette.paletteName)) {
  // Load defaultpalette
  store.save(defaultpalette.paletteName, keys)
}

store.on('update', ({changed, current}) => {
  if (changed) {
    objectToUrl(keys.reduce((obj, key) => {
      obj[key] = current[key]
      return obj
    }, {}))
  }
})


// Events
store.on('cards.ADD_CARD', (card) => {
  store.set({cards: (cards) => {
    card.color = new Color(card.color)
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
      card.color = new Color(card.color)
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
/**
 * [5,2,1,4,7][3,6]
 * [4,2,1,3,5]
 *
 * [5,2,1,4,7,12][3,6,8,9,10,11]
 * [4,2,1,3,5,6]
 */
store.on('cards.REMOVE_CARD', (indexs) => {
  store.set({cards: (cards) => {
    const zIndexs = indexs.map((i) => cards[i].zIndex)
    return cards.reduce((newcards, card, i) => {
      if (!~indexs.indexOf(i)) {
        card.index = newcards.length
        card.zIndex -= zIndexs.reduce((num, zIndex) => num + (card.zIndex > zIndex), 0)
        newcards.push(card)
      }
      return newcards
    }, [])
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
