import * as PIXI from 'pixi.js';
import Game from './game';
import Boss from './boss';
import LetterTile from './letter-tile';
import { HealthBar } from './health-bar';
import Victor = require('victor');

export default class KillPhrase {
    private game: Game;
    private boss: Boss;
    public phrase: string;
    private healthBar: HealthBar;
    public length: number;
    public tiles: LetterTile[] = [];
    public container = new PIXI.Container();
    public phraseContainer = new PIXI.Container();
    public killNumber = Infinity;
    public pos: Victor;

    constructor(game: Game, boss: Boss, phrase: string) {
        this.game = game;
        this.boss = boss;
        this.phrase = this.cleanPhrase(phrase);
        this.length = phrase.length;
        this.pos = new Victor(200, this.game.app.renderer.height - 180);
        this.healthBar = new HealthBar(this.game, this.boss, {
            outline: true,
        });
        this.init();
    }

    public init() {
        this.newPhrase(this.phrase);
        this.container.position.set(this.pos.x, this.pos.y);
        this.container.addChild(this.phraseContainer);
        this.container.addChild(this.healthBar.container);
        this.healthBar.container.x = -32;
        this.healthBar.container.y = 32;
    }

    public update(delta: number) {
        this.tiles.forEach((letter) => letter.update(delta));
        this.healthBar.update();
    }

    private cleanPhrase(phrase: string) {
        if (!phrase) throw new Error(`"${phrase}" is undefined`);
        return phrase
            .split('')
            .map((ltr) => ltr.toUpperCase())
            .join('');
    }

    public removePhrase() {
        this.phraseContainer.removeChildren();
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

        this.placeTiles();
    }

    public getMaxTileWidth() {
        return Math.max(...this.tiles.map((ltr) => ltr.el.width));
    }

    public placeTiles() {
        this.tiles.forEach((letter) => letter.placeLettersTile());
    }
}
