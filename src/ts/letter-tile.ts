import * as PIXI from 'pixi.js';
import Game from './game';
import Boss from './boss';
import Wedge from './wedge';

export default class LetterTile {
    private game: Game;
    private boss: Boss;
    public wedge: Wedge;
    public letter: string;
    public id: number;
    private container = new PIXI.Container();
    public letterEl: PIXI.Text;
    private padding: number = 2;

    constructor(game: Game, boss: Boss, letter: string, id: number) {
        this.game = game;
        this.boss = boss;
        this.wedge = game.turret.getWedgeByLetter(letter);
        this.letter = letter;
        this.id = id;
        this.init();
    }

    public init() {
        this.initLetter();
        this.wedge.missilePodArmingOrder.push(this.id);
    }

    public reinit() {
        this.letterEl.text = this.letter;
    }

    public update(delta: number) {
        const firstDamagedLetterIndex = this.boss.firstDamagedLetterIndex();
        const damagedInputs =
            firstDamagedLetterIndex >= 0 &&
            firstDamagedLetterIndex + 1 <= this.boss.validVisitedLetterCount;
        const wedgeIsArmed = this.wedge.missilePod.isArmed;
        const isNextToBeTyped = damagedInputs
            ? this.id === 0
            : this.id === this.boss.validVisitedLetterCount;
        if (this.wedge.isDamaged()) {
            if (this.game.frameCount % 5 === 0) {
                this.letterEl.text = String.fromCharCode(
                    65 + Math.floor(Math.random() * 26)
                );
            }
            this.letterEl.alpha = isNextToBeTyped ? 0.6 : 0.3;
        } else {
            this.letterEl.text = this.letter;
            this.letterEl.alpha = 1;
        }

        if (isNextToBeTyped) {
            // make blink
            if (this.game.frameCount % 30 === 0) {
                this.letterEl.style.fill = '#cccccc';
            } else if (this.game.frameCount % 30 === 5) {
                this.letterEl.style.fill = '#ff5050';
            }
        } else if (damagedInputs) {
            this.letterEl.style.fill = '#cccccc';
        } else {
            if (wedgeIsArmed) {
                this.letterEl.style.fill = '#ff5050';
            } else {
                this.letterEl.style.fill = '#cccccc';
            }
        }
    }

    private initLetter() {
        const letterStyle = new PIXI.TextStyle();
        letterStyle.fill = '#cccccc';
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
