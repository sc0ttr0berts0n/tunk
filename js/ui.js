const modalTogglers = document.querySelectorAll('[data-modal-toggler]');
modalTogglers.forEach((toggler) => {
    const modal = document.querySelector(
        `[data-modal="${toggler.dataset.modalToggler}"]`
    );

    const closeButton = modal.querySelector('.modal--close');

    toggler.addEventListener('click', () => {
        game.paused = true;
        modal.classList.add('modal--container__visible');
        closeButton.focus();
        closeButton.addEventListener('click', () => {
            modal.classList.remove('modal--container__visible');
            game.paused = false;
            toggler.focus();
        });
    });
});

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

const methodRunners = document.querySelectorAll('[data-game-method]');
methodRunners.forEach((runner) => {
    runner.addEventListener('click', () => {
        const method = runner.dataset.gameMethod;
        if (method && game[method]) {
            game[method]();
        }
    });
});
