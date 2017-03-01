import Histore from './Histore'
import defaultpalette from './constants/defaultpalette'
import tinycolor from 'tinycolor2'

tinycolor.prototype.toJSON = function (type) {
  return this.toString(type)
}
const storage = window.sessionStorage

// storage.clear()
const store = Histore.getItem(['cards', 'bgColor'], defaultpalette)
store.set('cards', (cards) => {
  cards.forEach((card, i) => {
    card.color = tinycolor(card.color)
    card.zIndex = card.zIndex == null ? i : card.zIndex
    return card
  })
  return cards
}, false)

store.on('cards.ADD_CARD', (card, memo) => {
  store.set('cards', (cards) => {
    card.color = tinycolor(card.color)
    card.zIndex = cards.length
    return [...cards, card]
  }, memo)
})
store.on('cards.DUPLICATE_CARD', (index, memo) => {
  const newCard = typeof index === 'number' ? store.get('cards')[index] : index
  newCard.x += 10
  newCard.y += 10
  store.trigger('cards.ADD_CARD', newCard, memo)
})

store.on('cards.RESIZE_CARD', (index, w, h = w, memo) => {
  store.set('cards', (cards) => {
    const card = cards[index]
    card.width = w
    card.height = h
    return cards
  }, memo)
})
store.on('cards.TRANSLATE_CARD', (index, left, top, memo) => {
  store.set('cards', (cards) => {
    const card = cards[index]
    card.left = left
    card.top = top
    return cards
  }, memo)
})
// Don't momorize
store.on('cards.SELECT_CARDS', (indexs) => {
  store.set('cards', (cards) => {
    cards.forEach((card, i) => {
      if (indexs.has(i)) {
        card.selected = true
      } else {
        delete card.selected
      }
    })
    return cards
  }, false)
})


store.on('cards.REMOVE_CARD', (index, memo) => {
  store.set('cards', (cards) => {
    // cards.splice(index, 1)
    return cards.slice(0, index).concat(cards.slice(index + 1))
  }, memo)
})
store.on('cards.CARD_FORWARD', (index, memo) => {
  store.set('cards', (cards) => {
    const currIndex = +cards[index].zIndex
    cards.forEach((card, i) => {
      if (i === index) {
        card.zIndex = cards.length - 1
      } else if (card.zIndex > currIndex) {
        --card.zIndex
      }
    })
    return cards
  }, memo)
})


store.subscribe('cards', (cards) => {
  console.log('cards', cards)
})

export default store
