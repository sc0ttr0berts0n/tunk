import * as PIXI from 'pixi.js';
import Game from './game';
import Boss from './boss';
import LetterTile from './letter-tile';
import init from './ui';

export default class KillPhrase {
    private game: Game;
    private boss: Boss;
    public phrase: string;
    public length: number;
    public tiles: LetterTile[] = [];
    private maxLetterTileWidth: number;
    public container = new PIXI.Container();
    public killNumber = Infinity;
    public pos: Vec2 = { x: 128, y: 1024 - 128 };

    constructor(game: Game, boss: Boss, phrase: string) {
        this.game = game;
        this.boss = boss;
        this.phrase = this.cleanPhrase(phrase);
        this.length = phrase.length;
        this.init();
    }

    public init() {
        this.newPhrase(this.phrase);
        this.container.x = this.pos.x;
        this.container.y = this.pos.y;
    }

    public update(delta: number) {
        this.tiles.forEach((letter) => letter.update(delta));
    }

    private cleanPhrase(phrase: string) {
        if (!phrase) throw new Error(`"${phrase}" is undefined`);
        return phrase
            .split('')
            .map((ltr) => ltr.toUpperCase())
            .join('');
    }

    public removePhrase() {
        this.container.removeChildren();
        this.tiles = [];
    }

    public newPhrase(phrase: string) {
        if (this.tiles.length > 0) {
            this.removePhrase();
        }

        const cleanPhrase = this.cleanPhrase(phrase);
        const phraseArr = cleanPhrase.split('');

        this.length = phraseArr.length;
        this.phrase = cleanPhrase;

        this.killNumber = [...new Set(phraseArr)].length;

        this.game.turret.wedges.forEach((wedge) => {
            wedge.isVisited = false;
            wedge.missilePod.isArmed = false;
            wedge.isKillPhraseLetter = false;
        });

        this.tiles = phraseArr.map((ltr, index) => {
            return new LetterTile(
                this.game,
                this.boss,
                this,
                ltr.toUpperCase(),
                index
            );
        });

        this.maxLetterTileWidth = this.getMaxTileWidth();
        this.placeTiles();
    }

    public getMaxTileWidth() {
        return Math.max(...this.tiles.map((ltr) => ltr.letterEl.width));
    }

    public placeTiles() {
        this.tiles.forEach((letter) => letter.placeLettersTile());
    }
}
