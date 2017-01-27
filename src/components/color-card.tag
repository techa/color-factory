import store from '../store/store.js'
<color-card>
  <div class="card">
    <div class="card_inner" style="background-color: {color}; color: {color.lightness < 40 ? '#eee': '#111'};">
      <span class="cardtext"><b>{name}</b><br>{color}</span>
    </div>
  </div>
  <script>
    Object.assign(this, this.card)

    this.on('mount', ()=> {
      const card = $(this.root.getElementsByClassName('card')[0])
      let rect = this.rect =  this.box.getBoundingClientRect()

      const grid = 5
      function snap (n) {
        return Math.round(n / grid) * grid
      }

      let beforePositionX = snap(this.x || ((rect.width - 120 - 320) * Math.random() + 320))
      let beforePositionY = snap(this.y || ((rect.height - 120) * Math.random()))

      card.css({
        left: beforePositionX,
        top: beforePositionY,
      }).draggable({
        grid: [ 5, 5 ],
        containment:  this.root.parentElement,
        start: (e, ui) => {
          beforePositionX = ui.position.left
          beforePositionY = ui.position.top
          rect =  this.box.getBoundingClientRect()
          store.trigger('card_forward', this.i)
        },
        drag: (e, ui) => {
          ui.position.left = ui.position.left
          ui.position.top = ui.position.top
        },
        stop: (e, ui) => {
          let x = ui.position.left
          let y = ui.position.top
          if (x < 320) {
            x = ui.position.left = beforePositionX
            y = ui.position.top = beforePositionY
          }
          this.x = x
          this.y = y
          card.css(ui.position)
          store.trigger('card_moved', x, y)
        },
      }).on('click', (e) => {
        store.trigger('menu_close')
        store.trigger('card_forward', this.i)
      }).on('dblclick', (e) => {
        store.trigger('set_bgColor', this.color)
      }).on('contextmenu', (e) => {
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
      /* http://qiita.com/sawadays0118/items/4c329fd05cdff14ffebc
      ブロック要素には vertical-align:middle;が効かないのでtable-cellを使うが、
      table, inline-table, table-cell, table-row, table-row-group）において、min-height,max-heightは効かないのが仕様
        */
      display: table-cell;
    }
  </style>
</color-card>
