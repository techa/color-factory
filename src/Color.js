/* eslint camelcase:0, no-cond-assign:0  */
import {webcolor} from './constants/webcolor'
import {jiscolor_en} from './constants/jiscolor_en'
import {jiscolor_ja} from './constants/jiscolor_ja'
import {materialcolor} from './constants/materialcolor'

class Rgb extends Array {
  constructor (r, g, b) {
    super(r, g, b)
    this.r = r
    this.g = g
    this.b = b
  }
  toString () {
    return `rgb(${this.r}, ${this.g}, ${this.b})`
  }
}
class Rgba extends Array {
  constructor (r, g, b, a) {
    a = a == null ? 1 : a
    super(r, g, b, a)
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }
  toString () {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
  }
}
class Hsl extends Array {
  constructor (h, s, l) {
    super(h, s, l)
    this.h = h
    this.s = s
    this.l = l
  }
  toString () {
    return `hsl(${Math.round(this.h)}, ${Math.round(this.s)}%, ${Math.round(this.l)}%)`
  }
}
class Hsla extends Array {
  constructor (h, s, l, a) {
    a = a == null ? 1 : a
    super(h, s, l, a)
    this.h = h
    this.s = s
    this.l = l
    this.a = a
  }
  toString () {
    return `hsla(${Math.round(this.h)}, ${Math.round(this.s)}%, ${Math.round(this.l)}%, ${this.a})`
  }
}

/**
 * Color
 *
 * @export
 * @class Color
 * @see https://github.com/carloscabo/colz/blob/master/public/js/colz.class.js#L72
 */
export default class Color {
  constructor (param, g, b) {
    this.setColor(param, g, b)

    ;[['r', 'g', 'b'], ['red', 'green', 'blue']].forEach((keys) => {
      keys.forEach((key, i) => {
        Object.defineProperty(this, key, {
          get () {
            return this.rgb[i]
          },
          set (val) {
            this.rgb[i] = Math.min(Math.max(0, Math.round(val)), 255)
            this.setParams(this.rgb, rgb2hsl(...this.rgb))
            this.toHex()
            return this
          }
        })
      })
    })
    ;['h', 'hue'].forEach((key) => {
      Object.defineProperty(this, key, {
        get () {
          return Math.round(this.hsl[0])
        },
        set (val) {
          while (val < 0) {
            val += 360
          }
          this.hsl[0] = Math.round(val % 360)
          this.setParams(hsl2rgb(...this.hsl), this.hsl)
          this.toHex()
          return this
        }
      })
    })
    ;[['s', 'l'], ['saturation', 'lightness']].forEach((keys) => {
      keys.forEach((key, i) => {
        Object.defineProperty(this, key, {
          get () {
            return Math.round(this.hsl[i + 1])
          },
          set (val) {
            this.hsl[i + 1] = Math.min(Math.max(0, Math.round(val)), 100)
            this.setParams(hsl2rgb(...this.hsl), this.hsl)
            this.toHex()
            return this
          }
        })
      })
    })
  }

  setColor (param, g, b) {
    this.a = 1
    let rgb, hsl

    switch ({}.toString.call(param).slice(8, -1)) {
      case 'String':
        let result
        if (result = hex2rgb(param)) {
          // hex #000
          rgb = result
          this.hex = param
        } else if (result = /^(rgb|hsl)a?\((\d{1,3})(%?), ?(\d{1,3})(%?), ?(\d{1,3})(%?)(?:, ?(0|1|0?\.\d{1,2}))?\)$/.exec(param)) {
          const data = [+result[2], +result[4], +result[6]]
          const percent = result[3] + result[5] + result[7]
          if (result[1] === 'rgb') {
            if (percent === '%%%') {
              // %を処理
              rgb = data.map(h => Math.floor(h / 100 * 255))
            } else if (!percent) {
              rgb = data
            } else {
              throw new Error('ERROR! Don\'t mix up integer and percentage notation. 整数と割合を混在しないでください')
            }
          } else if (result[1] === 'hsl' && percent === '%%') {
            hsl = data
          }
          if (result[8]) this.a = +('0' + result[8])
        } else if (this.hex = (webcolor.find((arg) => new RegExp(`^${param}$`, 'i').test(arg[1])) || [null, ''])[0]) {
          rgb = hex2rgb(this.hex)
        } else {
          throw new Error('ERROR! Color string ' + param)
        }
        break
      case 'Number':
        if (typeof g === 'number' && typeof b === 'number') {
          rgb = [param, g, b]
        } else if (g == null && b == null) {
          hsl = [param, 100, 50]
        }
        break
      case 'Array':
        rgb = param
        break
      case 'Object':
        if (typeof param.r === 'number' && typeof param.g === 'number' && typeof param.b === 'number') {
          rgb = [param.r, param.g, param.b]
        } else if (typeof param.h === 'number' && typeof param.s === 'number' && typeof param.l === 'number') {
          hsl = [param.h, param.s, param.l]
        }
        if (typeof param.a === 'number') {
          this.a = param.a
        }
        break
      case 'Undefined':
      case 'Null':
        this.hex = randomColor()
        rgb = hex2rgb(this.hex)
        break
      default:
        throw new TypeError('new Color arguments ERROR!' + arguments)
    }

    if (!hsl) {
      hsl = rgb2hsl(rgb)
    }
    if (!rgb) {
      rgb = hsl2rgb(hsl)
    }

    this.hsv = rgb2hsv(rgb)

    this.setParams(rgb, hsl)
    if (!this.hex) {
      this.toHex()
    }

    ;[webcolor, jiscolor_en, jiscolor_ja].some((colorlist) => {
      this.name = this.findColorName(colorlist)
      return this.name
    })
    this.name = this.name || nearName(this.hex)
  }

  setParams (rgb, hsl) {
    const rgba = rgb
    const hsla = hsl
    rgba[3] = this.a
    hsla[3] = this.a
    this.rgb  = new Rgb(...rgb)
    this.rgba = new Rgba(...rgba)
    this.hsl  = new Hsl(...hsl)
    this.hsla = new Hsla(...hsla)
  }

  findColorName (colorlist) {
    return (colorlist.find((arg) => arg[0] === this.hex.toUpperCase()) || [0, ''])[1]
  }
  /**
   * hsl変換を経由することで安定したHEXを出力する
   */
  toHex () {
    return (this.hex = rgb2hex(hsl2rgb(this.hsl)))
  }

  toString () {
    return this.hex
  }
  toJSON () {
    return this.hex
  }
}

Color.webcolor = webcolor
Color.jiscolor_en = jiscolor_en
Color.jiscolor_ja = jiscolor_ja
Color.materialcolor = materialcolor

function nearName (hex) {
  const rgb = hex2rgb(hex)
  let nearest = []
  let minscore = Infinity
  ;[webcolor, jiscolor_en, jiscolor_ja].forEach((colorlist) => {
    colorlist.forEach(([_hex, name]) => {
      const _rgb = hex2rgb(_hex)
      const score = _rgb.reduce((p, c, i) => p + Math.abs(rgb[i] - c), 0)
      if (minscore > score) {
        minscore = score
        nearest = [[_hex, name, _rgb, score]]
      } else if (minscore === score) {
        minscore = score
        nearest.push([_hex, name, _rgb])
      }
    })
  })
  return nearest
  // const hsl = rgb2hsl(...rgb)
  // let nearestName = []
  // nearest.forEach(([_hex, name, _rgb]) => {
  //   const _hsl = rgb2hsl(..._rgb)
  //   const score = Math.abs(_hsl[0] - hsl[0])
  //   if (minscore >= score) {
  //     minscore = score
  //     nearestName = [_hex, name]
  //   }
  // })
  // return nearestName
}

export function randomColor () {
  return '#' + Math.random().toString(16).slice(2, 8)
}

/**
 * カラーコード変換
 *
 * @param {string} hex
 * @returns {array}  [r,g,b]
 * @see http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
export function hex2rgb (hex) {
  const result = hex
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r + r + g + g + b + b)
    .match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  return result ? result.slice(1).map(h => parseInt(h, 16)) : null
}
export function hexToRgb (hex) {
  const [r, g, b] = hex2rgb(hex)
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * カラーコード変換
 *
 * @export
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string} hex
 */
export function rgb2hex (r, g, b) {
  if (arguments.length === 1) {
    g = r.g || r[1]
    b = r.b || r[2]
    r = r.r || r[0]
  }
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * RGB色空間からHSL色空間へ変換する
 *
 * @export
 * @param {number} r 0-255
 * @param {number} g 0-255
 * @param {number} b 0-255
 * @returns {Array.<number>}  [h, s, l] h: 0-360 , s: 0-100 , l: 0-100
 *
 * @see http://www.petitmonte.com/javascript/rgb_hsl_convert.html
 * @see https://ja.wikipedia.org/wiki/HLS色空間
 */
export function rgb2hsl (r, g, b) {
  if (arguments.length === 1) {
    g = r.g || r[1]
    b = r.b || r[2]
    r = r.r || r[0]
  }
  r /= 255
  g /= 255
  b /= 255
  var max = Math.max(r, g, b)
  var min = Math.min(r, g, b)
  var d = max - min
  var h
  var l = (max + min) / 2
  var s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  switch (max) {
    case min:
      h = s = 0
      break
    case r:
      // h = (g - b) / d + (g < b ? 6 : 0); h /= 6
      h = 60 * (g - b) / d + 0
      break
    case g:
      // h = (b - r) / d + 2; h /= 6
      h = 60 * (b - r) / d + 120
      break
    case b:
      // h = (r - g) / d + 4; h /= 6
      h = 60 * (b - r) / d + 240
      break
  }

  s *= 100
  l *= 100

  // return [Math.round(h), Math.round(s), Math.round(l)]
  return [h, s, l]
}

function hue2rgb (p, q, t) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}
/**
 * HSL色空間からRGB色空間へ変換する
 *
 * @export
 * @param {number} h  (hue)       : 色相    0-360度の値
 * @param {number} s  (saturation): 彩度    0-100%の値   彩度は100%が純色となり、彩度を落としていくと徐々に灰色になります
 * @param {number} l  (lightness) : 明度    0-100%の値   明度は中間の50%が純色で0%になると黒色、100%は白色となります
 * @returns
 *
 * @see http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 * @see http://www.petitmonte.com/javascript/rgb_hsl_convert.html
 * @see http://d.hatena.ne.jp/ja9/20100907/1283840213
 * @see https://ja.wikipedia.org/wiki/HLS色空間
 */
export function hsl2rgb (h, s, l) {
  var r, g, b
  if (arguments.length === 1) {
    s = h.s || h[1]
    l = h.l || h[2]
    h = h.h || h[0]
  }

  while (h < 0) {
    h += 360
  }
  h %= 360
  s = Math.max(0, Math.min(s, 100))
  l = Math.max(0, Math.min(l, 100))
  h /= 360
  s /= 100
  l /= 100

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s
    var p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  r = Math.round(r * 255)
  g = Math.round(g * 255)
  b = Math.round(b * 255)
  return [r, g, b]
}

/**
 * RGB色空間からHSV色空間へ変換する
 *
 * @export
 * @param {number} r 0-255
 * @param {number} g 0-255
 * @param {number} b 0-255
 * @returns {object}  {h, s, v}
 */
export function rgb2hsv (r, g, b) {
  if (arguments.length === 1) {
    g = r.g || r[1]
    b = r.b || r[2]
    r = r.r || r[0]
  }
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = max
  let s = (max === 0 ? 0 : d / max)
  let v = max / 255

  switch (max) {
    case min:
      h = 0
      break
    case r:
      h = (g - b) + d * (g < b ? 6 : 0); h /= 6 * d
      break
    case g:
      h = (b - r) + d * 2; h /= 6 * d
      break
    case b:
      h = (r - g) + d * 4; h /= 6 * d
      break
  }

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  v = Math.round(v * 100)
  return [h, s, v]
}

/**
 * HSV(HSB)色空間からRGB色空間へ変換する
 *
 * @export
 * @param {any} h  (hue)       : 色相/色合い   0-360度の値
 * @param {any} s  (saturation): 彩度/鮮やかさ 0-100%の値
 * @param {any} v  (Value)     : 明度/明るさ   0-100%の値
 * @returns
 *
 * @see http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
 */
export function hsv2rgb (h, s, v) {
  var r, g, b
  if (arguments.length === 1) {
    s = h.s || h[1]
    v = h.v || h[2]
    h = h.h || h[0]
  }

  while (h < 0) {
    h += 360
  }
  h %= 360

  var i = Math.floor(h * 6)
  var f = h * 6 - i
  var p = v * (1 - s)
  var q = v * (1 - f * s)
  var t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0:
      r = v; g = t; b = p
      break
    case 1:
      r = q; g = v; b = p
      break
    case 2:
      r = p; g = v; b = t
      break
    case 3:
      r = p; g = q; b = v
      break
    case 4:
      r = t; g = p; b = v
      break
    case 5:
      r = v; g = p; b = q
      break
  }

  r = Math.round(r * 255)
  g = Math.round(g * 255)
  b = Math.round(b * 255)
  return [r, g, b]
}
