<context-menu>
  <div id="menu" ref="menu" show={mode}>
    <p class="menuitem" onclick={addCard} if={mode == 'tip'}>ADD CARD</p>
    <p class="menuitem" onclick={removeCard} if={mode == 'card'}>DELETE</p>
    <p class="menuitem" onclick={duplicateCard} if={mode == 'card'}>DUPLICATE</p>
    <p class="menuitem" onclick={setBgColor}>SET BACKGROUND</p>
    <p class="menuitem">
      <span>COPY:</span>
      <span each={key in copys} class="menuitem" onclick={copyColor}>{key}</span>
    </p>
    <p class="menuitem" if={mode == 'card'}>
      <span>SIZE:</span>
      <span each={key in sizes} class="menuitem" onclick={setSize}>{key}</span>
    </p>
  </div>

  <script>
    import store from '../store/store.js'

    /**
     * クリップボードコピー関数
     *
     * @export
     * @param {string} textVal
     * @returns {boolean}
     */
    function copyTextToClipboard (textVal) {
      // テキストエリアを用意する
      const copyFrom = document.createElement('textarea')
      // テキストエリアへ値をセット
      copyFrom.textContent = textVal

      // bodyタグの要素を取得
      const bodyElm = document.getElementsByTagName('body')[0]
      // 子要素にテキストエリアを配置
      bodyElm.appendChild(copyFrom)

      // テキストエリアの値を選択
      copyFrom.select()
      // コピーコマンド発行
      const retVal = document.execCommand('copy')
      // 追加テキストエリアを削除
      bodyElm.removeChild(copyFrom)

      return retVal
    }

    this.mode = false

    let activeCard

    this.addCard = () => {
      store.trigger('add_card', activeCard)
    }
    this.removeCard = () => {
      const selectElements = this.parent.selectable.selectElements
      if (selectElements.length) {
        store.cards.forEach((card, i) => {
          if (card.selected) {
            store.trigger('remove_card', i)
          }
        })
        selectElements.length = 0
      } else {
        store.trigger('remove_card', activeCard.i)
      }
    }
    this.duplicateCard = () => {
      store.trigger('duplicate_card', activeCard.i)
    }
    this.setBgColor = () => {
      store.trigger('set_bgColor', activeCard.color)
    }

    this.copys = 'HEX,RGB,HSL'.split(',')

    this.copyColor = (e) => {
      const key = e.target.textContent.toLowerCase()
      copyTextToClipboard(activeCard.color[key])
    }

    this.sizes = [120, 240, 360]

    this.setSize = (e) => {
      store.trigger('set_card_size', activeCard.i, +e.target.textContent)
      activeCard.rectSetter()
    }


    const menuHide = (e) => {
      store.trigger('menu_close')
    }
    store.on('menu_close', (e) => {
      this.mode = false
      this.update()
    })

    store.on('menu_open', (e, card, mode) => {
      this.refs.menu.style.left = e.clientX + 'px'
      this.refs.menu.style.top = e.clientY + 'px'

      activeCard = card

      // 'tip' or 'card'
      this.mode = mode

      window.addEventListener('blur', menuHide)
      document.addEventListener('click', menuHide)
      this.update()
    })
  </script>

  <style>
    #menu {
      position: absolute;
      font-size:12px;
      background: #fff;
      border: solid 1px silver;
      z-index: 100;
    }
    .menuitem {
      min-width: 100px;
      padding: 4px;
      margin: 0;
    }
    .menuitem:hover, .menuitem:active {
      background: aquamarine;
    }
    .menuitem .menuitem:hover {
      font-weight: bold;
    }
  </style>
</context-menu>
