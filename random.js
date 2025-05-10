class RandomAlphabetGen {
    getInfo() {
      return {
        id: 'randomstring',
        name: 'ランダム　文字列生成',
        blocks: [
          {
            opcode: 'generateRandomString',
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
          }
        ],
        menus: {
          caseMenu: {
            acceptReporters: true,
            items: [
              '大文字',
              '小文字',
              '数字',
              '記号',
              'アルファベット',
              '英数字',
              '英記号',
              '数字記号',
              'ひらがな大文字',
              'ひらがな小文字',
              'ひらがなすべて',
              'カタカナ大文字',
              'カタカナ小文字',
              'カタカナすべて',
              'ひら、かたかな',
              '英数記号',
              'すべて'
            ]
          }
        }
      };
    }
  
    generateRandomString(args) {
      const num = Math.max(0, Math.floor(args.NUM));
  
      const CHAR_SETS = {
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
  
      const chars = CHAR_SETS[args.CASE] || CHAR_SETS['アルファベット'];
  
      let result = '';
      for (let i = 0; i < num; i++) {
        const idx = Math.floor(Math.random() * chars.length);
        result += chars[idx];
      }
  
      return result;
    }
  }
  
  Scratch.extensions.register(new RandomAlphabetGen());
  