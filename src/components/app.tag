<app>
  <div id="colors" ref="colors">
    <!--<input type="text" id="color-name" placeholder="COLOR NAME">-->
    <color-wheel size="280" oncolorchange={colorchange} simple=""/>
    <div id="form_add">
      <input id="color_hex" ref="color_hex" placeholder="#000000, Black" onsubmit={addCard_btn} oninput={color_hexInput}>
      <button id="add_btn" onclick={addCard_btn}>➕</button>
    </div>

    <div id="pallete">
      <color-tip each={palette}/>
    </div>

    <color-lists/>
  </div>

  <div id="box" ref="box">
    <color-card each={card, i in cards}/>
  </div>

  <context-menu/>

  <script>
    import store from '../store/store.js'
    import Color from '../Color.js'
    import {Selectable} from '../mouse.js'

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

    const validationRegExp = /^(#?[a-f\d]{3}(?:[a-f\d]{3})?)(?:\s*\W?\s(.+))?/i
    this.addCard_btn = () => {
      const text = validationRegExp.exec(this.refs.color_hex.value)
      if (text) {
        store.trigger('add_card', {
          name: (text[2] || '').trim(),
          color: new Color(text[1]),
        })
        this.refs.color_hex.value = ''
      }
    }
    this.color_hexInput = (e) => {
      const value = this.refs.color_hex.value
      const text = validationRegExp.exec(value)
      if (text) {
        this.tags['color-wheel'].color = new Color(text[1])
      }
    }

    this.colorchange = (color) => {
      this.refs.color_hex.value = color.hex + ' ' + color.getNearWebColor(20)
    }

    this.on('mount', () => {
      store.box = this.refs.box
      const bgColor = store.getItem('bgColor') || '#1f2532'
      this.refs.box.style.backgroundColor = bgColor

      store.on('set_bgColor', (color) => {
        const textcolor = color.lightness < 35 ? '#eee' : '#111'
        this.refs.colors.style.color = textcolor
      })

      store.trigger('set_bgColor', new Color(bgColor))

      this.selectable = new Selectable(this.refs.box, {
        filter: '.card',
        selectedClass: 'card_selected',
        tolerance: 'fit',
        start: (e, position) => {
          store.trigger('menu_close')
        },
        selecting: (e, position, el, index) => {
          store.trigger('card_select', index, true)
        },
        unselecting: (e, position, el, index) => {
          store.trigger('card_select', index, false)
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
