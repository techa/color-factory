<color-lists>
  <select name="colorlists" id="colorlists" onchange={colorListLord}>
    <option value="webcolor">Web Color</option>
    <option value="jiscolor_ja">JIS JA</option>
    <option value="jiscolor_en">JIS EN</option>
    <option value="materialcolor">GOOGLE MATERIAL</option>
  </select>
  <color-tip each={colorlists}/>
  <script>
    import Color           from '../Color.js'
    import {webcolor}      from '../constants/webcolor'
    import {jiscolor_en}   from '../constants/jiscolor_en'
    import {jiscolor_ja}   from '../constants/jiscolor_ja'
    import {materialcolor} from '../constants/materialcolor'
    const colorlists = {
      webcolor: webcolor.map(val => ({
        name: val[1],
        color: new Color(val[0])
      })),
      jiscolor_en: jiscolor_en.map(val => ({
        name: val[1],
        color: new Color(val[0])
      })),
      jiscolor_ja: jiscolor_ja.map(val => ({
        name: `${val[1]}\n(${val[2]})`,
        color: new Color(val[0])
      })),
      materialcolor: materialcolor.map(val => ({
        name: val[1],
        color: new Color(val[0])
      })),
    }

    this.colorlists = colorlists.webcolor

    this.colorListLord = (e) => {
      this.colorlists = colorlists[e.target.value]
    }
  </script>
  <style>
    #colorlists {
      width: 280px;
      font-size: 20px;
      margin: 10px 0;
      display: block;
    }
    #colorlists option {
      background: #fff;
      color: #111;
    }
    #colorlists option:hover {
      background: aquamarine;
    }
  </style>
</color-lists>
