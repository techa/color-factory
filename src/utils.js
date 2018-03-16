export function round (num, digit) {
  return Number(num.toFixed(digit))
}

export function kebabCase (str) {
  return str.replace(/^([A-Z])|.([A-Z])/g, (r, m1, m2) => {
    if (m1) {
      return m1.toLowerCase()
    } else if (m2) {
      return '-' + m2.toLowerCase()
    }
  })
}

export function convertWCName (object) {
  const obj = {}
  for (let key in object) {
    obj[kebabCase(key)] = object[key]
  }
  return obj
}

const numStylekey = ['width', 'height', 'top', 'left']
export function styler (dom, data) {
  if (dom[0] === void 0) {
    dom = [dom]
  }
  dom.forEach((el) => {
    const style = el.style
    for (let key in data) {
      const val = data[key]
      if (typeof val === 'number' && numStylekey.indexOf(key) !== -1) {
        style[key] = val + 'px'
      } else if (val != null) {
        style[key] = val
      }
    }
  })
}
export function styleString (data) {
  let style = ''
  for (let key in data) {
    const val = data[key]
    if (typeof val === 'number' && numStylekey.indexOf(key) !== -1) {
      style += kebabCase(key) + `: ${val}px;`
    } else if (val != null) {
      style += kebabCase(key) + `: ${val};`
    }
  }
  console.log('style', style)
  return style
}

/**
 * クリップボードコピー関数
 *
 * @export
 * @param {string} textVal
 * @returns {boolean}
 */
export function copyTextToClipboard (textVal) {
  // テキストエリアを用意する
  const copyFrom = document.createElement('textarea')
  // テキストエリアへ値をセット
  copyFrom.textContent = textVal

  // bodyタグの要素を取得
  const bodyElm = document.getElementsByTagName('body')[0]
  // 子要素にテキストエリアを配置
  bodyElm.appendChild(copyFrom)

  // テキストエリアの値を選択
  copyFrom.select()
  // コピーコマンド発行
  const retVal = document.execCommand('copy')
  // 追加テキストエリアを削除
  bodyElm.removeChild(copyFrom)

  return retVal
}

export function eventer (constructor) {
  const EVENTS = constructor._events = {}
  Object.assign(constructor, {
    on (eventName, handler) {
      (EVENTS[eventName] = EVENTS[eventName] || []).push(handler)
      return this
    },
    off (eventName, handler) {
      const index = EVENTS[eventName].indexOf(handler)
      if (~index) EVENTS[eventName].splice(index, 1)
      return this
    },
    once (eventName, handler) {
      const oncehandler = (...args) => {
        this.off(eventName, oncehandler)
        handler(...args)
      }
      (EVENTS[eventName] = EVENTS[eventName] || []).push(oncehandler)
      return this
    },
    fire (eventName, ...args) {
      console.log('fire', eventName)
      if (EVENTS[eventName]) {
        EVENTS[eventName].forEach((handler) => handler(...args))
      } else {
        console.error(`fire: ${eventName} is undefind`)
      }
      return this
    },
  })
}
