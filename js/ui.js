// vars
const showHelpButton = document.querySelector('.help-button');
const closeHelpButton = document.querySelector('.help-close');
const helpPanel = document.querySelector('.help-window');
const showOptionsButton = document.querySelector('.options-button');
const restartButton = document.querySelector('.restart-button');
const closeOptionsButton = document.querySelector('.options-close');
const optionsPanel = document.querySelector('.options-window');
const toggleButton = document.querySelectorAll('.toggle-button');
const reduceMotionButton = document.querySelector('.options-reduce-motion');

// modal open/close
showHelpButton.addEventListener('click', () => {
    helpPanel.style.display = 'block';
});
closeHelpButton.addEventListener('click', () => {
    helpPanel.style.display = 'none';
});
showOptionsButton.addEventListener('click', () => {
    optionsPanel.style.display = 'block';
});
closeOptionsButton.addEventListener('click', () => {
    optionsPanel.style.display = 'none';
});

// visually toggle the toggle buttons
toggleButton.forEach((button) => {
    button.addEventListener('click', (e) => {
        // temp gate to handle buttons that arent reduce motion
        if (e.target.classList.contains('options-reduce-motion')) return;

        if (e.target.classList.contains('toggle-button__off')) {
            e.target.classList.remove('toggle-button__off');
            e.target.classList.add('toggle-button__on');
            console.log('lol');
        } else {
            e.target.classList.add('toggle-button__off');
            e.target.classList.remove('toggle-button__on');
            console.log('jk');
        }
    });
});

reduceMotionButton.addEventListener('click', (e) => {
    game.reduceMotion = !game.reduceMotion;
    if (game.reduceMotion) {
        e.target.classList.remove('toggle-button__off');
        e.target.classList.add('toggle-button__on');
    } else {
        e.target.classList.add('toggle-button__off');
        e.target.classList.remove('toggle-button__on');
    }
});

restartButton.addEventListener('click', () => game.reinit());
