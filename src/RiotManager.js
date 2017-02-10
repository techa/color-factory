export function keydownHandler (handler) {
  return function (e) {
    if (
      e.which !== 17 && // Ctrl
      e.which !== 91 && // Cmd
      e.which !== 18 && // Alt
      e.which !== 16 // Shift
    ) {
      handler(e)
    }
  }
}

export function createEventHooks (object) {
  const listenerMap = Object.create(null)
  object.trigger = function (eventType, ...args) {
    const listeners = listenerMap[eventType]
    if (listeners) {
      listeners.forEach(function (listener) {
        try {
          listener.apply(object, args)
        } catch (e) {
          console.error(e.message, e.stack)
        }
      })
    }
  }
  object.on = function (eventType, listener) {
    let listeners = listenerMap[eventType]
    if (!listeners) {
      listeners = []
      listenerMap[eventType] = listeners
    }
    listeners.push(listener)
  }
  object.off = function (eventType, listener) {
    const listeners = listenerMap[eventType]
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (~index) {
        listeners.splice(index, 1)
      }
    }
  }
  return listenerMap
}

export class RiotManager {
  constructor (options) {
    this.options = Object.assign({
      defaultMode: 'default'
    }, options || {})

    this.mode = []
    this.stores = options.stores || []
    this.onMode(this.options.defaultMode)

    ;['on', 'one', 'off', 'trigger'].forEach((api) => {
      this[api] = (...args) => {
        this.stores.forEach((store) => {
          store[api].apply(store, args)
        })
      }
    })
  }
  addStore (store) {
    this.stores.push(store)
  }

  modeCheck (modeStr) {
    return modeStr.split(' ').some((mode) => this.mode.indexOf(mode) > -1)
  }
  onMode (modeStr) {
    return modeStr.split(' ').reduce((added, mode) => {
      if (this.mode.indexOf(mode) === -1) {
        this.mode.push(mode)
        added.push(mode)
      }
      return added
    }, [])
  }
  offMode (modeStr) {
    return modeStr.split(' ').reduce((removed, mode) => {
      const index = this.mode.indexOf(mode)
      if (index > -1) {
        this.mode.splice(index, 1)
        removed.push(mode)
      }
      return removed
    }, [])
  }
}

export const keymaps = [
  // { key: 'ctrl+shift+alt+left',
  //   action: 'cursorColumnSelectLeft',
  //   mode: 'default' },
  { key: 'ctrl+z',
    action: 'undo' },
  { key: 'ctrl+y',
    action: 'redo',
    mode: 'default' },
  { key: 'ctrl+shift+z',
    action: 'redo',
    mode: 'default' },
  { key: 'ctrl+c',
    action: 'copy',
    mode: 'default' },
  {key: 'ctrl+a',
    action: 'selectAll',
    mode: 'default' },
  { key: 'shift+w',
    action: 'cursorColumnSelectLeft',
    mode: 'default' },
]

export default class RiotKeyManager extends RiotManager {
  constructor (options, keymapsData) {
    super(options)
    this.options = Object.assign({
      element: window,
    }, this.options)

    this.keymaps = []

    if (keymapsData) {
      this.addKeymaps(keymapsData)
    }

    // ADD Event
    this.options.element.addEventListener('keydown', keydownHandler((e) => {
      const inputTags = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA'
      if (inputTags) {
        // brackets
        return
      }
      this.keymaps.some((keymap) => {
        const action = this.getAction(e, keymap)
        if (action) {
          let returnBoolean = false
          try {
            returnBoolean = this.trigger(action, e)
          } catch (error) {
            console.error(error.message, error.stack)
          }
          // if (returnBoolean) {
          //   e.preventDefault()
          // }
          // return returnBoolean
          e.preventDefault()
          return true
        }
      })
    }))
  }

  getAction (e, keymap) {
    const {key, action, mode} = keymap
    if (!this.modeCheck(mode)) return
    if (e.shiftKey !== /\bshift\b/i.test(key)) return
    if (e.ctrlKey !== /\bctrl\b/i.test(key)) return
    if (e.altKey !== /\balt\b/i.test(key)) return
    // if (e.shiftKey !== key.includes('shift')) return
    // if (e.ctrlKey !== key.includes('ctrl')) return
    // if (e.altKey !== key.includes('alt')) return
    if (e.metaKey !== /\bcommand\b|\bcmd\b/i.test(key)) return

    const eKey = e.key.replace('Arrow', '').toLowerCase(),
          keyReg = keymap.key.replace(/\b(shift|ctrl|alt|command|cmd)[-+]/ig, '')
    console.log(keyReg, eKey)
    if (!new RegExp(`${keyReg}$`).test(eKey)) return

    // var keyCode = e.charCode || e.keyCode
    // var keyCodeChar = String.fromCharCode(keyCode).toLowerCase()
    // let actioncb = typeof action === 'string' ? listenerMap[action] : action
    return action
  }

  addKeymaps (keymapsData) {
    if (Array.isArray(keymapsData)) {
      keymapsData.forEach((keymaps) => {
        this.addKeymap(this.options.defaultMode, keymaps)
      })
    } else {
      Object.keys(keymapsData).forEach((key) => {
        this.addKeymap(key, keymapsData[key])
      })
    }
  }
  addKeymap (modeStr, keymaps) {
    keymaps.forEach((keymap) => {
      keymap.mode = modeStr
      this.keymaps.push(keymap)
    })
  }
}
