import { Store } from 'svelte/store.js'
import { eventer } from '../utils.js'
import KeyManager from './KeyManager.js'

function changeCheck (state, changed, before) {
  for (const key of Object.keys(changed)) {
    switch (typeof state[key]) {
      case 'object':
        for (const [k, v] of Object.entries(state[key])) {
          if (!before[key] || (before[key] && !Object.is(before[key][k], v))) {
            return true
          }
        }
        break
      default:
        if (!Object.is(before[key], state[key])) {
          return true
        }
    }
  }
}

export default class Histore extends Store {
  constructor (state, options) {
    const {storage, init, keymaps} = options
    if (storage) {
      const data = window.localStorage.getItem(storage)
      state = JSON.parse(data) || state
    }

    if (init) init(state)
    super(state, options)
    eventer(this)
    this._keyManager = new KeyManager(this, options)
    this.options = options

    const undostock = []
    const redostock = []
    const history = this._history = {
      undostock,
      redostock,
      memo: false,
    }

    let oldstate = JSON.stringify(state)
    this.onchange((newstate, changed) => {
      const newstateJSON = JSON.stringify(newstate)
      if (newstateJSON !== oldstate) {
        console.log('change', newstateJSON !== oldstate)
        switch (history.memo) {
          case 'undo':
            redostock.push(oldstate)
            break
          case 'redo':
            undostock.push(oldstate)
            break
          case true:
            undostock.push(oldstate)
            if (undostock.length > 10) {
              undostock.shift()
            }
            redostock.splice(0, redostock.length)
            break
        }
        if (history.memo) {
          if (storage) {
            window.localStorage.setItem(storage, newstateJSON)
          }
          oldstate = newstateJSON
        }
        console.log('memo', history.memo, history)
      }
      history.memo = false
      console.log('State', this.get())
    })

    this.methodToEventHandler('undo', 'redo')
    // this.on('undo', this.undo.bind(this))
    // this.on('redo', this.redo.bind(this))
  }
  methodToEventHandler (...eventnames) {
    for (const eventname of eventnames) {
      if (typeof this[eventname] === 'function') {
        this.on(eventname, this[eventname].bind(this))
      }
    }
  }
  set (newState) {
    for (const key in newState) {
      if (typeof newState[key] === 'function') {
        newState[key] = newState[key](this.get(key))
      }
    }
    super.set(newState)
  }
  memo () {
    this._history.memo = true
    this.set(this.get())
  }
  _parse (state) {
    if (typeof state === 'string') {
      state = JSON.parse(state) || state
    }
    const {init} = this.options
    if (init) init(state)
    return state
  }
  undo () {
    const history = this._history
    if (history.undostock.length) {
      this._history.memo = 'undo'
      this.set(this._parse(history.undostock.pop()))
    }
  }
  redo () {
    const history = this._history
    if (history.redostock.length) {
      this._history.memo = 'redo'
      this.set(this._parse(history.redostock.pop()))
    }
  }
}

