class KeyboardObserver {
    constructor() {
        this.key = null;
        this.code = null;
        this.init();
    }
    init() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    reinit() {
        this.key = null;
        this.code = null;
    }
    handleKeyPress(e) {
        if (e.which >= 65 && e.which <= 90) {
            this.key = e.key;
            this.code = e.which;
        }
    }
}
