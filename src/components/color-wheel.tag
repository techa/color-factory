import Color from '../Color.js'
import {mousePosition, eventRegister} from '../movable.js'
<color-wheel>
  <div class="color-wheel" riot-style="width: {opts.size}px; height: {opts.size}px;">
    <canvas class="color-wheel-canvas" ref="canvas" width={size} height={size}></canvas>
    <button class="color-wheel-center" riot-style="{centerRadius} background-color: {color}; color:{color2};">
      <div class="color-wheel-text {active: mode == 'hue'}">{color.h}</div>
      <div class="color-wheel-text {active: mode == 'saturation'}">{color.s}%</div>
      <div class="color-wheel-text {active: mode == 'lightness'}">{color.l}%</div>
    </button>
    <button each={btns} class="color-wheel-btn color-wheel-{className}" ref={className} riot-style="{style} color:{color2}; border-color:{color2}; background-color:{color};" onclick={click}>
      <div class="color-wheel-btn-text">{text}</div>
    </button>
    <div class="color-wheel-handle"></div>
  </div>

  <style>
    .color-wheel {
      position: relative;
      padding: 5px;
    }
    .color-wheel-handle {
      position: absolute;
    }
    .color-wheel-handle {
      position: absolute;
      width: 10px;
      height: 10px;
      top: 0;
      left: 0;
      border: 1px solid black;
      border-radius: 5px;
    }
    .color-wheel-handle::before {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      border: 1px solid white;
      border-radius: 4px;
    }
    .color-wheel-btn {
      position: absolute;
      /*display: flex;
      justify-content: center;
      align-items: center;*/
      border-width: 1px;
      border-style: solid;
      text-align:center;
      opacity: 0.6;
      /*display: table-cell;
      vertical-align: middle;*/
    }
    .color-wheel-btn.active,
    .color-wheel-btn:hover {
      font-weight: bold;
      opacity: 1;
    }
    .color-wheel-center {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
    .color-wheel-text {
      opacity: 0.6;
    }
    .color-wheel-text.active {
      font-weight: bold;
      opacity: 1;
    }
  </style>

  <script>
    const size = this.size = opts.size - 10 || 300
    const center = size / 2
    const radius = Math.round(center / 3)
    const centerRadius = radius * 2 -10
    this.centerRadius = `width: ${centerRadius}px; height: ${centerRadius}px;border-radius: ${centerRadius}px; font-size: ${centerRadius / 5}px; `

    this.color = new Color()
    this.color2 = this.color.l < 45 ? '#eee' : '#111'

    this.mode = 'hue'

    const btnstyle = `width: ${radius}px; height: ${radius}px; border-radius: ${radius / 2}px;`
    this.btns = [
      {
        className: 'saturation',
        style: btnstyle + `top: 0; left: 0;`,
        text: 'S',
        click: (e) => {
          this.mode = this.mode === 'saturation' ? 'hue' : 'saturation'
          e.target.classList.toggle('active')
          this.refs.lightness.classList.remove('active')
          this.canvasDraw(this.mode === 'hue' ? this.mode + 'saturation' : this.mode)
        }
      },
      {
        className: 'lightness',
        style: btnstyle + `top: 0; right: 0;`,
        text: 'L',
        click: (e) => {
          this.mode = this.mode === 'lightness' ? 'hue' : 'lightness'
          e.target.classList.toggle('active')
          this.refs.saturation.classList.remove('active')
          this.canvasDraw(this.mode === 'hue' ? this.mode + 'lightness' : this.mode)
        }
      },
      {
        className: 'minus',
        style: btnstyle + `bottom: 0; left: 0;`,
        text: '➖',
        click: () => {
          --this.color[this.mode]
          opts.oncolorchange(this.color)
        }
      },
      {
        className: 'plus',
        style: btnstyle + `bottom: 0; right: 0;`,
        text: '➕',
        click: () => {
          ++this.color[this.mode]
          opts.oncolorchange(this.color)
        }
      },
    ]

    let grad, saturation, lightness, canvas
    this.on('update', () => {
      this.color2 = this.color.l < 45 ? '#eee' : '#111'
    })
    this.on('mount', () => {
      canvas = this.refs.canvas.getContext('2d')
      this.canvasDraw()
      mousePosition(this.refs.canvas)

      this.btns.slice(2).forEach((data) => {
        const el = this.refs[data.className]
        let time
        function mdown (e) {
          time = setInterval(data.click, 100)
          eventRegister(el, true, mup, 'mouseup', 'touchcancel', 'touchend')
        }
        function mup (e) {
          clearInterval(time)
          time = false
          eventRegister(el, false, mup, 'mouseup', 'touchcancel', 'touchend')
        }
        eventRegister(el, true, mdown, 'mousedown', 'touchstart')
      })
    })


    function angle (x, y) {
      let deg = Math.round(Math.atan2(center - y, center - x) / Math.PI * 180 - 90)
      if (deg < 0) {
        deg += 360
      }
      return deg
    }
    function position (r, deg) {
      const d = (deg - 90) / 180 * Math.PI
      return [
        Math.floor((center + r * Math.cos(d)) * 100) / 100,
        Math.floor((center + r * Math.sin(d)) * 100) / 100,
      ]
    }
    this.canvasDraw = (mode) => {
      switch (mode) {
        case 'saturation':
          saturation = [0, 50, 100]
          lightness = Array(3).fill(this.color.l)
          break
        case 'lightness':
          saturation = Array(3).fill(this.color.s)
          lightness = [0, 50, 100]
          break
        case 'huesaturation':
          saturation = [0, 50, 100]
          lightness = [50, 50, 50]
          break
        case 'huelightness':
          saturation = [100, 100, 100]
          lightness = [0, 50, 100]
          break
        default:
          saturation = saturation || [100, 100, 100]
          lightness = lightness || [0, 50, 100]
          break
      }

      // http://www.html5.jp/canvas/ref.html
      canvas.clearRect(0, 0, size, size)

      for (let i = 0; i < 360; i++) {
        canvas.beginPath()
        grad  = canvas.createLinearGradient(...position(radius, i), ...position(center, i))

        ;[0, 0.5, 1].forEach((direction, j) => {
          grad.addColorStop(direction, `hsl(${i}, ${saturation[j]}%, ${lightness[j]}%)`)
        })
        canvas.fillStyle = grad

        canvas.moveTo(...position(radius, i))
        canvas.lineTo(...position(center, i))
        canvas.lineTo(...position(center, i + 1.5))
        canvas.lineTo(...position(radius, i + 1.5))
        canvas.closePath()
        canvas.fill()
      }
    }
  </script>
</color-wheel>
