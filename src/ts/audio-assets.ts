import { Howl, Howler } from 'howler';
import Game from './game';

export default class AudioAssets {
    public game: Game;
    public bgm = new Howl({ src: ['/assets/audio/fsharptunk4.mp3'] });
    public death = new Howl({ src: ['/assets/audio/deathsound.mp3'] });
    public cannonFire = new Howl({ src: ['/assets/audio/canon1.mp3'] });
    public moveDepart = new Howl({ src: ['/assets/audio/depart.mp3'] });
    public moveArrive = new Howl({ src: ['/assets/audio/arrive.mp3'] });
    public wallBreak = new Howl({ src: ['/assets/audio/wallbreak2.mp3'] });
    public explosion = new Howl({ src: ['/assets/audio/impact_sample.mp3'] });
    public missileTravel = new Howl({
        src: ['/assets/audio/missile-travel.mp3'],
    });
    public missileDestroy = new Howl({
        src: ['/assets/audio/missile-destroy.mp3'],
    });

    constructor(game: Game) {
        this.game = game;
    }
}
