import AutoTyper from './AutoTyper';
import UIPanel from './UIPanel';

export default class UIController {
    constructor() {
        this.typer = new AutoTyper();
        this.panel = new UIPanel("AutoType");

        this.initUI();
    }

    initUI() {
        this.panel.addSlider("Delay", 10, 500, this.typer.delay, 10, (val) => {
            this.typer.setDelay(val);
        });

        this.startBtn = this.panel.addButton('Start', (btn) => {
            if (!this.typer.isTyping()) {
                this.start(btn);
            } else {
                this.stop(btn);
            }
        });
    }

    start(button) {
        button.innerText = 'Stop';
        button.style.backgroundColor = '#e74c3c';
        this.typer.start(() => this.stop(button));
    }

    stop(button) {
        button.innerText = 'Start';
        button.style.backgroundColor = '#4CAF50';
        this.typer.stop();
    }
}
