class RandomGeneratorExtension {
    getInfo() {
      return {
        id: 'randomgen',
        name: 'ランダム ジェネレーター',
        iconURI: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij4KICA8cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgcng9IjIwIiBmaWxsPSIjNkM2M0ZGIi8+CiAgPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMTAiIGZpbGw9IiNmZmYiLz4KICA8Y2lyY2xlIGN4PSI2NCIgY3k9IjY0IiByPSIxMCIgZmlsbD0iI2ZmZiIvPgogIDxjaXJjbGUgY3g9Ijk2IiBjeT0iOTYiIHI9IjEwIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPgo=',
        color1: '#6C63FF',
        color2: '#5A52D4',
        color3: '#4A43B0',
        blocks: [
          {
            opcode: 'generateRandomStringFromSet',
            blockType: Scratch.BlockType.REPORTER,
            text: '[CASE] から [NUM] 文字の文字列を生成する',
            arguments: {
              CASE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'caseMenu',
                defaultValue: 'アルファベット'
              },
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            opcode: 'generateCustomRandomString',
            blockType: Scratch.BlockType.REPORTER,
            text: '[CHARS] の中から [NUM] 文字の文字列を作る',
            arguments: {
              CHARS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'ABCabc123'
              },
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5
              }
            }
          },
          {
            opcode: 'generateRandomColor',
            blockType: Scratch.BlockType.REPORTER,
            text: 'ランダムな色（形式: [FORMAT]）',
            arguments: {
              FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'colorFormatMenu',
                defaultValue: 'RGB'
              }
            }
          }
        ],
        menus: {
          caseMenu: {
            acceptReporters: true,
            items: [
              '大文字', '小文字', '数字', '記号',
              'アルファベット', '英数字', '英記号', '数字記号',
              'ひらがな大文字', 'ひらがな小文字', 'ひらがなすべて',
              'カタカナ大文字', 'カタカナ小文字', 'カタカナすべて',
              'ひら、かたかな', '英数記号', 'すべて'
            ]
          },
          colorFormatMenu: {
            acceptReporters: true,
            items: ['RGB', '16進数']
          }
        }
      };
    }
  
    generateRandomStringFromSet(args) {
      const num = Math.max(0, Math.floor(args.NUM));
      const sets = {
        '大文字': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '小文字': 'abcdefghijklmnopqrstuvwxyz',
        '数字': '0123456789',
        '記号': '!"#$%&\'()=~|`{+*}<>?_',
        'アルファベット': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        '英数字': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        '英記号': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!"#$%&\'()=~|`{+*}<>?_',
        '数字記号': '0123456789!"#$%&\'()=~|`{+*}<>?_',
        'ひらがな大文字': 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん゛゜',
        'ひらがな小文字': 'ぁぃぅぇぉゎゃゅょ゛',
        'ひらがなすべて': 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉゃゅょゎ゛゜',
        'カタカナ大文字': 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン゛゜',
        'カタカナ小文字': 'ァィゥェォヵヶヮャュョ゛',
        'カタカナすべて': 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォヵヶヮャュョ゛゜',
        'ひら、かたかな': 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉゃゅょゎアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォヵヶヮャュョ゛゜',
        '英数記号': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&\'()=~|`{+*}<>?_',
        'すべて': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&\'()=~|`{+*}<>?_あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんぁぃぅぇぉゃゅょゎアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォヵヶヮャュョ゛゜'
      };
      const chars = sets[args.CASE] || sets['アルファベット'];
      return this._randomString(chars, num);
    }
  
    generateCustomRandomString(args) {
      const chars = args.CHARS || 'ABC123';
      const num = Math.max(0, Math.floor(args.NUM));
      return this._randomString(chars, num);
    }
  
    generateRandomColor(args) {
      const format = args.FORMAT;
      if (format === 'RGB') {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
      } else {
        const hex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        return `#${hex()}${hex()}${hex()}`;
      }
    }
  
    _randomString(charset, length) {
      let result = '';
      for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * charset.length);
        result += charset[index];
      }
      return result;
    }
  }
  
  Scratch.extensions.register(new RandomGeneratorExtension());
  
