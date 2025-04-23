class MyExtension {
  
    getInfo() {
      return {
        id: 'comment',
        name: 'comments',
        color1: "#e4db8c",
        color2: "#c6be79",
        color3: "#a8a167",
        blocks: [
          {
            opcode: 'commentCommand',
            blockType: Scratch.BlockType.COMMAND,
            text: '// [COMMENT]',
            arguments: {
              COMMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'コメント'
              }
            }
          }
        ]
      };
    }
  
      commentCommand(args) {
          console.log(args.COMMENT);
        }
        
    }
    
    Scratch.extensions.register(new MyExtension());
    