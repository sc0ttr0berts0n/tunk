import * as PIXI from 'pixi.js';
import Game from './game';
import LetterTile from './letter-tile';

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

    public init() {
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
        this.validVisitedLetterCount = this.getValidVisitedLetterCount();
        this.activeKillPhrase.forEach((letter) => letter.update(delta));
    }

    public reinit() {
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

    private getValidVisitedLetterCount() {
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
    }

    firstDamagedLetterIndex() {
        return this.activeKillPhrase.findIndex((letter) => {
            return letter.wedge.isDamaged();
        });
    }

    getMaxLetterTileWidth() {
        return Math.max(
            ...this.activeKillPhrase.map((letter) => letter.letterEl.width)
        );
    }

    renderKillPhrase() {}
}
