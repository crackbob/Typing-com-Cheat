const panel = document.createElement('div');
panel.style.position = 'fixed';
panel.style.width = '250px';
panel.style.height = 'auto';
panel.style.backgroundColor = 'rgba(25, 25, 25, 0.75)';
panel.style.zIndex = '999999';
panel.style.left = '100px';
panel.style.top = '100px';
panel.style.userSelect = "none";
panel.style.padding = '10px';
panel.style.borderRadius = '8px';
document.body.append(panel);

let header = document.createElement('h2');
header.style.margin = '0';
header.style.textAlign = "center";
header.style.fontSize = "30px";
header.style.color = '#FFF';
header.style.cursor = 'grab';
header.textContent = "AutoType";
panel.appendChild(header);

const goButton = document.createElement('button');
goButton.textContent = 'Go';
goButton.style.marginTop = '10px';
goButton.style.width = '100%';
goButton.style.padding = '8px';
goButton.style.fontSize = '16px';
goButton.style.backgroundColor = '#4CAF50';
goButton.style.color = 'white';
goButton.style.border = 'none';
goButton.style.borderRadius = '4px';
goButton.style.cursor = 'pointer';
panel.appendChild(goButton);

let isDragging = false;
let offset = { x: 0, y: 0 };

header.addEventListener('mousedown', (event) => {
  isDragging = true;
  offset.x = event.clientX - panel.getBoundingClientRect().left;
  offset.y = event.clientY - panel.getBoundingClientRect().top;
  header.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    panel.style.left = `${event.clientX - offset.x}px`;
    panel.style.top = `${event.clientY - offset.y}px`;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  header.style.cursor = 'grab';
});

goButton.addEventListener('click', () => {
    bot();
});

function bot () {
    let inputBox = document.getElementsByClassName("js-input-box")[0];

    // isTrusted cant be spoofed with a created key event
    function fakeKeyEvent(type, key) {
        let event = {
            key: key,
            type: type,
            isTrusted: true,
            triggered: true,
            preventDefault: () => {},
            stopPropagation: () => {},
            timestamp: Date.now(),
            timeStamp: Date.now(),
            currentTarget: inputBox,
            delegateTarget: inputBox
        };
        event.originalEvent = event;
        return event;
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
                    Object.values(inputBox)[0].handle(fakeKeyEvent('keydown', letter));
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
                Object.values(inputBox)[0].handle(fakeKeyEvent('keydown', character));
            }, index * 50)
        });
    }

}