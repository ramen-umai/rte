class FetchPlus {
    getInfo() {
      return {
        id: 'fetchplus',
        name: 'fetch+',
        color1: '#4b8bbe',
        color2: '#306998',
        docsURI: 'https://ramen-umai.github.io/rte/fetchplusdocs.html',
        blocks: [
          {
            opcode: 'getText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'GET TEXT [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://ramen-umai.github.io/rte/fetchplus.js'
              }
            }
          },
          {
            opcode: 'getJSONValue',
            blockType: Scratch.BlockType.REPORTER,
            text: 'GET JSON URL: [URL] キー [KEY] の値',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'bitcoin.usd'
              },
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
              }
            }
          }
        ]
      };
    }
  
    async getText(args) {
      try {
        const res = await fetch(args.URL);
        return await res.text();
      } catch (e) {
        return 'Error: ' + e.message;
      }
    }
  
    async getJSONValue(args) {
      try {
        const res = await fetch(args.URL);
        const data = await res.json();
  
        const keys = args.KEY.split('.');
        let result = data;
        for (const key of keys) {
          if (result && typeof result === 'object' && key in result) {
            result = result[key];
          } else {
            return 'キーが見つかりません';
          }
        }
        return typeof result === 'object' ? JSON.stringify(result) : result;
      } catch (e) {
        return 'エラー: ' + e.message;
      }
    }
  }
  
  Scratch.extensions.register(new FetchPlus());
  
