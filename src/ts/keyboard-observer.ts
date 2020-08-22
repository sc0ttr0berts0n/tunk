export default class KeyboardObserver {
    public key: number = NaN;
    public code: number = NaN;

    constructor() {
        this.init();
    }

    public init() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    public reinit() {
        this.key = NaN;
        this.code = NaN;
    }

    private handleKeyPress(e: KeyboardEvent) {
        if (e.which >= 65 && e.which <= 90) {
            this.key = parseInt(e.key);
            this.code = e.which;
        }
    }
}
