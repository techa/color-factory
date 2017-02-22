<color-card>
  <div class="card animated bounceIn" ref="card"
    riot-style="background-color: {color}; color: {textColor}; width: {width}px; height: {height}px; left: {x}px; top: {y}px; z-index: {+card.zIndex};">
    <div class="cardtext"><b>{name}</b><br>{color}</div>
  </div>
  <script>
    import store     from '../store/store.js'
    import {Movable} from '../mouse.js'
    import {contrastColors} from '../Color.js'

    this.width = 120
    this.height = 120
    Object.assign(this, this.card)

    this.textColor = contrastColors(this.color, '#eee', '#111')[0]

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
      if (init && (+this.card.x < colorsWidth || !this.card.y)) {
        // random positions
        this.x = snap((maxW - colorsWidth) * Math.random() + colorsWidth)
        this.y = snap((maxH) * Math.random())
      } else {
        this.x = Math.min(Math.max(colorsWidth, this.card.x), maxW)
        this.y = Math.min(Math.max(0, this.card.y), maxH)
      }
      card.style.left = this.x + 'px'
      card.style.top  = this.y + 'px'
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

          store.trigger('card_forward', this.i)
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
          this.x = x
          this.y = y
          store.trigger('card_moved', this.i, x, y)
        },
        click: (e, position, el) => {
          this.parent.selectable.select(this.i)
        },
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
