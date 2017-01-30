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
    <div each={btns} class="color-wheel-btn color-wheel-{className}" ref={className} riot-style="{style} color:{color2}; border-color:{color2}; background-color:{color};" onclick={click}>
      <div class="color-wheel-text">{text}</div>
    </div>
    <div class="color-wheel-handle" ref="handle"></div>
  </div>

  <style>
    .color-wheel {
      position: relative;
      padding: 5px;
      text-align: center;
    }
    .color-wheel-handle {
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
    .color-wheel-center {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
    .color-wheel-text {
      user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      pointer-events: none;
      opacity: 0.6;
    }
    .color-wheel-text.active,
    .color-wheel-btn.active,
    .color-wheel-btn.active .color-wheel-text,
    .color-wheel-btn:hover {
      font-weight: bold;
      opacity: 1;
    }
  </style>

  <script>
    const size = this.size = opts.size - 10 || 300
    const center = size / 2
    const radius = Math.round(center / 3)
    const centerDiameter = radius * 2 -10
    this.centerRadius = `width: ${centerDiameter}px; height: ${centerDiameter}px;border-radius: ${centerDiameter}px; font-size: ${centerDiameter / 5}px; `

    this.color = new Color()
    this.color2 = this.color.l < 45 ? '#eee' : '#111'

    this.mode = 'hue'
    this.submode = 'saturation'

    const btnstyle = `width: ${radius}px; height: ${radius}px; line-height: ${radius}px; border-radius: ${radius / 2}px; font-size: ${radius / 2}px; `
    const btnModeChange = (e) => {
      this.mode = this.mode === this.submode ? 'hue' : this.submode
      e.target.classList.toggle('active')
      this.canvasDraw()
    }
    this.btns = [
      {
        className: 'saturation',
        style: btnstyle + `top: 0; left: 0;`,
        text: 'S',
        click: (e) => {
          this.submode = 'saturation'
          btnModeChange(e)
          this.refs.lightness.classList.remove('active')
        }
      },
      {
        className: 'lightness',
        style: btnstyle + `top: 0; right: 0;`,
        text: 'L',
        click: (e) => {
          this.submode = 'lightness'
          btnModeChange(e)
          this.refs.saturation.classList.remove('active')
        }
      },
      {
        className: 'minus',
        style: btnstyle + `bottom: 0; left: 0;`,
        text: '➖',
        mdown: (e) => {
          --this.color[this.mode]
          opts.oncolorchange(this.color)
        }
      },
      {
        className: 'plus',
        style: btnstyle + `bottom: 0; right: 0;`,
        text: '➕',
        mdown: (e) => {
          ++this.color[this.mode]
          opts.oncolorchange(this.color)
        }
      },
    ]

    // update mount
    const handleSetPosition = () => {
      const [mx, my] = positionRd(radius, this.color.hue)
      const [x, y] = positionRd(this.color[this.submode] * (center - radius) / 100, this.color.hue)
      this.refs.handle.style.left = mx + x - center + 'px'
      this.refs.handle.style.top = my + y - center + 'px'
    }
    // picker mousePosition
    const handleSetColor = (position) => {
      const deg = angle(position.x, position.y)
      const r = Math.hypot(size / 2 - position.x, size / 2 - position.y)
      const percent = Math.round((r - radius) / (center - radius) * 100)

      this.color.hue = deg
      this.color[this.submode] = percent
      this.update()
    }

    let grad, saturation, lightness, canvas
    this.on('update', () => {
      this.color2 = this.color.l < 45 ? '#eee' : '#111'
      handleSetPosition()
    })
    this.on('mount', () => {
      canvas = this.refs.canvas.getContext('2d')
      this.canvasDraw()
      handleSetPosition()

      // picker
      mousePosition({
        containment: this.refs.canvas,
        start: (e, position) => {
          handleSetColor(position)
        },
        drag: (e, position) => {
          handleSetColor(position)
        },
      })

      // + - btn
      let time
      this.btns.slice(2).forEach((data) => {
        const el = this.refs[data.className]
        function mup (e) {
          clearInterval(time)
          time = false
          eventRegister(el, false, 'mouseup touchcancel touchend', mup)
        }
        eventRegister(el, true, 'mousedown touchstart', (e) => {
          e.stopPropagation()
          time = setInterval(data.mdown.bind(el, e), 80)
          eventRegister(el, true, 'mouseup touchcancel touchend', mup)
        })
      })
    }) // on mount

    function angle (x, y) {
      return Math.round(Math.atan2(size / 2 - y, size / 2 - x) / Math.PI * 180) - 90
    }
    function positionRd (r, deg) {
      const d = (deg - 90) / 180 * Math.PI
      return [
        Math.floor((center + r * Math.cos(d)) * 100) / 100,
        Math.floor((center + r * Math.sin(d)) * 100) / 100,
      ]
    }
    this.canvasDraw = () => {
      switch (this.submode) {
        case 'saturation':
          saturation = [0, 50, 100]
          lightness = [50, 50, 50]
          // lightness = Array(3).fill(this.color.l)
          break
        case 'lightness':
          saturation = [100, 100, 100]
          // saturation = Array(3).fill(this.color.s)
          lightness = [0, 50, 100]
          break
      }

      // http://www.html5.jp/canvas/ref.html
      canvas.clearRect(0, 0, size, size)

      for (let i = 0; i < 360; i++) {
        canvas.beginPath()
        grad  = canvas.createLinearGradient(...positionRd(radius, i), ...positionRd(center, i))

        ;[0, 0.5, 1].forEach((direction, j) => {
          grad.addColorStop(direction, `hsl(${i}, ${saturation[j]}%, ${lightness[j]}%)`)
        })
        canvas.fillStyle = grad

        canvas.moveTo(...positionRd(radius, i))
        canvas.lineTo(...positionRd(center, i))
        canvas.lineTo(...positionRd(center, i + 1.5))
        canvas.lineTo(...positionRd(radius, i + 1.5))
        canvas.closePath()
        canvas.fill()
      }
    }
  </script>
</color-wheel>
