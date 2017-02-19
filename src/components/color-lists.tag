<color-lists>
  <div class="wrapper">
    <select name="colorlists" id="colorlists" onchange={colorListLord}>
      <option value="webcolor">Web Color</option>
      <option value="jiscolor_ja">JIS JA</option>
      <option value="jiscolor_en">JIS EN</option>
      <option value="materialcolor">GOOGLE MATERIAL</option>
      <option value="pantone_coated">PANTONE COATED</option>
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
    import {webcolor}      from '../constants/webcolor'
    import {jiscolor_en}   from '../constants/jiscolor_en'
    import {jiscolor_ja}   from '../constants/jiscolor_ja'
    import {materialcolor} from '../constants/materialcolor'
    const colorlists = {
      webcolor: webcolor.map(val => ({
        name: val[1],
        color: val[0]
      })),
      jiscolor_en: jiscolor_en.map(val => ({
        name: val[1],
        color: val[0]
      })),
      jiscolor_ja: jiscolor_ja.map(val => ({
        name: `${val[1]}\n(${val[2]})`,
        color: val[0]
      })),
      materialcolor: materialcolor.map(val => ({
        name: `${val[1]}\n(${val[2]})`,
        color: val[0]
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
      /*height: 117px;*/
    }
    .list {
      height: 100%;
      overflow-y: scroll;
    }
  </style>
</color-lists>
