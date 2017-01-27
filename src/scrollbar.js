/**
 * 要素をドラッグ移動可能にする
 *
 * @param {Element}  handle
 * @param {Object}   options
 * @param {Element}  [options.parent]      parent Element
 * @param {strung}   [options.direction]   'horizontal' or vertical / 'row' or 'column'
 * @param {boolean}   [options.horizontal] 水平移動を許可する (default: true)
 * @param {boolean}   [options.vertical]   垂直移動を許可する (default: true)
 * @param {function} [options.onDragStart] callback (x, y, x%, y%)
 * @param {function} [options.onDragEnd]
 * @param {function} [options.onDrag]
 */
function movable (handle, {
  parent = handle.parentElement,
  direction,
  horizontal,
  vertical,
  jump,
  onDragStart,
  onDragEnd,
  onDrag,
  grid = 0
}) {
  const on = 'addEventListener'
  const off = 'removeEventListener'

  switch (direction) {
    case 'row':
    case 'horizontal':
      horizontal = true
      break
    case 'column':
    case 'vertical':
      vertical = true
      break
    default:
      horizontal = true
      vertical = true
      break
  }

  let dragging, pageX, pageY, barRect, handleRect
  function getRects () {
    barRect = parent.getBoundingClientRect()
    handleRect = handle.getBoundingClientRect()
  }
  getRects()

  function startMoving (e) {
    e.preventDefault()
    dragging = true

    window[on]('mouseup', stoptMoving)
    window[on]('touchend', stoptMoving)
    window[on]('touchcancel', stoptMoving)

    window[on]('mousemove', moving)
    window[on]('touchmove', moving)

    getRects()

    if ('touches' in e) {
      pageX = e.touches[0].pageX
      pageY = e.touches[0].pageY
    } else {
      pageX = e.pageX
      pageY = e.pageY
    }
    // callbackを実行
    if (onDragStart) onDragStart(...adjust(e))
  }

  function stoptMoving (e) {
    dragging = false

    // callbackを実行
    if (onDragEnd) {
      const returnValue = onDragEnd(...adjust(e))
      if (returnValue) {
        setPosition(returnValue)
      }
    }

    window[off]('mouseup', stoptMoving)
    window[off]('touchend', stoptMoving)
    window[off]('touchcancel', stoptMoving)

    window[off]('mousemove', moving)
    window[off]('touchmove', moving)
  }

  function moving (e) {
    if (!dragging) return

    const offsets = adjust(e)
    let returnValue

    // callbackを実行
    if (onDrag) returnValue = onDrag(...offsets)

    setPosition(offsets, returnValue)
  }

  // https://syncer.jp/javascript-reverse-reference/get-mouse-position
  function jumping (e) {
    getRects()

    pageX = e.pageX // X座標
    pageY = e.pageY // Y座標

    // 要素の位置座標を計算
    const positionX = barRect.left + window.pageXOffset // 要素のX座標
    const positionY = barRect.top + window.pageYOffset // 要素のY座標

    // 要素の左上からの距離を計算
    let offsetX = pageX - positionX
    let offsetY = pageY - positionY

    offsetX = modify(offsetX - handleRect.width / 2, 'width')
    offsetY = modify(offsetY - handleRect.height / 2, 'height')

    const offsets = [
      // parentを基準にしたX,Y座標
      offsetX, offsetY,
      percentage(offsetX, 'width'),
      percentage(offsetY, 'height')
    ]
    // callbackを実行
    if (typeof jump === 'function') jump(...offsets)

    setPosition(offsets)
  }
  function stopPropagation (e) { e.stopPropagation() }

  if (jump) {
    handle[on]('click', stopPropagation)
    parent[on]('click', jumping)
  }
  handle[on]('mousedown', startMoving)
  handle[on]('touchstart', startMoving)

  function destroy () {
    handle[off]('click', stopPropagation)
    parent[off]('click', jumping)
    handle[off]('mousedown', startMoving)
    handle[off]('touchstart', startMoving)
  }

  function adjust (e) {
    let offsetX, offsetY
    if ('touches' in e) {
      offsetX = e.touches[0].clientX - pageX
      offsetY = e.touches[0].clientY - pageY
    } else {
      offsetX = e.clientX - pageX
      offsetY = e.clientY - pageY
    }

    offsetX = modify(offsetX + handleRect.left + window.pageXOffset - barRect.left, 'width')
    offsetY = modify(offsetY + handleRect.top + window.pageYOffset - barRect.top, 'height')

    return [
      // parentを基準にしたX,Y座標
      offsetX, offsetY,
      percentage(offsetX, 'width'),
      percentage(offsetY, 'height')
    ]
  }

  function modify (offset, side) {
    let value = Math.min(Math.max(0, offset), barRect[side] - handleRect[side])
    value = Math.round(value * 100) / 100
    if (grid) {
      value = Math.round(value / grid) * grid
    }
    return value
  }
  function percentage (offset, side) {
    return Math.min(Math.max(0, offset / (barRect[side] - handleRect[side]) * 100), 100)
  }

  function setPosition (offsets, returnValue) {
    if (returnValue && returnValue[0] && returnValue[1]) {
      // 値が返ってきた場合その値に設定
      if (horizontal) handle.style.left = returnValue[0]
      if (vertical)   handle.style.top = returnValue[1]
    } else if (returnValue === void 0) {
      // 何もか返って来ない場合(undefind)
      if (horizontal) handle.style.left = offsets[0] + 'px'
      if (vertical)   handle.style.top = offsets[1] + 'px'
    }
  }

  return {
    handle, parent, destroy
  }
}
/**
 * elをスクロール
 *
 * @param {string|Element}   el ID string or Element
 * @param {object}           [options={}]
 * @returns {Element}        scrollbar-body
 */
function scrollbar (el, options = {}) {
  el = typeof el === 'string' ? document.getElementById(el) : el

  const wrapper = el
  let body = el.getElementsByClassName('scrollbar-body')[0]
  let content = el.getElementsByClassName('scrollbar-content')[0]
  let bar = el.getElementsByClassName('scrollbar-bar')[0]
  let handle = el.getElementsByClassName('scrollbar-handle')[0]

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
    direction: 'vertical',
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

  var ticking = false
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

if (typeof module !== 'undefined') {
  // CommonJS/Node compatibility.
  module.exports = {scrollbar, movable}
}
