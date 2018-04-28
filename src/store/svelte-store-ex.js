import { Store } from 'svelte/store.js'
import { eventer } from '../utils.js'
import KeyManager from './KeyManager.js'


export default class Histore extends Store {
  constructor (state, options) {
    const {storageKey, init} = options
    if (storageKey) {
      const data = window.localStorage.getItem(storageKey)
      state = JSON.parse(data) || state
    }

    if (init) init(state)
    super(state, options)
    eventer(this)
    this._keyManager = new KeyManager(this, options)
    this.options = options

    this.storageKey = storageKey
    this._storageKeys = [this.storageKey]
    this._history = {
      oldstate: JSON.stringify(state),
      undostock: [],
      redostock: [],
      memo: false,
    }

    this.onchange(this._save.bind(this))

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

