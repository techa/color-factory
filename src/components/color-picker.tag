<color-picker>
  <div class="color-picker" riot-style="width: {opts.size}px; height: {opts.size}px;">
    <div class="color-wheel">
      <canvas class="wheel-canvas" ref="wheel" width={wheelRadius} height={wheelRadius}></canvas>
      <div class="color-handle" ref="hue_handle"></div>
    </div>

    <div class="color-spectrum" riot-style="{spectrumStyle}">
      <canvas class="spectrum-canvas" ref="spectrum" width={spectrumEdge} height={spectrumEdge}></canvas>
      <div class="color-handle" ref="spectrum_handle"></div>
    </div>

    <div class="color-alpha" if={opts.alpha}></div>
  </div>

  <style>
    .color-picker {
      position: relative;
      padding: 5px;
      text-align: center;
    }
    .color-wheel,
    .color-spectrum {
      /*position: absolute;*/
    }
    .color-spectrum {
      position: absolute;
    }
    .color-handle {
      position: absolute;
      width: 10px;
      height: 10px;
      top: 0;
      left: 0;
      border: 1px solid black;
      border-radius: 5px;
      text-align: left;
      /* 値noneは、要素がマウスイベントのターゲットにならないことを明示することに加え、その代わりにマウスイベントが通過する要素やその配下にあるどんなターゲット要素へも指示はしません。 */
      pointer-events: none;
    }
    .color-handle::before {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      border: 1px solid white;
      border-radius: 4px;
    }
    .color-alpha {
      height: 16px;
      margin: 5px;
      background-color: #fff;
      background-image: linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd),
                        linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd);
      background-size: 8px 8px;
      background-position:0 0, 4px 4px;
      background-repeat: repeat;
    }
  </style>

  <script>
    /* global opts */
    import tinycolor from 'tinycolor2'
    import { MousePosition } from '../mouse.js'

    const size = this.size = opts.size || 300
    const wheelRadius = this.wheelRadius = size - 10
    const wheelWidth = 20
    const center = wheelRadius / 2
    const radius = wheelRadius / 2 - wheelWidth
    const edge = this.spectrumEdge = (radius / Math.sqrt(2) | 0) * 2 - 10
    const boxp = center - edge / 2

    this.spectrumStyle = `width: ${edge}px; height: ${edge}px; left: ${boxp + 5}px; top: ${boxp + 5}px;`

    this.color = opts.color ? tinycolor(opts.color) : tinycolor.random()
    this.textColor = tinycolor.mostReadable(this.color, ['#eee', '#111'])

    const canvases = {
      wheel: {
        positionTest: (position) => {
          const x = center - position.x,
                y = center - position.y,
                r = Math.hypot(x, y)
          return radius <= r && r <= center
        },
        setColor: (position) => {
          const x = center - position.x,
                y = center - position.y

          const hsl = this.color.toHsl()
          const hue = Math.round(Math.atan2(y, x) / Math.PI * 180) - 90
          hsl.h = hue < 0 ? 360 + hue : hue

          this.color = tinycolor(hsl)
          opts.oncolorchange(this.color)
          canvases.wheel.setPosition(hsl.h)

          this.spectrumColor = this.color
          canvases.spectrum.draw()
        },
        setPosition: (hue) => {
          hue = hue == null ? this.color.toHsl().h : hue
          const [mx, my] = positionRd(radius + wheelWidth / 2, hue)
          this.refs.hue_handle.style.left = mx + 'px'
          this.refs.hue_handle.style.top = my  + 'px'
        },
        draw: () => {
          const context = this.refs.wheel.getContext('2d')
          context.clearRect(0, 0, size, size)
          for (let i = 0; i < 360; i++) {
            context.beginPath()

            context.fillStyle = `hsl(${i}, 100%, 50%)`

            context.moveTo(...positionRd(radius, i))
            context.lineTo(...positionRd(center, i))
            context.lineTo(...positionRd(center, i + 1.5))
            context.lineTo(...positionRd(radius, i + 1.5))
            context.closePath()
            context.fill()
          }
        }
      },

      spectrum: {
        positionTest: (position) => {
          const x = position.x,
                y = position.y
          return (edge >= x && x >= 0 && edge >= y && y >= 0)
        },
        setColor: (position) => {
          const x = Math.max(0, Math.min(position.x, edge - 1)),
                y = Math.max(0, Math.min(position.y, edge - 1))

          const [r, g, b] = this.refs.spectrum.getContext('2d').getImageData(x, y, 1, 1).data

          this.color = tinycolor({r, g, b})
          opts.oncolorchange(this.color)
          canvases.spectrum.setPosition()
        },
        setPosition: () => {
          const hsv = this.color.toHsv()
          this.refs.spectrum_handle.style.left = edge * hsv.s - 5 + 'px'
          this.refs.spectrum_handle.style.top = edge - (edge * hsv.v) - 5 + 'px'
        },
        draw: (hue) => {
          const context = this.refs.spectrum.getContext('2d')
          // http://www.html5.jp/canvas/ref.html
          context.clearRect(0, 0, edge, edge)

          context.fillStyle = `hsl(${this.color.toHsl().h | 0}, 100%, 50%)`
          context.fillRect(0, 0, edge, edge)

          const whiteGrd = context.createLinearGradient(0, 0, edge, 0)
          whiteGrd.addColorStop(0.01, 'rgba(255, 255, 255, 1.000)')
          whiteGrd.addColorStop(0.99, 'rgba(255, 255, 255, 0.000)')

          context.fillStyle = whiteGrd
          context.fillRect(0, 0, edge, edge)

          const blackGrd = context.createLinearGradient(0, 0, 0, edge)
          blackGrd.addColorStop(0.01, 'rgba(0, 0, 0, 0.000)')
          blackGrd.addColorStop(0.99, 'rgba(0, 0, 0, 1.000)')

          context.fillStyle = blackGrd
          context.fillRect(0, 0, edge, edge)
        }
      },

      alpha: {
        setColor: (position) => {
          const x = Math.max(0, Math.min(position.x, edge - 1)),
                y = Math.max(0, Math.min(position.y, edge - 1))

          const [r, g, b] = this.refs.spectrum.getContext('2d').getImageData(x, y, 1, 1).data

          this.color = tinycolor({r, g, b})
          opts.oncolorchange(this.color)
          canvases.spectrum.setPosition()
        },
      }
    }

    // update oncolorchange
    this.on('update', () => {
      this.color = opts.color ? tinycolor(opts.color) : tinycolor.random()
      this.textColor = tinycolor.mostReadable(this.color, ['#eee', '#111'])
      canvases.spectrum.draw()
      canvases.spectrum.setPosition()
      canvases.wheel.setPosition()
    })

    this.on('mount', () => {
      // picker
      ;['wheel', 'spectrum'].forEach((type) => {
        const canvas = canvases[type]
        canvas.draw()
        canvas.setPosition()

        return new MousePosition(this.refs[type], {
          start: (e, position) => {
            if (canvas.positionTest(position)) {
              canvas.setColor(position)
            }
          },
          drag: (e, position) => {
            canvas.setColor(position)
          },
        })
      })
    }) // on mount

    function positionRd (r, deg) {
      const d = (deg - 90) / 180 * Math.PI
      return [
        Math.floor((center + r * Math.cos(d)) * 100) / 100,
        Math.floor((center + r * Math.sin(d)) * 100) / 100,
      ]
    }
  </script>
</color-picker>
