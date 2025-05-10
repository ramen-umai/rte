// converter.js

class TextConverter {
    getInfo() {
      return {
        id: 'textconverter',
        name: 'Converter',
        blocks: [
          {
            opcode: 'convertCase',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TXT] を [CASE] に変換',
            arguments: {
              TXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello world'
              },
              CASE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'caseMenu'
              }
            }
          },
          {
            opcode: 'reverseText',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TXT] を逆順に',
            arguments: {
              TXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            opcode: 'encodeText',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TXT] を [ENCODETYPE] に変換',
            arguments: {
              TXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              },
              ENCODETYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'encodeMenu'
              }
            }
          },
          {
            opcode: 'decodeText',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TXT] を [DECODETYPE] から復元',
            arguments: {
              TXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'aGVsbG8='
              },
              DECODETYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'encodeMenu'
              }
            }
          },
          {
            opcode: 'toDataURL',
            blockType: Scratch.BlockType.REPORTER,
            text: '[URL] を [MIMETYPE] のDataURLに変換',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/image.png'
              },
              MIMETYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'mimeMenu'
              }
            }
          }
        ],
        menus: {
          caseMenu: {
            acceptReporters: true,
            items: [
              '大文字',
              '小文字',
              '通常',
              'タイトルケース'
            ]
          },
          encodeMenu: {
            acceptReporters: true,
            items: [
              'Base64',
              'DataURL'
            ]
          },
          mimeMenu: {
            acceptReporters: true,
            items: [
              'text/plain',
              'text/javascript',
              'application/json',
              'image/png',
              'image/jpeg',
              'image/svg+xml'
            ]
          }
        }
      };
    }
  
    convertCase(args) {
      const txt = args.TXT;
      const mode = args.CASE;
      if (typeof txt !== 'string') return '';
      switch (mode) {
        case '大文字':
          return txt.toUpperCase();
        case '小文字':
          return txt.toLowerCase();
        case '通常':
          return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
        case 'タイトルケース':
          return txt.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        default:
          return txt;
      }
    }
  
    reverseText(args) {
      const txt = args.TXT;
      if (typeof txt !== 'string') return '';
      return txt.split('').reverse().join('');
    }
  
    encodeText(args) {
      const txt = args.TXT;
      const type = args.ENCODETYPE;
      if (typeof txt !== 'string') return '';
      try {
        switch (type) {
          case 'Base64':
            return btoa(unescape(encodeURIComponent(txt)));
          case 'DataURL': {
            const base64 = btoa(unescape(encodeURIComponent(txt)));
            return `data:text/plain;base64,${base64}`;
          }
          default:
            return txt;
        }
      } catch (e) {
        return `${type}変換失敗`;
      }
    }
  
    decodeText(args) {
      const txt = args.TXT;
      const type = args.DECODETYPE;
      if (typeof txt !== 'string') return '';
      try {
        switch (type) {
          case 'Base64':
            return decodeURIComponent(escape(atob(txt)));
          case 'DataURL': {
            const match = txt.match(/^data:.*;base64,(.*)$/);
            if (match && match[1]) {
              return decodeURIComponent(escape(atob(match[1])));
            } else {
              return 'DataURL形式無効';
            }
          }
          default:
            return txt;
        }
      } catch (e) {
        return `${type}復元失敗`;
      }
    }
  
    toDataURL(args) {
      const url = args.URL;
      const mime = args.MIMETYPE;
      return new Promise(resolve => {
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })
          .catch(() => resolve('DataURL変換失敗'));
      });
    }
  }
  
  Scratch.extensions.register(new TextConverter());
  