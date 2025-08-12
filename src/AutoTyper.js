import TrustedEvent from './TrustedEvent';

export default class AutoTyper {
    constructor() {
        this.delay = 100;
        this.isRunning = false;
        this.timeoutId = null;
        this.onComplete = () => {};
    }

    setDelay(ms) {
        this.delay = ms;
    }

    isTyping() {
        return this.isRunning;
    }

    stop() {
        this.isRunning = false;
        clearTimeout(this.timeoutId);
    }

    start(onComplete = () => {}) {
        this.isRunning = true;
        this.onComplete = onComplete;

        const inputBox = document.getElementsByClassName("js-input-box")[0];
        const sendKey = (key) => {
            if (!this.isRunning) return;
            Object.values(inputBox)[0].handle(TrustedEvent(KeyboardEvent, 'keydown', {
                target: inputBox,
                which: key,
                key,
                currentTarget: inputBox,
                delegateTarget: inputBox,
                defaultPrevented: false
            }));
        };

        const inGame = !!document.getElementById("js-game");

        if (inGame) {
            this._handleInGame(sendKey);
        } else {
            this._handleNormalTyping(sendKey);
        }
    }

    _handleInGame(sendKey) {
        const parcelRequire = window[Object.keys(window).find(key => key.includes("parcel"))];
        const targetModule = Object.values(parcelRequire.cache).find(mod =>
            mod?.exports?.default?.prototype?.gameOver
        ).exports;

        const _updateTransform = targetModule.default.prototype.updateTransform;
        targetModule.default.prototype.updateTransform = () => {
            const letters = this._getGameLetters();
            this._typeLetters(letters, sendKey, () => {
                this.stop();
                this.onComplete();
            });

            targetModule.default.prototype.updateTransform = _updateTransform;
            return _updateTransform.apply(this, arguments);
        };
    }

    _handleNormalTyping(sendKey) {
        const letters = Array.from(document.getElementsByClassName("letter"));
        if (letters[0]?.classList.contains("letter--falling")) {
            letters.reverse();
        }

        let startIndex = letters.findIndex(el => el.classList.contains("is-active") || el.classList.contains("is-wrong"));
        if (startIndex === -1) startIndex = 0;

        const chars = letters.slice(startIndex).map(el =>
            (el.innerText || el.innerHTML).replace(" ", " ")
        );

        this._typeLetters(chars, sendKey, () => {
            this.stop();
            this.onComplete();
        });
    }

    _typeLetters(letters, sendKey, onComplete) {
        let i = 0;
        const typeNext = () => {
            if (!this.isRunning || i >= letters.length) {
                onComplete();
                return;
            }
            sendKey(letters[i]);
            i++;
            this.timeoutId = setTimeout(typeNext, this.delay);
        };
        typeNext();
    }

    _getGameLetters() {
        const gameLetters = document.querySelector("#js-game")?.__vue__?.controller?.state?.words;
        return gameLetters ? gameLetters.join("").split("") : [];
    }
}