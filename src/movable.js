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

function hitChecker (rect1, rect2, tolerance) {
  const fitflg = tolerance === 'fit'
  return hit(rect1, rect2, fitflg, true) && hit(rect1, rect2, fitflg)
}

function hit (rect1, rect2, fitflg, xflg) {
  const [x, w] = xflg ? ['left', 'width'] : ['top', 'height']
  if (fitflg) {
    // rect1 x1-----------------------------------------------x1+w1
    // rect2          x2---------------x2+w2
    if (rect1[x] <= rect2[x] && rect2[x] + rect2[w] <= rect1[x] + rect1[w]) {
      return true
    }
    return false
  }

  // rect1                x1---------------------------x1+w1
  // rect2 x2---------------------------------x2+w2
  if (
    rect2[x] <= rect1[x] && rect1[x] <= rect2[x] + rect2[w]
  ) {
    return true
  }
  // rect1 x1---------------------------------x1+w1
  // rect2               x2----------------------------------------x2+w2
  if (
    rect1[x] <= rect2[x] && rect2[x] <= rect1[x] + rect1[w]
  ) {
    return true
  }
  return false
}

/**
 * selectable
 *
 * @export
 * @param {element} element
 * @param {object} options
 */
export function selectable (element, options) {
  const opts = Object.assign({
    containment: element,
    filter: '*',
    cancel: 'input,textarea,button,select,option',
    tolerance: 'touch', // or 'fit'
    selectorClass: '', // 'selector'
    selectedClass: 'selected',
    // selecting: noop,
    // unselecting: noop,
    // selected: noop,
  }, options || {})

  const selectorDiv = document.createElement('div')

  if (opts.selectorClass) {
    selectorDiv.classList.add(opts.selectorClass)
  } else {
    selectorDiv.style.position = 'absolute'
    selectorDiv.style.zIndex = '100'
    selectorDiv.style.border = '1px dotted black'
  }
  const selectorString = opts.filter + opts.cancel.replace(/(\w+),?/g, ':not($1)')
  let children
  let childrenRects
  let selectElements = []

  function unselect (e, position) {
    children.forEach((child, i) => {
      if (child.classList.contains(opts.selectedClass)) {
        child.classList.remove(opts.selectedClass)
          // Callback
        if (opts.unselecting) {
          opts.unselecting(e, position, child, i)
        }
      }
    })
  }

  mousePosition(Object.assign({}, opts, {
    start (e, position) {
      // array init
      children = Array.from(element.querySelectorAll(selectorString))
      childrenRects = children.map((el) => el.getBoundingClientRect())
      // 追加
      element.appendChild(selectorDiv)
      if (opts.start) {
        opts.start(e, position, selectorDiv)
      }
      selectorDiv.style.left = position.startX + 'px'
      selectorDiv.style.top  = position.startY + 'px'
      selectorDiv.style.width  = '0px'
      selectorDiv.style.height = '0px'
      selectElements = []
      unselect(e, position)
    },
    drag (e, position, el) {
      let left, top, width, height
      if (position.vectorX < 0) {
        left  = position.startX + position.vectorX
      }
      if (position.vectorX >= 0) {
        left  = position.startX
      }
      if (position.vectorY < 0) {
        top  = position.startY + position.vectorY
      }
      if (position.vectorY >= 0) {
        top  = position.startY
      }
      width  = Math.abs(position.vectorX)
      height = Math.abs(position.vectorY)
      // 選択範囲のRectデータ
      const sdRect = {left, top, width, height}

      // 選択範囲内の要素にクラスを追加。範囲外の要素からクラスを削除
      childrenRects.forEach((rect2, i) => {
        const indexOf = selectElements.indexOf(children[i])
        if (hitChecker(sdRect, rect2, opts.tolerance)) {
          if (indexOf === -1) {
            children[i].classList.add(opts.selectedClass)
            selectElements.push(children[i])
            // Callback
            if (opts.selecting) {
              opts.selecting(e, position, children[i], i)
            }
          }
        } else if (indexOf > -1) {
          children[i].classList.remove(opts.selectedClass)
          selectElements.splice(indexOf, 1)
          // Callback
          if (opts.unselecting) {
            opts.unselecting(e, position, children[i], i)
          }
        }
      })
      // Callback
      if (opts.selected) {
        opts.selected(e, position, selectorDiv, selectElements)
      }
      // マウスが動いた場所にselectorDiv要素を動かす
      position.left = left
      position.top = top
      Object.assign(position, sdRect)
      position.setPosition(e, selectorDiv)
      // selectorDiv.style.width  = width + 'px'
      // selectorDiv.style.height = height + 'px'
    },
    stop (e, position, el) {
      // if (clickflg) unselect(e, position)
      if (opts.stop) {
        opts.stop(e, position, selectorDiv)
      }
      // 消す
      element.removeChild(selectorDiv)
    },
  }))
}

/**
 * elをスクロール
 *
 * @param {string|Element}   el ID string or Element
 * @param {object}           [options={}]
 * @returns {Element}        scrollbar-body
 */
export function scrollbar (element, options = {}) {
  const wrapper = typeof element === 'string' ? document.getElementById(element) : element
  let body = wrapper.getElementsByClassName('scrollbar-body')[0]
  let content = wrapper.getElementsByClassName('scrollbar-content')[0]
  let bar = wrapper.getElementsByClassName('scrollbar-bar')[0]
  let handle = wrapper.getElementsByClassName('scrollbar-handle')[0]

  // parts create
  wrapper.classList.add('scrollbar-wrapper')
  if (!body) {
    body = document.createElement('div')
    body.className = 'scrollbar-body'
    wrapper.appendChild(body)
  }
  if (!content) {
    content = document.createElement('div')
    content.className = 'scrollbar-content'
    body.appendChild(content)
  }
  if (!bar) {
    bar = document.createElement('div')
    bar.className = 'scrollbar-bar'
    wrapper.appendChild(bar)
  }
  if (!handle) {
    handle = document.createElement('div')
    handle.className = 'scrollbar-handle'
    bar.appendChild(handle)
  }

  // // elの中身をscrollbar-bodyに移動する
  // var children = el.children || []
  // for (let i = 0; i < children.length; i++) {
  //   body.appendChild(el.removeChild(children[i]))
  // }

  let wrapperHeight, contentHeight, barHight, parsent
  let handleHeight = handle.getBoundingClientRect().height

  function resize () {
    wrapperHeight = wrapper.getBoundingClientRect().height
    contentHeight = content.getBoundingClientRect().height
    barHight = bar.getBoundingClientRect().height

    parsent = wrapperHeight / contentHeight

    handleHeight = Math.max(1, barHight * parsent)

    handle.style.height = parsent * 100 + '%'
    handle.style.visibility = parsent > 0.999 ? 'hidden' : 'visible'
    handle.style.top = (barHight - handleHeight) * body.scrollTop / (contentHeight - wrapperHeight) + 'px'
  }
  resize()
  window.addEventListener('resize', resize)

  movable(handle, {
    axis: 'y',
    drag (e, position) {
      body.scrollTop = position.percentTop
    },
    jump (offsetX, offsetY) {
      body.scrollTop = Math.min(Math.max(offsetY, 0), barHight - handleHeight) / parsent
    },
    onDrag (offsetX, offsetY) {
      body.scrollTop = Math.min(Math.max(offsetY, 0), barHight - handleHeight) / parsent
    }
  })

  const contentObserver = new window.MutationObserver(resize)
  contentObserver.observe(content, {
    childList: true,
    subtree: true,
    characterData: true
  })

  let ticking = false
  body.addEventListener('scroll', function (e) {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handle.style.top = (barHight - handleHeight) * body.scrollTop / (contentHeight - wrapperHeight) + 'px'
        ticking = false
      })
    }
    ticking = true
  }, true)
  bar.addEventListener('wheel', function (e) {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        body.scrollTop += e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY
        ticking = false
      })
    }
    ticking = true
  })

  return {
    body, content, bar, handle, resize
  }
}
