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

    this.handleRect = { width: 0, height: 0, left: 0, top: 0 }

    // position
    const position = { left: 0, top: 0 }
    // 代入したときにもthis.adjust()したい
    Object.defineProperties(this, {
      left: {
        get () {
          return position.left
        },
        set (val) {
          position.left = this.adjust(val, 'width')
        },
      },
      top: {
        get () {
          return position.top
        },
        set (val) {
          position.top = this.adjust(val, 'height')
        },
      },
    })
  }

  /**
   * mousemove, mouseup
   *
   * @param {Event}   e
   * @param {Boolean} [initflg]
   * @param {Element} [handle=this.options.handle]
   * @returns
   *
   * @memberOf PositionManager
   */
  set (e, initflg, handle = this.options.handle) {
    if (initflg) {
      // ボックスサイズ取得。ここに書くのはresize対策
      this.parentRect = this.options.containment.getBoundingClientRect()
      if (handle) this.handleRect = handle.getBoundingClientRect()
    }

    const event = 'touches' in e ? e.touches[0] : e
    // スクロールも考慮した絶対座標 this.parentRect.left - window.pageXOffset
    this.x = event.pageX - this.parentRect.left - window.pageXOffset
    this.y = event.pageY - this.parentRect.top - window.pageYOffset

    if (initflg) {
      this.startX = this.x
      this.startY = this.y
      this.vectorX = 0
      this.vectorY = 0
    } else {
      this.vectorX = this.x - this.startX
      this.vectorY = this.y - this.startY
    }

    // modify
    this.left = this.handleRect.left - this.parentRect.left + this.vectorX
    this.top = this.handleRect.top - this.parentRect.top + this.vectorY

    this.percentLeft = this.percentage(this.x, 'width')
    this.percentTop = this.percentage(this.y, 'height')

    if (initflg) {
      this.startLeft = this.left
      this.startTop = this.top
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
        el.style.top = this.top + 'px'
    }
    if (typeof this.width === 'number') {
      el.style.width = this.width + 'px'
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
   * @param {String}  side
   * @param {Object}  [rect=this.handleRect]     getBoundingClientRect
   * @returns {Number}          this.left
   *
   * @memberOf PositionManager
   */
  adjust (offset, side, rect = this.handleRect) {
    const options = this.options
    // handlesの動きをcontainmentに制限する
    if (options.containment !== document.body) {
      offset = Math.min(Math.max(0, offset), this.parentRect[side] - rect[side])
    }
    const grid = side === 'width' ? options.grid[0] : options.grid[1]
    offset = Math.round(offset / grid) * grid
    return offset
  }

  /**
   * Boxを基準にした％
   *
   * @param {Number}  offset    this.left
   * @param {String}  side
   * @returns {Number} ％
   *
   * @memberOf PositionManager
   */
  percentage (offset, side) {
    return Math.min(Math.max(0, offset / (this.parentRect[side] - this.handleRect[side]) * 100), 100)
  }
}

/**
 * addEventListener & removeEventListener
 *
 * @export
 * @param {element}  el
 * @param {string}   eventNames Multiple event registration with space delimiter.スぺース区切りで複数イベント登録
 * @param {function} callback
 * @param {boolean}  [useCapture]
 */
export function on (el, eventNames, callback, useCapture) {
  eventNames.split(' ').forEach((eventName) => {
    ;(el || window).addEventListener(eventName, callback, !!useCapture)
  })
}
export function off (el, eventNames, callback, useCapture) {
  eventNames.split(' ').forEach((eventName) => {
    ;(el || window).removeEventListener(eventName, callback, !!useCapture)
  })
}

/**
 * マウス座標
 *
 * @param {Object|Element} options
 */
export class MousePosition {
  constructor (element, options) {
    this.options = Object.assign({
      containment: element || document.body,
      handle: null,
      // start: noop,
      // drag: noop,
      // stop: noop,
      switch: true,
    }, options || {})

    // イベント登録
    this._event = {
      mdown: (e) => { this.mdown(e) },
      mmove: (e) => { this.mmove(e) },
      mup: (e) => { this.mup(e) },
    }
    on(element, 'mousedown touchstart', this._event.mdown)

    this.position = new PositionManager(this.options)

    this._clickFlg = false
  }

  destroy () {
    off(0, 'mousedown touchstart', this._event.mdown)
  }

  toggle (bool = !this.options.switch) {
    this.options.switch = bool
  }

  // マウスが押された際の関数
  mdown (e, handle) {
    if (!this.options.switch) return
    const { options, position } = this
    // マウス座標を保存
    position.set(e, true, handle)

    if (options.start) {
      options.start(e, position, handle)
    }
    on(0, 'mouseup touchcancel touchend', this._event.mup)
    on(0, 'mousemove touchmove', this._event.mmove)
    this._clickFlg = true
  }

  // マウスカーソルが動いたときに発火
  mmove (e) {
    if (!this.options.switch) return
    const { options, position } = this
    // マウスが動いたベクトルを保存
    position.set(e)
    // フリックしたときに画面を動かさないようにデフォルト動作を抑制
    e.preventDefault()

    if (options.drag) {
      options.drag(e, position)
    }
    // カーソルが外れたとき発火
    on(0, 'mouseleave touchleave', this._event.mup)
    this._clickFlg = false
  }

  // マウスボタンが上がったら発火
  mup (e) {
    if (!this.options.switch) return
    const { options, position } = this
    // マウスが動いたベクトルを保存
    position.set(e)

    if (this._clickFlg && options.click) {
      options.click(e, position)
    } else if (options.stop) {
      options.stop(e, position)
    }
    // ハンドラの消去
    off(0, 'mouseup touchend touchcancel mouseleave touchleave', this._event.mup)
    off(0, 'mousemove touchmove', this._event.mmove)
  }
}

/**
 * movable
 *
 * @export
 * @param {element} element
 * @param {object} options
 */
export class Movable extends MousePosition {
  constructor (element, options) {
    super(element, Object.assign({
      containment: element.parentElement,
      handle: element,
      draggingClass: 'dragging',
    }, options || {}))
  }

  // マウスが押された際の関数
  mdown (e) {
    super.mdown(e)
    // クラス名に .drag を追加
    this.options.handle.classList.add(this.options.draggingClass)
  }

  // マウスカーソルが動いたときに発火
  mmove (e) {
    super.mmove(e)
    // マウスが動いた場所に要素を動かす
    this.position.setPosition(e)
  }

  // マウスボタンが上がったら発火
  mup (e) {
    super.mup(e)
    // クラス名 .drag も消す
    this.options.handle.classList.remove(this.options.draggingClass)
  }
}

/**
 * Resizable
 *
 * @export
 * @param {element} element
 * @param {object} options
 */
export class Resizable extends MousePosition {
  constructor (element, options) {
    const style = window.getComputedStyle(element.parentElement)
    super(element, Object.assign({
      containment: element.parentElement,
      handle: element,
      draggingClass: 'resizing',
      minWidth: parseFloat(style.minWidth) || 10,
      minHeight: parseFloat(style.minHeight) || 10,
    }, options || {}))
  }

  // マウスが押された際の関数
  mdown (e) {
    super.mdown(e)
    // クラス名に .drag を追加
    this.options.handle.classList.add(this.options.draggingClass)
  }

  // マウスカーソルが動いたときに発火
  mmove (e) {
    super.mmove(e)
    const pos = this.position
    const width = pos.parentRect.width + pos.vectorX
    const height = pos.parentRect.height + pos.vectorY
    if (width >= this.options.minWidth) {
      this.options.containment.style.width = width + 'px'
    }
    if (height >= this.options.minHeight) {
      this.options.containment.style.height = height + 'px'
    }
  }

  // マウスボタンが上がったら発火
  mup (e) {
    super.mup(e)
    // クラス名 .drag も消す
    this.options.handle.classList.remove(this.options.draggingClass)
  }
}


export function hitChecker (rect1, rect2, tolerance) {
  return tolerance === 'fit' ? fitHit(rect1, rect2) : touchHit(rect1, rect2)
}

function fitCheck (rectA, rectB, direction, side) {
  const a1 = rectA[direction]
  const a2 = a1 + rectA[side]
  const b1 = rectB[direction]
  const b2 = b1 + rectB[side]
  // rectA a1----------------------------------------a2
  // rectB          b1---------------b2
  return a1 <= b1 && b2 <= a2
}
export function fitHit (rectA, rectB) {
  if (
    fitCheck(rectA, rectB, 'left', 'width') &&
    fitCheck(rectA, rectB, 'top', 'height')
  ) {
    return true
  }
  return false
}

function touchCheck (rectA, rectB, direction, side) {
  const a1 = rectA[direction]
  const a2 = a1 + rectA[side]
  const b1 = rectB[direction]
  const b2 = b1 + rectB[side]
  // rectA                (a1)---a2      a1-----(a2)
  // rectA (a1)------------------a2      a1----------------------(a2)
  // rectA       a1----------------------------------------a2
  // rectB             b1-----------------------------b2
  return (b1 <= a2 && a2 <= b2) || (b1 <= a1 && a1 <= b2) || (a1 <= b1 && b2 <= a2)
}
export function touchHit (rectA, rectB) {
  if (
    touchCheck(rectA, rectB, 'left', 'width') &&
    touchCheck(rectA, rectB, 'top', 'height')
  ) {
    return true
  }
  return false
}


export class Selectable extends MousePosition {
  constructor (element, options) {
    super(element, Object.assign({
      containment: element,
      filter: '*',
      cancel: 'input,textarea,button,select,option',
      tolerance: 'touch', // or 'fit'
      selectorClass: '', // 'selector'
      selectedClass: 'selected',
      // selecting: noop,
      // unselecting: noop,
      // selected: noop,
    }, options || {}))

    const opts = this.options

    const helper = this.helper = document.createElement('div')

    helper.style.position = 'absolute'

    if (opts.selectorClass) {
      helper.classList.add(opts.selectorClass)
    } else {
      helper.style.zIndex = '10000'
      helper.style.border = '1px dotted black'
    }
    this.reset()

    const callback = (e, that) => {
      if (e.shiftKey) {
        this.toggle(that)
      } else if (!this.children.find(({ el }) => el === that).isSelected) {
        this.unselectAll()
        this.toggle(that)
      }
      // Callback
      if (opts.selected) {
        opts.selected(this.position, this.selects)
      }
    }
    function cb (e) { callback(e, this) }

    this.children.forEach(({ el }, i) => {
      el.addEventListener('mousedown', cb)
    })

    const observer = new MutationObserver((mutations) => { // eslint-disable-line
      mutations.forEach((mutation) => {
        // console.log('!!!!!', mutation.type)
        let change = false
        for (const el of mutation.addedNodes) {
          if (el !== helper) {
            el.addEventListener('mousedown', cb)
            change = true
          }
        }
        for (const el of mutation.removedNodes) {
          if (el !== helper) {
            el.removeEventListener('mousedown', cb)
            change = true
          }
        }
        if (change) {
          this.reset()
        }
      })
    })
    observer.observe(element, { childList: true })
  }

  get selects () {
    return this.children.filter((child) => child.isSelected)
  }

  reset (isSelected = false) {
    const opts = this.options
    const method = isSelected ? 'add' : 'remove'
    const que = opts.filter + opts.cancel.replace(/(\w+),?/g, ':not($1)')
    this.children = Array.from(opts.containment.querySelectorAll(que))
      .map((el, index) => {
        el.classList[method](opts.selectedClass)
        return {
          el,
          index,
          rect: el.getBoundingClientRect(),
          isSelected,
        }
      })
  }

  /**
   *
   *
   * @param {number|element} search
   * @param {boolean} flg
   * @memberof Selectable
   */
  toggle (search, flg) {
    const opts = this.options
    const child = typeof search === 'number'
      ? this.children[search]
      : this.children.find(({ el }) => el === search)
    const { el, isSelected } = child

    child.isSelected = flg = flg == null ? !isSelected : flg

    if (flg) {
      el.classList.add(opts.selectedClass)
      // Callback
      if (opts.selecting) {
        this.position.options.handle = el
        opts.selecting(this.position, child)
      }
    } else {
      el.classList.remove(opts.selectedClass)
      // Callback
      if (opts.unselecting) {
        this.position.options.handle = el
        opts.unselecting(this.position, child)
      }
    }
  }

  select (i) {
    this.toggle(i, true)
  }

  selectAll () {
    this.children.forEach((child, i) => {
      this.select(i)
    })
  }

  unselect (i) {
    this.toggle(i, false)
  }

  unselectAll () {
    this.children.forEach((child, i) => {
      this.unselect(i)
    })
  }

  helperRect (position) {
    let left, top
    if (position.vectorX < 0) {
      left = position.startX + position.vectorX
    }
    if (position.vectorX >= 0) {
      left = position.startX
    }
    if (position.vectorY < 0) {
      top = position.startY + position.vectorY
    }
    if (position.vectorY >= 0) {
      top = position.startY
    }
    const width = Math.abs(position.vectorX)
    const height = Math.abs(position.vectorY)
    // 選択範囲のRectデータ
    return { left, top, width, height }
  }

  mdown (e, handle) {
    super.mdown(e, handle)
    const el = this.options.containment
    const { position, helper } = this
    // array init
    if (!e.shiftKey) this.reset()
    else {
      for (const child of this.children) {
        child.shiftSelected = child.isSelected
      }
    }
    // helper追加
    el.appendChild(helper)
    helper.style.left = position.startX + 'px'
    helper.style.top = position.startY + 'px'
    helper.style.width = '0px'
    helper.style.height = '0px'
  }

  // マウスカーソルが動いたときに発火
  mmove (e) {
    super.mmove(e)
    const opts = this.options
    const { position, helper } = this
    // 選択範囲のRectデータ
    const helperRect = this.helperRect(position)

    // 選択範囲内の要素にクラスを追加。範囲外の要素からクラスを削除
    this.children.forEach(({ rect }, i) => {
      const hit = hitChecker(helperRect, rect, opts.tolerance)
      if (!this.children[i].shiftSelected) {
        this.toggle(i, hit)
      }
    })
    // マウスが動いた場所にhelper要素を動かす
    helper.style.left = helperRect.left + 'px'
    helper.style.top = helperRect.top + 'px'
    helper.style.width = helperRect.width + 'px'
    helper.style.height = helperRect.height + 'px'
  }

  // マウスボタンが上がったら発火
  mup (e) {
    super.mup(e)
    const opts = this.options
    // helper要素を消す
    opts.containment.removeChild(this.helper)
    // Callback
    if (opts.selected) {
      opts.selected(this.position, this.selects)
    }
  }
}
