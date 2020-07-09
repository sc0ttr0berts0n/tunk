import Game from './game';
import * as PIXI from 'pixi.js';

export default class Boss {
    private game: Game;
    private killPhrases: string[];
    public activeKillPhrase: LetterTile[];
    private maxLetterTileWidth: number;
    private container = new PIXI.Container();
    public killPhraseContainer = new PIXI.Container();
    private pos: Vec2;
    public active = true;
    public validVisitedLetters: string[];
    public validVisitedLetterCount: number;
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

    reinit() {
        this.activeKillPhrase.forEach((letter) => letter.reinit());
        this.validVisitedLetterCount = 0;
    }

    getNewKillPhrase() {
        const killPhrase = this.killPhrases.shift().split('');
        return killPhrase.map(
            (letter, index) =>
                new LetterTile(this.game, this, letter.toUpperCase(), index)
        );
    }

    public getValidVisitedLetterCount() {
        const historyCount = this.activeKillPhrase.length;
        const history = this.game.turret.history.slice(-historyCount);
        const phrase = this.activeKillPhrase.map((letter) => letter.letter);
        const startLetterIndexes = history
            .map((ltr, index) => {
                return ltr === phrase[0] ? index : -1;
            })
            .filter((index) => index >= 0);
        const candidateArray = startLetterIndexes.map((index) =>
            history.slice(index)
        );
        if (candidateArray.length) {
            const count = Math.max(
                ...candidateArray.map((arr) => {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i] !== phrase[i]) {
                            return 0;
                        }
                    }
                    return arr.length;
                })
            );
            return count;
        } else {
            return 0;
        }

        // const arr1 = ['D', 'L', 'F', 'E', 'D', 'E', 'X'];
        // const arr2 = ['I', 'L', 'F', 'E', 'F', 'D', 'E'];
        // const arr3 = ['D', 'E', 'S', 'T', 'R', 'O', 'Y'];
    }

    public setValidVisitedLetterCount(
        value = this.getValidVisitedLetterCount()
    ) {
        this.validVisitedLetterCount = value;
    }

    private getValidVisitedLetters() {
        const count = this.getValidVisitedLetterCount();
        const letters = this.activeKillPhrase.map((ltr) => ltr.letter);
        return letters.slice(0, count - 1);
    }

    firstDamagedLetterIndex() {
        const phrase = this.activeKillPhrase.map((el) => el.letter);
        return phrase.findIndex((letter) => {
            return this.game.turret.getWedgeByLetter(letter).isDamaged();
        });
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
        const firstDamagedLetterIndex = this.boss.firstDamagedLetterIndex();
        const wedge = this.game.turret.getWedgeByLetter(this.letter);
        const damagedInputs =
            firstDamagedLetterIndex >= 0 &&
            firstDamagedLetterIndex + 1 <= this.boss.validVisitedLetterCount;
        const isTyped = this.id + 1 <= this.boss.validVisitedLetterCount;
        const isNextToBeTyped = damagedInputs
            ? this.id === 0
            : this.id === this.boss.validVisitedLetterCount;
        if (wedge) {
            if (wedge.isDamaged()) {
                if (this.game.frameCount % 5 === 0) {
                    this.letterEl.text = String.fromCharCode(
                        65 + Math.floor(Math.random() * 26)
                    );
                }
                if (isNextToBeTyped) {
                    this.letterEl.alpha = 0.6;
                } else {
                    this.letterEl.alpha = 0.3;
                }
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
                if (isTyped) {
                    this.letterEl.style.fill = '#ff5050';
                } else {
                    this.letterEl.style.fill = '#cccccc';
                }
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
