class PopupExtension {
    constructor(runtime) {
      this.runtime = runtime;
      // 現在の設定
      this.popupStyle = {
        backgroundColor: '#333333',
        textColor:      '#ffffff',
        fontSize:       '16px',
        position:       'top-right'
      };
      // デフォルト設定
      this.defaultStyle = { ...this.popupStyle };
    }
  
    getInfo() {
      return {
        id: 'popupExtension',
        name: 'カスタマイズポップアップ',
        blocks: [
          {
            opcode: 'setBackgroundColor',
            blockType: Scratch.BlockType.COMMAND,
            text: '背景色を[COLOR]にする',
            arguments: {
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#333333'
              }
            }
          },
          {
            opcode: 'setTextColor',
            blockType: Scratch.BlockType.COMMAND,
            text: 'テキストの色を[COLOR]にする',
            arguments: {
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ffffff'
              }
            }
          },
          {
            opcode: 'setFontSize',
            blockType: Scratch.BlockType.COMMAND,
            text: 'フォントサイズを[SIZE]にする',
            arguments: {
              SIZE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '16px'
              }
            }
          },
          {
            opcode: 'FontSizeGuide',
            blockType: Scratch.BlockType.LABEL,
            text: '⚠フォントサイズにはpxをつけてください'
          },
          {
            opcode: 'setPopupPosition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'ポップアップの位置を[POSITION]にする',
            arguments: {
              POSITION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'positionMenu',
                defaultValue: 'top-right'
              }
            }
          },
          {
            opcode: 'saveAsDefault',
            blockType: Scratch.BlockType.COMMAND,
            text: '現在のスタイルをデフォルトにする'
          },
          {
            opcode: 'resetToDefault',
            blockType: Scratch.BlockType.COMMAND,
            text: 'スタイルをデフォルトに戻す'
          },
          {
            opcode: 'showPopup',
            blockType: Scratch.BlockType.COMMAND,
            text: '内容を[TXT]にしてポップアップを表示　[HIDE]消す',
            arguments: {
              TXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World!'
              },
              HIDE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'hideOptionMenu',
                defaultValue: 'click'
              }
            }
          }
        ],
        menus: {
          positionMenu: {
            acceptReporters: false,
            items: [
              { text: '左上',   value: 'top-left' },
              { text: '右上',   value: 'top-right' },
              { text: '左下',   value: 'bottom-left' },
              { text: '右下',   value: 'bottom-right' },
              { text: '中央',   value: 'center' }
            ]
          },
          hideOptionMenu: {
            acceptReporters: false,
            items: [
              { text: 'クリックされたとき', value: 'click' },
              { text: '1秒たったとき',   value: '1s'    },
              { text: '3秒たったとき',   value: '3s'    },
              { text: '5秒たったとき',   value: '5s'    }
            ]
          }
        }
      };
    }
  
    // 各設定メソッド
    setBackgroundColor(args) {
      this.popupStyle.backgroundColor = args.COLOR;
    }
    setTextColor(args) {
      this.popupStyle.textColor = args.COLOR;
    }
    setFontSize(args) {
      this.popupStyle.fontSize = args.SIZE;
    }
    setPopupPosition(args) {
      this.popupStyle.position = args.POSITION;
    }
  
    // デフォルト設定の保存・復元
    saveAsDefault() {
      this.defaultStyle = { ...this.popupStyle };
    }
    resetToDefault() {
      this.popupStyle = { ...this.defaultStyle };
    }
  
    // ポップアップ表示
    showPopup(args) {
      const popup = document.createElement('div');
      popup.textContent = args.TXT;
  
      // 共通スタイル
      popup.style.position        = 'fixed';
      popup.style.backgroundColor = this.popupStyle.backgroundColor;
      popup.style.color           = this.popupStyle.textColor;
      popup.style.fontSize        = this.popupStyle.fontSize;
      popup.style.padding         = '10px 20px';
      popup.style.borderRadius    = '5px';
      popup.style.zIndex          = '9999';
      popup.style.boxShadow       = '0 4px 6px rgba(0,0,0,0.5)';
  
      // 位置設定
      switch (this.popupStyle.position) {
        case 'top-left':
          popup.style.top  = '20px';
          popup.style.left = '20px';
          break;
        case 'top-right':
          popup.style.top   = '20px';
          popup.style.right = '20px';
          break;
        case 'bottom-left':
          popup.style.bottom = '20px';
          popup.style.left   = '20px';
          break;
        case 'bottom-right':
          popup.style.bottom = '20px';
          popup.style.right  = '20px';
          break;
        case 'center':
          popup.style.top       = '50%';
          popup.style.left      = '50%';
          popup.style.transform = 'translate(-50%, -50%)';
          break;
      }
  
      document.body.appendChild(popup);
  
      // 非表示タイミング
      const hideOpt = args.HIDE;
      if (hideOpt === 'click') {
        popup.onclick = () => popup.remove();
      } else {
        let ms = { '1s': 1000, '3s': 3000, '5s': 5000 }[hideOpt] || 0;
        setTimeout(() => popup.remove(), ms);
      }
    }
  }
  
  // 拡張機能として登録
  Scratch.extensions.register(new PopupExtension());
  