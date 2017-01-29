function noop (e, position) {
  console.log('position', position)
}

export function eventRegister (el, onoff, callback, ...eventNames) {
  onoff = onoff ? 'addEventListener' : 'removeEventListener'
  eventNames.forEach((eventName) => {
    ;(el || window)[onoff](eventName, callback, false)
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
    stop: noop,
    grid: 1,
    percent: false,
    axis: null,
  }, options)

  const grid = options.grid > 0 ? [options.grid, options.grid] : options.grid
  // handlesの動きをcontainmentに制限するフラグ
  let contains = options.handle && options.containment

  let barRect
  let handleRect = {width: 0, height: 0}

  // 値の変更
  function modify (e, startflg) {
    const event = 'touches' in e ? e.touches[0] : e
    let offsetX = event.pageX
    let offsetY = event.pageY

    if (startflg) {
      startflg = 'start'
    } else  {
      startflg = ''
      offsetX -= position.startx
      offsetY -= position.starty
    }

    if (Array.isArray(event)) {
      offsetX = event[0]
      offsetY = event[1]
    }

    offsetX = position[startflg + 'x'] = adjust(offsetX, 'width')
    offsetY = position[startflg + 'y'] = adjust(offsetY, 'height')

    if (options.percent && contains) {
      position[startflg + 'percentX'] = percentage(offsetX, 'width')
      position[startflg + 'percentY'] = percentage(offsetY, 'height')
    }
  }
  // 値の調整
  function adjust (offset, side) {
    if (contains) {
      offset = Math.min(Math.max(0, offset), barRect[side] - handleRect[side])
    }
    offset = Math.round(offset * 100) / 100
    if (grid) {
      const gridi = side === 'width' ? grid[0] : grid[1]
      offset = Math.round(offset / gridi) * gridi
    }
    return offset
  }
  function percentage (offset, side) {
    return Math.min(Math.max(0, offset / (barRect[side] - handleRect[side]) * 100), 100)
  }

  // イベント登録
  const eventListener = eventRegister.bind(null, options.containment)
  ;(options.handle || options.containment).addEventListener('mousedown', mdown, false)
  ;(options.handle || options.containment).addEventListener('touchstart', mdown, false)

  const position = {
    startx: null,
    starty: null,
    x: null,
    y: null,
  }

  let handleel

  // マウスが押された際の関数
  function mdown (e) {
    // ボックスサイズ取得。ここに書くのはresize対策
    if (options.containment) barRect = options.containment.getBoundingClientRect()
    if (options.handle) handleRect = options.handle.getBoundingClientRect()

    // マウス座標を保存
    modify(e, true)

    handleel = this
    if (options.start) {
      options.start(e, position, handleel)
      modify([position.startx, position.starty], true)
    }

    eventListener(true, mup, 'mouseup', 'touchcancel', 'touchend')
    eventListener(true, mmove, 'mousemove', 'touchmove')
  }

  // マウスカーソルが動いたときに発火
  function mmove (e) {
    // マウスが動いたベクトルを保存
    modify(e)
    // フリックしたときに画面を動かさないようにデフォルト動作を抑制
    e.preventDefault()

    if (options.drag) {
      options.drag(e, position, handleel)
      modify([position.x, position.y])
      // ;[position.x, position.y] = gridModify(position.x, position.y)
    }

    // カーソルが外れたとき発火
    eventListener(true, mup, 'mouseleave', 'touchleave')
  }

  // マウスボタンが上がったら発火
  function mup (e) {
    // マウスが動いたベクトルを保存
    modify(e)

    if (options.stop) {
      options.stop(e, position, handleel)
      modify([position.x, position.y])
    }

    // ハンドラの消去
    eventListener(false, mup, 'mouseup', 'touchend', 'touchcancel', 'mouseleave', 'touchleave')
    eventListener(false, mmove, 'mousemove', 'touchmove')
  }
}

export function movable (element, options) {
  const opts = Object.assign({
    containment: element.parentElement,
    handle: element,
    draggingClass: 'dragging',
  }, options)

  mousePosition(Object.assign({}, opts, {
    start (e, position, el) {
      // クラス名に .drag を追加
      el.classList.add(opts.draggingClass)
      // 要素内の相対座標を取得
      position.startx -= el.offsetLeft
      position.starty -= el.offsetTop
      if (opts.start) {
        opts.start(e, position, el)
      }
    },
    drag (e, position, el) {
      if (opts.drag) {
        opts.drag(e, position, el)
      }
      // マウスが動いた場所に要素を動かす
      el.style.left = position.x + 'px'
      el.style.top = position.y + 'px'
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
