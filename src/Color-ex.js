import Color from 'color'
Color.prototype.toJSON = function () {
  return this[this.model]().object()
}

Color.prototype.toString = function (mode) {
  // console.log('mode', mode)
  const color = this.alpha(Math.round(this.valpha * 100) / 100)
  switch (mode) {
    case 'hex':
      return color.hex()
    case 'rgb':
    case 'hsl':
      return color[mode]().string(0)
    case 'hsv':
      const {h, s, v} = color.hsv().round().object()
      if (color.valpha !== 1) {
        return `hsva(${h}, ${s}%, ${v}%, ${color.valpha})`
      }
      return `hsv(${h}, ${s}%, ${v}%)`
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
  let lum1 = bgColor.luminosity()
  let lum2 = txtColor.luminosity()

  if (lum1 > lum2) [lum1, lum2] = [lum2, lum1]
  return (lum2 + 0.05) / (lum1 + 0.05)
}

Color.prototype.mostReadable = function (...colors) {
  let mostlum = 0
  let mostread
  for (const color of colors) {
    const cntrast = this.contrast(Color(color))
    if (mostlum < cntrast) {
      mostlum = cntrast
      mostread = color
    }
  }
  return mostread
}
Color.random = function () {
  return Color('#' + Math.random().toString(16).slice(2, 8))
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
  return Color(colors
    .map((color) => Color(color).rgb().array())
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
