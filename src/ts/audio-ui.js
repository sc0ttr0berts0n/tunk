export default function audioUI() {
    const buttons = document.querySelectorAll('.audio--button');
    buttons.forEach((button) => {
        const pathToAudio = `/assets/audio/${button.dataset.src}`;
        const sound = new Howl({
            src: [pathToAudio],
        });
        const _clickHandler = () => {
            if (sound.playing()) {
                sound.stop();
            } else {
                sound.play();
            }
            button.classList.toggle('audio--button__active');
        };
        button.addEventListener('click', _clickHandler);
    });
}
