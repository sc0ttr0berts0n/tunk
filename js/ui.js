// sets up the opening and closing of modals
const modalTogglers = document.querySelectorAll('[data-modal-toggler]');
modalTogglers.forEach((toggler) => {
    const modal = document.querySelector(
        `[data-modal="${toggler.dataset.modalToggler}"]`
    );

    const closeButton = modal.querySelector('.modal--close');

    toggler.addEventListener('click', () => {
        // remember if was open
        const wasOpen = modal.classList.contains('modal--container__visible');

        // close any open toggler first
        const openModals = document.querySelectorAll(
            '.modal--container__visible'
        );

        if (openModals) {
            openModals.forEach((openModal) => {
                openModal.classList.remove('modal--container__visible');
            });
        }

        // pause the game
        game.paused = true;

        // open the target modal
        if (wasOpen) {
            modal.classList.remove('modal--container__visible');
        } else {
            modal.classList.add('modal--container__visible');
        }
        closeButton.focus();
        closeButton.addEventListener('click', () => {
            modal.classList.remove('modal--container__visible');
            game.paused = false;
            toggler.focus();
        });
    });
});

// toggles game object boolean passed in through data-game-boolean attribute
const booleanTogglers = document.querySelectorAll('[data-game-boolean]');
booleanTogglers.forEach((toggler) => {
    const cssClass = toggler.classList.toString();
    const targetBoolean = toggler.dataset.gameBoolean;
    toggler.addEventListener('click', () => {
        game[targetBoolean] = !game[targetBoolean];
        if (game[targetBoolean]) {
            toggler.classList.remove(`${cssClass}__off`);
            toggler.classList.add(`${cssClass}__on`);
        } else {
            toggler.classList.add(`${cssClass}__off`);
            toggler.classList.remove(`${cssClass}__on`);
        }
    });
});

// runs a method in game object passed in as data on data-game-method attribute
const methodRunners = document.querySelectorAll('[data-game-method]');
methodRunners.forEach((runner) => {
    runner.addEventListener('click', () => {
        const method = runner.dataset.gameMethod;
        if (method && game[method]) {
            game[method]();
        }
    });
});

// show or hide the title
const showTitle = sessionStorage.getItem('tunk-show-title') !== 'false';
const titleScreen = document.querySelector('[data-title-screen]');
titleScreen.addEventListener('click', () => {
    sessionStorage.setItem('tunk-show-title', 'false');
    removeTitleScreen();
});

// function to remove title screen via class addition
// unpauses the game;
const removeTitleScreen = () => {
    titleScreen.classList.add('title--container__hide');
    setTimeout(() => {
        game.paused = false;
    }, 1500);
};

// when the game is loaded, remove the title screen, either
// immediately, or after a duration, depending on whether
// its been cleared in the past via session storage.
document.addEventListener('DOMContentLoaded', () => {
    if (showTitle) {
        setTimeout(removeTitleScreen, 5000);
    } else {
        removeTitleScreen();
    }
});
