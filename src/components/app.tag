<app>
  <div id="colors" ref="colors">
    <!--<input type="text" id="color-name" placeholder="COLOR NAME">-->
    <color-picker color={color} size="280" oncolorchange={colorchange} simple=""/>
    <div id="form_add">
      <button id="color_type" onclick={color_typeChange}>{color_type.toUpperCase()}</button>
      <input id="color_hex" ref="color_hex" placeholder={placeholder} onsubmit={addCard_btn} oninput={color_hexInput}>
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
    /* global opts */
    import store from '../store.js'
    import tinycolor from 'tinycolor2'
    import {Selectable} from '../mouse.js'

    this.cards = opts.cards
    const palette = () => {
      return this.cards.map((arg) => arg).sort((a, b) => {
        return a.color.getLuminance() - b.color.getLuminance()
      }).sort((a, b) => {
        return a.color.toHsl().h - b.color.toHsl().h
      })
    }

    store.subscribe(() => {
      // console.log('subscribe.cards')
      this.cards = store.cards
      // this.palette = palette()
      this.update()
    })

    this.color = tinycolor.random()

    const COLOR_TYPE = ['hex', 'rgb', 'hsl']
    let colortypeindex = 0
    this.color_type = COLOR_TYPE[colortypeindex]
    const placeholder = ['#000000', 'rgb(0, 0, 0)', 'hsl(0, 0%, 0%)']
    this.placeholder = placeholder[colortypeindex]

    this.color_typeChange = () => {
      ++colortypeindex
      colortypeindex %= COLOR_TYPE.length
      this.color_type = COLOR_TYPE[colortypeindex]
      this.placeholder = placeholder[colortypeindex]

      this.refs.color_hex.value = this.color.toString(this.color_type)
    }

    // ぱ
    function colorKeyUpDown (e) {
      const newcolor = tinycolor(this.refs.color_hex.value)
      if (newcolor.isValid() && e.keyCode === 'Arrowup ArrowDown') {
        const value = e.target.value
        const selection = window.getSelection()
        const range = selection.getRangeAt(0)
        if (range.collapsed) {
          const val = value
          // TODO
        }
      }
    }


    this.addCard_btn = () => {
      const newcolor = tinycolor(this.refs.color_hex.value)

      if (newcolor.isValid()) {
        store.trigger('cards.ADD_CARD', {
          name: '',
          color: newcolor,
        })
        this.refs.color_hex.value = ''
      }
    }

    let typing
    this.color_hexInput = (e) => {
      const newcolor = tinycolor(this.refs.color_hex.value)
      if (newcolor.isValid()) {
        typing = setTimeout(() => {
          this.color = newcolor
          this.update()
          clearTimeout(typing)
          typing = null
        }, 300)
      }
    }

    this.colorchange = (color) => {
      this.refs.color_hex.value = color.toString(this.color_type)
      this.refs.color_hex.style.color = tinycolor.mostReadable(color, ['#eee', '#111'])
      this.refs.color_hex.style.backgroundColor = color.toString('hex')
    }

    this.on('mount', () => {
      store.box = this.refs.box
      const bgColor = store.get('bgColor')

      this.colorchange(this.color)

      store.on('bgColor.set_bgColor', (color) => {
        const textcolor = tinycolor.mostReadable(color, ['#eee', '#111'])
        this.refs.colors.style.color = textcolor
        this.refs.box.style.backgroundColor = color
      })

      store.trigger('bgColor.set_bgColor', tinycolor(bgColor))

      this.selectable = new Selectable(this.refs.box, {
        filter: '.card',
        selectedClass: 'card_selected',
        tolerance: 'fit',
        start: (e, position) => {
          store.trigger('menu_close')
        },
        selected: (position, indexs) => {
          store.trigger('cards.SELECT_CARDS', indexs)
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
