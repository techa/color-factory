import color from 'color'
import xkcd from './constants/xkcd.json'
import { hsl2zaa, zaa2hsl } from './zaa'

Object.assign(color.prototype, {
  toString (model) {
    // console.log('model', model)
    const color = this.alpha(Math.round(this.valpha * 100) / 100)
    switch (model) {
      case '#':
      case 'hex':
        return color.hex()
      case '$':
      case 'zaa':
        return hsl2zaa(color.hsl().round().object())
      case 'rgb':
      case 'hsl':
        return color[model]().string(0)
      case 'prgb':
      case 'rgbp':
      case 'rgb%':
      case '%':
        return color.percentString(0)
      case 'hsv':
      case 'hwb':
      case 'xyz':
      case 'lab':
        let str = model
        const arr = color[model]().round().array()
        if (color.valpha !== 1) {
          str += 'a'
        }
        if (/hsv|hwb/.test(model)) {
          arr[1] += '%'
          arr[2] += '%'
        }
        return str + `(${arr.join(', ')})`
      case 'cmyk':
        const cmyk = color.cmyk().round().array()
        return `cmyk(${cmyk.join(', ')})`
      default:
        return color.string(0)
    }
  },
})

/**
 * @export
 * @class Color
 * @extends {color} https://github.com/Qix-/color/blob/master/index.js
 */
export default class Color extends color {
  constructor (param, model) {
    const match = typeof param === 'string' && param.replace(/\s*/g, '').match(
      /(hsv|hwb|xyz|lab|cmyk)a?\([-+]?(\d+),-?(\d+)%?,-?(\d+)%?(?:,([.\d]+))?\)/i
    )
    if (match) {
      param = match.slice(2)
      param[3] = param[3] == null ? 1 : param[3] || 0
      model = match[1]
      param = param.map((a) => +a || 0)
    } else {
      // $zaa code
      const match = typeof param === 'string' && param.replace(/\s*/g, '').match(
        /^\$([0-9a-z]\d(\d\d|a0){2,3}|[0-9a-z][0-9a]{2,3}?)$/i
      )
      if (match) {
        param = zaa2hsl(param)
        model = 'hsl'
      }
    }
    super(param, model)
  }
  toJSON () {
    if (this.valpha !== 1) {
      return this.hex() + Math.round(this.valpha * 255).toString(16)
    }
    return this.hex() // this[this.model]().round(2).object()
  }
  nearColorName () {
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
  /**
   * Green-blindness (6% of men, 0.4% of women)
   * @see https://github.com/google/palette.js/blob/master/demo.js
   * @returns {Color}
   */
  greenBlindness () {
    const [r, g, b] = this.rgb().array().map((p) => p ** 2.2)
    const R = Math.pow(0.02138 + 0.677 * g + 0.2802 * r, 1 / 2.2)
    const B = Math.pow(0.02138 * (1 + g - r) + 0.9572 * b, 1 / 2.2) || 0
    return new Color([R, R, B, this.valpha])
  }
  /**
   * Red-blindness (2.5% of men)
   */
  redBlindness () {
    const [r, g, b] = this.rgb().array().map((p) => p ** 2.2)
    const R = Math.pow(0.003974 + 0.8806 * g + 0.1115 * r, 1 / 2.2)
    const B = Math.pow(0.003974 * (1 - g + r) + 0.9921 * b, 1 / 2.2) || 0
    return new Color([R, R, B, this.valpha])
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
  alphaBlending (...colors) {
    return new Color(
      [this, ...colors]
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
  contrast (txtColor) {
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
  mostReadable (colors, opts = {}) {
    let bestlum = 0
    let bestColor
    const { fallbackColors, min = 0 } = opts
    for (const color of colors) {
      const contrast = this.contrast(new Color(color))
      if (bestlum < contrast) {
        bestlum = contrast
        bestColor = color
      }
    }
    if (bestlum >= min || !fallbackColors) {
      return bestColor
    }
    return this.mostReadable(['#fff', '#000'], { min, fallbackColors: false })
  }
  textColor () {
    return this.mostReadable(['#fff', '#000'])
  }
}

Color.random = function () {
  return new Color('#' + Math.random().toString(16).slice(2, 8))
}
