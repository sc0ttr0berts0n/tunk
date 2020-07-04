export default class KeyboardObserver {
    public key: string = '';
    public code: number = NaN;
    public history: string[] = [];
    public maxHistory: number = 20;

    constructor() {
        this.init();
    }

    public init() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    public reinit() {
        this.key = '';
        this.code = NaN;
    }

    private handleKeyPress(e: KeyboardEvent) {
        if (e.which >= 65 && e.which <= 90) {
            this.key = e.key;
            this.code = e.which;
            this.handleHistory(e.key);
        }
    }

    private handleHistory(letter: string) {
        this.history.push(letter);
        while (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }
}
