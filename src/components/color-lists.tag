<color-tip class="tip">
  <div class="tip" title={title} riot-style="background-color: {color};"></div>
  <script>
    this.title = this.name + ' : ' + this.color
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

<color-lists>
  <div class="wrapper">
    <select name="colorlists" id="colorlists" onchange={colorListLord}>
      <option each={colorlistData} value={name}>{name}</option>
    </select>
    <div class="scrollbar-wrapper">
      <div class="scrollbar-body">
        <div ref="colortips" class="scrollbar-content">
          <color-tip each={colorlists}/>
        </div>
      </div>
    </div>
  </div>
  <script>
    import store from '../store/store.js'
    import tinycolor from 'tinycolor2'
    import WEBCOLOR      from '../constants/webcolor.json'
    import JISCOLOR_EN   from '../constants/jiscolor_en.json'
    import JISCOLOR_JA   from '../constants/jiscolor_ja.json'
    import MATERIALCOLOR from '../constants/materialcolor.json'
    import RALCOLOUR     from '../constants/ralcolour.json'
    import GOE_COATED     from '../constants/goe-coated.json'
    import GOE_UNCOATED   from '../constants/goe-uncoated.json'
    import SOLID_COATED   from '../constants/solid-coated.json'
    import SOLID_UNCOATED from '../constants/solid-uncoated.json'

    function parser (list, temp) {
      return Object.keys(list).map(key => ({
        name: temp ? temp(key, list[key]) : key,
        color: list[key][0]
      }))
    }
    function pantone (list) {
      return Object.keys(list).map(key => ({
        name: `${key}`,
        color: list[key]
      }))
    }
    this.colorlistData = [
      { name: 'Web Color',
        list: parser(WEBCOLOR) },
      { name: 'JIS EN',
        list: parser(JISCOLOR_EN) },
      { name: 'JIS JA',
        list: parser(JISCOLOR_JA) },
      { name: 'GOOGLE MATERIAL',
        list: Object.keys(MATERIALCOLOR).reduce((ary, key) => {
          MATERIALCOLOR[key].forEach((color, i) => {
            let name = key
            if (i === 0)      name += 50
            else if (i < 10)  name += i * 100
            else if (i >= 10) name += ['A100', 'A200', 'A400', 'A700'][i % 10]
            ary.push({name, color})
          })
          return ary
        }, []) },
      { name: 'RAL',
        list: parser(RALCOLOUR) },
      { name: 'PANTONE® Goe™ Coated',
        list: pantone(GOE_COATED) },
      { name: 'PANTONE® Goe™ Uncoated',
        list: pantone(GOE_UNCOATED) },
      { name: 'PANTONE® solid Coated',
        list: pantone(SOLID_COATED) },
      { name: 'PANTONE® solid Uncoated',
        list: pantone(SOLID_UNCOATED) },
    ]

    this.colorlists = this.colorlistData[0].list

    this.colorListLord = (e) => {
      this.colorlists = this.colorlistData.find(({name}) => name === e.target.value).list
    }

    this.on('mount', () => {
      this.refs.colortips.addEventListener('click', (e) => {
        const el = e.target
        if (el.classList.contains('tip')) {
          const [name, color] = el.title.split(' : ')
          store.trigger('add_card', {name, color})
        }
      })
      this.refs.colortips.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        const el = e.target
        if (el.classList.contains('tip')) {
          const [name, color] = el.title.split(' : ')
          store.trigger('menu_open', e, {name, color: tinycolor(color)}, 'tip')
        }
      })
    })
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
    .wrapper {
      position: relative;
      height: calc(100% - 420px);
      margin: 0;
    }
    .scrollbar-wrapper {
      position: relative;
      height: 100%;
      overflow: hidden;
    }
    .scrollbar-body {
      /* scrillbarの幅17px分余分にとることでバーを隠す */
      width: calc(100% + 17px);
      height: 100%;
      /*height: inherit;*/
      overflow-y: scroll;
    }
    .scrollbar-content {
      /* 中身のmarginを含めたサイズを取得するのために必要 */
      /*overflow-y: auto;*/
      display: flex;
      flex-wrap: wrap;
    }
  </style>
</color-lists>
