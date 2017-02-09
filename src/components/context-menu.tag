<context-menu>
  <div id="menu" ref="menu" show={isTipMenuOpen || isCardMenuOpen}>
    <p class="menuitem" onclick={addCard} show={isTipMenuOpen}>ADD CARD</p>
    <p class="menuitem" onclick={removeCard} show={isCardMenuOpen}>DELETE</p>
    <p class="menuitem" onclick={duplicateCard} show={isCardMenuOpen}>DUPLICATE</p>
    <p class="menuitem" onclick={setBgColor}>SET BACKGROUND</p>
    <p class="menuitem" onclick={copyHex}>COPY HEX</p>
    <p class="menuitem" onclick={copyRgb}>COPY RGB</p>
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

    this.isCardMenuOpen = false
    this.isTipMenuOpen = false

    let activeCard

    this.addCard = () => {
      store.trigger('add_card', activeCard)
    }
    this.removeCard = () => {
      if (this.parent.selecting_cardsIndexs.length) {
        this.parent.selecting_cardsIndexs.forEach((index) => {
          store.trigger('remove_card', index)
        })
      } else store.trigger('remove_card')
      // store.trigger('remove_card')
    }
    this.duplicateCard = () => {
      store.trigger('duplicate_card')
    }
    this.setBgColor = () => {
      store.trigger('set_bgColor', activeCard.color)
    }
    this.copyHex = () => {
      copyTextToClipboard(activeCard.color)
    }
    this.copyRgb = () => {
      copyTextToClipboard(activeCard.color.rgb)
    }

    const menuHide = (e) => {
      store.trigger('menu_close')
    }
    store.on('menu_close', (e) => {
      this.isCardMenuOpen = false
      this.isTipMenuOpen = false
      this.update()
    })

    store.on('menu_open', (e, card, tip) => {
      this.refs.menu.style.left = e.clientX + 'px'
      this.refs.menu.style.top = e.clientY + 'px'

      activeCard = card

      if (tip) {
        this.isTipMenuOpen = true
      } else {
        this.isCardMenuOpen = true
      }

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
    }
    .menuitem {
      min-width: 100px;
      padding: 4px;
      margin: 0;
    }
    .menuitem:hover, .menuitem:active {
      background: aquamarine;
    }
  </style>
</context-menu>
