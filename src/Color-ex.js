import Color from 'color'
import store from './store/store.js'
import xkcd from './constants/xkcd.json'
Color.prototype.toJSON = function () {
  return this[this.model]().round(2).object()
}

Color.prototype.nearColorName = function () {
  const hsl = this.hsl().alpha(1).object()
  let difference = 50
  let name = ''
  xkcd.forEach(([_name, _hsl]) => {
    let diff = 0
    // gray
    if (hsl.s < 5) {
      diff += Math.abs(hsl.s - _hsl.s)
      if (diff < 5) {
        diff += Math.abs(hsl.l - _hsl.l)
        if (diff < difference) {
          difference = diff
          name = _name
        }
        return
      }
      diff = 0
    }

    for (const key in hsl) {
      diff += Math.abs(hsl[key] - _hsl[key])
    }
    if (diff < difference) {
      difference = diff
      name = _name
    }
  })
  return name
}

Color.prototype.toString = function (model) {
  // console.log('model', model)
  const color = this.alpha(Math.round(this.valpha * 100) / 100)
  switch (model) {
    case 'hex':
      return color.hex()
    case 'rgb':
    case 'hsl':
      return color[model]().string(0)
    case 'prgb':
    case '%':
      return color.percentString(0)
    case 'hsv':
    case 'xyz':
    case 'lab':
      let str = model
      const arr = color[model]().round().array()
      if (color.valpha !== 1) {
        str += 'a'
      }
      return str + `(${arr.join(', ')})`
    case 'cmyk':
      const { bgColor } = store.get()
      const cmyk = bgColor.alphaBlending(color).cmyk().round().array()
      return `cmyk(${cmyk.join(', ')})`
    default:
      return color.string(0)
  }
}
Color.prototype.alphaBlending = function (...colors) {
  return alphaBlending(this, ...colors)
}
Color.prototype.contrast = function (txtColor) {
  let bgColor = this
  if (this.valpha !== 1 && txtColor.valpha !== 1) {
    bgColor = this.alphaBlending()
    txtColor = bgColor.alphaBlending(txtColor)
  } else {
    bgColor = this.valpha === 1 ? this : txtColor.alphaBlending(this)
    txtColor = txtColor.valpha === 1 ? txtColor : this.alphaBlending(txtColor)
  }
  const lum1 = bgColor.luminosity()
  const lum2 = txtColor.luminosity()

  if (lum1 > lum2) return (lum1 + 0.05) / (lum2 + 0.05)
  return (lum2 + 0.05) / (lum1 + 0.05)
}

Color.prototype.mostReadable = function (...colors) {
  let mostlum = 0
  let mostread
  for (const color of colors) {
    const contrast = this.contrast(Color(color))
    if (mostlum < contrast) {
      mostlum = contrast
      mostread = color
    }
  }
  return mostread
}
Color.random = function () {
  return new Color('#' + Math.random().toString(16).slice(2, 8))
}

/**
 * Alpha Blending in CSS
 *
 * <-back   layer   front->
 * Color.alphaBlending('rgba(...)', txtColor)
 *
 * @export
 * @param {Color} colors indexが深いほど手前。index0が一番奥の色
 * @see https://engineering.canva.com/2017/12/04/WebGL-David-Guan/
 * @returns
 */
export function alphaBlending (...colors) {
  return new Color(colors
    .map((color) => new Color(color).rgb().array())
    .reduce((back, front) => {
      const color = []
      const a = front[3] == null ? 1 : front[3]
      for (let i = 0; i < 3; i++) {
        color[i] = front[i] * a + back[i] * (1 - a)
      }
      return color
    }, [255, 255, 255, 1])
  )
}
