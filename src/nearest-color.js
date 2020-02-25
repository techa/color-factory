
/**
 * Search nearest color
 *
 * @see https://github.com/dtao/nearest-color
 *
 * @typedef {{r number,g number,b number}} Rgb
 * @typedef {{ name: string, hex: string, luminance: number, rgb: Rgb }} Data
 * @param {Color} main
 * @param {Array<Data>} colors fetch('https://api.color.pizza/v1/')
 * @returns {{ name, hex, rgb, distance }}
 */
export default function nearestColor (main, colors) {
  const color = main.rgb().object()

  let distance
  let minDistance = Infinity
  let rgb
  let value

  for (let i = 0; i < colors.length; ++i) {
    rgb = colors[i].rgb

    distance = (
      (color.r - rgb.r) ** 2 +
      (color.g - rgb.g) ** 2 +
      (color.b - rgb.b) ** 2
    )

    if (distance < minDistance) {
      minDistance = distance
      value = colors[i]
    }
  }

  return {
    name: value.name,
    hex: value.hex,
    rgb: value.rgb,
    distance: Math.sqrt(minDistance),
  }
}
