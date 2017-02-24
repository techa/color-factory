<color-wheel>
  <div class="color-wheel" riot-style="width: {opts.size}px; height: {opts.size}px;">
    <canvas class="color-wheel-canvas" ref="canvas" width={size} height={size}></canvas>
    <button class="color-wheel-center" riot-style="{centerDiameter} background-color: {color}; color:{textColor};" onclick={centerClick}>
      <div class="color-wheel-text {active: mode == 'hue'}">{color.toHsl().h | 0}</div>
      <div class="color-wheel-text {active: mode == 'saturation'}">{color.toHsl().s * 100 | 0}%</div>
      <div class="color-wheel-text {active: mode == 'lightness'}">{color.toHsl().l * 100 | 0}%</div>
    </button>
    <div each={btns} class="color-wheel-btn color-wheel-{className}" ref={className} riot-style="{style} color:{textColor}; border-color:{color2}; background-color:{color};" onclick={click}>
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
      opacity: 0.8;
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
    /* global opts */
    // import Color, {contrastColors} from '../Color.js'
    import tinycolor from 'tinycolor2'
    import {MousePosition, on, off} from '../mouse.js'
    const size = this.size = opts.size - 10 || 300
    const center = size / 2
    const radius = Math.round(center / 3)
    const centerDiameter = radius * 2 - 10
    this.centerDiameter = `width: ${centerDiameter}px; height: ${centerDiameter}px;border-radius: ${centerDiameter}px; font-size: ${centerDiameter / 5}px; `

    this.color = opts.color ? tinycolor(opts.color) : tinycolor.random()
    this.textColor = this.color.getLuminance() < 0.5 ? '#eee' : '#111'

    this.centerClick = (e) => {
      if (!opts.simple) {
        this.color = tinycolor.random()
        opts.oncolorchange(this.color)
      } else {
        btnModeChange(this.wheelmode === 'saturation' ? 'lightness' : 'saturation')
      }
    }

    this.mode = ''
    this.wheelmode = 'saturation'

    const btnstyle = (r) => {
      return `width: ${r}px; height: ${r}px; line-height: ${r}px; border-radius: ${r / 2}px; font-size: ${r / 2}px; `
    }
    const btnModeChange = (mode) => {
      if (mode === 'hue') return
      const wheelmode = mode === 'saturation' ? 'lightness' : 'saturation'
      if (!opts.simple) {
        this.refs[mode].classList.add('active')
        this.refs[wheelmode].classList.remove('active')
      }
      if (this.wheelmode !== mode) {
        this.wheelmode = mode
        this.canvasDraw()
      }
    }

    this.btns = []
    if (!opts.simple) {
      this.btns = [
        {
          className: 'saturation',
          style: btnstyle(radius) + `top: 0; left: 0;`,
          text: 'S',
          click: (e) => {
            btnModeChange('saturation')
          }
        },
        {
          className: 'lightness',
          style: btnstyle(radius) + `top: 0; right: 0;`,
          text: 'L',
          click: (e) => {
            btnModeChange('lightness')
          }
        },
      ]
      ;['hue', 'hue-30', 'hue-60', 'saturation', 'lightness'].forEach((key, i) => {
        const [mode, number] = key.split('-')
        const y = mode === 'hue' ? 'bottom' : 'top'
        const radiusby = key === 'hue' ? 1 : 0.6

        const btnAdd = (pm, text, by) => {
          const xy = [0, 0]
          let x = (+number)
          ? pm === 'minus'        ? 'left' : 'right'
          : mode === 'saturation' ? 'left' : 'right'
          if (!+number && mode === 'hue' && pm === 'minus') {
            x = 'left'
          }
          if (number === '30' || (mode !== 'hue' && pm === 'plus')) {
            xy[0] = radius
          }
          if (number === '60' || (mode !== 'hue' && pm === 'minus')) {
            xy[1] = radius
          }
          this.btns.push({
            className: pm + '-' + key,
            style: btnstyle(radius * radiusby) + `${x}: ${xy[0]}px; ${y}: ${xy[1]}px;`,
            text:  number || text,
            mdown: (e) => {
              const num = (number || 1) * by
              switch (mode) {
                case 'hue':
                  this.color.spin(num)
                  break
                case 'saturation':
                  this.color.saturate(num)
                  break
                case 'lightness':
                  this.color.lighten(num)
                  break
              }
              this.mode = mode
              btnModeChange(mode)
              opts.oncolorchange(this.color)
              this.update()
            }
          })
        }
        btnAdd('minus', '➖', -1)
        btnAdd('plus', '➕', 1)
      })
    }

    // use update mount
    const handleSetPosition = () => {
      const hsl = this.color.toHsl()
      const [mx, my] = positionRd(radius, hsl.h)
      const [x, y] = positionRd(hsl[this.wheelmode[0]] * (center - radius), hsl.h)
      this.refs.handle.style.left = mx + x - center + 'px'
      this.refs.handle.style.top = my + y - center + 'px'
    }
    // picker mousePosition
    const handleSetColor = (position, start) => {
      const x = center - position.x,
            y = center - position.y,
            r = Math.hypot(x, y)

      // 円の外をクリックしたとき
      if (start && (r - center) > 10) return

      const hsl = this.color.toHsl()
      const hue = Math.round(Math.atan2(y, x) / Math.PI * 180) - 90
      hsl.h = hue < 0 ? 360 + hue : hue
      hsl[this.wheelmode[0]] = (r - radius) / (center - radius)

      this.color = tinycolor(hsl)
      opts.oncolorchange(this.color)
      this.update()
    }

    // update oncolorchange
    let grad, saturation, lightness, canvas
    this.on('update', () => {
      this.textColor =  this.color.getLuminance() < 0.5 ? '#eee' : '#111'
      handleSetPosition()
    })
    this.on('mount', () => {
      if (!opts.simple) this.refs[this.wheelmode].classList.add('active')
      canvas = this.refs.canvas.getContext('2d')
      this.canvasDraw()
      handleSetPosition()

      // picker
      this.mousePosition = new MousePosition({
        containment: this.refs.canvas,
        start: (e, position) => {
          handleSetColor(position, true)
        },
        drag: (e, position) => {
          handleSetColor(position)
        },
      })

      // + - btn
      let time
      this.btns.slice(2).forEach((data) => {
        const el = this.refs[data.className]
        const mup = (e) => {
          clearInterval(time)
          time = false
          this.mode = ''
          this.update()
          off(el, 'mouseup touchcancel touchend', mup)
        }
        on(el, 'mousedown touchstart', (e) => {
          const cb = data.mdown.bind(el, e)
          cb()
          e.stopPropagation()
          time = setTimeout(() => {
            clearTimeout(time)
            time = setInterval(cb, 100)
          }, 300)
          on(el, 'mouseup touchcancel touchend', mup)
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
    this.canvasDraw = () => {
      switch (this.wheelmode) {
        case 'saturation':
          saturation = [0, 50, 100]
          lightness = [50, 50, 50]
          break
        case 'lightness':
          saturation = [100, 100, 100]
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
