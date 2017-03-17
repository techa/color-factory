;(function () {
  /**
   * @type {object}
   */
  const defaultkeymaps = [
    {
      key: 'ctrl+z',
      action: 'undo',
      mode: '',
      // payload: {}
    },
    {
      key: 'ctrl+shift+z',
      action: 'redo',
      mode: '',
      // payload: {}
    },
  ]
  /**
   * keydown
   *
   * @param {function} handler
   * @returns {function}
   */
  function keydownHandler (handler) {
    return function (e) {
      if (
        e.which !== 17 && // Ctrl
        e.which !== 91 && // Cmd
        e.which !== 18 && // Alt
        e.which !== 16 && // Shift
        !(/^\w$/.test(e.key) && !(e.ctrlKey || e.altKey || e.metaKey)) // [a-zA-Z]
      ) {
        handler(e)
      }
    }
  }

  /**
   * Class KeyManager constructor
   *
   * @param {object}  keymaps   keymap
   * @param {Histore} store     Histore instance
   * @param {object}  [options] element
   */
  function KeyManager (keymaps = defaultkeymaps, store, options) {
    this.options = Object.assign({element: window}, options || {})
    this.mode = undefined

    this.keymaps = []
    this.addKeymaps(keymaps)

    this.options.element.addEventListener('keydown', keydownHandler((e) => {
      const inputTags = /^(INPUT|TEXTAREA)$/.test(e.target.tagName)
      if (inputTags) {
        // brackets
        return `fd${inputTags}`
      }
      // console.log('e.key', e.key, this.keymaps)
      this.keymaps.some((keymap) => {
        const action = this.getAction(e, keymap)
        if (action) {
          try {
            if (typeof action === 'function') {
              action(e, keymap.payload)
            } else if (store) {
              store.trigger(action, e, keymap.payload)
            } else {
              throw new Error('keymaps action error')
            }
          } catch (err) {
            console.error(err.message, err.stack)
          }
          e.preventDefault()
          return true
        }
      })
    }))
  }
  KeyManager.prototype = {
    getAction (e, keymap) {
      const { key, action, mode } = keymap
      // if (!this.modeCheck(mode)) return
      if (e.shiftKey !== /\bshift\b/i.test(key)) return
      if (e.ctrlKey !== /\bctrl\b/i.test(key)) return
      if (e.altKey !== /\balt\b/i.test(key)) return
      if (e.metaKey !== /\b(command|cmd)\b/i.test(key)) return

      const eKey = e.key.replace('Arrow', '').toLowerCase(),
            keyReg = keymap.key.replace(/\b(shift|ctrl|alt|command|cmd)[-+]/ig, '')
      // console.log(keyReg, eKey)
      if (!new RegExp(`${keyReg}$`).test(eKey)) return
      return action
    },
    addKeymap (key, action, mode = '', payload = {}) {
      this.keymaps.push({ key, action, mode, payload })
    },
    addKeymaps (keymaps, mode) {
      // store.on('undo', (e, payload) => { store.undo() })
      // [
        // { key: 'ctrl+z', action: 'undo', mode, payload },
      // ]
      if (Object.prototype.toString.call(keymaps) === '[object Array]') {
        keymaps.forEach((keymap) => {
          this.keymaps.push(keymap)
        })
      } else if (typeof keymaps === 'object') {
      // {
        // 'ctrl+z' () { store.undo() },
      // }
        Object.keys(keymaps).forEach((key) => {
          this.addKeymap(key, keymaps[key], mode)
        })
      }
    }
  }


  // CommonJS: Export function
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeyManager
  } else if (typeof define === 'function' && define.amd) {
  // AMD/requirejs: Define the module
    define(function () { return KeyManager })
  } else {
  // Browser: Expose to window
    window.KeyManager = KeyManager
  }
})()
