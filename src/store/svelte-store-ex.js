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

function save (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}
function load (key) {
  const data = window.localStorage.getItem(key)
  if (!data) {
    console.warn(key + ' is Undefind')
  }
  return JSON.parse(window.localStorage.getItem(key))
}

function updater (globalStorageKey) {
  const saveListsKey = globalStorageKey + '-list'
  const saveList = load(saveListsKey)
  if (saveList) {
    saveList.forEach((saveName) => {
      const data = load(saveName)
      window.localStorage.removeItem(saveName)
      const storageKey = globalStorageKey + '/palette/' + saveName
      save(storageKey, data)
    })
  }
  return saveList
}

const EVENTS = constructor._events = {}

export default class Histore extends Store {
  constructor (state, options) {
    const { globalStorageKey } = options
    const saveTypes = options.saveTypes || { global: Object.keys(state) }
    if (globalStorageKey) {
      state = load(globalStorageKey) || state
    }

    super(state, options)
    this._keyManager = new KeyManager(this, options)
    this.options = options

    this.globalStorageKey = globalStorageKey

    this.saveListsKey = globalStorageKey + '-lists'
    const _saveList = load(this.saveListsKey) || updater() || {}
    /**
     * @property {Set{}} saveLists { global: new Set(['saveName', 'saveName']) }
     */
    this.saveLists = Object.keys(saveTypes).reduce((obj, saveType) => {
      obj[saveType] = new Set(_saveList[saveType] || [])
      return obj
    }, {})

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
  dataList (saveType) {
    const saveList = this.saveLists[saveType]
    const list = []
    saveList.forEach((saveName) => {
      const storageKey = this._createStorageKey(saveType, saveName)
      const data = load(storageKey)
      if (!data) return
      list.push(data)
    })
    return list
  }
  _createStorageKey (saveType, saveName) {
    return this.globalStorageKey + '/' + saveType + '/' + saveName
  }

  /**
   * LocalStrageにデータを追加
   *
   * @param {string} saveType
   * @param {string} saveName
   * @param {*} data
   * @memberof Histore
   */
  add (saveType, saveName, data) {
    const storageKey = this._createStorageKey(saveType, saveName)
    if (!load(storageKey)) {
      this._save(saveType, saveName, data)
    }
  }
  /**
   * LocalStrageからデータを削除
   *
   * @param {string} saveType
   * @param {string} saveName
   * @memberof Histore
   */
  remove (saveType, saveName) {
    const storageKey = this._createStorageKey(saveType, saveName)
    const saveList = this.saveLists[saveType]
    if (saveList && saveList.has(saveName)) {
      window.localStorage.removeItem(storageKey)

      saveList.delete(saveName)
      save(this.saveListsKey, this.saveLists)
    } else {
      throw new Error(`Histore.remove(${saveType}, ${saveName}): save is undefind`)
    }
  }
  /**
   * LocalStrageからstateにデータをロード
   *
   * @param {string} saveType
   * @param {string} saveName
   * @memberof Histore
   */
  load (saveType, saveName) {
    const storageKey = this._createStorageKey(saveType, saveName)
    const data = load(storageKey)
    if (data) {
      data[saveType] = saveName
      this.set(data)
    } else {
      throw new Error(`Histore.load(${saveType}, ${saveName}): savedata is undefind`)
    }
  }
  /**
   * LocalStrageにstateのデータを保存
   *
   * @param {string} [saveType] 省略した場合、すべて記録する
   * @param {string} [saveName]
   * @memberof Histore
   */
  save (saveType, saveName) {
    const state = this.get()
    const { saveTypes, saveUse } = this.options

    if (saveType == null) {
      Object.keys(saveTypes).forEach((savetype) => {
        const data = saveTypes[savetype].reduce((obj, key) => {
          obj[key] = state[key]
          return obj
        }, {})

        if (savetype === 'global') {
          save(this.globalStorageKey, data)
        } else {
          this._save(savetype, '', data)
        }
      })
    } else {
      const data = saveTypes[saveType].reduce((obj, key) => {
        obj[key] = state[key]
        return obj
      }, {})

      const savename = saveName || saveUse[saveType]
      this._save(saveType, savename, data)
    }
  }
  _save (saveType, saveName, data) {
    const saveList = this.saveLists[saveType]
    if (saveList && !saveList.has(saveName) && saveType !== 'global' && saveName) {
      saveList.add(saveName)
      save(this.saveListsKey, this.saveLists)
    }
    save(this._createStorageKey(saveType, saveName), data)
  }


  _memo ({ changed, current, previous }) {
    const newstateJSON = JSON.stringify(current)
    const { oldstate, undostock, redostock, memo } = this._history
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
        this.save()
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

