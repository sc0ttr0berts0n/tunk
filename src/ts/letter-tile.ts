import * as PIXI from 'pixi.js';
import Game from './game';
import Boss from './boss';
import Wedge from './wedge';
import KillPhrase from './kill-phrase';

export default class LetterTile {
    private game: Game;
    private boss: Boss;
    public killPhrase: KillPhrase;
    public wedge: Wedge;
    public letter: string;
    public id: number;
    private container = new PIXI.Container();
    public el: PIXI.Text;
    private padding: number = 2;

    constructor(
        game: Game,
        boss: Boss,
        killPhrase: KillPhrase,
        letter: string,
        id: number
    ) {
        this.game = game;
        this.boss = boss;
        this.killPhrase = killPhrase;
        this.wedge = game.turret.getWedgeByLetter(letter);
        this.letter = letter;
        this.id = id;
        this.init();
    }

    public init() {
        this.initLetter();
    }

    public reinit() {
        this.el.text = this.letter;
    }

    public update(delta: number) {
        const wedgeIsArmed = this.wedge.missilePod.isArmed;
        if (this.wedge.isDamaged()) {
            if (this.game.frameCount % 5 === 0) {
                const randomLetter = String.fromCharCode(
                    65 + Math.floor(Math.random() * 26)
                );
                this.el.text = randomLetter;
            }
            this.el.alpha = 0.3;
        } else {
            this.el.text = this.letter;
            this.el.alpha = 1;
        }

        if (wedgeIsArmed) {
            this.el.style.fill = '#ff5050';
        } else {
            this.el.style.fill = '#cccccc';
        }
    }

    private initLetter() {
        const letterStyle = new PIXI.TextStyle();
        letterStyle.fill = '#cccccc';
        letterStyle.fontSize = 24;
        letterStyle.stroke = '#282228';
        letterStyle.strokeThickness = 8;
        letterStyle.miterLimit = 10;
        letterStyle.lineJoin = 'bevel';
        letterStyle.fontFamily = 'Arial';
        letterStyle.fontWeight = 'bold';
        this.el = new PIXI.Text(this.letter, letterStyle);
        this.el.anchor.set(0.5);
        this.container.addChild(this.el);
        this.killPhrase.phraseContainer.addChild(this.container);

        // register letters as kill phrase letters
        const wedge = this.game.turret.getWedgeByLetter(this.letter);
        wedge.isKillPhraseLetter = true;
    }

    public placeLettersTile() {
        const offset =
            this.killPhrase.getMaxTileWidth() * this.id +
            Math.max(0, this.id - 1) * this.padding;
        this.el.x = offset;
    }
}
