import riot from 'riot'
import {Undo} from '../undo'
import Color from 'color'
const storage = window.sessionStorage

Color.prototype.toJSON = function (type) {
  return this.toString(type)
}

class Store {
  constructor () {
    riot.observable(this)
    // storage.clear()
    if (storage) {
      this.cards = this.getItem('cards')
    }
    if (!this.cards) {
      this.cards = [
        {
          name: 'turquoise',
          color: '#40E0D0'
        },
        {
          name: 'salmon',
          color: '#FA8072'
        },
        {
          name: 'red',
          color: '#ff5555'
        },
        {
          name: 'red2',
          color: '#fc0e49'
        },
        {
          name: 'red3',
          color: '#fe3265'
        },
        {
          name: 'yellow',
          color: '#FFD54F'
        },
        {
          name: 'teal',
          color: '#11c1b0'
        },
        {
          name: 'navy',
          color: '#1f2532'
        },
        {
          name: 'light',
          color: '#7F8C9A'
        },
        {
          name: 'dark',
          color: '#323a45'
        },
        {
          name: 'ivy',
          color: '#514a56'
        },
        {
          name: 'purple',
          color: '#a234d5'
        },
        {
          name: 'red4',
          color: '#d74059'
        },
      ]
    }

    this.cards.forEach((param, index) => {
      param.color = Color(param.color)
      param.zIndex = index
    })

    this.undo = new Undo(this.getState())

    this.on('undo', () => {
      const state = this.undo.undo()
      console.log('undo_state', state)
      if (!state) {
        return
      }
      this.cards = state.cards
      this.box.style.backgroundColor = state.bgColor
    })
    this.on('redo', () => {
      const state = this.undo.redo()
      console.log('redo_state', state)
      if (!state) {
        return
      }
      this.cards = state.cards
      this.box.style.backgroundColor = state.bgColor
    })

    // CARDS
    this.on('add_card', (param) => {
      param.color = Color(param.color)
      param.zIndex = this.cards.length
      this.cards.push(param)
      this.trigger('cards_changed', this.cards)
    })
    this.on('remove_card', (index = this.cards.length - 1) => {
      this.trigger('remove_card_animation', index, () => {
        this.cards.splice(index, 1)
        this.trigger('cards_changed', this.cards)
      })
    })

    this.on('card_forward', (index) => {
      const currIndex = +this.cards[index].zIndex
      this.cards.forEach((card, i) => {
        if (i === index) {
          card.zIndex = this.cards.length - 1
        } else if (card.zIndex > currIndex) {
          --card.zIndex
        }
      })
      this.trigger('cards_changed', this.cards)
    })

    this.on('duplicate_card', (index) => {
      const newCard = Object.assign({}, this.cards[index])
      newCard.x += 10
      newCard.y += 10
      this.trigger('add_card', newCard)
    })

    this.on('set_card_size', (index, w, h = w) => {
      let card = this.cards[index]
      if (card.width !== w || card.height !== h) {
        card.width = w
        card.height = h
        this.trigger('cards_changed', this.cards)
      }
    })

    this.on('card_moved', (index, x, y) => {
      let card = this.cards[index]
      if (card.x !== x || card.y !== y) {
        card.x = x
        card.y = y
        this.trigger('cards_changed', this.cards)
      }
    })
    this.on('card_select', (index, bool) => {
      if (bool) {
        this.cards[index].selected = true
      } else {
        delete this.cards[index].selected
      }
    })
    this.on('cards_select', (indexs, bool) => {
      this.cards.forEach((card, i) => {
        if (indexs.has(i)) {
          card.selected = true
        } else {
          delete card.selected
        }
      })
    })

    this.on('cards_changed', () => {
      this.save()
      this.undo.saveState(this.getState())
    })

    // BACKGROUND
    this.on('set_bgColor', (color) => {
      this.box.style.backgroundColor = color
      this.setItem('bgColor', color)
      this.undo.saveState(this.getState())
    })
  }

  getState () {
    return {
      cards: this.cards,
      bgColor: this.box && this.box.style.backgroundColor || 'rgb(31, 37, 50)'
    }
  }

  getItem (key) {
    const val = storage.getItem(key)
    return val ? JSON.parse(val) : val
  }
  setItem (key, value) {
    storage.setItem(key, JSON.stringify(value))
  }
  save () {
    this.setItem('cards', this.cards)
  }
}

export default new Store()
