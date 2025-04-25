class MyExtension {
    constructor() {
      this.userInput = '';     // promptの入力を保存
      this.confirmResult = false; // confirmの結果を保存（true/false）
    }
  
    getInfo() {
      return {
        id: 'alerts',
        name: 'アラート plus',
        color1: '#ff4c4c', // メインの色（赤）
        color2: '#ff6666', // セカンダリ（赤っぽく）
        color3: '#cc0000', // 枠の色（濃い赤）
        blocks: [
          {
            opcode: 'say',
            blockType: Scratch.BlockType.COMMAND,
            text: 'アラート [A]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'こんにちは！'
              }
            }
          },
          {
            opcode: 'con',
            blockType: Scratch.BlockType.COMMAND,
            text: 'コンファーム [A]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '確認しますか？'
              }
            }
          },
          {
            opcode: 'pro',
            blockType: Scratch.BlockType.COMMAND,
            text: 'プロンプト [A]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'どう思いますか？'
              }
            }
          },
          {
            opcode: 'getInput',
            blockType: Scratch.BlockType.REPORTER,
            text: 'プロンプト結果'
          },
          {
            opcode: 'getConfirm',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'コンファーム結果'
          }
        ]
      };
    }
  
    // アラートを表示
    say(args) {
      alert(args.A);
    }
  
    // コンファームを表示し、結果を保存
    con(args) {
      this.confirmResult = confirm(args.A);
    }
  
    // プロンプトを表示し、入力を保存
    pro(args) {
      const result = prompt(args.A);
      if (result !== null) {
        this.userInput = result;
      } else {
        this.userInput = '';
      }
    }
  
    // プロンプトの結果を返す
    getInput() {
      return this.userInput;
    }
  
    // コンファームの結果（true/false）を返す
    getConfirm() {
      return this.confirmResult;
    }
  }
  
  Scratch.extensions.register(new MyExtension());
  
