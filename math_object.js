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
                "id": "math",
                "name": "math object",
                "color1": "#0088ff",
                "color2": "#0063ba",
                "tbShow": true,
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "odds",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[A]％の確率が当たった",
        arguments: {
            "A": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["odds"] = async (args, util) => {
        return (Math.floor(Math.random() * ((100 / args["A"]) - 1 + 1) + 1) == 1)
    };

    blocks.push({
        opcode: "e",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "e",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["e"] = async (args, util) => {
        return 2.718
    };

    blocks.push({
        opcode: "void",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[A] ≠ [B]",
        arguments: {
            "A": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 5,
            },
            "B": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 1,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["void"] = async (args, util) => {
        if (Boolean((args["A"] == args["B"]))) {
            return false

        } else {
            return true

        };
    };

    blocks.push({
        opcode: "pai",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "π",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["pai"] = async (args, util) => {
        return 3.14
    };

    blocks.push({
        opcode: "plus",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[A] ≧ [B]",
        arguments: {
            "A": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 5,
            },
            "B": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 1,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["plus"] = async (args, util) => {
        if (Boolean(((args["A"] == args["B"]) || (args["A"] > args["B"])))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: "minus",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "[A] ≦ [B]",
        arguments: {
            "A": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 1,
            },
            "B": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 5,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["minus"] = async (args, util) => {
        if (Boolean(((args["A"] == args["B"]) || (args["A"] < args["B"])))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: "null",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "無",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["null"] = async (args, util) => {
        return ''
    };

    blocks.push({
        opcode: "false",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "誤",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["false"] = async (args, util) => {
        return false
    };

    blocks.push({
        opcode: "true",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "正",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["true"] = async (args, util) => {
        return true
    };

    blocks.push({
        opcode: "nlist",
        blockType: Scratch.BlockType.REPORTER,
        text: "[A]～[B]を全部足した数",
        arguments: {
            "A": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
            },
            "B": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["nlist"] = async (args, util) => {
        if (Boolean((args["A"] < args["B"]))) {
            variables['F'] = ((args["A"] ** 2) - args["A"])
            variables['E'] = ((args["B"] ** 2) + args["B"])
            variables['FE'] = (variables['E'] - variables['F'])
            return (variables['FE'] / 2)

        } else {
            return 'ERROR'

        };
    };

    blocks.push({
        opcode: "power",
        blockType: Scratch.BlockType.REPORTER,
        text: "[A]の[B]乗",
        arguments: {
            "A": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
            },
            "B": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["power"] = async (args, util) => {
        return (args["A"] ** args["B"])
    };

    Scratch.extensions.register(new Extension());
})(Scratch);