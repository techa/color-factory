function noop () {}

/**
 * constructor PositionManager
 *
 * @export
 * @class PositionManager
 * @param {object} options
 */
export class PositionManager {
  constructor (options) {
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

    this.handleRect = {width: 0, height: 0, left: 0, top: 0}

    // position
    const position = { left: 0, top: 0 }
    // 代入したときにもthis.adjust()したい
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

  /**
   * mousedown
   *
   * @param {Event} e
   * @returns
   *
   * @memberOf PositionManager
   */
  init (e) {
    // ボックスサイズ取得。ここに書くのはresize対策
    this.parentRect = this.options.containment.getBoundingClientRect()
    if (this.options.handle) this.handleRect = this.options.handle.getBoundingClientRect()
    // this.x - this.startX
    this.vectorX = 0
    this.vectorY = 0
    this.set(e, true)
    return this
  }

  /**
   * mousemove, mouseup
   *
   * @param {Event}   e
   * @param {Boolean} initflg
   * @returns
   *
   * @memberOf PositionManager
   */
  set (e, initflg) {
    if ({}.toString.call(e) === '[object MouseEvent]') {
      const event = 'touches' in e ? e.touches[0] : e
      this.x = event.pageX - this.parentRect.left - window.pageXOffset
      this.y = event.pageY - this.parentRect.top - window.pageYOffset

      if (!initflg) {
        this.vectorX = this.x - this.startX
        this.vectorY = this.y - this.startY
      }
    }

    // modify
    this.left = this.handleRect.left + this.vectorX
    this.top  = this.handleRect.top + this.vectorY

    if (this.options.percent) {
      this.percentLeft = this.percentage(this.left, true)
      this.percentTop  = this.percentage(this.top)
    }

    if (initflg) {
      this.startX = this.x
      this.startY = this.y
      this.startLeft = this.left
      this.startTop  = this.top
    }
    return this
  }


  /**
   * handle move
   *
   * @param {Event}    e
   * @param {Element} [el=this.options.handle]
   * @returns
   *
   * @memberOf PositionManager
   */
  setPosition (e, el = this.options.handle) {
    switch (this.options.axis) {
      case 'x':
      case 'y':
        this.oneWayMove(this.options.axis, el)
        break
      case 'shift':
      case 'ctrl':
      case 'alt':
        if (e[this.options.axis + 'Key']) {
          const maxV = Math.abs(this.vectorX) > Math.abs(this.vectorY)
          this.oneWayMove(maxV ? 'x' : 'y', el)
          break
        }
        // fall through
      default:
        el.style.left = this.left + 'px'
        el.style.top  = this.top + 'px'
    }
    if (typeof this.width === 'number') {
      el.style.width  = this.width + 'px'
    }
    if (typeof this.height === 'number') {
      el.style.height = this.height + 'px'
    }
    return this
  }
  oneWayMove (either, el = this.options.handle) {
    if (either === 'x') {
      el.style.left = this.left + 'px'
      el.style.top = this.startTop + 'px'
    } else if (either === 'y') {
      el.style.left = this.startLeft + 'px'
      el.style.top = this.top + 'px'
    }
    return this
  }

  /**
   * Box内に制限しグリッド幅に合わせ計算調整する
   *
   * @param {Number}  offset                     this.handleRect.left + this.vectorX
   * @param {Boolean} [widthflg]
   * @param {Object}  [rect=this.handleRect]     getBoundingClientRect
   * @returns {Number}          this.left
   *
   * @memberOf PositionManager
   */
  adjust (offset, widthflg, rect = this.handleRect) {
    const side = widthflg ? 'width' : 'height'
    const options = this.options
    // handlesの動きをcontainmentに制限する
    if (options.containment !== document.body) {
      offset = Math.min(Math.max(0, offset), this.parentRect[side] - rect[side])
    }
    const grid = widthflg ? options.grid[0] : options.grid[1]
    offset = Math.round(offset / grid) * grid
    return offset
  }
  /**
   * Boxを基準にした％
   *
   * @param {Number}  offset    this.left
   * @param {Boolean} [widthflg]
   * @returns {Number} ％
   *
   * @memberOf PositionManager
   */
  percentage (offset, widthflg) {
    const side = widthflg ? 'width' : 'height'
    return Math.min(Math.max(0, offset / (this.parentRect[side] - this.handleRect[side]) * 100), 100)
  }
}


/**
 * addEventListener & removeEventListener
 *
 * @export
 * @param {element}  el
 * @param {boolean}  onoff      true: addEventListener, false: removeEventListener
 * @param {string}   eventNames Multiple event registration with space delimiter.スぺース区切りで複数イベント登録
 * @param {function} callback
 * @param {boolean}  [useCapture] http://qiita.com/hosomichi/items/49500fea5fdf43f59c58
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
 * @param {Object|Element} options
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
