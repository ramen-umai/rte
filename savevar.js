/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "id": "saveVar",
                "name": "保存変数",
                "docsURI": "https://ramen-umai.github.io/rte/#savevar",
                "color1": "#ff8800",
                "color2": "#cc7a00",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "del",
        blockType: Scratch.BlockType.COMMAND,
        text: "保存変数[NAME]を削除",
        arguments: {
            "NAME": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '変数',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["del"] = async (args, util) => {
        localStorage.removeItem(args.NAME);;
    };

    blocks.push({
        opcode: "get",
        blockType: Scratch.BlockType.REPORTER,
        text: "保存変数[NAME]",
        arguments: {
            "NAME": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '変数',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["get"] = async (args, util) => {
        return localStorage.getItem(args["NAME"])
    };

    blocks.push({
        opcode: "plus",
        blockType: Scratch.BlockType.COMMAND,
        text: "保存変数[NAME]を[NUMBER]ずつ変える",
        arguments: {
            "NAME": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '変数',
            },
            "NUMBER": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '1',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["plus"] = async (args, util) => {
        localStorage.setItem(args["NAME"], (Number(localStorage.getItem(args["NAME"])) + args["NUMBER"]))
        return (Number(localStorage.getItem(args["NAME"])) + args["NUMBER"])
    };

    blocks.push({
        opcode: "set",
        blockType: Scratch.BlockType.COMMAND,
        text: "保存変数[NAME]を[STRING]にする",
        arguments: {
            "NAME": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '変数',
            },
            "STRING": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["set"] = async (args, util) => {
        localStorage.setItem('n', (localStorage.getItem('n') + 1))
        localStorage.setItem(args["NAME"], args["STRING"])
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
