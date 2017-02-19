<color-card>
  <div class="card" ref="card"
  riot-style="background-color: {color}; color: {textColor}; width: {width}px; height: {height}px;">
    <span class="cardtext"><b>{name}</b><br>{color}</span>
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

    this.rectSetter = (init) => {
      this.width = this.card.width || 120
      this.height = this.card.height || 120

      const rect = this.parent.refs.box.getBoundingClientRect()
      const maxW = rect.width - this.width
      const maxH = rect.height - this.height

      const card = this.refs.card
      if (init && (this.card.x < 320 || !this.card.y)) {
        // random positions
        card.style.left = snap((maxW - 320) * Math.random() + 320) + 'px'
        card.style.top  = snap((maxH) * Math.random()) + 'px'
      } else {
        card.style.left = Math.min(Math.max(320, this.card.x), maxW) + 'px'
        card.style.top = Math.min(Math.max(0, this.card.y), maxH) + 'px'
      }
    }

    this.on('update', () => {
      this.rectSetter()
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
          if (x < 320) {
            x = position.left = position.startLeft
            y = position.top  = position.startTop
          }
          position.setPosition(e)
          store.trigger('card_moved', x, y)
        },
        click: (e, position, el) => {
          this.parent.selectable.select(store.cards.length - 1)
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
    }
    .card.card_selected {
      outline: 1px dashed black;
      box-shadow: 0 0 0 1px white;
    }
    .card.active {
      z-index: 100;
    }
    .cardtext {
      width: inherit;
      height: inherit;
      margin: auto;
      vertical-align:middle;
      white-space: pre-wrap;
      user-select: none;
      -ms-user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      /* http://qiita.com/sawadays0118/items/4c329fd05cdff14ffebc
      ブロック要素には vertical-align:middle;が効かないのでtable-cellを使うが、
      table, inline-table, table-cell, table-row, table-row-group）において、min-height,max-heightは効かないのが仕様
        */
      display: table-cell;
    }
  </style>
</color-card>
