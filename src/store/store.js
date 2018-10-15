import defaultpalette from '../constants/hslcolor-circle'
import fuji from '../constants/fuji'

import Histore from './svelte-store-ex.js'
import Color from '../Colorx.js'
import { objectToUrl, searchToObject } from '../url.js'

const globalSave = {
  pickermodel: 'hsl',
  grayscale: false,
  textvisible: true,
  cardViewModels: {
    hex: true,
    rgb: false,
    rgbp: false,
    hsl: true,
    zaa: false,
    hsv: false,
    hcg: false,
    hwb: false,
    cmyk: false,
    contrast: true,
  },
}

class Store extends Histore {
  constructor () {
    super(...arguments)
    this.on('state', ({ changed, current }) => {
      if (changed.cards) {
        for (let i = 0; i < current.cards.length; i++) {
          const card = current.cards[i]
          if (!(card.color instanceof Color)) {
            card.color = new Color(card.color)
          }
          card.index = i
          card.zIndex = card.zIndex == null ? i : card.zIndex
        }
      }
      if (current.bgColor && !(current.bgColor instanceof Color)) {
        current.bgColor = new Color(current.bgColor)
      }
    })

    this.add('palette', defaultpalette.paletteName, defaultpalette)
    this.add('palette', fuji.paletteName, fuji)

    const query = searchToObject()
    if (query.data) {
      const key = query.data.paletteName || 'Imported palette'
      query.data.paletteName = key
      this.set(query.data)
    } else {
      try {
        this.load('palette', '')
      } catch (error) {
        this.load('palette', defaultpalette.paletteName)
      }
    }

    const keys = Object.keys(defaultpalette)
    this.on('update', ({ changed, current }) => {
      if (changed) {
        objectToUrl(keys.reduce((obj, key) => {
          obj[key] = current[key]
          return obj
        }, {}))
      }
    })
  }

  addCard (card) {
    this.set({ cards: (cards) => {
      card.color = new Color(card.color)
      card.zIndex = cards.length
      card.index = cards.length
      return [...cards, store.cardPosition(card)]
    } })
    this.memo()
  }

  editCard (index, param) {
    this.set({ cards: (cards) => {
      const card = cards[index]
      Object.assign(card, param)
      return cards
    } })
    this.memo()
  }
  /**
   *
   *
   * @param {array} indexs
   * @memberof Store
   */
  duplicateCard (indexs) {
    this.set({ cards: (cards) => {
      const newCards = indexs.map((index, i) => {
        const card = Object.assign({}, cards[index])
        card.color = new Color(card.color)
        card.zIndex = cards.length + i
        card.index = cards.length + i
        card.left += 30
        card.top += 30
        return this.cardPosition(card)
      })
      return cards.concat(newCards)
    } })
    this.memo()
  }

  toggleTextmode (indexs, bool) {
    this.set({ cards: (cards) => {
      indexs.map((index) => {
        const card = cards[index]
        card.textMode = typeof bool === 'boolean' ? bool : !card.textMode
      })
      return cards
    } })
    this.memo()
  }

  /**
   * [5,2,1,4,7][3,6]
   * [4,2,1,3,5]
   *
   * [5,2,1,4,7,12][3,6,8,9,10,11]
   * [4,2,1,3,5,6]
   */
  removeCard (indexs) {
    this.set({ cards: (cards) => {
      const zIndexs = indexs.map((i) => cards[i].zIndex)
      return cards.reduce((newcards, card, i) => {
        if (!~indexs.indexOf(i)) {
          card.index = newcards.length
          card.zIndex -= zIndexs.reduce((num, zIndex) => num + (card.zIndex > zIndex), 0)
          newcards.push(card)
        }
        return newcards
      }, [])
    } })
    this.memo()
  }

  cardForward (index) {
    this.set({ cards: (cards) => {
      const currIndex = +cards[index].zIndex
      cards.forEach((card, i) => {
        if (i === index) {
          card.zIndex = cards.length - 1
        } else if (card.zIndex > currIndex) {
          --card.zIndex
        }
      })
      return cards
    } })
  }
}


const store = new Store(
  Object.assign({}, globalSave, defaultpalette),
  {
    globalStorageKey: '$color-factory',
    saveTypes: {
      global: Object.keys(globalSave),
      palette: Object.keys(defaultpalette),
    },
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
      {
        key: 'delete',
        action: 'delete',
      },
    ],
  }
)

export default store
