/* eslint camelcase:0, no-cond-assign:0  */
;(function () {
  const MAX = { r: 255, g: 255, b: 255, h: 360 }
  const formats = ['hsl', 'hsv', 'rgb']
  const formatKeys = {
    hsl: ['hue', 'saturation', 'lightness'],
    hsv: ['chroma', 'value'],
    rgb: ['red', 'green', 'blue']
  }

  const mathRound = Math.round,
        mathAbs = Math.abs,
        mathMin = Math.min,
        mathMax = Math.max,
        mathFloor = Math.floor

  /**
   * adjust number
   *
   * @param {string|number} val
   * @param {number} max
   * @returns {number} 0~1
   */
  function parseNum (val, max) {
    return mathRound(parseNum01(val, max) * max)
  }
  /**
   * adjust number
   *
   * @param {string|number} val
   * @param {number} max
   * @returns {number} 0~1
   */
  function parseNum01 (val, max) {
    // '1.' = '100%'
    if (typeof val === 'string' && val.indexOf('.') !== -1 && parseFloat(val) === 1) {
      val = '100%'
    }
    // isPercentage
    const percentFlg = typeof val === 'string' && val.substr(-1) === '%'
    val = parseFloat(val)

    if (max === 360) {
      val = hueAdjust(val)
    }

    val = clamp(val, max)

    if (percentFlg) {
      val = parseInt(val * max, 10) / 100
    }
    // Handle floating point rounding errors
    if (mathAbs(val - max) < 0.000001) {
      return 1
    }
    // Convert into [0, 1] range if it isn't already
    return (val % max) / parseFloat(max)
  }

  function hueAdjust (h) {
    while (h < 0) h += 360
    return h % 360
  }

  function clamp (n, max, min) {
    return mathMax(min || 0, mathMin(n, max))
  }

  function clamp01 (n) {
    return mathMax(0,  mathMin(n, 1))
  }

  const parsers = (function () {
    // <http://www.w3.org/TR/css3-values/#integers>
    const INTEGER = '[-\\+]?\\d+%?'

    // <http://www.w3.org/TR/css3-values/#number-value>
    const NUMBER = '[-\\+]?\\d*\\.\\d+%?'

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    const UNIT = `(?:${NUMBER})|(?:${INTEGER})`
    const MATCH3 = `[\\s|\\(]+(${UNIT})[,|\\s]+(${UNIT})[,|\\s]+(${UNIT})\\s*\\)?`
    const MATCH4 = `[\\s|\\(]+(${UNIT})[,|\\s]+(${UNIT})[,|\\s]+(${UNIT})[,|\\s]+(${UNIT})\\s*\\)?`

    return {
      rgb: new RegExp('rgb' + MATCH3),
      rgba: new RegExp('rgba' + MATCH4),
      hsl: new RegExp('hsl' + MATCH3),
      hsla: new RegExp('hsla' + MATCH4),
      hsv: new RegExp('hsv' + MATCH3),
      hsva: new RegExp('hsva' + MATCH4),
      UNIT: new RegExp(UNIT),
      hex3: /^#?([\da-fA-F]{1})([\da-fA-F]{1})([\da-fA-F]{1})$/,
      hex4: /^#?([\da-fA-F]{1})([\da-fA-F]{1})([\da-fA-F]{1})([\da-fA-F]{1})$/,
      hex6: /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/,
      hex8: /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/
    }
  })()

  function isValidUnit (val) {
    return parsers.UNIT.test(val)
  }

  function string2object (text) {
    text = text.trim().toLowerCase()
    let named = false
    if (names[text]) {
      text = names[text]
      named = true
    }

    if (text === 'transparent') {
      return {r: 0, g: 0, b: 0, a: 0, format: 'name'}
    }

    // color functions. [rgb, rgba, hsl, hsla, hsv, hsva]
    const parsersKeys = Object.keys(parsers)
    for (let i = 0; i < 6; i++) {
      const key = parsersKeys[i],
            match = parsers[key].exec(text)

      if (match) {
        const obj = {}
        for (let j = 0; j < key.length; j++) {
          obj[key[j]] = match[j + 1]
        }
        return obj
      }
    }

    // color hex. [hex8, hex6, hex4, hex3]
    for (let i = parsersKeys.length - 1; i > 6; i--) {
      const key = parsersKeys[i],
            match = parsers[key].exec(text)

      if (match) {
        const obj = {
          format: named ? 'name' : key
        }
        for (let j = 1; j < 4; j++) {
          let hex = match[j]
          // key === hex3 || key === hex4
          if (i < 9) {
            hex += hex
          }
          obj[' rgb'[j]] = parseInt(hex, 16)
        }

        if (match[4]) {
          obj.a = parseInt(match[4], 16) / 255
        }

        return obj
      }
    }

    throw new Error(`Invalid arguments text`)
  }

  function input2hsl (input) {
    let hsl = [0, 0, 0],
        a = 1,
        ok = false,
        format = false
    if (typeof input === 'string') {
      input = string2object(input)
    }

    if (Array.isArray(input)) {
      input = {r: input[0], g: input[1], b: input[2]}
      a = input[3] == null ? a : input[3]
      format = 'rgb'
    }


    if (typeof input === 'object') {
      if (isValidUnit(input.r) && isValidUnit(input.g) && isValidUnit(input.b)) {
        hsl = rgb2hsl(input)
        ok = true
        format = String(input.r).substr(-1) === '%' ? 'prgb' : 'rgb'
      } else if (isValidUnit(input.h) && isValidUnit(input.s) && isValidUnit(input.v)) {
        hsl = hsv2hsl(input)
        ok = true
        format = 'hsv'
      } else if (isValidUnit(input.h) && isValidUnit(input.s) && isValidUnit(input.l)) {
        hsl = [
          parseNum01(input.h, 360) * 360,
          parseNum01(input.s, 100) * 100,
          parseNum01(input.l, 100) * 100
        ]

        ok = true
        format = 'hsl'
      }
      if (input.hasOwnProperty('a')) {
        a = input.a
      }
    }
    return {
      hsl: hsl.map((n, i) => clamp(n, i ? 100 : 360)),
      format: input.format || format,
      ok,
      a
    }
  }
  /**
   * RGB & HSL & HSV
   *
   * @class ColorParams
   * @extends {Array}
   */
  class ColorParams extends Array {
    /**
     * Creates an instance of ColorParams.
     *
     * @param {string} format
     * @param {Array.<number>|object} param
     * @param {number} a
     *
     * @memberOf ColorParams
     */
    constructor (format, param, a) {
      // create empty Array
      super()
      this.format = format
      for (let i = 0; i < 3; i++) {
        const chara = format.charAt(i)
        Object.defineProperty(this, chara, {
          get () {
            return this[i]
          },
          set (val) {
            if (chara === 'h') {
              val = hueAdjust(val)
            }
            this[i] = clamp(hueAdjust(val), MAX[chara] || 100)
          }
        })
        // set init value
        this[chara] = param[chara] || param[i] || 0
      }
      // set alpha

      Object.defineProperty(this, 'a', {
        get () {
          return this._a
        },
        set (val) {
          this._a = clamp01(val)
        }
      })
      // set init value
      this.a = a || param.a || param[3]
      this.a = this.a === 0 ? 0 : this.a || 1
    }
    // @returns css string
    toString () {
      const a = this.a === 1 ? ')' : `, ${this._a})`
      const percent = /^hs/.test(this.format) ? '%' : ''
      return this.format + `(${this[0]}, ${this[1] + percent}, ${this[2] + percent}` + a
    }
  }

  let colorID = 0
  /**
   * Color
   *
   * @export
   * @class Color
   * @see https://github.com/carloscabo/colz/blob/master/public/js/colz.class.js#L72
   */
  function Color (params, opts) {
    if (params instanceof Color) {
      return params
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof Color)) {
      return new Color(params, opts)
    }

    this._hsl = [0, 0, 0]
    this.setColor(params, true)
    this._originalInput = params
    this._ID_ = colorID++

    formats.forEach((format) => {
      formatKeys[format].forEach((key) => {
        const chara = key[0]
        const value = {
          get () {
            return this.getParam(format)[chara]
          },
          set (val) {
            const param = this.getParam(format)
            param[chara] = parseNum(val, MAX[chara] || 100)
            console.log('param', param)
            this.setColor(param, {format})
          }
        }
        Object.defineProperties(this, {[key]: value, [chara]: value})
      })
    })
    Object.defineProperty(this, 'alpha', {
      get () {
        return this._a
      },
      set (val) {
        this._a = clamp01(val)
      }
    })
  }
  Color.prototype = {
    setColor (params, opts = {}) {
      const {hsl, format, ok, a} = input2hsl(params)
      this.format = opts.format || format || 'rgb'
      this._hsl = hsl
      this._a = a
      this._roundA = mathRound(a * 100) / 100
      this._ok = ok
      return this
    },
    isValid () {
      return this._ok
    },
    getParam (format, ratio) {
      format = format || this.format
      const hsl = this._hsl
      let param
      switch (format) {
        case 'hsl':
          param = hsl
          break
        case 'hsv':
          param = hsl2hsv(hsl)
          break
        case 'prgb':
          param = hsl2rgb(hsl).map(n => mathRound(n / 255 * 100))
          format = 'rgb'
          break
        case 'rgb':
        default:
          param = hsl2rgb(hsl)
      }
      return new ColorParams(format, param, this._a)
      // return param.reduce((obj, arg, i) => {
      //   obj[format[i]] = arg
      //   return obj
      // }, { a: this._a })
    },
    getParamRatio (format) {
      return this.getParam(format).map((n, i) => n / (MAX[format[i]] || 100))
    },
    clone () {
      console.log('this.format', this.format)
      return Color(this.toString(this.format))
    },
    alphas (value) {
      const color = this.clone()
      color.alpha = value
      return color
    },
    toJSON () {
      return this.toString('rgb')
    },
    toName () {
      if (this._a === 0) {
        return 'transparent'
      }

      if (this._a < 1) {
        return false
      }

      return hexNames[rgb2hex(hsl2rgb(this._hsl))] || false
    },
    toString (format) {
      format = format || this.format
      const param = this.getParam(format)

      switch (format) {
        case 'hex':
        case 'hex6':
          return rgb2hex(param)
        case 'hex3':
          return param.reduce((str, v) => (str += v.toString(16)[0]), '#')
        case 'hex8':
          return rgb2hex(param) + mathRound(this._roundA * 255).toString(16)
        case 'hex4':
          return param.reduce((str, v) => (str += v.toString(16)[0]), '#') + mathRound(this._roundA * 255).toString(16)[0]
      }

      let prefix = format
      let surfix = ')'

      if (this._roundA !== 1) {
        prefix += 'a'
        surfix = `, ${this._roundA})`
      }

      for (let i = format.length; i--;) {
        const val = param[format[i]]
        if (val != null) {
          param[format[i]] = mathRound(val)
        }
      }

      switch (format) {
        case 'rgb':
          return prefix + `(${param.r}, ${param.g}, ${param.b}` + surfix
        case 'prgb':
          return prefix + `(${param.r}%, ${param.g}%, ${param.b}%` + surfix
        case 'hsl':
          return prefix + `(${param.h}, ${param.s}%, ${param.l}%` + surfix
        case 'hsv':
          return prefix + `(${param.h}, ${param.s}%, ${param.v}%` + surfix
      }
    },
    getLuminance () {
      return getLuminance(hsl2rgb(this._hsl))
    },
    getBrightness () {
      // http://www.w3.org/TR/AERT#color-contrast
      const param = hsl2rgb(this._hsl)
      return (299 * param[0] + 587 * param[1] + 114 * param[2]) / 1000
    },
    isDark () {
      return this.getBrightness() < 128
    },
    isLight () {
      return !this.isDark()
    },
    textColor (colorList) {
      return mostReadable(this, colorList || [Color.white, Color.black])
    },
    contrastColor (colorList) {
      return mostReadable(this, colorList || [Color.white, Color.black])
    },
  }
  Object.assign(Color.prototype, formats.reduce((obj, format) => {
    const method = 'to' + format[0].toUpperCase() + format.substr(1)
    obj[method] = function () { return this.getParam(format) }

    obj[method + 'String'] = function () { return this.toString(format) }
    return obj
  }, {
    toPercentageRgb () {
      return this.getParam('prgb')
    },
    toPercentageRgbString () {
      return this.toString('prgb')
    }
  }))
  Object.assign(Color, {
    black: '#000',
    white: '#fff',
    random () {
      return new Color(randomHex())
    },
    scheme,
    readability,
    isReadable,
    sortReadable,
    mostReadable,
  })

  const names = Color.names = {
    aliceblue: 'f0f8ff',
    antiquewhite: 'faebd7',
    aqua: '0ff',
    aquamarine: '7fffd4',
    azure: 'f0ffff',
    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '000',
    blanchedalmond: 'ffebcd',
    blue: '00f',
    blueviolet: '8a2be2',
    brown: 'a52a2a',
    burlywood: 'deb887',
    burntsienna: 'ea7e5d',
    cadetblue: '5f9ea0',
    chartreuse: '7fff00',
    chocolate: 'd2691e',
    coral: 'ff7f50',
    cornflowerblue: '6495ed',
    cornsilk: 'fff8dc',
    crimson: 'dc143c',
    cyan: '0ff',
    darkblue: '00008b',
    darkcyan: '008b8b',
    darkgoldenrod: 'b8860b',
    darkgray: 'a9a9a9',
    darkgreen: '006400',
    darkgrey: 'a9a9a9',
    darkkhaki: 'bdb76b',
    darkmagenta: '8b008b',
    darkolivegreen: '556b2f',
    darkorange: 'ff8c00',
    darkorchid: '9932cc',
    darkred: '8b0000',
    darksalmon: 'e9967a',
    darkseagreen: '8fbc8f',
    darkslateblue: '483d8b',
    darkslategray: '2f4f4f',
    darkslategrey: '2f4f4f',
    darkturquoise: '00ced1',
    darkviolet: '9400d3',
    deeppink: 'ff1493',
    deepskyblue: '00bfff',
    dimgray: '696969',
    dimgrey: '696969',
    dodgerblue: '1e90ff',
    firebrick: 'b22222',
    floralwhite: 'fffaf0',
    forestgreen: '228b22',
    fuchsia: 'f0f',
    gainsboro: 'dcdcdc',
    ghostwhite: 'f8f8ff',
    gold: 'ffd700',
    goldenrod: 'daa520',
    gray: '808080',
    green: '008000',
    greenyellow: 'adff2f',
    grey: '808080',
    honeydew: 'f0fff0',
    hotpink: 'ff69b4',
    indianred: 'cd5c5c',
    indigo: '4b0082',
    ivory: 'fffff0',
    khaki: 'f0e68c',
    lavender: 'e6e6fa',
    lavenderblush: 'fff0f5',
    lawngreen: '7cfc00',
    lemonchiffon: 'fffacd',
    lightblue: 'add8e6',
    lightcoral: 'f08080',
    lightcyan: 'e0ffff',
    lightgoldenrodyellow: 'fafad2',
    lightgray: 'd3d3d3',
    lightgreen: '90ee90',
    lightgrey: 'd3d3d3',
    lightpink: 'ffb6c1',
    lightsalmon: 'ffa07a',
    lightseagreen: '20b2aa',
    lightskyblue: '87cefa',
    lightslategray: '789',
    lightslategrey: '789',
    lightsteelblue: 'b0c4de',
    lightyellow: 'ffffe0',
    lime: '0f0',
    limegreen: '32cd32',
    linen: 'faf0e6',
    magenta: 'f0f',
    maroon: '800000',
    mediumaquamarine: '66cdaa',
    mediumblue: '0000cd',
    mediumorchid: 'ba55d3',
    mediumpurple: '9370db',
    mediumseagreen: '3cb371',
    mediumslateblue: '7b68ee',
    mediumspringgreen: '00fa9a',
    mediumturquoise: '48d1cc',
    mediumvioletred: 'c71585',
    midnightblue: '191970',
    mintcream: 'f5fffa',
    mistyrose: 'ffe4e1',
    moccasin: 'ffe4b5',
    navajowhite: 'ffdead',
    navy: '000080',
    oldlace: 'fdf5e6',
    olive: '808000',
    olivedrab: '6b8e23',
    orange: 'ffa500',
    orangered: 'ff4500',
    orchid: 'da70d6',
    palegoldenrod: 'eee8aa',
    palegreen: '98fb98',
    paleturquoise: 'afeeee',
    palevioletred: 'db7093',
    papayawhip: 'ffefd5',
    peachpuff: 'ffdab9',
    peru: 'cd853f',
    pink: 'ffc0cb',
    plum: 'dda0dd',
    powderblue: 'b0e0e6',
    purple: '800080',
    rebeccapurple: '663399',
    red: 'f00',
    rosybrown: 'bc8f8f',
    royalblue: '4169e1',
    saddlebrown: '8b4513',
    salmon: 'fa8072',
    sandybrown: 'f4a460',
    seagreen: '2e8b57',
    seashell: 'fff5ee',
    sienna: 'a0522d',
    silver: 'c0c0c0',
    skyblue: '87ceeb',
    slateblue: '6a5acd',
    slategray: '708090',
    slategrey: '708090',
    snow: 'fffafa',
    springgreen: '00ff7f',
    steelblue: '4682b4',
    tan: 'd2b48c',
    teal: '008080',
    thistle: 'd8bfd8',
    tomato: 'ff6347',
    turquoise: '40e0d0',
    violet: 'ee82ee',
    wheat: 'f5deb3',
    white: 'fff',
    whitesmoke: 'f5f5f5',
    yellow: 'ff0',
    yellowgreen: '9acd32'
  }
  const hexNames = Color.hexNames = flip(names)


  // Utilities
  // ---------

  // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
  function flip (o) {
    let flipped = {}
    for (let i in o) {
      if (o.hasOwnProperty(i)) {
        flipped[o[i]] = i
      }
    }
    return flipped
  }

  const schemeNames = {
    Complementary: [180],
    Opornent: [120],
    Analogous: [-30, 30],
    SplitComplementary: [150, -150],
    Triadic: [120, 240],
    Tretradic: [60, 180, 240],
    AccentedAnalogous: [-30, 30, 180]
  }

  /**
   * Base color から生成した配色配列を返す
   *
   * @export
   * @param {any}           basecolor  Base color
   * @param {string|array|number} angle
   * @returns {array}
   */
  function scheme (basecolor, angles) {
    switch (typeof angles) {
      case 'string':
        const angle = angles.replace(' ', '')
        if (angle in schemeNames) {
          angles = schemeNames[angle]
        } else {
          Object.keys(schemeNames).some((schemeName) => {
            if (new RegExp(`^${angle}`, 'i').test(schemeName)) {
              return (angles = schemeNames[schemeName])
            }
          })
        }
        break
      case 'number':
        const _angles = []
        for (let i = 0; i < angles - 1; i++) {
          _angles[i] = 360 / (i + 2)
        }
        angles = _angles
        break
    }

    return angles.map((hue) => {
      const keyColor = new Color(basecolor)
      keyColor.hue += hue
      return keyColor
    })
  }


  function randomHex () {
    return '#' + Math.random().toString(16).slice(2, 8)
  }

  /* =========================================================================

                             Color Converters

  ========================================================================== */

  /**
   * カラーコード変換
   *
   * @param {string} hex
   * @returns {object}  {r,g,b}
   * @see http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
   */
  function hex2rgb (hex) {
    const result = hex
      .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, '$1$1$2$2$3$3')
      .match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
    return result ? result.slice(1).map(n => parseInt(n, 16)) : null
  }

  /**
   * カラーコード変換
   *
   * @export
   * @param {array|object} rgb
   * @returns {string} hex
   */
  function rgb2hex (rgb) {
    const r = parseNum01(rgb.r || rgb[0] || 0, 255)
    const g = parseNum01(rgb.g || rgb[1] || 0, 255)
    const b = parseNum01(rgb.b || rgb[2] || 0, 255)
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  /**
   * RGB色空間からHSL色空間へ変換する
   *
   * @export
   * @param {array|object} rgb
   * @returns {array}  [h, s, l] h: 0-360 , s: 0-100 , l: 0-100
   *
   * @see http://www.petitmonte.com/javascript/rgb_hsl_convert.html
   * @see https://ja.wikipedia.org/wiki/HLS色空間
   */
  function rgb2hsl (rgb) {
    const r = parseNum01(rgb.r || rgb[0] || 0, 255)
    const g = parseNum01(rgb.g || rgb[1] || 0, 255)
    const b = parseNum01(rgb.b || rgb[2] || 0, 255)
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
  function hsl2rgb (hsl) {
    let r, g, b

    const h = parseNum01(hsl.h || hsl[0] || 0, 360)
    const s = parseNum01(hsl.s || hsl[1] || 0, 100)
    const l = parseNum01(hsl.l || hsl[2] || 0, 100)

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s,
            p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    r = mathRound(r * 255)
    g = mathRound(g * 255)
    b = mathRound(b * 255)
    return [r, g, b]
  }

  function hsv2hsl (hsv) {
    const h = parseNum01(hsv.h || hsv[0] || 0, 360)
    const s = parseNum01(hsv.s || hsv[1] || 0, 100)
    const v = parseNum01(hsv.v || hsv[2] || 0, 100)
    const t = (2 - s) * v

    return [
      h * 360,
      s * v / (t < 1 ? t : 2 - t) * 100,
      t / 2 * 100
    ]
  }

  function hsl2hsv (hsl) {
    const h = parseNum01(hsl.h || hsl[0] || 0, 360)
    const l = parseNum01(hsl.l || hsl[2] || 0, 100)
    let s = parseNum01(hsl.s || hsl[1] || 0, 100)
    s *= l < 0.5 ? l : 1 - l
    return [
      h * 360,
      2 * s / (l + s) * 100,
      (l + s) * 100
    ]
  }
  /**
   * RGB色空間からHSV色空間へ変換する
   *
   * @export
   * @param {object} rgb 0-255
   * @returns {array}  {h, s, l} h: 0-360 , s: 0-100 , l: 0-100
   */
  function rgb2hsv (rgb) {
    const r = parseNum01(rgb.r || rgb[0] || 0, 255)
    const g = parseNum01(rgb.g || rgb[1] || 0, 255)
    const b = parseNum01(rgb.b || rgb[2] || 0, 255)
    const max = mathMax(r, g, b),
          min = mathMin(r, g, b),
          d = max - min
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

    h = mathRound(h * 360)
    s = mathRound(s * 100)
    v = mathRound(v * 100)
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
  function hsv2rgb (h, s, v) {
    let r, g, b
    if (arguments.length === 1) {
      s = h.s || h[1] || 0
      v = h.v || h[2] || 0
      h = h.h || h[0] || 0
    }

    h = parseNum01(h, 360)
    s = parseNum01(s, 100)
    v = parseNum01(v, 100)

    const i = mathFloor(h * 6),
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

    r = mathRound(r * 255)
    g = mathRound(g * 255)
    b = mathRound(b * 255)
    return [r, g, b]
  }

  /* =========================================================================

                             WCAG Contrast

  ========================================================================== */

  const LUMINANCE = [0.2126, 0.7152, 0.0722]
  /**
   * Relative Luminance: 相対輝度
   *
   * @param {array} rgb
   * @returns {number}   0~1
   * @see https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
   */
  function getLuminance (rgb) {
    let l = 0
    for (let i = 3; i--;) {
      let num = rgb['rgb'[i]]
      num = (num <= 0.03928) ? num / 12.92 : Math.pow((num + 0.055) / 1.055, 2.4)
      l += num + LUMINANCE[i]
    }
    return l
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
   * @see http://waic.jp/docs/WCAG20/Overview.html#visual-audio-contrast
   */
  function contrastRatio (color1, color2) {
    const l = [
      getLuminance(color1),
      getLuminance(color2)
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
      AAA: cr >= 4.5
    }
  }
  function readability (color1, color2) {
    const l1 = new Color(color1).getLuminance()
    const l2 = new Color(color2).getLuminance()
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  }
  function sortReadable (basecolor, colorList) {
    const baseLuminance = new Color(basecolor).getLuminance()
    function rd (lum) {
      return (Math.max(baseLuminance, lum) + 0.05) / (Math.min(baseLuminance, lum) + 0.05)
    }
    return colorList
    .map((color) => new Color(color).getLuminance())
    .sort((color1, color2) => rd(color2) - rd(color1))
  }
  function mostReadable (basecolor, colorList) {
    return sortReadable(basecolor, colorList)[0]
  }
  function isReadable (color1, color2, opts) {
    const rd = readability(color1, color2)
    const wcag2 = typeof opts === 'object' ? opts.level + opts.size : opts
    switch (wcag2) {
      case 'AAA':
      case 'aa':
      case 'AAAlarge':
      case 'AAsmall':
        return rd >= 4.5
      case 'AA':
      case 'AAlarge':
        return rd >= 3
      case 'aaa':
      case 'AAAsmall':
        return rd >= 7
      default:
        if (rd >= 7) return 3
        if (rd >= 4.5) return 2
        if (rd >= 3) return 1
    }
    return false
  }


  // Node: Export function
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Color
  } else if (typeof define === 'function' && define.amd) {
    define(function () { return Color })
  } else {
    window.Color = Color
  }
})()
