<color-input>
  <div id="form_add">
    <button id="color_type" onclick={color_typeChange}>{color_type.toUpperCase()}</button>
    <input id="color_hex" ref="color_hex" placeholder="#000000" onsubmit={addCard_btn} oninput={color_hexInput}>
    <button id="add_btn" onclick={addCard_btn}>➕</button>
  </div>
  <script>
    import store from '../store/store.js'
    import Color from '../Color.js'
    function regReplace (main, obj) {
      let source = main.source
      for (let key in obj) {
        const objsource = obj[key].source
        source = source.replace(new RegExp(key, 'g'), objsource)
      }
      return new RegExp(source, main.toString().match(/[gimuy]*$/)[0])
    }
    regReplace(/rgb\(ff, ff, ff\)|hsl\(hue, per, per\)/, {
      ff: /(25[0-5]|2[0-4]\d|1\d\d|\d?\d)/, // 0~255
      hue: /((?:3[0-5]|[12]\d|\d?)\d)/, // 0~359
      per: /(100|\d?\d)%/, // 0%~100%
      ' ': /\s*/,
    })
    this.types = [
      { type: 'hex',
        parser: /^(#(?:[a-f\d]{3}){1,2})/i,
        placeholder: '#000000' },
      { type: 'rgb(0, 0, 0)',
        parser: /^rgb\((25[0-5]|2[0-4]\d|1\d\d|\d?\d), (25[0-5]|2[0-4]\d|1\d\d|\d?\d), (25[0-5]|2[0-4]\d|1\d\d|\d?\d)\)/,
        placeholder: '#000000' },
      { type: 'hsl',
        parser: /^hsl\((3[0-5]|[12]\d|\d?)\d, (100|\d?\d)%, (100|\d?\d)%\)/,
        placeholder: '#000000' },
    ]
    const COLOR_TYPE = ['hex', 'rgb', 'hsl']
    let colortypeindex = 0
    this.color_type = COLOR_TYPE[colortypeindex]
    this.placeholder = ['#000000', 'rgb(0, 0, 0)', 'hsl(0, 0%, 0%)']
    this.color_typeChange = () => {
      ++colortypeindex
      colortypeindex %= COLOR_TYPE.length
      this.color_type = COLOR_TYPE[colortypeindex]

      this.refs.color_hex.value = this.tags['color-wheel'].color[this.color_type]
    }
    const validationRegExp = /^(#?[a-f\d]{3}(?:[a-f\d]{3})?)/i
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
      this.refs.color_hex.value = color[this.color_type]
    }
  </script>
  <style>
    #form_add {
      margin: 10px 0;
      /*font-size: 16px;*/
      display: flex;
      flex-direction: row;}
      #color_type {
        text-align: center;
        width: 45px;
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
        height: 42px;
        text-align: center;
        border-width: 1px;
        border-style: solid;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;}
  </style>
</color-input>
