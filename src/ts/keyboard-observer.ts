export default class KeyboardObserver {
    public key: number = NaN;
    public code: number = NaN;

    constructor() {
        this.init();
    }
    init() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    reinit() {
        this.key = NaN;
        this.code = NaN;
    }
    handleKeyPress(e: KeyboardEvent) {
        if (e.which >= 65 && e.which <= 90) {
            this.key = parseInt(e.key);
            this.code = e.which;
        }
    }
}
