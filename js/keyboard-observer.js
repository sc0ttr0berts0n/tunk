class KeyboardObserver {
    constructor() {
        this.key = null;
        this.code = null;
        this.init();
    }
    init() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    handleKeyPress(e) {
        console.log("KeyPress = " + e.which);
        if ((e.which >= 65 && e.which <= 90) || (e.which == 37) || (e.which == 39)) {
            this.key = e.key;
            this.code = e.which;
        }
    }
}
