import TrustedEvent from "./TrustedEvent";
import UIPanel from "./UIPanel";

let panel = new UIPanel("AutoType");
panel.addButton('start', () => {
    bot();
});

function bot () {
    let inputBox = document.getElementsByClassName("js-input-box")[0];

    function sendFakeKeystroke(type, key) {
        Object.values(inputBox)[0].handle(TrustedEvent(KeyboardEvent, type, {
            target: inputBox,
            which: key,
            key: key,
            currentTarget: inputBox,
            delegateTarget: inputBox,
            defaultPrevented: false
        }))
    }

    let inGame = !!document.getElementById("js-game");

    if (inGame) {

        let parcelRequire = window[Object.keys(window).find(key => key.includes("parcel"))];
        let targetModule = Object.values(parcelRequire.cache).find(module => module?.exports?.default?.prototype?.gameOver).exports;
        let _updateTransform = targetModule.default.prototype.updateTransform;
        targetModule.default.prototype.updateTransform = function () {

            let gameLetters = this.controller.state.words.join().replaceAll(",", "").split("");

            gameLetters.forEach((letter, index) => {
                setTimeout(function () {
                    sendFakeKeystroke('keydown', letter);
                }, index * 100)
            });

            targetModule.default.prototype.updateTransform = _updateTransform;
            return _updateTransform.apply(this, arguments);
        }

    } else {
        let letters = Array.from(document.getElementsByClassName("letter"));

        if (letters[0].classList.contains("letter--falling")) {
            letters.reverse();
        }

        let startingLetter = letters.findIndex(el => el.classList.contains("is-active"));
        if (startingLetter === -1) {
            startingLetter = letters.findIndex(el => el.classList.contains("is-wrong"));
        }

        letters.slice(startingLetter).forEach((letter, index) => {

            let character = letter.innerText;

            if (character.length == 0) {
                character = letter.innerHTML;
            }

            character = character.replace(" ", " ");

            setTimeout(function () {
                sendFakeKeystroke('keydown', character);
            }, index * 50)
        });
    }

}