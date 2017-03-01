
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
