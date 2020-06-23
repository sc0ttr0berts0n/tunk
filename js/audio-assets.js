class AudioAssets {
    constructor(game) {
        this.game = game;
        this.bgm = new Howl({ src: ['/assets/audio/fsharptunk_vD.mp3'] });
        this.death = new Howl({ src: ['/assets/audio/deathsound.mp3'] });
        this.cannonFire = new Howl({ src: ['/assets/audio/canon1.mp3'] });
        this.moveDepart = new Howl({ src: ['/assets/audio/depart.mp3'] });
        this.moveArrive = new Howl({ src: ['/assets/audio/arrive.mp3'] });
        this.wallBreak = new Howl({ src: ['/assets/audio/wallbreak2.mp3'] });
    }
}
