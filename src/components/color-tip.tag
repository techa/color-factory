import store from '../store/store.js'
<color-tip>
  <div class="tip" title={title} style="background-color: {color};"></div>
  <script>
    this.title = this.name + ' : ' + this.color
    const on = 'addEventListener'
    this.on('mount', () => {
      const tip = this.root.getElementsByClassName('tip')[0]
      tip[on]('click', (e) => {
        store.trigger('add_card', Object.assign({}, this._item))
      })
      // tip[on]('dblclick', (e) => {
      //   store.trigger('set_bgColor', this.color)
      // })
      tip[on]('contextmenu', (e) => {
        e.preventDefault()
        store.trigger('menu_open', e, this, true)
      })
    })
  </script>
  <style>
    .tip{
      width: 20px;
      height: 20px;
      margin:0;
      padding:0;
      display:inline-block;
    }
  </style>
</color-tip>
