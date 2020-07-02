var buttons = document.querySelectorAll('.audio--button');
buttons.forEach(function (button) {
    var pathToAudio = "/assets/audio/" + button.dataset.src;
    var sound = new Howl({
        src: [pathToAudio],
    });
    var _clickHandler = function () {
        if (sound.playing()) {
            sound.stop();
        }
        else {
            sound.play();
        }
        button.classList.toggle('audio--button__active');
    };
    button.addEventListener('click', _clickHandler);
});
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
// sets up the opening and closing of modals
var modalTogglers = document.querySelectorAll('[data-modal-toggler]');
modalTogglers.forEach(function (toggler) {
    var modal = document.querySelector("[data-modal=\"" + toggler.dataset.modalToggler + "\"]");
    var closeButton = modal.querySelector('.modal--close');
    toggler.addEventListener('click', function () {
        // remember if was open
        var wasOpen = modal.classList.contains('modal--container__visible');
        // close any open toggler first
        var openModals = document.querySelectorAll('.modal--container__visible');
        if (openModals) {
            openModals.forEach(function (openModal) {
                openModal.classList.remove('modal--container__visible');
            });
        }
        // pause the game
        game.paused = true;
        // open the target modal
        if (wasOpen) {
            modal.classList.remove('modal--container__visible');
        }
        else {
            modal.classList.add('modal--container__visible');
        }
        closeButton.focus();
        closeButton.addEventListener('click', function () {
            modal.classList.remove('modal--container__visible');
            game.paused = false;
            toggler.focus();
        });
    });
});
// toggles game object boolean passed in through data-game-boolean attribute
var booleanTogglers = document.querySelectorAll('[data-game-boolean]');
booleanTogglers.forEach(function (toggler) {
    var cssClass = toggler.classList.toString();
    var targetBoolean = toggler.dataset.gameBoolean;
    toggler.addEventListener('click', function () {
        game[targetBoolean] = !game[targetBoolean];
        if (game[targetBoolean]) {
            toggler.classList.remove(cssClass + "__off");
            toggler.classList.add(cssClass + "__on");
        }
        else {
            toggler.classList.add(cssClass + "__off");
            toggler.classList.remove(cssClass + "__on");
        }
    });
});
// runs a method in game object passed in as data on data-game-method attribute
var methodRunners = document.querySelectorAll('[data-game-method]');
methodRunners.forEach(function (runner) {
    runner.addEventListener('click', function () {
        var method = runner.dataset.gameMethod;
        if (method && game[method]) {
            game[method]();
        }
    });
});
// show or hide the title
var showTitle = sessionStorage.getItem('tunk-show-title') !== 'false';
var titleScreen = document.querySelector('[data-title-screen]');
titleScreen.addEventListener('click', function () {
    sessionStorage.setItem('tunk-show-title', 'false');
    removeTitleScreen();
});
// function to remove title screen via class addition
// unpauses the game;
var removeTitleScreen = function () {
    titleScreen.classList.add('title--container__hide');
    setTimeout(function () {
        game.paused = false;
    }, 1500);
};
// when the game is loaded, remove the title screen, either
// immediately, or after a duration, depending on whether
// its been cleared in the past via session storage.
document.addEventListener('DOMContentLoaded', function () {
    if (showTitle) {
        setTimeout(removeTitleScreen, 5000);
    }
    else {
        removeTitleScreen();
    }
});
// show debug on ```` key press
var debugUI = document.querySelectorAll('[data-debug-ui]');
if (debugUI) {
    document.addEventListener('keydown', function (e) {
        if (e.which == 192) {
            debugUI.forEach(function (el) {
                el.classList.toggle('show');
            });
        }
    });
}
//# sourceMappingURL=app.js.map