<color-card>
  <div class="card" ref="card">
    <div class="card_inner" riot-style="background-color: {color}; color: {textColor};">
      <span class="cardtext"><b>{name}</b><br>{color}</span>
    </div>
  </div>
  <script>
    import store     from '../store/store.js'
    import {movable} from '../movable.js'
    import {contrastColors} from '../Color.js'
    Object.assign(this, this.card)
    this.textColor = contrastColors(this.color, '#eee', '#111')[0]

    this.on('mount', () => {
      const card = this.refs.card
      let rect = this.parent.refs.box.getBoundingClientRect()

      const grid = 5
      function snap (n) {
        return Math.round(n / grid) * grid
      }

      card.style.left = snap(this.x || ((rect.width - 120 - 320) * Math.random() + 320)) + 'px'
      card.style.top  = snap(this.y || ((rect.height - 120) * Math.random())) + 'px'

      movable(card, {
        containment: this.parent.refs.box,
        grid,
        start: (e, position, el) => {
          store.trigger('card_forward', this.i)
        },
        stop: (e, position, el) => {
          let x = position.left
          let y = position.top
          if (x < 320) {
            x = position.left = position.startLeft
            y = position.top  = position.startTop
          }
          position.setPosition()
          store.trigger('card_moved', x, y)
        }
      })

      card.addEventListener('contextmenu', (e) => {
        // デフォルトイベントをキャンセル
        // これを書くことでコンテキストメニューが表示されなくなります
        e.preventDefault()
        store.trigger('menu_open', e, this)
      }, false)
    })
  </script>
  <style>
    .card {
      position: absolute;
      width: 120px;
      height: 120px;
      border-width: 2px;
      border-color: transparent;
      border-style: dashed;
    }
    .card.card_selected {
      background-color: black;
      border-color: white;
    }
    .card_inner {
      width: 116px;
      height: 116px;
      margin: auto;
      text-align:center;
      font-size:12px;
    }
    .card.active {
      z-index: 100;
    }
    .cardtext {
      width: 116px;
      height: 116px;
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
