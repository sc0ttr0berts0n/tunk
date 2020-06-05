class AudioAssets {
    constructor(game) {
        this.game = game;
        this.cannonFire = new Howl({ src: ['/assets/audio/canon1.mp3'] });
        this.moveDepart = new Howl({ src: ['/assets/audio/depart.mp3'] });
        this.moveArrive = new Howl({ src: ['/assets/audio/arrive.mp3'] });
    }
}
