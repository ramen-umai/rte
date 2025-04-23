class ClockExtension {
    getInfo() {
      return {
        id: 'clock',
        name: '時計',
        color1: '#00BFFF',
        color2: '#00FFFF',
        blocks: [
          {
            opcode: 'getDateTime',
            blockType: Scratch.BlockType.REPORTER,
            text: '時間を表示 [FORMAT]',
            arguments: {
              FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dateTimeFormatMenu',
                defaultValue: 'yyyy/mm/dd hh:mm:ss'
              }
            }
          }
        ],
        menus: {
          dateTimeFormatMenu: ['yyyy/mm/dd hh:mm:ss', 'yyyy-mm-dd hh:mm:ss', 'dd/mm/yyyy hh:mm:ss', 'dd-mm-yyyy hh:mm:ss', 'yyyy/mm/dd', 'dd/mm/yyyy', 'yyyy-mm-dd', 'dd-mm-yyyy']
        }
      };
    }
  
    // 日付と時刻をフォーマットに合わせて取得する関数
    getDateTime(args) {
      const now = new Date();
  
      let year = now.getFullYear();
      let month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月は0ベースなので+1
      let day = now.getDate().toString().padStart(2, '0');
      let hour = now.getHours().toString().padStart(2, '0');
      let minute = now.getMinutes().toString().padStart(2, '0');
      let second = now.getSeconds().toString().padStart(2, '0');
  
      let date = '';
      let time = `${hour}:${minute}:${second}`;
  
      switch (args.FORMAT) {
        case 'yyyy-mm-dd hh:mm:ss':
          date = `${year}-${month}-${day}`;  // yyyy-mm-dd
          break;
          case 'dd-mm-yyyy hh:mm:ss':
            date = `${day}-${month}-${year}`;  // dd-mm-yyyy
            break;
        case 'dd/mm/yyyy hh:mm:ss':
          date = `${day}/${month}/${year}`; // dd/mm/yyyy
          break;
        case 'yyyy/mm/dd': // ここを修正しました！
          date = `${year}/${month}/${day}`;  // yyyy/mm/dd のみの形式
          time = ''; // 時刻が必要ない場合は空にする
          break;
        case 'dd/mm/yyyy': // ここを修正しました！
          date = `${day}/${month}/${year}`;  // yyyy/mm/dd のみの形式
          time = ''; // 時刻が必要ない場合は空にする
          break;
        case 'yyyy-mm-dd': // ここを修正しました！
          date = `${year}-${month}-${day}`;  // yyyy/mm/dd のみの形式
          time = ''; // 時刻が必要ない場合は空にする
          break;
        case 'dd-mm-yyyy': // ここを修正しました！
          date = `${day}-${month}-${year}`;  // yyyy/mm/dd のみの形式
          time = ''; // 時刻が必要ない場合は空にする
          break;
        case 'yyyy/mm/dd hh:mm:ss':
        default:
          date = `${year}/${month}/${day}`;  // yyyy/mm/dd
          break;
      }
  
      return `${date} ${time}`;
    }
  }
  
  // TurboWarp用の拡張として登録
  Scratch.extensions.register(new ClockExtension());
  