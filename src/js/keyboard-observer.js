var KeyboardObserver = /** @class */ (function () {
    function KeyboardObserver() {
        this.key = null;
        this.code = null;
        this.init();
    }
    KeyboardObserver.prototype.init = function () {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    };
    KeyboardObserver.prototype.reinit = function () {
        this.key = null;
        this.code = null;
    };
    KeyboardObserver.prototype.handleKeyPress = function (e) {
        if (e.which >= 65 && e.which <= 90) {
            this.key = e.key;
            this.code = e.which;
        }
    };
    return KeyboardObserver;
}());
//# sourceMappingURL=keyboard-observer.js.map