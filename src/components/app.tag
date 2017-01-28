import store from '../store/store.js'
import Color from '../Color.js'
<app>
  <div id="colors">
    <!--<input type="text" id="color-name" placeholder="COLOR NAME">-->
    <div id="form_add">
      <input id="color_hex" placeholder="#000000, Black" onsubmit={addCard_btn}>
      <button id="add_btn" onclick={addCard_btn}>➕</button>
    </div>

    <div id="pallete">
      <color-tip each={palette}/>
    </div>

    <color-lists/>
  </div>

  <div id="box">
    <color-card each={card, i in cards}/>
  </div>

  <context-menu/>

  <script>
    this.cards = store.cards
    const palette = () => {
      return this.cards.map((arg) => arg).sort((a, b) => {
        return a.color.lightness - b.color.lightness
      }).sort((a, b) => {
        return a.color.hue - b.color.hue
      })
    }
    this.palette = palette()
    store.on('cards_changed', (cards) => {
      this.cards = cards
      this.palette = palette()
      this.update()
    })

    this.addCard_btn = () => {
      const text = /^(#?(?:[a-f\d]{3}|[a-f\d]{6}))(?:\s*\W\s*(.+))/i.exec(this.color_hex.value)
      if (text) {
        store.trigger('add_card', {
          name: (text[2] || '').trim(),
          color: new Color(text[1])
        })
        this.color_hex.value = ''
      }
    }

    this.on('mount', ()=> {
      const box = store.box = document.getElementById('box')
      const bgColor = store.getItem('bgColor') || '#1f2532'
      this.box.style.backgroundColor = bgColor

      store.on('set_bgColor', (color) => {
        const textcolor = color.lightness < 35 ? '#eee' : '#111'
        this.colors.style.color = textcolor
        // this['color-name'].style.borderColor = color
      })

      store.trigger('set_bgColor', new Color(bgColor))

      $(box).selectable({
        appendTo: '#box',
        filter: '.card',
        classes: {
          'ui-selected': 'card_selected'
        },
        start: ( e, ui ) => {
          store.trigger('menu_close')
          $('.card_selected').removeClass('card_selected')
        },
        unselected: ( e, ui ) => {
          console.log('ddddddddddddd')
          $('.card_selected').removeClass('card_selected')
          // store.trigger('menu_close')
        },
      })
    })
  </script>
  <style>
    .ui-selectable-helper {
      position: absolute;
      z-index: 100;
      border: 1px dotted black;
    }
    #colors {
      width: 320px;
      position: absolute;
      margin:0;
      padding: 20px;
      top:0;
      left:0;
    }
    #box {
      width: 100%;
      height: 100%;
      background: #1f2532;
    }
    #form_add {
      margin: 10px 0;
      /*font-size: 16px;*/
      display: flex;
      flex-direction: row;}
      #color_hex {
        flex: 1 1 auto; /* width: auto; */
        height: 42px;
        padding: 8px 5px;
        border-width: 1px 0 1px 1px;
        border-style: solid;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;}
      #add_btn {
        height: 42px;
        text-align: center;
        border-width: 1px;
        border-style: solid;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;}
  </style>
</app>
