class OpenUrlExtension {
    getInfo() {
      return {
        id: 'openurl',
        name: 'URL',
        color1: '#ff6347',
        color2: '#ffa07a',
        blocks: [
          {
            opcode: 'description',
            blockType: Scratch.BlockType.LABEL,
            text: 'URL短縮はTinyURLを使用しています。'
          },
          {
            opcode: 'shorten',
            blockType: Scratch.BlockType.REPORTER,
            text: '[URL] を短縮',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://ramen-umai.github.io/turbowarp-Expansions/'
              }
            }
          },
          {
            opcode: 'openUrl',
            blockType: Scratch.BlockType.COMMAND,
            text: 'URL [URL] を [TARGET] で開く',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://ramen-umai.github.io/turbowarp-Expansions/'
              },
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'targetMenu'
              }
            }
          },
          {
            opcode: 'urlSound',
            blockType: Scratch.BlockType.COMMAND,
            text: 'URL [URL] から音をならす',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://ramen-umai.github.io/turbowarp-Expansions/sound.wav'
              }
            }
          },
          {
            opcode: 'showQR',
            blockType: Scratch.BlockType.COMMAND,
            text: 'URL[URL]からQRコードを [FORMAT] 形式でサイズ [SIZEY]x[SIZEX]で[TUB] に表示',
            arguments: {
              FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'formatMenu'
              },
              SIZEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '200'
              },
              SIZEX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '200'
              },
              TUB: {
                type: Scratch.ArgumentType.STRING,
                menu: 'targetMenu'
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://ramen-umai.github.io/turbowarp-Expansions/'
              }
            }
          }        
        ],
        menus: {
          targetMenu: {
            acceptReporters: false,
            items: [
              { text: '新しいタブ', value: '_blank' },
              { text: '同じタブ', value: '_self' }
            ]
          },
          formatMenu: {
            acceptReporters: false,
            items: [
              { text: 'SVG', value: 'svg' },
              { text: 'PNG', value: 'png' }
            ]
          }
        }
      };
    }
  
    async shorten(args) {
      const originalURL = encodeURIComponent(args.URL);
      try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${originalURL}`);
        return await response.text();
      } catch (e) {
        return 'エラー';
      }
    }
  
    openUrl(args) {
      const url = args.URL;
      const target = args.TARGET || '_blank';
      if (url && url.startsWith('http')) {
        window.open(url, target);
      } else {
        alert('有効なURLを入力してください（http から始まるURL）');
      }
    }
  
    showQR(args) {
      const format = args.FORMAT || 'png';
      const width = args.SIZEX || '200';
      const height = args.SIZEY || '200';
      const target = args.TUB || '_blank';
      const url = encodeURIComponent(args.URL);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${url}&format=${format}&size=${width}x${height}`;
      window.open(qrUrl, target);
    }

    urlSound(args) {
        const audio = args.URL
        const sound = new Audio(audio);
        sound.play();
        
      }
    
    description() {
      // 説明ラベル用（何もしない）
    }
  }
  
  Scratch.extensions.register(new OpenUrlExtension());
  