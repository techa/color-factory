;(function () {
  let initDone, storage, undoLimt, memorizeDefault, eventNameSeperator
  let undoKeys = [],
      redoKeys = [],
      events = [],
      listeners = []
  const states = {},
        stringify = JSON.stringify,
        parse = JSON.parse

  /**
   * Histore
   *
   * @class Histore
   * @param {object} data
   * @param {object} [opts={}]
   */
  function Histore (defaultData, opts = {}) {
    if (!(this instanceof Histore)) {
      return new Histore(defaultData, opts)
    }
    if (initDone) {
      throw new Error('Histore is already created.')
    }
    initDone = true
    this.setOptions(opts)

    const data = Object.keys(defaultData).reduce((obj, key) => {
      let val = storage.getItem(key)
      val = val ? parse(val) : defaultData[key]
      if (val === void 0) {
        throw new Error(`Histore.getItem: ${key} is undefind`)
      }
      obj[key] = val
      return obj
    }, {})

    this.set(data)
  }

  Histore.prototype = {
    setOptions (opts) {
      opts = opts || {}
      storage = opts.storage
      memorizeDefault = typeof opts.memorizeDefault === 'boolean'
        ? memorizeDefault
        : !!storage
      undoLimt = opts.undoLimt || 50
      eventNameSeperator = opts.eventNameSeperator || '.'
      return this
    },
    toJSON () {
      return states
    },
    clear (key) {
      if (key) {
        delete states[key]
        undoKeys = undoKeys.filter((k) => key !== k)
        redoKeys = redoKeys.filter((k) => key !== k)
        storage.removeItem(key)
      } else {
        // clear all
        for (let _key in states) {
          delete states[_key]
        }
        undoKeys.length = 0
        redoKeys.length = 0
        storage.clear()
      }
      return this
    },
    get (key) {
      if (!key) {
        return Object.keys(states).reduce((obj, _key) => {
          if (states[_key]) {
            obj[_key] = states[_key].current
          }
          return obj
        }, {})
      } else if (Object.prototype.toString.call(key) === '[object RegExp]') {
        return Object.keys(states).reduce((obj, _key) => {
          if (key.test(_key) && states[_key]) {
            obj[_key] = states[_key].current
          }
          return obj
        }, {})
      }
      return states[key].current
    },
    /**
     * Histore.set()
     *
     * @param {string} key
     * @param {any} value
     * @param {any} [memo=memorizeDefault]
     * @returns this
     */
    set (key, value, memo = memorizeDefault) {
      if (typeof key === 'string' && value !== void 0) {
        _setter(key, value, memo)
      } else if (typeof key === 'object') {
        // key = object
        for (let _key in key) {
          _setter(_key, key[_key], value)
        }
      } else {
        throw new TypeError(`Histore.set(key): ${key} is Invalid`)
      }
      function _setter (key, value, memo) {
        states[key] = (states[key] || new State(key)).set(value, memo)
      }

      if (memo) {
        redoKeys.length = 0
        undoKeys.push(key)
      }
      listeners.forEach((listener) => {
        listener(this.get())
      })
      return this
    },
    memo (key) {
      states[key].memo()
      redoKeys.length = 0
      undoKeys.push(key)
      return this
    },
    undo (key) {
      const len = undoKeys.length
      if (!len) {
        throw new Error('undoKeys.length == 0')
      }
      if (len) {
        key = key || undoKeys.pop()
        const stat = states[key]
        if (stat.canUndo()) {
          stat.undo()
          redoKeys.push(key)
        }
      }
      return this
    },
    redo (key) {
      const len = redoKeys.length
      if (!len) {
        throw new Error('redoKeys.length == 0')
      }
      if (len) {
        key = key || redoKeys.pop()
        const stat = states[key]
        if (stat.canRedo()) {
          stat.redo()
          undoKeys.push(key)
        }
      }
      return this
    },
    on (eventName, handler) {
      (events[eventName] = events[eventName] || []).push(handler)
      return this
    },
    off (eventName, handler) {
      const ary = events[eventName]
      const index = ary.indexOf(handler)
      if (index !== -1) {
        events[eventName].splice(index, 1)
      }
      return this
    },
    one (eventName, handler) {
      const onehandler = (...args) => {
        this.off(eventName, onehandler)
        handler(...args)
      }
      (events[eventName] = events[eventName] || []).push(onehandler)
      return this
    },
    trigger (eventName, ...args) {
      if (events[eventName]) {
        events.forEach((handler) => handler(...args))
      }
      return this
    },
    fire (eventName, ...args) {
      return this.trigger(eventName, ...args)
    },
    subscribe (key, handler) {
      if (typeof key === 'function') {
        listeners.push(key)
      } else {
        states[key].listeners.push(handler)
      }
      return this
    },
  }


  /**
   * states children Class constructor
   *
   * @param {string} key
   * @param {any}    value
   */
  function State (key) {
    this.key = key

    this.undoStock = []
    this.current = null
    this.redoStock = []

    this.events = {}
    this.listeners = []
  }
  State.prototype = {
    toJSON () {
      return this.current
    },
    setItem (value) {
      if (storage) {
        storage.setItem(this.key, value)
      }
    },
    set (value, memo) {
      const remember = new Promise((resolve, reject) => {
        resolve(stringify(this.current))
      })
      if (typeof value === 'function') {
        this.current = value(this.current)
      } else {
        this.current = value
      }

      remember.then((oldstr) => {
        const newstr = stringify(this.current)

        if (oldstr !== newstr) {
          if (memo) {
            this.redoStock.length = 0
            this.undoStock.push(oldstr)
            while (this.undoStock.length > undoLimt) {
              this.undoStock.shift()
            }
            new Promise(() => { // eslint-disable-line
              this.setItem(newstr)
            })
            console.log('---memory set---')
          }

          // subscribe
          this.listeners.forEach((listener) => {
            listener(this.current)
          })
        }
      })
      // let oldstr, newstr
      // if (memo || this.listeners.length) {
      //   oldstr = stringify(this.current)
      // }
      // if (typeof value === 'function') {
      //   this.current = value(this.current)
      // } else {
      //   this.current = value
      // }
      // if (memo || this.listeners.length) {
      //   newstr = stringify(this.current)
      // }
      // if (oldstr !== newstr) {
      //   if (memo) {
      //     this.redoStock.length = 0
      //     this.undoStock.push(oldstr)
      //     while (this.undoStock.length > undoLimt) {
      //       this.undoStock.shift()
      //     }

      //     this.setItem(newstr)
      //     console.log('---memory set---')
      //   }

      //   // subscribe
      //   this.listeners.forEach((listener) => {
      //     listener(this.current)
      //   })
      // }
      // Do not write processing after here
      return this
    },
    memo () {
      const len = this.undoStock.length
      const prevstr = stringify(this.undoStock[len - 1])
      const currstr = stringify(this.current)
      if (!len || prevstr !== currstr) {
        this.undoStock.push(currstr)
        while (this.undoStock.length > undoLimt) {
          this.undoStock.shift()
        }
        this.setItem(currstr)
        console.log('---memory memo---')
      }
    },
    canUndo () {
      return !!this.undoStock.length
    },
    canRedo () {
      return !!this.redoStock.length
    },
    undo (err) {
      const len = this.undoStock.length
      if (err && !len) {
        throw new Error('State.undoStock.length == 0')
      }
      if (len) {
        this.redoStock.push(stringify(this.current))
        this.current = parse(this.undoStock.pop())
      }
      return this
    },
    redo (err) {
      const len = this.redoStock.length
      if (err && !len) {
        throw new Error('State.redoStock.length == 0')
      }
      if (len) {
        this.undoStock.push(stringify(this.current))
        this.current = parse(this.redoStock.pop())
      }
      return this
    },
  }

  // CommonJS: Export function
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Histore
    /* global define */
  } else if (typeof define === 'function' && define.amd) {
  // AMD/requirejs: Define the module
    define(function () { return Histore })
  } else {
  // Browser: Expose to window
    window.Histore = Histore
  }
})()
