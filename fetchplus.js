class FetchPlus {
    constructor(runtime) {
      this.runtime = runtime;
    }
  
    getInfo() {
      return {
        id: 'fetchplus',
        name: 'fetch+',
        blocks: [
          {
            opcode: 'fetchRequest',
            blockType: 'reporter',
            text: '[URL] に [METHOD] リクエスト、本文 [BODY]、形式 [FORMAT]',
            arguments: {
              URL: {
                type: 'string',
                defaultValue: 'https://jsonplaceholder.typicode.com/posts/1'
              },
              METHOD: {
                type: 'string',
                menu: 'methods'
              },
              BODY: {
                type: 'string',
                defaultValue: ''
              },
              FORMAT: {
                type: 'string',
                menu: 'formats'
              }
            }
          }
        ],
        menus: {
          methods: {
            acceptReporters: true,
            items: ['GET', 'POST', 'PUT', 'DELETE']
          },
          formats: {
            acceptReporters: true,
            items: ['text', 'json']
          }
        }
      };
    }
  
    async fetchRequest(args) {
      const url = args.URL;
      const method = args.METHOD || 'GET';
      const body = args.BODY || null;
      const format = args.FORMAT || 'text';
  
      try {
        const options = {
          method,
          headers: {
            'Content-Type': 'application/json'
          }
        };
  
        if (method !== 'GET' && body) {
          options.body = body;
        }
  
        const response = await fetch(url, options);
  
        if (!response.ok) {
          return `エラー: ${response.status} ${response.statusText}`;
        }
  
        return format === 'json' ? await response.json() : await response.text();
      } catch (e) {
        return `fetch エラー: ${e.message}`;
      }
    }
  }
  
  Scratch.extensions.register(new FetchPlus());
  