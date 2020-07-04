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

    reinit() {
        this.activeKillPhrase.forEach((letter) => letter.reinit());
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
    public letter: string;
    public id: number;
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

    public reinit() {
        this.letterEl.text = this.letter;
    }

    public update(delta: number) {
        const wedge = this.game.turret.getWedgeByLetter(this.letter);
        if (wedge) {
            if (wedge.isDamaged()) {
                if (this.game.frameCount % 5 === 0) {
                    this.letterEl.text = String.fromCharCode(
                        65 + Math.floor(Math.random() * 26)
                    );
                }
                this.letterEl.alpha = 0.3;
            } else {
                this.letterEl.text = this.letter;
                this.letterEl.alpha = 1;
            }
        }
        // make blink
        // if (this.game.frameCount % 30 === 0) {
        //     this.letterEl.style.fill = '#ffffff';
        // } else if (this.game.frameCount % 30 === 6) {
        //     this.letterEl.style.fill = '#ff5050';
        // }

        // random letter
    }

    private initLetter() {
        const letterStyle = new PIXI.TextStyle();
        letterStyle.fill = '#ff5050';
        letterStyle.fontSize = 25;
        letterStyle.stroke = '#282228';
        letterStyle.strokeThickness = (10 / 28) * letterStyle.fontSize;
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
