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
                "blockIconURI": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTAwIiB6b29tQW5kUGFuPSJtYWduaWZ5IiB2aWV3Qm94PSIwIDAgMzc1IDM3NC45OTk5OTEiIGhlaWdodD0iNTAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0IiB2ZXJzaW9uPSIxLjAiPjxkZWZzPjxjbGlwUGF0aCBpZD0iOGUzN2RhODJjOCI+PHBhdGggZD0iTSA1Mi4xMzY3MTkgMTQ3LjQ0MTQwNiBMIDk0LjE3OTY4OCAxNDcuNDQxNDA2IEwgOTQuMTc5Njg4IDE4OS40ODQzNzUgTCA1Mi4xMzY3MTkgMTg5LjQ4NDM3NSBaIE0gNTIuMTM2NzE5IDE0Ny40NDE0MDYgIiBjbGlwLXJ1bGU9Im5vbnplcm8iLz48L2NsaXBQYXRoPjxjbGlwUGF0aCBpZD0iY2U0MDQ5YzdiZiI+PHBhdGggZD0iTSAyODAuMDU4NTk0IDE0Ny40NDE0MDYgTCAzMjIuMTAxNTYyIDE0Ny40NDE0MDYgTCAzMjIuMTAxNTYyIDE4OS40ODQzNzUgTCAyODAuMDU4NTk0IDE4OS40ODQzNzUgWiBNIDI4MC4wNTg1OTQgMTQ3LjQ0MTQwNiAiIGNsaXAtcnVsZT0ibm9uemVybyIvPjwvY2xpcFBhdGg+PC9kZWZzPjxwYXRoIGZpbGw9IiNmYTA2MDEiIGQ9Ik0gMzEzLjI3MzQzOCA2MS44MDQ2ODggQyAzMTUuMzI4MTI1IDYzLjg2MzI4MSAzMTcuMzM1OTM4IDY1Ljk3MjY1NiAzMTkuMjg5MDYyIDY4LjEyODkwNiBDIDMyMS4yNDYwOTQgNzAuMjg1MTU2IDMyMy4xNDQ1MzEgNzIuNDg0Mzc1IDMyNC45OTIxODggNzQuNzM0Mzc1IEMgMzI2LjgzNTkzOCA3Ni45ODQzNzUgMzI4LjYyODkwNiA3OS4yNzczNDQgMzMwLjM1OTM3NSA4MS42MTcxODggQyAzMzIuMDkzNzUgODMuOTUzMTI1IDMzMy43Njk1MzEgODYuMzMyMDMxIDMzNS4zODY3MTkgODguNzUgQyAzMzcuMDAzOTA2IDkxLjE3MTg3NSAzMzguNTU4NTk0IDkzLjYyODkwNiAzNDAuMDU0Njg4IDk2LjEyNSBDIDM0MS41NTA3ODEgOTguNjIxMDk0IDM0Mi45ODQzNzUgMTAxLjE1MjM0NCAzNDQuMzU5Mzc1IDEwMy43MTg3NSBDIDM0NS43MzA0NjkgMTA2LjI4NTE1NiAzNDcuMDM5MDYyIDEwOC44ODI4MTIgMzQ4LjI4MTI1IDExMS41MTU2MjUgQyAzNDkuNTI3MzQ0IDExNC4xNDQ1MzEgMzUwLjcwMzEyNSAxMTYuODA0Njg4IDM1MS44MjAzMTIgMTE5LjQ5MjE4OCBDIDM1Mi45MzM1OTQgMTIyLjE4MzU5NCAzNTMuOTgwNDY5IDEyNC44OTQ1MzEgMzU0Ljk2MDkzOCAxMjcuNjM2NzE5IEMgMzU1Ljk0MTQwNiAxMzAuMzc1IDM1Ni44NTE1NjIgMTMzLjEzNjcxOSAzNTcuNjk5MjE5IDEzNS45MjE4NzUgQyAzNTguNTQyOTY5IDEzOC43MDcwMzEgMzU5LjMyMDMxMiAxNDEuNTExNzE5IDM2MC4wMjczNDQgMTQ0LjMzNTkzOCBDIDM2MC43MzQzNzUgMTQ3LjE1NjI1IDM2MS4zNzEwOTQgMTQ5Ljk5NjA5NCAzNjEuOTM3NSAxNTIuODUxNTYyIEMgMzYyLjUwMzkwNiAxNTUuNzAzMTI1IDM2My4wMDM5MDYgMTU4LjU3MDMxMiAzNjMuNDI5Njg4IDE2MS40NDkyMTkgQyAzNjMuODU1NDY5IDE2NC4zMjgxMjUgMzY0LjIxNDg0NCAxNjcuMjE0ODQ0IDM2NC41IDE3MC4xMDkzNzUgQyAzNjQuNzg1MTU2IDE3My4wMDc4MTIgMzY1IDE3NS45MTAxNTYgMzY1LjE0MDYyNSAxNzguODE2NDA2IEMgMzY1LjI4NTE1NiAxODEuNzIyNjU2IDM2NS4zNTU0NjkgMTg0LjYyODkwNiAzNjUuMzU1NDY5IDE4Ny41MzkwNjIgQyAzNjUuMzU1NDY5IDE5MC40NDkyMTkgMzY1LjI4NTE1NiAxOTMuMzU5Mzc1IDM2NS4xNDA2MjUgMTk2LjI2NTYyNSBDIDM2NSAxOTkuMTcxODc1IDM2NC43ODUxNTYgMjAyLjA3NDIxOSAzNjQuNSAyMDQuOTY4NzUgQyAzNjQuMjE0ODQ0IDIwNy44NjMyODEgMzYzLjg1OTM3NSAyMTAuNzUzOTA2IDM2My40Mjk2ODggMjEzLjYzMjgxMiBDIDM2My4wMDM5MDYgMjE2LjUwNzgxMiAzNjIuNTA3ODEyIDIxOS4zNzUgMzYxLjkzNzUgMjIyLjIzMDQ2OSBDIDM2MS4zNzEwOTQgMjI1LjA4NTkzOCAzNjAuNzM0Mzc1IDIyNy45MjE4NzUgMzYwLjAyNzM0NCAyMzAuNzQ2MDk0IEMgMzU5LjMyMDMxMiAyMzMuNTcwMzEyIDM1OC41NDI5NjkgMjM2LjM3MTA5NCAzNTcuNjk5MjE5IDIzOS4xNTYyNSBDIDM1Ni44NTU0NjkgMjQxLjk0MTQwNiAzNTUuOTQxNDA2IDI0NC43MDMxMjUgMzU0Ljk2MDkzOCAyNDcuNDQ1MzEyIEMgMzUzLjk4MDQ2OSAyNTAuMTgzNTk0IDM1Mi45MzM1OTQgMjUyLjg5ODQzOCAzNTEuODIwMzEyIDI1NS41ODU5MzggQyAzNTAuNzA3MDMxIDI1OC4yNzczNDQgMzQ5LjUyNzM0NCAyNjAuOTMzNTk0IDM0OC4yODUxNTYgMjYzLjU2NjQwNiBDIDM0Ny4wMzkwNjIgMjY2LjE5NTMxMiAzNDUuNzMwNDY5IDI2OC43OTY4NzUgMzQ0LjM1OTM3NSAyNzEuMzYzMjgxIEMgMzQyLjk4ODI4MSAyNzMuOTI5Njg4IDM0MS41NTQ2ODggMjc2LjQ2MDkzOCAzNDAuMDU4NTk0IDI3OC45NTcwMzEgQyAzMzguNTYyNSAyODEuNDUzMTI1IDMzNy4wMDc4MTIgMjgzLjkxMDE1NiAzMzUuMzkwNjI1IDI4Ni4zMjgxMjUgQyAzMzMuNzczNDM4IDI4OC43NSAzMzIuMDk3NjU2IDI5MS4xMjg5MDYgMzMwLjM2MzI4MSAyOTMuNDY0ODQ0IEMgMzI4LjYzMjgxMiAyOTUuODAwNzgxIDMyNi44Mzk4NDQgMjk4LjA5NzY1NiAzMjQuOTk2MDk0IDMwMC4zNDM3NSBDIDMyMy4xNDg0MzggMzAyLjU5Mzc1IDMyMS4yNSAzMDQuNzk2ODc1IDMxOS4yOTI5NjkgMzA2Ljk1MzEyNSBDIDMxNy4zMzk4NDQgMzA5LjEwOTM3NSAzMTUuMzM1OTM4IDMxMS4yMTg3NSAzMTMuMjc3MzQ0IDMxMy4yNzM0MzggQyAzMTEuMjE4NzUgMzE1LjMzMjAzMSAzMDkuMTEzMjgxIDMxNy4zMzk4NDQgMzA2Ljk1NzAzMSAzMTkuMjkyOTY5IEMgMzA0LjgwMDc4MSAzMjEuMjQ2MDk0IDMwMi41OTc2NTYgMzIzLjE0ODQzOCAzMDAuMzQ3NjU2IDMyNC45OTYwOTQgQyAyOTguMDk3NjU2IDMyNi44Mzk4NDQgMjk1LjgwNDY4OCAzMjguNjI4OTA2IDI5My40Njg3NSAzMzAuMzYzMjgxIEMgMjkxLjEyODkwNiAzMzIuMDk3NjU2IDI4OC43NSAzMzMuNzczNDM4IDI4Ni4zMzIwMzEgMzM1LjM5MDYyNSBDIDI4My45MTAxNTYgMzM3LjAwNzgxMiAyODEuNDUzMTI1IDMzOC41NjI1IDI3OC45NTcwMzEgMzQwLjA1ODU5NCBDIDI3Ni40NjA5MzggMzQxLjU1NDY4OCAyNzMuOTI5Njg4IDM0Mi45ODgyODEgMjcxLjM2MzI4MSAzNDQuMzU5Mzc1IEMgMjY4Ljc5Njg3NSAzNDUuNzM0Mzc1IDI2Ni4xOTkyMTkgMzQ3LjAzOTA2MiAyNjMuNTcwMzEyIDM0OC4yODUxNTYgQyAyNjAuOTM3NSAzNDkuNTI3MzQ0IDI1OC4yNzczNDQgMzUwLjcwNzAzMSAyNTUuNTg5ODQ0IDM1MS44MjAzMTIgQyAyNTIuOTAyMzQ0IDM1Mi45MzM1OTQgMjUwLjE4NzUgMzUzLjk4NDM3NSAyNDcuNDQ1MzEyIDM1NC45NjQ4NDQgQyAyNDQuNzA3MDMxIDM1NS45NDUzMTIgMjQxLjk0NTMxMiAzNTYuODU1NDY5IDIzOS4xNjAxNTYgMzU3LjY5OTIxOSBDIDIzNi4zNzUgMzU4LjU0Njg3NSAyMzMuNTcwMzEyIDM1OS4zMjAzMTIgMjMwLjc1IDM2MC4wMjczNDQgQyAyMjcuOTI1NzgxIDM2MC43MzQzNzUgMjI1LjA4NTkzOCAzNjEuMzc1IDIyMi4yMzQzNzUgMzYxLjk0MTQwNiBDIDIxOS4zNzg5MDYgMzYyLjUwNzgxMiAyMTYuNTExNzE5IDM2My4wMDc4MTIgMjEzLjYzMjgxMiAzNjMuNDMzNTk0IEMgMjEwLjc1MzkwNiAzNjMuODU5Mzc1IDIwNy44NjcxODggMzY0LjIxNDg0NCAyMDQuOTcyNjU2IDM2NC41IEMgMjAyLjA3NDIxOSAzNjQuNzg5MDYyIDE5OS4xNzU3ODEgMzY1IDE5Ni4yNjk1MzEgMzY1LjE0NDUzMSBDIDE5My4zNjMyODEgMzY1LjI4NTE1NiAxOTAuNDUzMTI1IDM2NS4zNTkzNzUgMTg3LjU0Mjk2OSAzNjUuMzU5Mzc1IEMgMTg0LjYzMjgxMiAzNjUuMzU5Mzc1IDE4MS43MjY1NjIgMzY1LjI4NTE1NiAxNzguODE2NDA2IDM2NS4xNDQ1MzEgQyAxNzUuOTEwMTU2IDM2NSAxNzMuMDExNzE5IDM2NC43ODkwNjIgMTcwLjExMzI4MSAzNjQuNTAzOTA2IEMgMTY3LjIxODc1IDM2NC4yMTg3NSAxNjQuMzMyMDMxIDM2My44NTkzNzUgMTYxLjQ1MzEyNSAzNjMuNDMzNTk0IEMgMTU4LjU3NDIxOSAzNjMuMDA3ODEyIDE1NS43MDcwMzEgMzYyLjUxMTcxOSAxNTIuODUxNTYyIDM2MS45NDE0MDYgQyAxNTAgMzYxLjM3NSAxNDcuMTYwMTU2IDM2MC43MzgyODEgMTQ0LjMzNTkzOCAzNjAuMDMxMjUgQyAxNDEuNTE1NjI1IDM1OS4zMjQyMTkgMTM4LjcxMDkzOCAzNTguNTQ2ODc1IDEzNS45MjU3ODEgMzU3LjcwMzEyNSBDIDEzMy4xNDA2MjUgMzU2Ljg1OTM3NSAxMzAuMzc4OTA2IDM1NS45NDUzMTIgMTI3LjYzNjcxOSAzNTQuOTY0ODQ0IEMgMTI0Ljg5ODQzOCAzNTMuOTg0Mzc1IDEyMi4xODM1OTQgMzUyLjkzNzUgMTE5LjQ5NjA5NCAzNTEuODI0MjE5IEMgMTE2LjgwODU5NCAzNTAuNzEwOTM4IDExNC4xNDg0MzggMzQ5LjUzMTI1IDExMS41MTU2MjUgMzQ4LjI4OTA2MiBDIDEwOC44ODY3MTkgMzQ3LjA0Mjk2OSAxMDYuMjg5MDYyIDM0NS43MzQzNzUgMTAzLjcyMjY1NiAzNDQuMzYzMjgxIEMgMTAxLjE1NjI1IDM0Mi45OTIxODggOTguNjI1IDM0MS41NTg1OTQgOTYuMTI4OTA2IDM0MC4wNjI1IEMgOTMuNjMyODEyIDMzOC41NjY0MDYgOTEuMTcxODc1IDMzNy4wMDc4MTIgODguNzUzOTA2IDMzNS4zOTQ1MzEgQyA4Ni4zMzIwMzEgMzMzLjc3NzM0NCA4My45NTcwMzEgMzMyLjEwMTU2MiA4MS42MTcxODggMzMwLjM2NzE4OCBDIDc5LjI4MTI1IDMyOC42MzI4MTIgNzYuOTg4MjgxIDMyNi44NDM3NSA3NC43MzgyODEgMzI1IEMgNzIuNDg4MjgxIDMyMy4xNTIzNDQgNzAuMjg1MTU2IDMyMS4yNSA2OC4xMjg5MDYgMzE5LjI5Njg3NSBDIDY1Ljk3MjY1NiAzMTcuMzQzNzUgNjMuODY3MTg4IDMxNS4zMzU5MzggNjEuODA4NTk0IDMxMy4yODEyNSBDIDU5Ljc1IDMxMS4yMjI2NTYgNTcuNzQyMTg4IDMwOS4xMTMyODEgNTUuNzg5MDYyIDMwNi45NTcwMzEgQyA1My44MzU5MzggMzA0LjgwMDc4MSA1MS45MzM1OTQgMzAyLjYwMTU2MiA1MC4wODk4NDQgMzAwLjM1MTU2MiBDIDQ4LjI0MjE4OCAyOTguMTAxNTYyIDQ2LjQ1MzEyNSAyOTUuODA4NTk0IDQ0LjcxODc1IDI5My40Njg3NSBDIDQyLjk4NDM3NSAyOTEuMTMyODEyIDQxLjMwODU5NCAyODguNzUzOTA2IDM5LjY5NTMxMiAyODYuMzM1OTM4IEMgMzguMDc4MTI1IDI4My45MTQwNjIgMzYuNTE5NTMxIDI4MS40NTcwMzEgMzUuMDIzNDM4IDI3OC45NjA5MzggQyAzMy41MjczNDQgMjc2LjQ2NDg0NCAzMi4wOTM3NSAyNzMuOTMzNTk0IDMwLjcyMjY1NiAyNzEuMzY3MTg4IEMgMjkuMzUxNTYyIDI2OC44MDA3ODEgMjguMDQyOTY5IDI2Ni4yMDMxMjUgMjYuNzk2ODc1IDI2My41NzAzMTIgQyAyNS41NTQ2ODggMjYwLjk0MTQwNiAyNC4zNzUgMjU4LjI4MTI1IDIzLjI2MTcxOSAyNTUuNTkzNzUgQyAyMi4xNDg0MzggMjUyLjkwNjI1IDIxLjEwMTU2MiAyNTAuMTkxNDA2IDIwLjEyMTA5NCAyNDcuNDQ5MjE5IEMgMTkuMTQwNjI1IDI0NC43MTA5MzggMTguMjI2NTYyIDI0MS45NDkyMTkgMTcuMzgyODEyIDIzOS4xNjQwNjIgQyAxNi41MzkwNjIgMjM2LjM3ODkwNiAxNS43NjE3MTkgMjMzLjU3NDIxOSAxNS4wNTQ2ODggMjMwLjc1IEMgMTQuMzQ3NjU2IDIyNy45Mjk2ODggMTMuNzEwOTM4IDIyNS4wODk4NDQgMTMuMTQwNjI1IDIyMi4yMzQzNzUgQyAxMi41NzQyMTkgMjE5LjM4MjgxMiAxMi4wNzgxMjUgMjE2LjUxNTYyNSAxMS42NDg0MzggMjEzLjYzNjcxOSBDIDExLjIyMjY1NiAyMTAuNzU3ODEyIDEwLjg2NzE4OCAyMDcuODcxMDk0IDEwLjU4MjAzMSAyMDQuOTc2NTYyIEMgMTAuMjk2ODc1IDIwMi4wNzgxMjUgMTAuMDgyMDMxIDE5OS4xNzU3ODEgOS45Mzc1IDE5Ni4yNjk1MzEgQyA5Ljc5Njg3NSAxOTMuMzYzMjgxIDkuNzI2NTYyIDE5MC40NTcwMzEgOS43MjI2NTYgMTg3LjU0Njg3NSBDIDkuNzIyNjU2IDE4NC42MzY3MTkgOS43OTY4NzUgMTgxLjcyNjU2MiA5LjkzNzUgMTc4LjgyMDMxMiBDIDEwLjA4MjAzMSAxNzUuOTE0MDYyIDEwLjI5Njg3NSAxNzMuMDExNzE5IDEwLjU4MjAzMSAxNzAuMTE3MTg4IEMgMTAuODY3MTg4IDE2Ny4yMjI2NTYgMTEuMjIyNjU2IDE2NC4zMzIwMzEgMTEuNjQ4NDM4IDE2MS40NTcwMzEgQyAxMi4wNzQyMTkgMTU4LjU3ODEyNSAxMi41NzQyMTkgMTU1LjcxMDkzOCAxMy4xNDA2MjUgMTUyLjg1NTQ2OSBDIDEzLjcwNzAzMSAxNTAgMTQuMzQzNzUgMTQ3LjE2NDA2MiAxNS4wNTA3ODEgMTQ0LjMzOTg0NCBDIDE1Ljc2MTcxOSAxNDEuNTE1NjI1IDE2LjUzNTE1NiAxMzguNzE0ODQ0IDE3LjM3ODkwNiAxMzUuOTI5Njg4IEMgMTguMjI2NTYyIDEzMy4xNDQ1MzEgMTkuMTM2NzE5IDEzMC4zODI4MTIgMjAuMTE3MTg4IDEyNy42NDA2MjUgQyAyMS4wOTc2NTYgMTI0LjkwMjM0NCAyMi4xNDQ1MzEgMTIyLjE4NzUgMjMuMjU3ODEyIDExOS41IEMgMjQuMzcxMDk0IDExNi44MDg1OTQgMjUuNTUwNzgxIDExNC4xNTIzNDQgMjYuNzk2ODc1IDExMS41MTk1MzEgQyAyOC4wMzkwNjIgMTA4Ljg5MDYyNSAyOS4zNDc2NTYgMTA2LjI4OTA2MiAzMC43MTg3NSAxMDMuNzIyNjU2IEMgMzIuMDg5ODQ0IDEwMS4xNTYyNSAzMy41MjM0MzggOTguNjI1IDM1LjAxOTUzMSA5Ni4xMjg5MDYgQyAzNi41MTU2MjUgOTMuNjMyODEyIDM4LjA3NDIxOSA5MS4xNzU3ODEgMzkuNjkxNDA2IDg4Ljc1NzgxMiBDIDQxLjMwODU5NCA4Ni4zMzU5MzggNDIuOTgwNDY5IDgzLjk1NzAzMSA0NC43MTQ4NDQgODEuNjIxMDk0IEMgNDYuNDQ5MjE5IDc5LjI4NTE1NiA0OC4yMzgyODEgNzYuOTg4MjgxIDUwLjA4NTkzOCA3NC43NDIxODggQyA1MS45Mjk2ODggNzIuNDkyMTg4IDUzLjgzMjAzMSA3MC4yODkwNjIgNTUuNzg1MTU2IDY4LjEzMjgxMiBDIDU3LjczODI4MSA2NS45NzY1NjIgNTkuNzQ2MDk0IDYzLjg2NzE4OCA2MS44MDQ2ODggNjEuODEyNSBDIDYzLjg1OTM3NSA1OS43NTM5MDYgNjUuOTY4NzUgNTcuNzQ2MDk0IDY4LjEyNSA1NS43OTI5NjkgQyA3MC4yODEyNSA1My44Mzk4NDQgNzIuNDg0Mzc1IDUxLjkzNzUgNzQuNzM0Mzc1IDUwLjA5Mzc1IEMgNzYuOTgwNDY5IDQ4LjI0NjA5NCA3OS4yNzczNDQgNDYuNDU3MDMxIDgxLjYxMzI4MSA0NC43MjI2NTYgQyA4My45NDkyMTkgNDIuOTg4MjgxIDg2LjMyODEyNSA0MS4zMTI1IDg4Ljc1IDM5LjY5NTMxMiBDIDkxLjE2Nzk2OSAzOC4wNzgxMjUgOTMuNjI1IDM2LjUyMzQzOCA5Ni4xMjEwOTQgMzUuMDI3MzQ0IEMgOTguNjE3MTg4IDMzLjUzMTI1IDEwMS4xNDg0MzggMzIuMDk3NjU2IDEwMy43MTQ4NDQgMzAuNzI2NTYyIEMgMTA2LjI4MTI1IDI5LjM1MTU2MiAxMDguODc4OTA2IDI4LjA0Njg3NSAxMTEuNTExNzE5IDI2LjgwMDc4MSBDIDExNC4xNDA2MjUgMjUuNTU4NTk0IDExNi44MDA3ODEgMjQuMzc4OTA2IDExOS40ODgyODEgMjMuMjY1NjI1IEMgMTIyLjE3OTY4OCAyMi4xNTIzNDQgMTI0Ljg5NDUzMSAyMS4xMDE1NjIgMTI3LjYzMjgxMiAyMC4xMjUgQyAxMzAuMzcxMDk0IDE5LjE0NDUzMSAxMzMuMTM2NzE5IDE4LjIzMDQ2OSAxMzUuOTE3OTY5IDE3LjM4NjcxOSBDIDEzOC43MDMxMjUgMTYuNTM5MDYyIDE0MS41MDc4MTIgMTUuNzY1NjI1IDE0NC4zMzIwMzEgMTUuMDU4NTk0IEMgMTQ3LjE1MjM0NCAxNC4zNTE1NjIgMTQ5Ljk5MjE4OCAxMy43MTA5MzggMTUyLjg0NzY1NiAxMy4xNDQ1MzEgQyAxNTUuNjk5MjE5IDEyLjU3ODEyNSAxNTguNTY2NDA2IDEyLjA3ODEyNSAxNjEuNDQ1MzEyIDExLjY1MjM0NCBDIDE2NC4zMjQyMTkgMTEuMjI2NTYyIDE2Ny4yMTA5MzggMTAuODcxMDk0IDE3MC4xMDkzNzUgMTAuNTg1OTM4IEMgMTczLjAwMzkwNiAxMC4zMDA3ODEgMTc1LjkwNjI1IDEwLjA4NTkzOCAxNzguODEyNSA5Ljk0MTQwNiBDIDE4MS43MTg3NSA5LjgwMDc4MSAxODQuNjI1IDkuNzI2NTYyIDE4Ny41MzUxNTYgOS43MjY1NjIgQyAxOTAuNDQ1MzEyIDkuNzI2NTYyIDE5My4zNTU0NjkgOS44MDA3ODEgMTk2LjI2MTcxOSA5Ljk0MTQwNiBDIDE5OS4xNjc5NjkgMTAuMDg1OTM4IDIwMi4wNzAzMTIgMTAuMjk2ODc1IDIwNC45NjQ4NDQgMTAuNTgyMDMxIEMgMjA3Ljg2MzI4MSAxMC44NjcxODggMjEwLjc1IDExLjIyNjU2MiAyMTMuNjI4OTA2IDExLjY1MjM0NCBDIDIxNi41MDc4MTIgMTIuMDc4MTI1IDIxOS4zNzEwOTQgMTIuNTc0MjE5IDIyMi4yMjY1NjIgMTMuMTQ0NTMxIEMgMjI1LjA4MjAzMSAxMy43MTA5MzggMjI3LjkxNzk2OSAxNC4zNDc2NTYgMjMwLjc0MjE4OCAxNS4wNTQ2ODggQyAyMzMuNTY2NDA2IDE1Ljc2MTcxOSAyMzYuMzcxMDk0IDE2LjUzOTA2MiAyMzkuMTUyMzQ0IDE3LjM4MjgxMiBDIDI0MS45Mzc1IDE4LjIyNjU2MiAyNDQuNzAzMTI1IDE5LjE0MDYyNSAyNDcuNDQxNDA2IDIwLjEyMTA5NCBDIDI1MC4xNzk2ODggMjEuMTAxNTYyIDI1Mi44OTQ1MzEgMjIuMTQ4NDM4IDI1NS41ODU5MzggMjMuMjYxNzE5IEMgMjU4LjI3MzQzOCAyNC4zNzUgMjYwLjkzMzU5NCAyNS41NTQ2ODggMjYzLjU2MjUgMjYuNzk2ODc1IEMgMjY2LjE5NTMxMiAyOC4wNDI5NjkgMjY4Ljc5Mjk2OSAyOS4zNTE1NjIgMjcxLjM1OTM3NSAzMC43MjI2NTYgQyAyNzMuOTI1NzgxIDMyLjA5Mzc1IDI3Ni40NTcwMzEgMzMuNTI3MzQ0IDI3OC45NTMxMjUgMzUuMDIzNDM4IEMgMjgxLjQ0OTIxOSAzNi41MTk1MzEgMjgzLjkwNjI1IDM4LjA3ODEyNSAyODYuMzI4MTI1IDM5LjY5MTQwNiBDIDI4OC43NDYwOTQgNDEuMzA4NTk0IDI5MS4xMjUgNDIuOTg0Mzc1IDI5My40NjA5MzggNDQuNzE4NzUgQyAyOTUuODAwNzgxIDQ2LjQ1MzEyNSAyOTguMDkzNzUgNDguMjQyMTg4IDMwMC4zNDM3NSA1MC4wODk4NDQgQyAzMDIuNTkzNzUgNTEuOTMzNTk0IDMwNC43OTI5NjkgNTMuODM1OTM4IDMwNi45NDkyMTkgNTUuNzg5MDYyIEMgMzA5LjEwNTQ2OSA1Ny43NDIxODggMzExLjIxNDg0NCA1OS43NSAzMTMuMjczNDM4IDYxLjgwNDY4OCBaIE0gMzEzLjI3MzQzOCA2MS44MDQ2ODggIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0gMTg1LjQzMzU5NCAyOTkuOTk2MDk0IEMgMTgxLjM1NTQ2OSAyOTkuOTk2MDk0IDE3Ny40OTYwOTQgMjk5LjI4OTA2MiAxNzMuODYzMjgxIDI5OC41NTA3ODEgQyAxNzMuODYzMjgxIDI5OC41NTA3ODEgMTczLjg1NTQ2OSAyOTguNTUwNzgxIDE3My44NTU0NjkgMjk4LjU1MDc4MSBDIDE2NC4wMDc4MTIgMjk2LjU0Njg3NSAxNTQuNTYyNSAyOTIuMjc3MzQ0IDE0Ni41MDc4MTIgMjg2LjIxODc1IEMgMTQ2LjUwNzgxMiAyODYuMjE4NzUgMTQ2LjQ5NjA5NCAyODYuMjEwOTM4IDE0Ni40OTYwOTQgMjg2LjIxMDkzOCBDIDEzMC4wMzEyNSAyNzMuNzk2ODc1IDExOS45MzM1OTQgMjU0LjQ1NzAzMSAxMTkuMTg3NSAyMzQuMDcwMzEyIEMgMTE5LjE2MDE1NiAyMzMuODg2NzE5IDExOS4xNDA2MjUgMjMzLjY5MTQwNiAxMTkuMTQwNjI1IDIzMy40OTYwOTQgTCAxMTkuMTQwNjI1IDE0MC42MDkzNzUgQyAxMTkuMTQwNjI1IDEzMS40NjQ4NDQgMTI2LjU4MjAzMSAxMjQuMDA3ODEyIDEzNS43MzA0NjkgMTI0LjAwNzgxMiBDIDEzOS4xNzk2ODggMTI0LjAwNzgxMiAxNDIuMzgyODEyIDEyNS4wNjI1IDE0NS4wMzUxNTYgMTI2Ljg3NSBMIDE0NS4wMzUxNTYgMTA5LjY2MDE1NiBDIDE0NS4wMzUxNTYgMTAwLjUyMzQzOCAxNTIuMzgyODEyIDkyLjk5MjE4OCAxNjEuNDE0MDYyIDkyLjg3NSBDIDE2NC44NjMyODEgOTIuODI4MTI1IDE2OC4xNTIzNDQgOTMuODI0MjE5IDE3MC45NDE0MDYgOTUuNzIyNjU2IEwgMTcwLjk0MTQwNiA5MS42OTUzMTIgQyAxNzAuOTQxNDA2IDg1LjEyMTA5NCAxNzQuODI0MjE5IDc5LjE1NjI1IDE4MC44NDM3NSA3Ni41MDM5MDYgQyAxODIuOTUzMTI1IDc1LjU3NDIxOSAxODUuMjEwOTM4IDc1LjEwMTU2MiAxODcuNTQyOTY5IDc1LjEwMTU2MiBDIDE4OS44NjcxODggNzUuMTAxNTYyIDE5Mi4xMjEwOTQgNzUuNTc0MjE5IDE5NC4yNDIxODggNzYuNTAzOTA2IEMgMjAwLjAyMzQzOCA3OS4wNTA3ODEgMjAzLjgzNTkzOCA4NC42NTYyNSAyMDQuMTI1IDkwLjkyMTg3NSBDIDIwNi43ODkwNjIgODkuMTA5Mzc1IDIxMC4wMDM5MDYgODguMDQyOTY5IDIxMy40NDkyMTkgODguMDQyOTY5IEMgMjIyLjU5NzY1NiA4OC4wNDI5NjkgMjMwLjA0Mjk2OSA5NS40ODgyODEgMjMwLjA0Mjk2OSAxMDQuNjQ4NDM4IEwgMjMwLjA0Mjk2OSAxNTUuMjU3ODEyIEMgMjMzLjE5OTIxOSAxNTEuNzE0ODQ0IDIzNy40MTc5NjkgMTQ5LjUwNzgxMiAyNDIuNzkyOTY5IDE0OS41MDc4MTIgQyAyNTEuMDMxMjUgMTQ5LjUwNzgxMiAyNTUuOTQ1MzEyIDE1NC42MDkzNzUgMjU1Ljk0NTMxMiAxNjMuMTQ4NDM4IEwgMjU1Ljk0NTMxMiAyMDMuNTM1MTU2IEwgMjU1LjgxMjUgMjMxLjY2MDE1NiBDIDI1NS44MTI1IDI1My4yNzM0MzggMjQ1Ljg5MDYyNSAyNzMuMTQ4NDM4IDIyOC41OTc2NTYgMjg2LjE5MTQwNiBDIDIxNC45NzY1NjIgMjk2LjI5Njg3NSAyMDIuNjk1MzEyIDI5OC4zMzk4NDQgMjAxLjExNzE4OCAyOTguNTYyNSBDIDE5Ni43MTg3NSAyOTkuNDUzMTI1IDE5Mi4xOTkyMTkgMjk5Ljg5ODQzOCAxODcuNjc5Njg4IDI5OS45MDYyNSBDIDE4Ni45MTQwNjIgMjk5Ljk2NDg0NCAxODYuMTc5Njg4IDI5OS45OTYwOTQgMTg1LjQzMzU5NCAyOTkuOTk2MDk0IFogTSAxNzUuMzI4MTI1IDI5MS40MDYyNSBDIDE3OS4xNDg0MzggMjkyLjE4MzU5NCAxODMuMjE0ODQ0IDI5Mi45MTc5NjkgMTg3LjI1MzkwNiAyOTIuNjQ4NDM4IEMgMTg3LjMxMjUgMjkyLjY0ODQzOCAxODcuMzY3MTg4IDI5Mi42MzY3MTkgMTg3LjQyNTc4MSAyOTIuNjM2NzE5IEMgMTg3LjQ3NjU2MiAyOTIuNjM2NzE5IDE4Ny41MzUxNTYgMjkyLjYzNjcxOSAxODcuNTgyMDMxIDI5Mi42MzY3MTkgQyAxOTEuNjg3NSAyOTIuNjM2NzE5IDE5NS43OTI5NjkgMjkyLjIyMjY1NiAxOTkuNzY5NTMxIDI5MS40MDYyNSBMIDIwMC4wNDI5NjkgMjkxLjM1OTM3NSBDIDIwMC4xNDg0MzggMjkxLjM0NzY1NiAyMTEuNjAxNTYyIDI4OS43MzQzNzUgMjI0LjIzNDM3NSAyODAuMzYzMjgxIEMgMjM5LjY2NDA2MiAyNjguNzM0Mzc1IDI0OC41MjM0MzggMjUwLjk3MjY1NiAyNDguNTIzNDM4IDIzMS42NDg0MzggTCAyNDguNjU2MjUgMjAzLjUyNzM0NCBMIDI0OC42NTYyNSAxNjMuMTU2MjUgQyAyNDguNjU2MjUgMTU3LjU3MDMxMiAyNDUuODM5ODQ0IDE1Ni44MDg1OTQgMjQyLjc5Mjk2OSAxNTYuODA4NTk0IEMgMjMyLjczNDM3NSAxNTYuODA4NTk0IDIzMC4wNDI5NjkgMTcwLjUzNTE1NiAyMzAuMDQyOTY5IDE3OC42MzY3MTkgTCAyMzAuMDQyOTY5IDIwMi42MDU0NjkgQyAyMzAuMDQyOTY5IDIwNC42MjEwOTQgMjI4LjQwNjI1IDIwNi4yNDYwOTQgMjI2LjQwMjM0NCAyMDYuMjQ2MDk0IEMgMjA4LjYyODkwNiAyMDYuMjQ2MDk0IDE5Mi4yMTA5MzggMjEzLjgxNjQwNiAxODEuMzU1NDY5IDIyNy4wMTE3MTkgQyAxODAuMDc4MTI1IDIyOC41NTg1OTQgMTc3Ljc4NTE1NiAyMjguNzkyOTY5IDE3Ni4yMjY1NjIgMjI3LjUxNTYyNSBDIDE3NC42Njc5NjkgMjI2LjIzODI4MSAxNzQuNDQ1MzEyIDIyMy45NDE0MDYgMTc1LjcyMjY1NiAyMjIuMzgyODEyIEMgMTg3LjIyMjY1NiAyMDguNDA2MjUgMjA0LjIwMzEyNSAyMDAuMDIzNDM4IDIyMi43NTM5MDYgMTk5LjA1NDY4OCBMIDIyMi43NTM5MDYgMTA0LjY0ODQzOCBDIDIyMi43NTM5MDYgOTkuNTE1NjI1IDIxOC41NzgxMjUgOTUuMzM1OTM4IDIxMy40NDkyMTkgOTUuMzM1OTM4IEMgMjA4LjMxNjQwNiA5NS4zMzU5MzggMjA0LjEzNjcxOSA5OS41MDc4MTIgMjA0LjEzNjcxOSAxMDQuNjQ4NDM4IEwgMjA0LjEzNjcxOSAxNzQuODk4NDM4IEMgMjA0LjEzNjcxOSAxNzYuOTE0MDYyIDIwMi41IDE3OC41MzkwNjIgMjAwLjQ5NjA5NCAxNzguNTM5MDYyIEMgMTk4LjQ4NDM3NSAxNzguNTM5MDYyIDE5Ni44NTU0NjkgMTc2LjkwMjM0NCAxOTYuODU1NDY5IDE3NC44OTg0MzggTCAxOTYuODU1NDY5IDkxLjY5NTMxMiBDIDE5Ni44NTU0NjkgODguMDA3ODEyIDE5NC42Nzk2ODggODQuNjY3OTY5IDE5MS4zMDA3ODEgODMuMTc1NzgxIEMgMTg4LjkzNzUgODIuMTI4OTA2IDE4Ni4xNjAxNTYgODIuMTI4OTA2IDE4My43OTY4NzUgODMuMTc1NzgxIEMgMTgwLjQxNzk2OSA4NC42Njc5NjkgMTc4LjIzODI4MSA4OC4wMDc4MTIgMTc4LjIzODI4MSA5MS42OTUzMTIgTCAxNzguMjM4MjgxIDE3NC44OTg0MzggQyAxNzguMjM4MjgxIDE3Ni45MTQwNjIgMTc2LjYwNTQ2OSAxNzguNTM5MDYyIDE3NC42MDE1NjIgMTc4LjUzOTA2MiBDIDE3Mi41ODU5MzggMTc4LjUzOTA2MiAxNzAuOTYwOTM4IDE3Ni45MDIzNDQgMTcwLjk2MDkzOCAxNzQuODk4NDM4IEwgMTcwLjk2MDkzOCAxMDkuNDY4NzUgQyAxNzAuOTYwOTM4IDEwNi45NjA5MzggMTY5Ljk3MjY1NiAxMDQuNjA5Mzc1IDE2OC4xOTE0MDYgMTAyLjg0NzY1NiBDIDE2Ni40MTAxNTYgMTAxLjA4NTkzOCAxNjQuMDQ2ODc1IDEwMC4xNTYyNSAxNjEuNTMxMjUgMTAwLjE2NDA2MiBDIDE1Ni40Njg3NSAxMDAuMjM0Mzc1IDE1Mi4zNDM3NSAxMDQuNDkyMTg4IDE1Mi4zNDM3NSAxMDkuNjYwMTU2IEwgMTUyLjM0Mzc1IDE4Ni41OTM3NSBDIDE1Mi4zNDM3NSAxODguNjA5Mzc1IDE1MC43MDcwMzEgMTkwLjIzNDM3NSAxNDguNzAzMTI1IDE5MC4yMzQzNzUgQyAxNDYuNjkxNDA2IDE5MC4yMzQzNzUgMTQ1LjA2MjUgMTg4LjU5NzY1NiAxNDUuMDYyNSAxODYuNTkzNzUgTCAxNDUuMDYyNSAxNDAuNjA5Mzc1IEMgMTQ1LjA2MjUgMTM1LjQ4MDQ2OSAxNDAuODkwNjI1IDEzMS4yOTY4NzUgMTM1Ljc2MTcxOSAxMzEuMjk2ODc1IEMgMTMwLjYyODkwNiAxMzEuMjk2ODc1IDEyNi40NTcwMzEgMTM1LjQ3MjY1NiAxMjYuNDU3MDMxIDE0MC42MDkzNzUgTCAxMjYuNDU3MDMxIDIzMS42Mjg5MDYgQyAxMjYuNDU3MDMxIDI1MC42MTMyODEgMTM1LjU5NzY1NiAyNjguODQzNzUgMTUwLjkwMjM0NCAyODAuMzgyODEyIEMgMTUwLjkwMjM0NCAyODAuMzgyODEyIDE1MC45MTAxNTYgMjgwLjM4MjgxMiAxNTAuOTEwMTU2IDI4MC4zOTA2MjUgQyAxNTguMDc0MjE5IDI4NS44MDA3ODEgMTY2LjUyNzM0NCAyODkuNjE3MTg4IDE3NS4zMjgxMjUgMjkxLjQwNjI1IEMgMTc1LjMxNjQwNiAyOTEuNDA2MjUgMTc1LjMyODEyNSAyOTEuNDA2MjUgMTc1LjMyODEyNSAyOTEuNDA2MjUgWiBNIDE3NS4zMjgxMjUgMjkxLjQwNjI1ICIgZmlsbC1vcGFjaXR5PSIxIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48ZyBjbGlwLXBhdGg9InVybCgjOGUzN2RhODJjOCkiPjxwYXRoIGZpbGw9IiNmYTA2MDEiIGQ9Ik0gOTQuMjU3ODEyIDE2OC41IEMgOTQuMjU3ODEyIDE2OS4xOTE0MDYgOTQuMjI2NTYyIDE2OS44Nzg5MDYgOTQuMTU2MjUgMTcwLjU2NjQwNiBDIDk0LjA4OTg0NCAxNzEuMjUzOTA2IDkzLjk4ODI4MSAxNzEuOTMzNTk0IDkzLjg1NTQ2OSAxNzIuNjA5Mzc1IEMgOTMuNzE4NzUgMTczLjI4NTE1NiA5My41NTA3ODEgMTczLjk1NzAzMSA5My4zNTE1NjIgMTc0LjYxNzE4OCBDIDkzLjE1MjM0NCAxNzUuMjc3MzQ0IDkyLjkxNzk2OSAxNzUuOTI1NzgxIDkyLjY1NjI1IDE3Ni41NjI1IEMgOTIuMzkwNjI1IDE3Ny4xOTkyMTkgOTIuMDk3NjU2IDE3Ny44MjAzMTIgOTEuNzczNDM4IDE3OC40Mjk2ODggQyA5MS40NDUzMTIgMTc5LjAzOTA2MiA5MS4wOTM3NSAxNzkuNjI4OTA2IDkwLjcxMDkzOCAxODAuMjAzMTI1IEMgOTAuMzI4MTI1IDE4MC43NzczNDQgODkuOTE0MDYyIDE4MS4zMjgxMjUgODkuNDc2NTYyIDE4MS44NjMyODEgQyA4OS4wMzkwNjIgMTgyLjM5NDUzMSA4OC41NzgxMjUgMTgyLjkwNjI1IDg4LjA4OTg0NCAxODMuMzk0NTMxIEMgODcuNjAxNTYyIDE4My44ODI4MTIgODcuMDkzNzUgMTg0LjM0Mzc1IDg2LjU1ODU5NCAxODQuNzgxMjUgQyA4Ni4wMjczNDQgMTg1LjIxODc1IDg1LjQ3MjY1NiAxODUuNjI4OTA2IDg0Ljg5ODQzOCAxODYuMDExNzE5IEMgODQuMzI0MjE5IDE4Ni4zOTQ1MzEgODMuNzM0Mzc1IDE4Ni43NSA4My4xMjUgMTg3LjA3NDIxOSBDIDgyLjUxOTUzMSAxODcuNDAyMzQ0IDgxLjg5NDUzMSAxODcuNjk1MzEyIDgxLjI1NzgxMiAxODcuOTYwOTM4IEMgODAuNjIxMDk0IDE4OC4yMjI2NTYgNzkuOTcyNjU2IDE4OC40NTcwMzEgNzkuMzEyNSAxODguNjU2MjUgQyA3OC42NTIzNDQgMTg4Ljg1NTQ2OSA3Ny45ODQzNzUgMTg5LjAyMzQzOCA3Ny4zMDg1OTQgMTg5LjE1NjI1IEMgNzYuNjI4OTA2IDE4OS4yOTI5NjkgNzUuOTQ5MjE5IDE4OS4zOTQ1MzEgNzUuMjYxNzE5IDE4OS40NjA5MzggQyA3NC41NzQyMTkgMTg5LjUyNzM0NCA3My44ODY3MTkgMTg5LjU2MjUgNzMuMTk5MjE5IDE4OS41NjI1IEMgNzIuNTA3ODEyIDE4OS41NjI1IDcxLjgyMDMxMiAxODkuNTI3MzQ0IDcxLjEzMjgxMiAxODkuNDYwOTM4IEMgNzAuNDQ1MzEyIDE4OS4zOTQ1MzEgNjkuNzY1NjI1IDE4OS4yOTI5NjkgNjkuMDg5ODQ0IDE4OS4xNTYyNSBDIDY4LjQxNDA2MiAxODkuMDIzNDM4IDY3Ljc0NjA5NCAxODguODU1NDY5IDY3LjA4NTkzOCAxODguNjU2MjUgQyA2Ni40MjU3ODEgMTg4LjQ1NzAzMSA2NS43NzczNDQgMTg4LjIyMjY1NiA2NS4xMzY3MTkgMTg3Ljk2MDkzOCBDIDY0LjUgMTg3LjY5NTMxMiA2My44Nzg5MDYgMTg3LjQwMjM0NCA2My4yNjk1MzEgMTg3LjA3NDIxOSBDIDYyLjY2MDE1NiAxODYuNzUgNjIuMDcwMzEyIDE4Ni4zOTQ1MzEgNjEuNDk2MDk0IDE4Ni4wMTE3MTkgQyA2MC45MjE4NzUgMTg1LjYyODkwNiA2MC4zNzEwOTQgMTg1LjIxODc1IDU5LjgzNTkzOCAxODQuNzgxMjUgQyA1OS4zMDQ2ODggMTg0LjM0Mzc1IDU4Ljc5Mjk2OSAxODMuODgyODEyIDU4LjMwNDY4OCAxODMuMzk0NTMxIEMgNTcuODE2NDA2IDE4Mi45MDYyNSA1Ny4zNTU0NjkgMTgyLjM5NDUzMSA1Ni45MTc5NjkgMTgxLjg2MzI4MSBDIDU2LjQ4MDQ2OSAxODEuMzI4MTI1IDU2LjA3MDMxMiAxODAuNzc3MzQ0IDU1LjY4NzUgMTgwLjIwMzEyNSBDIDU1LjMwNDY4OCAxNzkuNjI4OTA2IDU0Ljk0OTIxOSAxNzkuMDM5MDYyIDU0LjYyNSAxNzguNDI5Njg4IEMgNTQuMjk2ODc1IDE3Ny44MjAzMTIgNTQuMDAzOTA2IDE3Ny4xOTkyMTkgNTMuNzM4MjgxIDE3Ni41NjI1IEMgNTMuNDc2NTYyIDE3NS45MjU3ODEgNTMuMjQ2MDk0IDE3NS4yNzczNDQgNTMuMDQyOTY5IDE3NC42MTcxODggQyA1Mi44NDM3NSAxNzMuOTU3MDMxIDUyLjY3NTc4MSAxNzMuMjg1MTU2IDUyLjU0Mjk2OSAxNzIuNjA5Mzc1IEMgNTIuNDA2MjUgMTcxLjkzMzU5NCA1Mi4zMDQ2ODggMTcxLjI1MzkwNiA1Mi4yMzgyODEgMTcwLjU2NjQwNiBDIDUyLjE3MTg3NSAxNjkuODc4OTA2IDUyLjEzNjcxOSAxNjkuMTkxNDA2IDUyLjEzNjcxOSAxNjguNSBDIDUyLjEzNjcxOSAxNjcuODEyNSA1Mi4xNzE4NzUgMTY3LjEyNSA1Mi4yMzgyODEgMTY2LjQzNzUgQyA1Mi4zMDQ2ODggMTY1Ljc1IDUyLjQwNjI1IDE2NS4wNzAzMTIgNTIuNTQyOTY5IDE2NC4zOTQ1MzEgQyA1Mi42NzU3ODEgMTYzLjcxNDg0NCA1Mi44NDM3NSAxNjMuMDQ2ODc1IDUzLjA0Mjk2OSAxNjIuMzg2NzE5IEMgNTMuMjQ2MDk0IDE2MS43MjY1NjIgNTMuNDc2NTYyIDE2MS4wNzgxMjUgNTMuNzM4MjgxIDE2MC40NDE0MDYgQyA1NC4wMDM5MDYgMTU5LjgwNDY4OCA1NC4yOTY4NzUgMTU5LjE4MzU5NCA1NC42MjUgMTU4LjU3NDIxOSBDIDU0Ljk0OTIxOSAxNTcuOTY0ODQ0IDU1LjMwNDY4OCAxNTcuMzc1IDU1LjY4NzUgMTU2LjgwMDc4MSBDIDU2LjA3MDMxMiAxNTYuMjI2NTYyIDU2LjQ4MDQ2OSAxNTUuNjc1NzgxIDU2LjkxNzk2OSAxNTUuMTQwNjI1IEMgNTcuMzU1NDY5IDE1NC42MDkzNzUgNTcuODE2NDA2IDE1NC4wOTc2NTYgNTguMzA0Njg4IDE1My42MDkzNzUgQyA1OC43OTI5NjkgMTUzLjEyMTA5NCA1OS4zMDQ2ODggMTUyLjY2MDE1NiA1OS44MzU5MzggMTUyLjIyMjY1NiBDIDYwLjM3MTA5NCAxNTEuNzg1MTU2IDYwLjkyMTg3NSAxNTEuMzc1IDYxLjQ5NjA5NCAxNTAuOTg4MjgxIEMgNjIuMDcwMzEyIDE1MC42MDU0NjkgNjIuNjYwMTU2IDE1MC4yNTM5MDYgNjMuMjY5NTMxIDE0OS45MjU3ODEgQyA2My44Nzg5MDYgMTQ5LjYwMTU2MiA2NC41IDE0OS4zMDg1OTQgNjUuMTM2NzE5IDE0OS4wNDI5NjkgQyA2NS43NzczNDQgMTQ4Ljc4MTI1IDY2LjQyNTc4MSAxNDguNTQ2ODc1IDY3LjA4NTkzOCAxNDguMzQ3NjU2IEMgNjcuNzQ2MDk0IDE0OC4xNDg0MzggNjguNDE0MDYyIDE0Ny45ODA0NjkgNjkuMDg5ODQ0IDE0Ny44NDM3NSBDIDY5Ljc2NTYyNSAxNDcuNzEwOTM4IDcwLjQ0NTMxMiAxNDcuNjA5Mzc1IDcxLjEzMjgxMiAxNDcuNTQyOTY5IEMgNzEuODIwMzEyIDE0Ny40NzY1NjIgNzIuNTA3ODEyIDE0Ny40NDE0MDYgNzMuMTk5MjE5IDE0Ny40NDE0MDYgQyA3My44ODY3MTkgMTQ3LjQ0MTQwNiA3NC41NzQyMTkgMTQ3LjQ3NjU2MiA3NS4yNjE3MTkgMTQ3LjU0Mjk2OSBDIDc1Ljk0OTIxOSAxNDcuNjA5Mzc1IDc2LjYyODkwNiAxNDcuNzEwOTM4IDc3LjMwODU5NCAxNDcuODQzNzUgQyA3Ny45ODQzNzUgMTQ3Ljk4MDQ2OSA3OC42NTIzNDQgMTQ4LjE0ODQzOCA3OS4zMTI1IDE0OC4zNDc2NTYgQyA3OS45NzI2NTYgMTQ4LjU0Njg3NSA4MC42MjEwOTQgMTQ4Ljc4MTI1IDgxLjI1NzgxMiAxNDkuMDQyOTY5IEMgODEuODk0NTMxIDE0OS4zMDg1OTQgODIuNTE5NTMxIDE0OS42MDE1NjIgODMuMTI1IDE0OS45MjU3ODEgQyA4My43MzQzNzUgMTUwLjI1MzkwNiA4NC4zMjQyMTkgMTUwLjYwNTQ2OSA4NC44OTg0MzggMTUwLjk4ODI4MSBDIDg1LjQ3MjY1NiAxNTEuMzc1IDg2LjAyNzM0NCAxNTEuNzg1MTU2IDg2LjU1ODU5NCAxNTIuMjIyNjU2IEMgODcuMDkzNzUgMTUyLjY2MDE1NiA4Ny42MDE1NjIgMTUzLjEyMTA5NCA4OC4wODk4NDQgMTUzLjYwOTM3NSBDIDg4LjU3ODEyNSAxNTQuMDk3NjU2IDg5LjAzOTA2MiAxNTQuNjA5Mzc1IDg5LjQ3NjU2MiAxNTUuMTQwNjI1IEMgODkuOTE0MDYyIDE1NS42NzU3ODEgOTAuMzI4MTI1IDE1Ni4yMjY1NjIgOTAuNzEwOTM4IDE1Ni44MDA3ODEgQyA5MS4wOTM3NSAxNTcuMzc1IDkxLjQ0NTMxMiAxNTcuOTY0ODQ0IDkxLjc3MzQzOCAxNTguNTc0MjE5IEMgOTIuMDk3NjU2IDE1OS4xODM1OTQgOTIuMzkwNjI1IDE1OS44MDQ2ODggOTIuNjU2MjUgMTYwLjQ0MTQwNiBDIDkyLjkxNzk2OSAxNjEuMDc4MTI1IDkzLjE1MjM0NCAxNjEuNzI2NTYyIDkzLjM1MTU2MiAxNjIuMzg2NzE5IEMgOTMuNTUwNzgxIDE2My4wNDY4NzUgOTMuNzE4NzUgMTYzLjcxNDg0NCA5My44NTU0NjkgMTY0LjM5NDUzMSBDIDkzLjk4ODI4MSAxNjUuMDcwMzEyIDk0LjA4OTg0NCAxNjUuNzUgOTQuMTU2MjUgMTY2LjQzNzUgQyA5NC4yMjY1NjIgMTY3LjEyNSA5NC4yNTc4MTIgMTY3LjgxMjUgOTQuMjU3ODEyIDE2OC41IFogTSA5NC4yNTc4MTIgMTY4LjUgIiBmaWxsLW9wYWNpdHk9IjEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvZz48ZyBjbGlwLXBhdGg9InVybCgjY2U0MDQ5YzdiZikiPjxwYXRoIGZpbGw9IiNmYTA2MDEiIGQ9Ik0gMzIyLjE4MzU5NCAxNjguNSBDIDMyMi4xODM1OTQgMTY5LjE5MTQwNiAzMjIuMTQ4NDM4IDE2OS44Nzg5MDYgMzIyLjA4MjAzMSAxNzAuNTY2NDA2IEMgMzIyLjAxMTcxOSAxNzEuMjUzOTA2IDMyMS45MTQwNjIgMTcxLjkzMzU5NCAzMjEuNzc3MzQ0IDE3Mi42MDkzNzUgQyAzMjEuNjQ0NTMxIDE3My4yODUxNTYgMzIxLjQ3NjU2MiAxNzMuOTU3MDMxIDMyMS4yNzczNDQgMTc0LjYxNzE4OCBDIDMyMS4wNzQyMTkgMTc1LjI3NzM0NCAzMjAuODQzNzUgMTc1LjkyNTc4MSAzMjAuNTc4MTI1IDE3Ni41NjI1IEMgMzIwLjMxNjQwNiAxNzcuMTk5MjE5IDMyMC4wMTk1MzEgMTc3LjgyMDMxMiAzMTkuNjk1MzEyIDE3OC40Mjk2ODggQyAzMTkuMzcxMDk0IDE3OS4wMzkwNjIgMzE5LjAxNTYyNSAxNzkuNjI4OTA2IDMxOC42MzI4MTIgMTgwLjIwMzEyNSBDIDMxOC4yNSAxODAuNzc3MzQ0IDMxNy44Mzk4NDQgMTgxLjMyODEyNSAzMTcuNDAyMzQ0IDE4MS44NjMyODEgQyAzMTYuOTY0ODQ0IDE4Mi4zOTQ1MzEgMzE2LjUgMTgyLjkwNjI1IDMxNi4wMTU2MjUgMTgzLjM5NDUzMSBDIDMxNS41MjczNDQgMTgzLjg4MjgxMiAzMTUuMDE1NjI1IDE4NC4zNDM3NSAzMTQuNDgwNDY5IDE4NC43ODEyNSBDIDMxMy45NDkyMTkgMTg1LjIxODc1IDMxMy4zOTQ1MzEgMTg1LjYyODkwNiAzMTIuODIwMzEyIDE4Ni4wMTE3MTkgQyAzMTIuMjUgMTg2LjM5NDUzMSAzMTEuNjU2MjUgMTg2Ljc1IDMxMS4wNTA3ODEgMTg3LjA3NDIxOSBDIDMxMC40NDE0MDYgMTg3LjQwMjM0NCAzMDkuODE2NDA2IDE4Ny42OTUzMTIgMzA5LjE3OTY4OCAxODcuOTYwOTM4IEMgMzA4LjU0Mjk2OSAxODguMjIyNjU2IDMwNy44OTQ1MzEgMTg4LjQ1NzAzMSAzMDcuMjM0Mzc1IDE4OC42NTYyNSBDIDMwNi41NzQyMTkgMTg4Ljg1NTQ2OSAzMDUuOTA2MjUgMTg5LjAyMzQzOCAzMDUuMjMwNDY5IDE4OS4xNTYyNSBDIDMwNC41NTQ2ODggMTg5LjI5Mjk2OSAzMDMuODcxMDk0IDE4OS4zOTQ1MzEgMzAzLjE4NzUgMTg5LjQ2MDkzOCBDIDMwMi41IDE4OS41MjczNDQgMzAxLjgxMjUgMTg5LjU2MjUgMzAxLjEyMTA5NCAxODkuNTYyNSBDIDMwMC40MzM1OTQgMTg5LjU2MjUgMjk5Ljc0MjE4OCAxODkuNTI3MzQ0IDI5OS4wNTg1OTQgMTg5LjQ2MDkzOCBDIDI5OC4zNzEwOTQgMTg5LjM5NDUzMSAyOTcuNjg3NSAxODkuMjkyOTY5IDI5Ny4wMTE3MTkgMTg5LjE1NjI1IEMgMjk2LjMzNTkzOCAxODkuMDIzNDM4IDI5NS42Njc5NjkgMTg4Ljg1NTQ2OSAyOTUuMDA3ODEyIDE4OC42NTYyNSBDIDI5NC4zNDc2NTYgMTg4LjQ1NzAzMSAyOTMuNjk5MjE5IDE4OC4yMjI2NTYgMjkzLjA2MjUgMTg3Ljk2MDkzOCBDIDI5Mi40MjU3ODEgMTg3LjY5NTMxMiAyOTEuODAwNzgxIDE4Ny40MDIzNDQgMjkxLjE5NTMxMiAxODcuMDc0MjE5IEMgMjkwLjU4NTkzOCAxODYuNzUgMjg5Ljk5MjE4OCAxODYuMzk0NTMxIDI4OS40MjE4NzUgMTg2LjAxMTcxOSBDIDI4OC44NDc2NTYgMTg1LjYyODkwNiAyODguMjkyOTY5IDE4NS4yMTg3NSAyODcuNzYxNzE5IDE4NC43ODEyNSBDIDI4Ny4yMjY1NjIgMTg0LjM0Mzc1IDI4Ni43MTg3NSAxODMuODgyODEyIDI4Ni4yMzA0NjkgMTgzLjM5NDUzMSBDIDI4NS43NDIxODggMTgyLjkwNjI1IDI4NS4yNzczNDQgMTgyLjM5NDUzMSAyODQuODM5ODQ0IDE4MS44NjMyODEgQyAyODQuNDAyMzQ0IDE4MS4zMjgxMjUgMjgzLjk5MjE4OCAxODAuNzc3MzQ0IDI4My42MDkzNzUgMTgwLjIwMzEyNSBDIDI4My4yMjY1NjIgMTc5LjYyODkwNiAyODIuODcxMDk0IDE3OS4wMzkwNjIgMjgyLjU0Njg3NSAxNzguNDI5Njg4IEMgMjgyLjIyMjY1NiAxNzcuODIwMzEyIDI4MS45MjU3ODEgMTc3LjE5OTIxOSAyODEuNjY0MDYyIDE3Ni41NjI1IEMgMjgxLjM5ODQzOCAxNzUuOTI1NzgxIDI4MS4xNjc5NjkgMTc1LjI3NzM0NCAyODAuOTY4NzUgMTc0LjYxNzE4OCBDIDI4MC43NjU2MjUgMTczLjk1NzAzMSAyODAuNjAxNTYyIDE3My4yODUxNTYgMjgwLjQ2NDg0NCAxNzIuNjA5Mzc1IEMgMjgwLjMzMjAzMSAxNzEuOTMzNTk0IDI4MC4yMzA0NjkgMTcxLjI1MzkwNiAyODAuMTYwMTU2IDE3MC41NjY0MDYgQyAyODAuMDkzNzUgMTY5Ljg3ODkwNiAyODAuMDYyNSAxNjkuMTkxNDA2IDI4MC4wNTg1OTQgMTY4LjUgQyAyODAuMDYyNSAxNjcuODEyNSAyODAuMDkzNzUgMTY3LjEyNSAyODAuMTYwMTU2IDE2Ni40Mzc1IEMgMjgwLjIzMDQ2OSAxNjUuNzUgMjgwLjMzMjAzMSAxNjUuMDcwMzEyIDI4MC40NjQ4NDQgMTY0LjM5NDUzMSBDIDI4MC42MDE1NjIgMTYzLjcxNDg0NCAyODAuNzY1NjI1IDE2My4wNDY4NzUgMjgwLjk2ODc1IDE2Mi4zODY3MTkgQyAyODEuMTY3OTY5IDE2MS43MjY1NjIgMjgxLjM5ODQzOCAxNjEuMDc4MTI1IDI4MS42NjQwNjIgMTYwLjQ0MTQwNiBDIDI4MS45MjU3ODEgMTU5LjgwNDY4OCAyODIuMjIyNjU2IDE1OS4xODM1OTQgMjgyLjU0Njg3NSAxNTguNTc0MjE5IEMgMjgyLjg3MTA5NCAxNTcuOTY0ODQ0IDI4My4yMjY1NjIgMTU3LjM3NSAyODMuNjA5Mzc1IDE1Ni44MDA3ODEgQyAyODMuOTkyMTg4IDE1Ni4yMjY1NjIgMjg0LjQwMjM0NCAxNTUuNjc1NzgxIDI4NC44Mzk4NDQgMTU1LjE0MDYyNSBDIDI4NS4yNzczNDQgMTU0LjYwOTM3NSAyODUuNzQyMTg4IDE1NC4wOTc2NTYgMjg2LjIzMDQ2OSAxNTMuNjA5Mzc1IEMgMjg2LjcxODc1IDE1My4xMjEwOTQgMjg3LjIyNjU2MiAxNTIuNjYwMTU2IDI4Ny43NjE3MTkgMTUyLjIyMjY1NiBDIDI4OC4yOTI5NjkgMTUxLjc4NTE1NiAyODguODQ3NjU2IDE1MS4zNzUgMjg5LjQyMTg3NSAxNTAuOTg4MjgxIEMgMjg5Ljk5MjE4OCAxNTAuNjA1NDY5IDI5MC41ODU5MzggMTUwLjI1MzkwNiAyOTEuMTk1MzEyIDE0OS45MjU3ODEgQyAyOTEuODAwNzgxIDE0OS42MDE1NjIgMjkyLjQyNTc4MSAxNDkuMzA4NTk0IDI5My4wNjI1IDE0OS4wNDI5NjkgQyAyOTMuNjk5MjE5IDE0OC43ODEyNSAyOTQuMzQ3NjU2IDE0OC41NDY4NzUgMjk1LjAwNzgxMiAxNDguMzQ3NjU2IEMgMjk1LjY2Nzk2OSAxNDguMTQ4NDM4IDI5Ni4zMzU5MzggMTQ3Ljk4MDQ2OSAyOTcuMDExNzE5IDE0Ny44NDM3NSBDIDI5Ny42ODc1IDE0Ny43MTA5MzggMjk4LjM3MTA5NCAxNDcuNjA5Mzc1IDI5OS4wNTg1OTQgMTQ3LjU0Mjk2OSBDIDI5OS43NDIxODggMTQ3LjQ3NjU2MiAzMDAuNDMzNTk0IDE0Ny40NDE0MDYgMzAxLjEyMTA5NCAxNDcuNDQxNDA2IEMgMzAxLjgxMjUgMTQ3LjQ0MTQwNiAzMDIuNSAxNDcuNDc2NTYyIDMwMy4xODc1IDE0Ny41NDI5NjkgQyAzMDMuODcxMDk0IDE0Ny42MDkzNzUgMzA0LjU1NDY4OCAxNDcuNzEwOTM4IDMwNS4yMzA0NjkgMTQ3Ljg0Mzc1IEMgMzA1LjkwNjI1IDE0Ny45ODA0NjkgMzA2LjU3NDIxOSAxNDguMTQ4NDM4IDMwNy4yMzQzNzUgMTQ4LjM0NzY1NiBDIDMwNy44OTQ1MzEgMTQ4LjU0Njg3NSAzMDguNTQyOTY5IDE0OC43ODEyNSAzMDkuMTc5Njg4IDE0OS4wNDI5NjkgQyAzMDkuODE2NDA2IDE0OS4zMDg1OTQgMzEwLjQ0MTQwNiAxNDkuNjAxNTYyIDMxMS4wNTA3ODEgMTQ5LjkyNTc4MSBDIDMxMS42NTYyNSAxNTAuMjUzOTA2IDMxMi4yNSAxNTAuNjA1NDY5IDMxMi44MjAzMTIgMTUwLjk4ODI4MSBDIDMxMy4zOTQ1MzEgMTUxLjM3NSAzMTMuOTQ5MjE5IDE1MS43ODUxNTYgMzE0LjQ4MDQ2OSAxNTIuMjIyNjU2IEMgMzE1LjAxNTYyNSAxNTIuNjYwMTU2IDMxNS41MjczNDQgMTUzLjEyMTA5NCAzMTYuMDE1NjI1IDE1My42MDkzNzUgQyAzMTYuNSAxNTQuMDk3NjU2IDMxNi45NjQ4NDQgMTU0LjYwOTM3NSAzMTcuNDAyMzQ0IDE1NS4xNDA2MjUgQyAzMTcuODM5ODQ0IDE1NS42NzU3ODEgMzE4LjI1IDE1Ni4yMjY1NjIgMzE4LjYzMjgxMiAxNTYuODAwNzgxIEMgMzE5LjAxNTYyNSAxNTcuMzc1IDMxOS4zNzEwOTQgMTU3Ljk2NDg0NCAzMTkuNjk1MzEyIDE1OC41NzQyMTkgQyAzMjAuMDE5NTMxIDE1OS4xODM1OTQgMzIwLjMxNjQwNiAxNTkuODA0Njg4IDMyMC41NzgxMjUgMTYwLjQ0MTQwNiBDIDMyMC44NDM3NSAxNjEuMDc4MTI1IDMyMS4wNzQyMTkgMTYxLjcyNjU2MiAzMjEuMjc3MzQ0IDE2Mi4zODY3MTkgQyAzMjEuNDc2NTYyIDE2My4wNDY4NzUgMzIxLjY0NDUzMSAxNjMuNzE0ODQ0IDMyMS43NzczNDQgMTY0LjM5NDUzMSBDIDMyMS45MTQwNjIgMTY1LjA3MDMxMiAzMjIuMDExNzE5IDE2NS43NSAzMjIuMDgyMDMxIDE2Ni40Mzc1IEMgMzIyLjE0ODQzOCAxNjcuMTI1IDMyMi4xODM1OTQgMTY3LjgxMjUgMzIyLjE4MzU5NCAxNjguNSBaIE0gMzIyLjE4MzU5NCAxNjguNSAiIGZpbGwtb3BhY2l0eT0iMSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjwvc3ZnPg==",
                "id": "actions",
                "name": "actions",
                "docsURI": "http://ramen-umai.github.io/turbowarp-Expansions/",
                "color1": "#ff8080",
                "color2": "#ff6b6b",
                "tbShow": true,
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "jsb",
        blockType: Scratch.BlockType.REPORTER,
        text: "JS [CODE]",
        arguments: {
            "CODE": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'alert (\'Hello World !\')',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["jsb"] = async (args, util) => {
        try {
            return eval(args.CODE);
        } catch (e) {
            return `エラー: ${e.message}`;
        };
    };

    blocks.push({
        opcode: "jsa",
        blockType: Scratch.BlockType.COMMAND,
        text: "JS [CODE]",
        arguments: {
            "CODE": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'alert (\'Hello World !\')',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["jsa"] = async (args, util) => {
        try {
            eval(args.CODE);
        } catch (e) {
            return `エラー: ${e.message}`;
        };
    };

    blocks.push({
        opcode: "comment",
        blockType: Scratch.BlockType.COMMAND,
        text: "// [TXT]",
        arguments: {
            "TXT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["comment"] = async (args, util) => {};

    blocks.push({
        opcode: "error",
        blockType: Scratch.BlockType.COMMAND,
        text: "error [TXT]",
        arguments: {
            "TXT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["error"] = async (args, util) => {
        console.error(args["TXT"]);
    };

    blocks.push({
        opcode: "warn",
        blockType: Scratch.BlockType.COMMAND,
        text: "warn [TXT]",
        arguments: {
            "TXT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["warn"] = async (args, util) => {
        console.warn(args["TXT"]);
    };

    blocks.push({
        opcode: "log",
        blockType: Scratch.BlockType.COMMAND,
        text: "log [TXT]",
        arguments: {
            "TXT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["log"] = async (args, util) => {
        console.log(args["TXT"]);
    };

    blocks.push({
        opcode: "result2",
        blockType: Scratch.BlockType.REPORTER,
        text: "前回のpromptの結果",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["result2"] = async (args, util) => {
        if (Boolean((variables['savep'] == null))) {
            console.error('値が空です');

        } else {
            return variables['savep']

        };
    };

    blocks.push({
        opcode: "result1",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "前回のconfilmの結果",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["result1"] = async (args, util) => {
        if (Boolean((variables['savec'] == null))) {
            console.error('値が空です');

        } else {
            return variables['savec']

        };
    };

    blocks.push({
        opcode: "prompt",
        blockType: Scratch.BlockType.REPORTER,
        text: "prompt [TXT]",
        arguments: {
            "TXT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["prompt"] = async (args, util) => {
        variables['savep'] = prompt(args["TXT"])
        return variables['savep']
    };

    blocks.push({
        opcode: "confilm",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "confilm [TXT]",
        arguments: {
            "TXT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["confilm"] = async (args, util) => {
        variables['savec'] = confirm(args["TXT"])
        return variables['savec']
    };

    blocks.push({
        opcode: "alert",
        blockType: Scratch.BlockType.COMMAND,
        text: "alert [TXT]",
        arguments: {
            "TXT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["alert"] = async (args, util) => {
        alert(args["TXT"])
    };

    Scratch.extensions.register(new Extension());
})(Scratch);