class JSExecutorExtension {
    getInfo() {
      return {
        id: 'jsExecutor',
        name: 'JavaScript　実行',
        color1: '#f5dd19',
        color2: '#00FFFF',
        blocks: [
          {
            opcode: 'executeJS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'JavaScriptコード [JS]',
            arguments: {
              JS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1 + 1'
              }
            }
          },
          {
            opcode: 'executeJS2',
            blockType: Scratch.BlockType.COMMAND,
            text: 'JavaScriptコード [JS]',
            arguments: {
              JS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1 + 1'
              }
            }
          },
          {
            opcode: 'Warning1',
            blockType: Scratch.BlockType.LABEL,
            text: '⚠ eval()を使用します。'
          },
          {
            opcode: 'Warning2',
            blockType: Scratch.BlockType.LABEL,
            text: '危険なコードにはご注意ください。'
          }
        ]
      };
    }
  
    Warning1() {
        //何もなし
    }
    Warning2() {
        //何もなし
    }
  
    executeJS(args) {
      try {
        return eval(args.JS);
      } catch (e) {
        return `エラー: ${e.message}`;
      }
    }

    executeJS2(args) {
        try {
          return eval(args.JS);
        } catch (e) {
          return `エラー: ${e.message}`;
        }
      }
  }
  
  Scratch.extensions.register(new JSExecutorExtension());
  