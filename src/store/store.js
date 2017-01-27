import riot from 'riot'
import {Undo} from '../undo'
import Color from '../Color'
const storage = window.localStorage

class Store {
  constructor () {
    riot.observable(this)
    this.palette = []
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
        }
      ]
    }

    this.cards.forEach((param) => {
      param.color = new Color(param.color)
    })

    this.undo = new Undo(this.getState())

    this.on('undo', (param) => {
      const state = this.undo.undo()
      console.log('undo_state', state)
      if (!state) {
        return
      }
      this.cards = state.cards
      this.box.style.backgroundColor = state.bgColor
      this.trigger('cards_changed', this.cards)
    })
    this.on('redo', (param) => {
      const state = this.undo.redo()
      console.log('redo_state', state)
      if (!state) {
        return
      }
      this.cards = state.cards
      this.box.style.backgroundColor = state.bgColor
      this.trigger('cards_changed', this.cards)
    })

    // CARDS
    this.on('add_card', (param) => {
      this.cards.push(param)
      this.trigger('cards_changed', this.cards)
    })
    this.on('remove_card', (index = this.cards.length - 1) => {
      this.cards.splice(index, 1)
      this.trigger('cards_changed', this.cards)
    })

    this.on('card_forward', (index) => {
      this.cards.push(this.cards.splice(index, 1)[0])
      this.trigger('cards_changed', this.cards)
    })

    this.on('duplicate_card', () => {
      const newCard = Object.assign({}, this.cards[this.cards.length - 1])
      newCard.x += 10
      newCard.y += 10
      this.trigger('add_card', newCard)
    })

    this.on('card_moved', (x, y) => {
      let card = this.cards[this.cards.length - 1]
      if (card.x !== x || card.y !== y) {
        card.x = x
        card.y = y
        this.trigger('cards_changed', this.cards)
      }
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
