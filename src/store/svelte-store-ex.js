import { Store } from 'svelte/store.js'
import KeyManager from './KeyManager.js'

/* eslint no-extend-native: 0 */
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
Map.prototype.toJSON = function toJSON () {
  return [...Map.prototype.entries.call(this)]
}
Set.prototype.toJSON = function toJSON () {
  return [...Set.prototype.values.call(this)]
}

const EVENTS = constructor._events = {}

export default class Histore extends Store {
  constructor (state, options) {
    const {storageKey, storageListKey} = options
    if (storageKey) {
      const data = window.localStorage.getItem(storageKey)
      if (!data) {
        window.localStorage.clear()
      }
      state = JSON.parse(data) || state
    }

    super(state, options)
    this._keyManager = new KeyManager(this, options)
    this.options = options

    this.storageKey = storageKey
    this.storageListKey = storageListKey || storageKey + '-list'
    const data = window.localStorage.getItem(this.storageListKey)
    this._storageSet = new Set(JSON.parse(data) || [])

    this._history = {
      oldstate: JSON.stringify(state),
      undostock: [],
      redostock: [],
      memo: false,
    }

    this.on('update', this._memo.bind(this))
  }
  on (eventName, handler) {
    if (eventName === 'state' || eventName === 'update') {
      super.on(eventName, handler)
    } else {
      (EVENTS[eventName] = EVENTS[eventName] || []).push(handler)
    }
    return this
  }
  fire (eventName, ...args) {
    console.log('fire', eventName)
    if (eventName === 'state' || eventName === 'update') {
      super.fire(eventName, ...args)
    } else if (EVENTS[eventName]) {
      EVENTS[eventName].forEach((handler) => handler(...args))
    } else {
      console.error(`fire: ${eventName} is undefind`)
    }
    return this
  }
  set (newState, memo) {
    for (const key in newState) {
      if (typeof newState[key] === 'function') {
        newState[key] = newState[key](this.get()[key])
      }
    }
    this._history.memo = memo
    super.set(newState)
  }
  memo () {
    this._history.memo = true
    this._memo({
      current: this.get(),
    })
  }
  dataList () {
    const list = []
    this._storageSet.forEach((storageKey) => {
      const data = window.localStorage.getItem(storageKey)
      if (!data) return
      list.push(JSON.parse(data))
    })
    return list
  }
  load (storageKey) {
    const data = window.localStorage.getItem(storageKey)
    if (!data) return
    const loadstate = JSON.parse(data)

    this.set(loadstate, true)
  }
  remove (storageKey) {
    window.localStorage.removeItem(storageKey)
    this._storageSet.delete(storageKey)
    window.localStorage.setItem(this.storageListKey, JSON.stringify(this._storageSet))
  }
  save (storageKey, keys) {
    if (!this._storageSet.has(storageKey)) {
      this._storageSet.add(storageKey)
      window.localStorage.setItem(this.storageListKey, JSON.stringify(this._storageSet))
    }

    keys = Array.isArray(keys) ? keys : Object.keys(keys)
    const state = this.get()
    window.localStorage.setItem(storageKey, JSON.stringify(keys.reduce((obj, key) => {
      obj[key] = state[key]
      return obj
    }, {})))
  }
  _memo ({ changed, current, previous }) {
    const newstateJSON = JSON.stringify(current)
    const {oldstate, undostock, redostock, memo} = this._history
    const storageKey = this.storageKey
    console.log('changed', newstateJSON !== oldstate)
    if (newstateJSON !== oldstate) {
      switch (memo) {
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
      if (memo) {
        if (storageKey) {
          window.localStorage.setItem(storageKey, newstateJSON)
        }
        this._history.oldstate = newstateJSON
      }
      console.log('memo', memo)
    }
    this._history.memo = false
    console.log('State', this.get())
  }
  undo () {
    const history = this._history
    if (history.undostock.length) {
      this.set(JSON.parse(history.undostock.pop()), 'undo')
    }
  }
  redo () {
    const history = this._history
    if (history.redostock.length) {
      this.set(JSON.parse(history.redostock.pop()), 'redo')
    }
  }
}

