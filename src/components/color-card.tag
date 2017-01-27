import store from '../store/store.js'
<color-card>
  <div class="card" style="background-color: {color};">
    <span class="cardtext"><b>{name}</b><br>{color}</span>
  </div>
  <script>
    Object.assign(this, this.card)

    const on = 'addEventListener'

    this.on('mount', ()=> {
      const card = this.root.getElementsByClassName('card')[0]
      const rect = this.rect =  this.box.getBoundingClientRect()

      const grid = 5
      function snap (n) {
        return Math.round(n / grid) * grid
      }

      let beforePositionX = card.style.left = snap(this.x || ((rect.width - 100 - 320) * Math.random() + 320)) + 'px'
      let beforePositionY = card.style.top = snap(this.y || ((rect.height - 100) * Math.random())) + 'px'

      if (this.color.lightness < 40) {
        card.style.color = '#eee'
      }

      movable(card, {
        parent: this.box,
        grid,
        onDragStart: (x, y) => {
          beforePositionX = x
          beforePositionY = y
          store.trigger('card_forward', this.i)
        },
        onDrag: (x, y) => {
          this.x = x
          this.y = y
        },
        onDragEnd: (x, y) => {
          if (x < 320) {
            x = beforePositionX
            y = beforePositionY
          }
          store.trigger('card_moved', x, y)
          return [x, y]
        },
      })

      card[on]('dblclick', (e) => {
        store.trigger('set_bgColor', this.color)
      })
      card[on]('contextmenu', (e) => {
        // デフォルトイベントをキャンセル
        // これを書くことでコンテキストメニューが表示されなくなります
        e.preventDefault()
        store.trigger('menu_open', e, this)
      })
    })
  </script>
  <style>
    .card {
      position: absolute;
      width: 100px;
      height: 100px;
      margin: auto;
      text-align:center;
      font-size:12px;
      background: #323a45;
    }
    .card.active {
      z-index: 100;
    }
    .cardtext {
      width: 100px;
      height: 100px;
      vertical-align:middle;
      white-space: pre-wrap;
      /* http://qiita.com/sawadays0118/items/4c329fd05cdff14ffebc
      ブロック要素には vertical-align:middle;が効かないのでtable-cellを使うが、
      table, inline-table, table-cell, table-row, table-row-group）において、min-height,max-heightは効かないのが仕様
        */
      display: table-cell;
    }
  </style>
</color-card>
