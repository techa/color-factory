<app>
  <div id="colors" ref="colors">
    <!--<input type="text" id="color-name" placeholder="COLOR NAME">-->
    <color-picker size="280" oncolorchange={colorchange} simple=""/>
    <div id="form_add">
      <button id="color_type" onclick={color_typeChange}>{color_type.toUpperCase()}</button>
      <input id="color_hex" ref="color_hex" placeholder="#000000" onsubmit={addCard_btn} oninput={color_hexInput}>
      <button id="add_btn" onclick={addCard_btn}>➕</button>
    </div>

    <div id="pallete">
      <color-tip each={palette}/>
    </div>
    <hr>
    <color-lists/>
  </div>

  <div id="box" ref="box">
    <color-card each={card, i in cards}/>
  </div>

  <context-menu/>

  <script>
    import store from '../store/store.js'
    import tinycolor from 'tinycolor2'
    import {Selectable} from '../mouse.js'

    this.cards = store.cards
    const palette = () => {
      return this.cards.map((arg) => arg).sort((a, b) => {
        return a.color.getLuminance() - b.color.getLuminance()
      }).sort((a, b) => {
        return a.color.toHsl().h - b.color.toHsl().h
      })
    }
    this.palette = palette()
    store.on('cards_changed', (cards) => {
      // this.cards = cards
      this.palette = palette()
      this.update()
    })

    const COLOR_TYPE = ['hex', 'rgb', 'hsl']
    let colortypeindex = 0
    this.color_type = COLOR_TYPE[colortypeindex]
    this.placeholder = ['#000000', 'rgb(0, 0, 0)', 'hsl(0, 0%, 0%)']
    this.color_typeChange = () => {
      ++colortypeindex
      colortypeindex %= COLOR_TYPE.length
      this.color_type = COLOR_TYPE[colortypeindex]

      this.refs.color_hex.value = this.tags['color-picker'].color.toString(this.color_type)
    }

    const validationRegExp = /^(#?[a-f\d]{3}(?:[a-f\d]{3})?)(?:\s*\W?\s(.+))?/i
    this.addCard_btn = () => {
      const text = validationRegExp.exec(this.refs.color_hex.value)
      if (text) {
        store.trigger('add_card', {
          name: (text[2] || '').trim(),
          color: text[1],
        })
        this.refs.color_hex.value = ''
      }
    }
    this.color_hexInput = (e) => {
      const value = this.refs.color_hex.value
      const text = validationRegExp.exec(value)
      if (text) {
        this.tags['color-picker'].color = tinycolor(text[1])
      }
    }

    this.colorchange = (color) => {
      this.refs.color_hex.value = color.toString(this.color_type)
    }

    this.on('mount', () => {
      store.box = this.refs.box
      const bgColor = store.getItem('bgColor') || '#1f2532'
      this.refs.box.style.backgroundColor = bgColor

      store.on('set_bgColor', (color) => {
        const textcolor = tinycolor.mostReadable(color, ['#eee', '#111'])
        this.refs.colors.style.color = textcolor
      })

      store.trigger('set_bgColor', tinycolor(bgColor))

      this.selectable = new Selectable(this.refs.box, {
        filter: '.card',
        selectedClass: 'card_selected',
        tolerance: 'fit',
        start: (e, position) => {
          store.trigger('menu_close')
        },
        selected: (position, indexs) => {
          store.trigger('cards_select', indexs, true)
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
      height: 100vh;
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
      #color_type {
        text-align: center;
        width: 42px;
        height: 42px;
        border-width: 1px 0 1px 1px;
        border-style: solid;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;}
      #color_hex {
        flex: 1 1 auto; /* width: auto; */
        height: 42px;
        padding: 8px 5px;
        border-width: 1px 0 1px 1px;
        border-style: solid;}
      #add_btn {
        width: 42px;
        height: 42px;
        text-align: center;
        border-width: 1px;
        border-style: solid;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;}
  </style>
</app>
