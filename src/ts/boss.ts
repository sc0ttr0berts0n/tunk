import Game from './game';
import * as PIXI from 'pixi.js';

export default class Boss {
    private game: Game;
    private killPhrases: string[];
    private activeKillPhrase: LetterTile[];
    private maxLetterTileWidth: number;
    private container = new PIXI.Container();
    public killPhraseContainer = new PIXI.Container();
    private pos: Vec2;
    constructor(game: Game, killPhrases: string[]) {
        this.game = game;
        this.killPhrases = killPhrases;
        this.pos = { x: 192, y: 192 };
        this.init();
    }

    init() {
        if (this.killPhrases.length) {
            this.activeKillPhrase = this.getNewKillPhrase();
        }
        this.getMaxLetterTileWidth();
        this.activeKillPhrase.forEach((letter) => letter.placeLettersTile());
        this.container.addChild(this.killPhraseContainer);
        this.container.x = this.pos.x;
        this.container.y = this.pos.y;

        this.game.app.stage.addChild(this.container);
        this.maxLetterTileWidth = this.getMaxLetterTileWidth();
    }

    public update(delta: number) {
        this.activeKillPhrase.forEach((letter) => letter.update(delta));
    }

    getNewKillPhrase() {
        const killPhrase = this.killPhrases.shift().split('');
        return killPhrase.map(
            (letter, index) =>
                new LetterTile(this.game, this, letter.toUpperCase(), index)
        );
    }

    getMaxLetterTileWidth() {
        return Math.max(
            ...this.activeKillPhrase.map((letter) => letter.letterEl.width)
        );
    }

    renderKillPhrase() {}
}

class LetterTile {
    private game: Game;
    private boss: Boss;
    private letter: string;
    private id: number;
    private container = new PIXI.Container();
    public letterEl: PIXI.Text;
    private padding: number = 2;
    constructor(game: Game, boss: Boss, letter: string, id: number) {
        this.game = game;
        this.boss = boss;
        this.letter = letter;
        this.id = id;
        this.init();
    }

    public init() {
        this.initLetter();
    }

    public update(delta: number) {
        const wedge = this.game.turret.getWedgeByLetter(this.letter);
        if (wedge) {
            const wedgeIsDamaged = wedge.health < wedge.maxHealth;
            if (wedgeIsDamaged) {
                this.letterEl.visible = false;
            } else {
                this.letterEl.visible = true;
            }
        }
    }

    private initLetter() {
        const letterStyle = new PIXI.TextStyle();
        letterStyle.fill = '#ff5050';
        letterStyle.stroke = '#282228';
        letterStyle.strokeThickness = 10;
        letterStyle.fontFamily = 'Arial';
        letterStyle.fontWeight = 'bold';
        this.letterEl = new PIXI.Text(this.letter, letterStyle);
        this.letterEl.anchor.set(0.5);
        this.container.addChild(this.letterEl);
        this.boss.killPhraseContainer.addChild(this.container);
    }

    public placeLettersTile() {
        const offset =
            this.boss.getMaxLetterTileWidth() * this.id +
            Math.max(0, this.id - 1) * this.padding;
        this.letterEl.x = offset;
    }
}
