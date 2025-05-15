class ShapeCalc {
    constructor() {
      this._piDigits = 2; // 小数桁数の設定（デフォルト 2）
    }
  
    getInfo() {
      return {
        id: 'shapecalc',
        name: '図形の計算',
        iconURL: 'https://ramen-umai.github.io/rte/math.svg',
        blocks: [
        　{
                blockType: Scratch.BlockType.LABEL,
                text: '【設定】'
        　},
          {
            opcode: 'setPiDigits',
            blockType: Scratch.BlockType.COMMAND,
            text: 'πは小数 [P] 桁として計算する',
            arguments: {
              P: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              }
            }
          },
  
          // 2次元図形ラベル
          {
            blockType: Scratch.BlockType.LABEL,
            text: '【2次元図形】'
          },
          {
            opcode: 'circleArea',
            blockType: Scratch.BlockType.REPORTER,
            text: '半径 [R] の円の面積',
            arguments: {
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'circleCircumference',
            blockType: Scratch.BlockType.REPORTER,
            text: '半径 [R] の円周の長さ',
            arguments: {
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'rectangleArea',
            blockType: Scratch.BlockType.REPORTER,
            text: '縦 [H] 横 [W] の長方形の面積',
            arguments: {
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 8 }
            }
          },
          {
            opcode: 'triangleArea',
            blockType: Scratch.BlockType.REPORTER,
            text: '底辺 [B] 高さ [H] の三角形の面積',
            arguments: {
              B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 6 },
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }
            }
          },
          {
            opcode: 'squareArea',
            blockType: Scratch.BlockType.REPORTER,
            text: '一辺 [S] の正方形の面積',
            arguments: {
              S: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            }
          },
  
          // 3次元図形ラベル
          {
            blockType: Scratch.BlockType.LABEL,
            text: '【3次元図形】'
          },
          {
            opcode: 'sphereVolume',
            blockType: Scratch.BlockType.REPORTER,
            text: '半径 [R] の球の体積',
            arguments: {
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
            }
          },
          {
            opcode: 'cubeVolume',
            blockType: Scratch.BlockType.REPORTER,
            text: '一辺 [S] の立方体の体積',
            arguments: {
              S: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }
            }
          },
          {
            opcode: 'cuboidVolume',
            blockType: Scratch.BlockType.REPORTER,
            text: '高さ [H] 幅 [W] 奥行き [D] の直方体の体積',
            arguments: {
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
              W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 },
              D: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
            }
          },
          {
            opcode: 'cylinderVolume',
            blockType: Scratch.BlockType.REPORTER,
            text: '半径 [R] 高さ [H] の円柱の体積',
            arguments: {
              R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          }
        ]
      };
    }
  
    // 設定：πの桁数
    setPiDigits(args) {
      const digits = Math.max(0, Math.floor(args.P));
      this._piDigits = digits;
    }
  
    // 内部関数：桁数に応じたπ
    _getPi() {
      return Number(Math.PI.toFixed(this._piDigits));
    }
  
    // --- 2次元の関数 ---
    circleArea(args) {
      const pi = this._getPi();
      const r = Math.max(0, args.R);
      return pi * r * r;
    }
  
    circleCircumference(args) {
      const pi = this._getPi();
      const r = Math.max(0, args.R);
      return 2 * pi * r;
    }
  
    rectangleArea(args) {
      const h = Math.max(0, args.H);
      const w = Math.max(0, args.W);
      return h * w;
    }
  
    triangleArea(args) {
      const b = Math.max(0, args.B);
      const h = Math.max(0, args.H);
      return (b * h) / 2;
    }
  
    squareArea(args) {
      const s = Math.max(0, args.S);
      return s * s;
    }
  
    // --- 3次元の関数 ---
    sphereVolume(args) {
      const pi = this._getPi();
      const r = Math.max(0, args.R);
      return (4 / 3) * pi * r * r * r;
    }
  
    cubeVolume(args) {
      const s = Math.max(0, args.S);
      return s * s * s;
    }
  
    cuboidVolume(args) {
      const h = Math.max(0, args.H);
      const w = Math.max(0, args.W);
      const d = Math.max(0, args.D);
      return h * w * d;
    }
  
    cylinderVolume(args) {
      const pi = this._getPi();
      const r = Math.max(0, args.R);
      const h = Math.max(0, args.H);
      return pi * r * r * h;
    }
  }
  
  Scratch.extensions.register(new ShapeCalc());
  