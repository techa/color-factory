<color-card>
  <div class="card animated bounceIn" ref="card"
    riot-style="{colorstyle} width: {width}px; height: {height}px; left: {left}px; top: {top}px; z-index: {+card.zIndex};">
    <div class="cardtext">
      <span><b>{name}</b></span><br>
      <span>{color}</span><br>
      <span>{color.toHslString()}</span><br>
      <span>{contrast}</span>
    </div>
  </div>
  <script>
    import store     from '../store.js'
    import {Movable} from '../mouse.js'
    import tinycolor from 'tinycolor2'

    this.width = 120
    this.height = 120
    Object.assign(this, this.card)


    const getContrast = (color) => {
      return Math.round(tinycolor.readability(tinycolor(color), this.color) * 10) / 10
    }
    store.on('bgColor.set_bgColor', (color) => {
      this.contrast  = getContrast(color)
      this.update()
    })
    this.contrast  = getContrast(store.get('bgColor'))

    this.textColor = tinycolor.mostReadable(this.color, ['#eee', '#111'])

    this.modeChange = () => {
      this.mode = !this.mode
      if (this.mode) {
        this.colorstyle = `background-color: transparent; color: ${this.color};`
      } else {
        this.colorstyle = `background-color: ${this.color}; color: ${this.textColor};`
      }
      this.update()
    }
    this.colorstyle = `background-color: ${this.color}; color: ${this.textColor};`

    function snap (n, grid = 5) {
      return Math.round(n / grid) * grid
    }

    const colorsWidth = 320

    this.rectSetter = (init) => {
      this.width = this.card.width || 120
      this.height = this.card.height || 120

      const rect = this.parent.refs.box.getBoundingClientRect()
      const maxW = rect.width - this.width
      const maxH = rect.height - this.height

      const card = this.refs.card
      if (init && (+this.card.left < colorsWidth || !this.card.top)) {
        // random positions
        this.left = snap(((maxW - colorsWidth) * Math.random()) + colorsWidth)
        this.top = snap((maxH) * Math.random())
      } else {
        this.left = Math.min(Math.max(colorsWidth, this.card.left), maxW)
        this.top = Math.min(Math.max(0, this.card.top), maxH)
      }
      card.style.left = this.left + 'px'
      card.style.top  = this.top + 'px'
    }

    // only once
    this.one('update', () => {
      this.refs.card.classList.remove('animated', 'bounceIn')
    })

    store.on('remove_card_animation', (index, cb) => {
      let timer
      if (this.i === index) {
        this.refs.card.classList.add('animated', 'bounceOut')
        const style = window.getComputedStyle(this.refs.card)
        const delay = parseFloat(style.animationDuration) + parseFloat(style.animationDelay)
        timer = setTimeout(() => {
          cb()
          clearTimeout(timer)
        }, delay * 1000 | 0)
      }
    })

    this.on('mount', () => {
      const card = this.refs.card
      this.rectSetter(true)

      let cards, cardRects

      this.movable = new Movable(card, {
        containment: this.parent.refs.box,
        grid: 5,
        axis: 'shift',
        start: (e, position) => {
          e.stopPropagation()

          store.trigger('menu_close')
          store.trigger('cards.CARD_FORWARD', this.i, false)

          if (card.classList.contains('card_selected')) {
            cards = this.parent.selectable.selectElements
          } else {
            this.parent.selectable.unselectAll()
            cards = []
          }
          cardRects = cards.map((el) => el.getBoundingClientRect())
        },
        drag: (e, position, el) => {
          cards.forEach((cardEl, i) => {
            if (card !== cardEl) {
              const cardRect = cardRects[i]
              cardEl.style.left = position.adjust(cardRect.left + position.vectorX, 'width', cardRect) + 'px'
              cardEl.style.top  = position.adjust(cardRect.top  + position.vectorY, 'height', cardRect) + 'px'
            }
          })
        },
        stop: (e, position, el) => {
          let x = position.left
          let y = position.top
          if (x < colorsWidth) {
            x = position.left = position.startLeft
            y = position.top  = position.startTop
          }
          position.setPosition(e)
          this.left = x
          this.top = y
          store.trigger('cards.TRANSLATE_CARD', this.i, x, y)
        },
        // click: (e, position, el) => {
        //   // store.memo('cards')
        //   store.trigger('cards.TRANSLATE_CARD', this.i, parseInt(card.style.left), parseInt(card.style.top))
        //   // this.parent.selectable.select(this.i)
        // },
      })

      card.addEventListener('contextmenu', (e) => {
        // デフォルトイベントをキャンセル
        // これを書くことでコンテキストメニューが表示されなくなります
        e.preventDefault()
        store.trigger('menu_open', e, this, 'card')
      }, false)
    })
  </script>
  <style>
    .card {
      position: absolute;
      text-align:center;
      font-size:12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card.card_selected {
      outline: 1px dashed black;
      box-shadow: 0 0 0 1px white;
    }
    .card.active {
      z-index: 100;
    }
    .cardtext {
      white-space: pre-wrap;
      user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
    }
  </style>
</color-card>
