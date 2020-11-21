import * as PIXI from 'pixi.js';
import Game from './game';
import Boss from './boss';
import LetterTile from './letter-tile';
import { HealthBar } from './health-bar';
import Victor = require('victor');

export default class KillPhraseUI {
    private game: Game;
    public phrase: string;
    private healthBar: HealthBar;
    public length: number;
    public tiles: LetterTile[] = [];
    public container = new PIXI.Container();
    public phraseContainer = new PIXI.Container();
    public killNumber = Infinity;
    public pos: Victor;

    constructor(game: Game) {
        this.game = game;
        this.phrase = this.getRandomKillPhrase();
        this.length = this.phrase.length;
        this.pos = new Victor(200, this.game.app.renderer.height - 164);
        this.healthBar = new HealthBar(this.game, game.boss, {
            outline: true,
        });
        this.init();
    }

    public init() {
        this.newPhrase(this.phrase);
        this.container.position.set(this.pos.x, this.pos.y);
        this.container.addChild(this.phraseContainer);
        this.game.graphics.skyContainer.addChild(this.container);
        this.initHealthBar();
    }

    public update(delta: number) {
        this.tiles.forEach((letter) => letter.update(delta));
        this.healthBar.update();
    }

    public reinit() {
        if (this.healthBar.isDestroyed) {
            this.healthBar = new HealthBar(this.game, this.game.boss, {
                outline: true,
            });
            this.initHealthBar();
        }
        this.setupNewKillPhrase();
    }

    public initKillPhrase() {
        return new KillPhraseUI(this.game);
    }

    private getRandomKillPhrase() {
        const phrases = [
            'GrayMarker',
            'Destroy',
            'Explode',
            'rockets',
            'missile',
            'victory',
            'Target',
            'Seeker',
            'pewpew',
            'kaboom',
            'blast',
            'Retro',
            'crash',
            'bomb',
            'bang',
            'Skat',
            'tear',
            'tunk',
            'bonk',
            'rip',
        ];

        // const phrases = ['AB', 'CD', 'EF', 'GF', 'ER'];

        // get a random index from the boss words
        const _randomIndex = () => {
            return Math.floor(Math.random() * phrases.length);
        };

        // fill array with random phrases
        return phrases[_randomIndex()];
    }

    public initHealthBar() {
        this.healthBar.container.x = -28;
        this.healthBar.container.y = 36;
        this.container.addChild(this.healthBar.container);
    }

    public setupNewKillPhrase() {
        this.newPhrase(this.getRandomKillPhrase());
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
                this.game.boss,
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

    cleanAndDestroy() {
        this.removePhrase();
        this.healthBar.cleanAndDestroy();
    }
}
