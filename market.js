class MarketExtension {
    constructor() {
      this.items = {};
    }
  
    getInfo() {
      return {
        id: 'market',
        name: 'Market',
        color1: '#4CAF50',
        color2: '#81C784',
        blocks: [
          {
            opcode: 'addItem',
            blockType: Scratch.BlockType.COMMAND,
            text: '商品 [NAME] を追加、在庫 [STOCK]、価格 [PRICE]、税率 [TAX]%',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'りんご' },
              STOCK: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              PRICE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              TAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'loadJson',
            blockType: Scratch.BlockType.COMMAND,
            text: 'JSON方式で [JSON] を読み込む',
            arguments: {
              JSON: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '{"りんご": {"price": 100, "stock": 5, "tax": 10}}'
              }
            }
          },
          {
            opcode: 'getJson',
            blockType: Scratch.BlockType.REPORTER,
            text: '現在の商品データ JSON'
          },
          {
            opcode: 'delItem',
            blockType: Scratch.BlockType.COMMAND,
            text: '現在の商品データを全削除する'
          },
          {
            opcode: 'getStock',
            blockType: Scratch.BlockType.REPORTER,
            text: '[ITEM] の在庫',
            arguments: {
              ITEM: { type: Scratch.ArgumentType.STRING, defaultValue: 'りんご' }
            }
          },
          {
            opcode: 'decreaseStock',
            blockType: Scratch.BlockType.COMMAND,
            text: '[ITEM] の在庫を [AMOUNT] 減らす',
            arguments: {
              ITEM: { type: Scratch.ArgumentType.STRING, defaultValue: 'りんご' },
              AMOUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'increaseStock',
            blockType: Scratch.BlockType.COMMAND,
            text: '[ITEM] の在庫を [AMOUNT] 増やす',
            arguments: {
              ITEM: { type: Scratch.ArgumentType.STRING, defaultValue: 'りんご' },
              AMOUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'setPrice',
            blockType: Scratch.BlockType.COMMAND,
            text: '[ITEM] の価格を [PRICE] にする',
            arguments: {
              ITEM: { type: Scratch.ArgumentType.STRING, defaultValue: 'りんご' },
              PRICE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 120 }
            }
          },
          {
            opcode: 'setTax',
            blockType: Scratch.BlockType.COMMAND,
            text: '[ITEM] の税率を [TAX]% にする',
            arguments: {
              ITEM: { type: Scratch.ArgumentType.STRING, defaultValue: 'りんご' },
              TAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'getWithTax',
            blockType: Scratch.BlockType.REPORTER,
            text: '[ITEM] の税込価格',
            arguments: {
              ITEM: { type: Scratch.ArgumentType.STRING, defaultValue: 'りんご' }
            }
          }
        ]
      };
    }
  
    loadJson(args) {
      try {
        this.items = JSON.parse(args.JSON);
      } catch (e) {
        alert("JSONが正しくありません");
      }
    }

    delItem() {
        this.items = {};
      }
  
    addItem(args) {
        const name = args.NAME;
        const stock = parseInt(args.STOCK, 10);
        const price = parseFloat(args.PRICE);
        const tax = parseFloat(args.TAX);
      
        if (this.items[name]) {
          alert(`${name} はすでに追加されています`);
          return;
        }
      
        this.items[name] = {
          stock: stock,
          price: price,
          tax: tax // デフォルトで税率10%
        };
      }
      
  
    getJson() {
      return JSON.stringify(this.items);
    }
  
    getStock(args) {
      return this.items[args.ITEM]?.stock ?? 0;
    }
  
    decreaseStock(args) {
      const item = this.items[args.ITEM];
      const amount = Number(args.AMOUNT);
      if (item && item.stock >= amount) {
        item.stock -= amount;
      }
    }
  
    increaseStock(args) {
      const item = this.items[args.ITEM];
      const amount = Number(args.AMOUNT);
      if (item) {
        item.stock += amount;
      }
    }
  
    setPrice(args) {
      const item = this.items[args.ITEM];
      const price = Number(args.PRICE);
      if (item) {
        item.price = price;
      }
    }
  
    setTax(args) {
        const item = this.items[args.ITEM];
        const tax = Number(args.TAX);
        if (item) {
          item.tax = tax;
        }
      }
      
    getWithTax(args) {
      const item = this.items[args.ITEM];
      if (!item) return 0;
      const taxRate = item.tax ?? 0;
      return Math.round(item.price * (1 + taxRate / 100));
    }
  }
  
  Scratch.extensions.register(new MarketExtension());
  