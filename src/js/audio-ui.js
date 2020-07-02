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
//# sourceMappingURL=audio-ui.js.map