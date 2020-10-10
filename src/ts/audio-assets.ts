import { Howl, Howler } from 'howler';
import Game from './game';

export default class AudioAssets {
    public game: Game;
    public bgm: Howl;
    public death: Howl;
    public cannonFire: Howl;
    public moveDepart: Howl;
    public moveArrive: Howl;
    public wallBreak: Howl;
    public explosion: Howl;
    public missileTravel: Howl;
    public missileDestroy: Howl;

    constructor(game: Game) {
        this.game = game;
        this.bgm = new Howl({ src: ['/assets/audio/fsharptunk4.mp3'] });
        this.death = new Howl({ src: ['/assets/audio/deathsound.mp3'] });
        this.cannonFire = new Howl({ src: ['/assets/audio/canon1.mp3'] });
        this.moveDepart = new Howl({ src: ['/assets/audio/depart.mp3'] });
        this.moveArrive = new Howl({ src: ['/assets/audio/arrive.mp3'] });
        this.wallBreak = new Howl({ src: ['/assets/audio/wallbreak2.mp3'] });
        this.explosion = new Howl({ src: ['/assets/audio/impact_sample.mp3'] });
        this.missileTravel = new Howl({
            src: ['/assets/audio/missile-travel.mp3'],
        });
        this.missileDestroy = new Howl({
            src: ['/assets/audio/missile-destroy.mp3'],
        });
    }
}
