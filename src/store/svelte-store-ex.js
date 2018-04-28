import { Store } from 'svelte/store.js'
import KeyManager from './KeyManager.js'


const EVENTS = constructor._events = {}

export default class Histore extends Store {
  constructor (state, options) {
    const {storageKey, storageKeys, init} = options
    if (storageKey) {
      const data = window.localStorage.getItem(storageKey)
      state = JSON.parse(data) || state
    }

    if (init) init(state)
    super(state, options)
    this._keyManager = new KeyManager(this, options)
    this.options = options

    this.storageKey = storageKey
    this.storageKeys = storageKeys || storageKey + '-list'
    const data = window.localStorage.getItem(this.storageKeys)
    this._storageKeys = JSON.parse(data) || [this.storageKey]

    this._history = {
      oldstate: JSON.stringify(state),
      undostock: [],
      redostock: [],
      memo: false,
    }

    this.on('state', this._save.bind(this))

    this.methodToEventHandler('undo', 'redo')
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
        newState[key] = newState[key](this.get()[key])
      }
    }
    super.set(newState)
  }
  memo () {
    this._history.memo = true
    this._save(this.get())
  }
  dataList () {
    return this._storageKeys
  }
  load (storageKey) {
    const data = window.localStorage.getItem(storageKey)
    const state = JSON.parse(data)
    this.storageKey = storageKey
    this._history = {
      oldstate: JSON.stringify(state),
      undostock: [],
      redostock: [],
      memo: false,
    }
    this.set(state)
  }
  save (storageKey) {
    this._storageKeys.push(storageKey)
    this.storageKey = storageKey
    this._history.memo = true
    window.localStorage.setItem(this.storageKeys, JSON.stringify(this._storageKeys))
    this._save(this.get())
  }
  _save (newstate, changed) {
    const newstateJSON = JSON.stringify(newstate)
    const {oldstate, undostock, redostock, memo} = this._history
    const storageKey = this.storageKey
    if (newstateJSON !== oldstate || changed == null) {
      console.log('change', newstateJSON !== oldstate)
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

