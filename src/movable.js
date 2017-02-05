function noop () {}

/**
 * constructor PositionManager
 *
 * @export
 * @class PositionManager
 * @param {object} options
 */
export function PositionManager (options) {
  this.options = Object.assign({
    containment: document.body,
    handle: null,
    grid: 1,
    percent: false,
    axis: false, // or 'x' , 'y', 'shift', 'ctrl', 'alt'
  }, options || {})

  let grid = this.options.grid
  if (!Array.isArray(grid)) {
    grid = parseFloat(grid, 10) || 1
    grid = [grid, grid]
  }
  this.options.grid = grid

  // containment内に置ける現在のマウス相対位置
  this.x = 0
  this.y = 0
  // this.x、this.yの初期値保存
  this.startX = 0
  this.startY = 0
  // position
  this.left = 0
  this.top = 0
  this.handleRect = {width: 0, height: 0, left: 0, top: 0}
  const position = {}
  Object.defineProperties(this, {
    left: {
      get () {
        return position.left
      },
      set (val) {
        position.left = this.adjust(val, true)
      }
    },
    top: {
      get () {
        return position.top
      },
      set (val) {
        position.top = this.adjust(val)
      }
    },
  })
}
Object.assign(PositionManager.prototype, {
  init (e) {
    // ボックスサイズ取得。ここに書くのはresize対策
    this.parentRect = this.options.containment.getBoundingClientRect()
    if (this.options.handle) this.handleRect = this.options.handle.getBoundingClientRect()
    // this.x - this.startX
    this.vectorX = 0
    this.vectorY = 0
    this.set(e, true)
    return this
  },

  set (e, startflg) {
    if ({}.toString.call(e) === '[object MouseEvent]') {
      const event = 'touches' in e ? e.touches[0] : e
      this.x = event.pageX - this.parentRect.left - window.pageXOffset
      this.y = event.pageY - this.parentRect.top - window.pageYOffset

      if (!startflg) {
        this.vectorX = this.x - this.startX
        this.vectorY = this.y - this.startY
      }
    }

    Object.assign(this, this.modify(this.handleRect.left + this.vectorX, this.handleRect.top + this.vectorY))

    if (startflg) {
      this.startX = this.x
      this.startY = this.y
      this.startLeft = this.left
      this.startTop  = this.top
    }
    return this
  },

  setPosition (e, el = this.options.handle) {
    switch (this.options.axis) {
      case 'x':
      case 'y':
        return this.oneWayMove(this.options.axis, el)
      case 'shift':
      case 'ctrl':
      case 'alt':
        if (e[this.options.axis + 'Key']) {
          const maxV = Math.abs(this.vectorX) > Math.abs(this.vectorY)
          return this.oneWayMove(maxV ? 'x' : 'y', el)
        }
        // fall through
      default:
        el.style.left = this.left + 'px'
        el.style.top  = this.top + 'px'
        break
    }
    return this
  },

  oneWayMove (either, el = this.options.handle) {
    if (either === 'x') {
      el.style.left = this.left + 'px'
      el.style.top = this.startTop + 'px'
    } else if (either === 'y') {
      el.style.left = this.startLeft + 'px'
      el.style.top = this.top + 'px'
    }
    return this
  },

  modify (offsetX, offsetY) {
    const position = {}
    offsetX = position.left = offsetX
    offsetY = position.top = offsetY

    if (this.options.percent) {
      position.percentLeft = this.percentage(offsetX, true)
      position.percentTop = this.percentage(offsetY)
    }
    return position
  },
  adjust (offset, width) {
    const side = width ? 'width' : 'height'
    const options = this.options
    // handlesの動きをcontainmentに制限する
    if (options.containment !== document.body) {
      offset = Math.min(Math.max(0, offset), this.parentRect[side] - this.handleRect[side])
    }
    const grid = width ? options.grid[0] : options.grid[1]
    offset = Math.round(offset / grid) * grid
    return offset
  },
  percentage (offset, width) {
    const side = width ? 'width' : 'height'
    return Math.min(Math.max(0, offset / (this.parentRect[side] - this.handleRect[side]) * 100), 100)
  }
})

/**
 * addEventListener & removeEventListener
 *
 * @export
 * @param {element}  el
 * @param {boolean}  onoff      true: addEventListener, false: removeEventListener
 * @param {string}   eventNames Multiple event registration with space delimiter.スぺース区切りで複数イベント登録
 * @param {function} callback
 * @param {boolean}  useCapture http://qiita.com/hosomichi/items/49500fea5fdf43f59c58
 */
export function eventRegister (el, onoff, eventNames, callback, useCapture) {
  onoff = onoff ? 'addEventListener' : 'removeEventListener'
  eventNames.split(' ').forEach((eventName) => {
    ;(el || window)[onoff](eventName, callback, !!useCapture)
  })
}

/**
 * マウス座標
 *
 * @param {object|element} options
 */
export function mousePosition (options) {
  options = Object.assign({
    containment: (options.nodeName ? options : document.body),
    handle: null,
    start: noop,
    drag: noop,
    stop: noop
  }, options || {})

  // イベント登録
  const eventListener = eventRegister.bind(null, window)
  eventRegister(options.handle || options.containment, true, 'mousedown touchstart', mdown)

  const position = new PositionManager(options)

  let handleel

  // マウスが押された際の関数
  function mdown (e) {
    // マウス座標を保存
    position.init(e)

    handleel = this
    if (options.start) {
      options.start(e, position, handleel)
      position.set()
    }
    eventListener(true, 'mouseup touchcancel touchend', mup)
    eventListener(true, 'mousemove touchmove', mmove)
  }

  // マウスカーソルが動いたときに発火
  function mmove (e) {
    // マウスが動いたベクトルを保存
    position.set(e)
    // フリックしたときに画面を動かさないようにデフォルト動作を抑制
    e.preventDefault()

    if (options.drag) {
      options.drag(e, position, handleel)
      position.set()
    }
    // カーソルが外れたとき発火
    eventListener(true, 'mouseleave touchleave', mup)
  }

  // マウスボタンが上がったら発火
  function mup (e) {
    // マウスが動いたベクトルを保存
    position.set(e)

    if (options.stop) {
      options.stop(e, position, handleel)
      position.set()
    }
    // ハンドラの消去
    eventListener(false, 'mouseup touchend touchcancel mouseleave touchleave', mup)
    eventListener(false, 'mousemove touchmove', mmove)
  }
}

/**
 * movable
 *
 * @export
 * @param {element} element
 * @param {object} options
 */
export function movable (element, options) {
  const opts = Object.assign({
    containment: element.parentElement,
    handle: element,
    draggingClass: 'dragging'
  }, options || {})

  mousePosition(Object.assign({}, opts, {
    start (e, position, el) {
      // クラス名に .drag を追加
      el.classList.add(opts.draggingClass)
      if (opts.start) {
        opts.start(e, position, el)
      }
    },
    drag (e, position, el) {
      if (opts.drag) {
        opts.drag(e, position, el)
      }
      // マウスが動いた場所に要素を動かす
      position.setPosition(e)
    },
    stop (e, position, el) {
      if (opts.stop) {
        opts.stop(e, position, el)
      }
      // クラス名 .drag も消す
      el.classList.remove(opts.draggingClass)
    },
  }))
}
