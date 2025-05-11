class FetchPlus {
  getInfo() {
    return {
      id: 'fetchplus',
      name: 'fetch+',
      color1: '#4b8bbe',
      color2: '#306998',
      blocks: [
        {
          opcode: 'getText',
          blockType: Scratch.BlockType.REPORTER,
          text: 'GET テキスト [URL]',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://example.com'
            }
          }
        },
        {
          opcode: 'getJSON',
          blockType: Scratch.BlockType.REPORTER,
          text: 'GET JSON [URL]',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://api.example.com/data'
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

  async getJSON(args) {
    try {
      const res = await fetch(args.URL);
      return await res.json();
    } catch (e) {
      return { error: e.message };
    }
  }
}

Scratch.extensions.register(new FetchPlus());
