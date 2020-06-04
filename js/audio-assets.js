class AudioAssets {
    constructor(game) {
        this.game = game;
        this.cannonFire = new Howl({ src: ['/assets/audio/canon1.mp3'] });
    }
}
