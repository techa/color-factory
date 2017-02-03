/* eslint camelcase:0, no-cond-assign:0  */
import { webcolor } from './constants/webcolor'

const MAX = { r: 255, g: 255, b: 255, h: 360, s: 100, l: 100 }
const RGB_HSL_KEYS = [['r', 'g', 'b'], ['red', 'green', 'blue'], ['h', 's', 'l'], ['hue', 'saturation', 'lightness']]

/**
 * RGB & RGBA & HSL & HSLA
 *
 * @class ColorParams
 * @extends {Array}
 */
class ColorParams extends Array {
  /**
   * Creates an instance of ColorParams.
   *
   * @param {string} type
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @param {number} a
   *
   * @memberOf ColorParams
   */
  constructor (type, r, g, b, a) {
    // create empty Array
    super()
    this.type = type
    for (let i = 0; i < 3; i++) {
      const chara = type.charAt(i)
      Object.defineProperty(this, chara, {
        get () {
          return this[i]
        },
        set (val) {
          if (chara === 'h') {
            while (val < 0) val += 360
            val %= 360
          }
          this[i] = Math.min(Math.max(0, Math.round(val)), MAX[chara])
        }
      })
      // set init value
      const arg = arguments[i + 1]
      this[chara] = typeof arg === 'number' ? arg : r[chara] || r[i] || 0
    }
    // set alpha
    if (type.charAt(3)) {
      Object.defineProperty(this, 'a', {
        get () {
          return this[3]
        },
        set (val) {
          this[3] = Math.min(Math.max(0, val), 1)
        }
      })
      // set init value
      this.a = a || r.a || r[3] || g || 0
    }
  }
  // @returns css string
  toString () {
    const a = this.a == null ? ')' : `, ${this[3]})`
    return this.type + `(${this[0]}, ${this[1]}, ${this[2]}` + a
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
  constructor (param, g, b, a) {
    RGB_HSL_KEYS.forEach((keys, i) => {
      keys.forEach((key, j) => {
        Object.defineProperty(this, key, {
          get () {
            return Math.round(i < 2 ? this.rgb[j] : this.hsl[j])
          },
          set (val) {
            if (i < 2) {
              this.rgb[key[0]] = val
              this.setParams(this.rgb, rgb2hsl(...this.rgb))
            } else {
              this.hsl[key[0]] = val
              this.setParams(hsl2rgb(...this.hsl), this.hsl)
            }
            this.hex = rgb2hex(this.rgb)
          }
        })
      })
    })
    this.setColor(param, g, b, a, true)
  }

  setColor (param, g, b, a, init) {
    if (!init && param instanceof Color) return param
    this.a = 1
    let rgb, hsl

    switch ({}.toString.call(param).slice(8, -1)) {
      case 'String':
        let result
        if (result = hex2rgb(param)) {
          // hex #000
          rgb = result
          if (param.charAt(0) !== '#') param = '#' + param
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
              throw new Error("ERROR! Don't mix up integer and percentage notation. 整数と割合を混在しないでください")
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
        if (param instanceof Color) {
          rgb = hex2rgb(param.hex)
        } else if (typeof param.r === 'number' && typeof param.g === 'number' && typeof param.b === 'number') {
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
        this.hex = randomHex()
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
    return this
  }

  setParams (rgb, hsl) {
    this.rgb  = new ColorParams('rgb', ...rgb)
    this.rgba = new ColorParams('rgba', ...rgb, this.a)
    this.hsl  = new ColorParams('hsl', ...hsl)
    this.hsla = new ColorParams('hsla', ...hsl, this.a)
    if (!this.hex) {
      this.toHex()
    }
  }

  getNearWebColor (score, hex) {
    const [color, name] = nearName(this.hex)
    return color ? name : hex ? this.hex : ''
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

/**
 * colorlistの内からhexに一番近いデータと返す
 *
 * @export
 * @param {string} hex
 * @param {array}  colorlist
 * @returns {array}  [_hex, name, _rgb, _score]
 */
export function nearName (hex, colorlist = webcolor) {
  const rgb = hex2rgb(hex)
  let nearest = []
  let minscore = Infinity

  colorlist.forEach(([_hex, name]) => {
    const _rgb = hex2rgb(_hex)
    const score = _rgb.reduce((p, c, i) => p + Math.abs(rgb[i] - c), 0)
    if (minscore > score) {
      minscore = score
      nearest = [[_hex, name, _rgb, score]]
    } else if (minscore === score) {
      minscore = score
      nearest.push([_hex, name, _rgb, score])
    }
  })
  if (nearest.length === 1) {
    return [...nearest[0], rgb2hex(hsl2rgb(rgb2hsl(...nearest[0][2])))]
  }
  const hsl = rgb2hsl(...rgb)
  let nearestName = []
  minscore = Infinity
  nearest.forEach(([_hex, name, _rgb, score]) => {
    const _hsl = rgb2hsl(_rgb)
    const _score = score - Math.abs(_hsl[0] - hsl[0])
    if (minscore > _score) {
      minscore = score
      nearestName = [_hex, name, _rgb, _score]
    }
  })
  return nearestName
}


function nearName2 (basecolor, colorlist = webcolor, options = {s: 10, l: 10, h: 30}) {
  const base = new Color(basecolor)
  let nearest = colorlist.map(([hex, name]) => [new Color(hex), name])

  // const val = contrastColors(basecolor, colorlist.map(([hex, name]) => new Color(hex)))

  // Object.keys(options).forEach((k) => {
  //   nearest = nearscore(k, options[k])
  // })
  // if (base.l <= 5) {
  //   nearest = nearest.filter(([color, name]) => color.l <= 5)
  // }
  // if (base.l >= 95) {
  //   nearest = nearest.filter(([color, name]) => color.l >= 95)
  // }
  // if (base.s <= 10) {
  //   nearest = nearest.filter(([color, name]) => color.l >= 95)
  // }
  // console.log('nearest', nearest)
  nearest = nearestContrast()

  function nearscore (key, score) {
    let minscore
    return nearest.reduce((logAry, data, i) => {
      const [color] = data

      if (Math.abs(base[key] - color[key]) < score) {
        logAry.push(data)
      }
      return logAry
    }, [])
  }
  function nearestContrast () {
    let minscore = null
    nearest.forEach(([color, name], i) => {
      const difference = contrastRatio(base.rgb, color.rgb)
      if (!i) {
        minscore = [color, name, difference]
      }
      if (difference.cr < minscore[2].cr) {
        minscore = [color, name, difference]
      }
    })
    return minscore
  }
  // console.log('nearest', nearest)
  return nearest || []
}

const schemeNames = {
  Complementary: [180],
  Opornent: [120],
  Analogous: [-30, 30],
  SplitComplementary: [150, -150],
  Triadic: [120, 240],
  Tretradic: [60, 180, 240],
  AccentedAnalogous: [-30, 30, 180],
}

/**
 * Base color から生成した配色配列を返す
 *
 * @export
 * @param {any}           basecolor  Base color
 * @param {string|number} angle
 * @returns {array}
 */
export function scheme (basecolor, ...angles) {
  if (arguments.length === 2) {
    const arg1 = arguments[1]
    if (Array.isArray(arg1)) {
      angles = arg1
    } else if (typeof arg1 === 'string') {
      const angle = angles.replace(' ', '')
      if (angle in schemeNames) {
        angles = schemeNames[angle]
      } else {
        Object.keys(schemeNames).some((schemeName) => {
          if (new RegExp(`${angle}`, 'i').test(schemeName)) {
            return (angles = schemeNames[schemeName])
          }
        })
      }
    }
  }

  if (Array.isArray(angles)) {
    return angles.map((hue) => {
      const keyColor = new Color(basecolor)
      keyColor.h += hue
      return keyColor
    })
  }
  throw new Error('Error! scheme')
}

/**
 * return: Sorted colors in order of strong contrast.
 * colorsをコントラストが強い順に並び替えして返す
 *
 * @export
 * @param {any}          basecolor  Base color
 * @param {string|Color} colors     Color or color hex string
 * @returns {array}                 Sorted contrastColors array. strongest contrast color first
 */
export function contrastColors (basecolor, ...colors) {
  const base = new Color(basecolor).rgb
  if (arguments.length === 2 && Array.isArray(arguments[1])) {
    colors = arguments[1]
  }
  colors = colors.map((color) => new Color(color))
  return colors.sort((color1, color2) => {
    return contrastRatio(base, color2.rgb).cr - contrastRatio(base, color1.rgb).cr
  })
}

export function randomHex () {
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
    g = r.g || r[1] || 0
    b = r.b || r[2] || 0
    r = r.r || r[0] || 0
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
    g = r.g || r[1] || 0
    b = r.b || r[2] || 0
    r = r.r || r[0] || 0
  }
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min
  let h,
      l = (max + min) / 2,
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  switch (max) {
    case min:
      h = s = 0
      break
    case r:
      h = (g - b) / d + (g < b ? 6 : 0); h /= 6
      break
    case g:
      h = (b - r) / d + 2; h /= 6
      break
    case b:
      h = (r - g) / d + 4; h /= 6
      break
  }

  h *= 360
  s *= 100
  l *= 100
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
 * @returns {Array.<number>}  [r, g, b]
 *
 * @see http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 * @see http://www.petitmonte.com/javascript/rgb_hsl_convert.html
 * @see http://d.hatena.ne.jp/ja9/20100907/1283840213
 * @see https://ja.wikipedia.org/wiki/HLS色空間
 */
export function hsl2rgb (h, s, l) {
  let r, g, b
  if (arguments.length === 1) {
    s = h.s || h[1] || 0
    l = h.l || h[2] || 0
    h = h.h || h[0] || 0
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
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
          p = 2 * l - q
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
 * @returns {Array.<number>}  [h, s, l] h: 0-360 , s: 0-100 , l: 0-100
 */
export function rgb2hsv (r, g, b) {
  if (arguments.length === 1) {
    g = r.g || r[1] || 0
    b = r.b || r[2] || 0
    r = r.r || r[0] || 0
  }
  const max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d   = max - min
  let h = max,
      s = (max === 0 ? 0 : d / max),
      v = max / 255

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
 * @param {number} h  (hue)       : 色相/色合い   0-360度の値
 * @param {number} s  (saturation): 彩度/鮮やかさ 0-100%の値
 * @param {number} v  (Value)     : 明度/明るさ   0-100%の値
 * @returns
 *
 * @see http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
 */
export function hsv2rgb (h, s, v) {
  let r, g, b
  if (arguments.length === 1) {
    s = h.s || h[1] || 0
    v = h.v || h[2] || 0
    h = h.h || h[0] || 0
  }

  while (h < 0) {
    h += 360
  }
  h %= 360

  const i = Math.floor(h * 6),
        f = h * 6 - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s)

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

function sRGB (num) {
  num /= 255
  return (num <= 0.03928) ? num / 12.92 : Math.pow((num + 0.055) / 1.055, 2.4)
}

function luminance (rgb) {
  return 0.2126 * sRGB(rgb[0]) + 0.7152 * sRGB(rgb[1]) + 0.0722 * sRGB(rgb[2])
}

/**
 * color1とcolor2のコントラスト比を計算
 *
 * @export
 * @param {array|Color} color1  rgb color array
 * @param {array|Color} color2  rgb color array
 * @returns {object}
 *
 * @see https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast
 * @see https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
 * @see https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
 * @see http://waic.jp/docs/WCAG20/Overview.html#visual-audio-contrast
 */
export function contrastRatio (color1, color2) {
  const l = [
    luminance(color1),
    luminance(color2),
  ]
  const [l1, l2] = l.sort((a, b) => b - a)

  // 1～21
  const cr = (l1 + 0.05) / (l2 + 0.05)
  return {
    sort: l[0] - l[1],
    // WCAG version 2 contrast ratio
    cr,
    // 評価
    // 通常のテキスト（14ポイント）
    aa: cr >= 4.5,
    aaa: cr >= 7,
    // 大きなテキスト（18ポイント、太字、中国語、日本語および韓国語）
    AA: cr >= 3,
    AAA: cr >= 4.5,
  }
}
export function contrastRatio1 (color1, color2) {
  const [r1, g1, b1] = color1
  const [r2, g2, b2] = color2

  const bright1 = (299 * r1 + 587 * g1 + 114 * b1) / 1000
  const bright2 = (299 * r2 + 587 * g2 + 114 * b2) / 1000
  const c = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)
  const d = Math.abs(bright1 - bright2)
  return {
    // WCAG version 1
    // contrast
    c,
    // brightness difference
    d,
    WCAG1: c > 500 && d > 125
  }
}

