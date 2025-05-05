export default class {
    constructor(title) {
        let panel = document.createElement('div');
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
        document.body.appendChild(panel);
        
        let header = document.createElement('h2');
        header.style.margin = '0';
        header.style.textAlign = "center";
        header.style.fontSize = "30px";
        header.style.color = '#FFF';
        header.style.cursor = 'grab';
        header.textContent = "AutoType";
        header.textContent = title;
        panel.appendChild(header);

        this.isDragging = false;
        this.offset = { x: 0, y: 0 };

        this.header = header;
        this.panel = panel;

        this.initDrag();
    }

    initDrag() {
        this.header.style.cursor = 'grab';

        this.header.addEventListener('pointerdown', (event) => {
            this.isDragging = true;
            this.offset.x = event.clientX - this.panel.getBoundingClientRect().left;
            this.offset.y = event.clientY - this.panel.getBoundingClientRect().top;
            this.header.setPointerCapture(event.pointerId);
            this.header.style.cursor = 'grabbing';
        });

        this.header.addEventListener('pointermove', (event) => {
            if (this.isDragging) {
                this.panel.style.left = `${event.clientX - this.offset.x}px`;
                this.panel.style.top = `${event.clientY - this.offset.y}px`;
            }
        });

        this.header.addEventListener('pointerup', (event) => {
            this.isDragging = false;
            this.header.releasePointerCapture(event.pointerId);
            this.header.style.cursor = 'grab';
        });
    }

    addButton(title, callback) {
        let button = document.createElement('button');
        button.innerText = title;
        button.style.marginTop = '10px';
        button.style.width = '100%';
        button.style.padding = '8px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.addEventListener("click", callback);

        this.panel.appendChild(button);
    }
}