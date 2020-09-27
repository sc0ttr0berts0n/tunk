import * as PIXI from 'pixi.js';
import Game from './game';
import KillPhrase from './kill-phrase';
import Victor = require('victor');

interface Options {
    killPhrases?: string[];
}

export default class Boss {
    private game: Game;
    private options: Options;
    private killPhrases: string[];
    public killPhrase: KillPhrase;
    private maxLetterTileWidth: number;
    private container = new PIXI.Container();
    public killPhraseContainer = new PIXI.Container();
    public pos: Vec2 = { x: 192, y: 192 };
    public rot = -Math.PI / 4;
    public targetRot = -Math.PI / 4;
    public potentialRots = [
        Math.PI / 2,
        Math.PI,
        (Math.PI / 2) * 3,
        Math.PI * 2,
    ];
    private closestDist = -370;
    private hoverDist = -40;
    private hoverRate = 0.01;
    public active = true;
    public validVisitedLetters: string[];
    public validVisitedLetterCount: number;
    public el: PIXI.Sprite;

    constructor(game: Game, options?: Options) {
        this.game = game;
        this.el = new PIXI.Sprite(this.game.graphics.bossOne);
        this.killPhrases = options?.killPhrases ?? this.getRandomKillPhrases();
        this.killPhrase = this.initKillPhrase();
        this.init();
    }

    public init() {
        this.container.x = this.game.app.renderer.width / 2;
        this.container.y = this.game.app.renderer.height / 2;
        this.container.rotation = -Math.PI * 0.25;
        this.el.anchor.set(0.5);
        this.el.y = this.closestDist;
        this.container.addChild(this.el);
        this.game.graphics.skyContainer.addChild(this.container);
    }

    public update(delta: number) {
        if (this.active) {
            this.validVisitedLetterCount = this.getValidVisitedLetterCount();
            const _everyLetterArmed =
                this.validVisitedLetterCount === this.killPhrase.length;

            if (_everyLetterArmed) {
                if (
                    this.killPhrase.tiles.every(
                        (tile) => !tile.wedge.isDamaged()
                    )
                ) {
                    this.handleFullyArmedMissilePods();
                }
            }
            if (this.killPhrase) {
                this.killPhrase.update(delta);
            }
        }
        this.updateBossShip();
        this.render();
    }

    public reinit() {
        this.killPhrase.tiles.forEach((letter) => letter.reinit());
        this.validVisitedLetterCount = 0;
    }

    private updateBossShip() {
        const offset =
            this.closestDist -
            Math.sin(this.game.frameCount * this.hoverRate) * this.hoverDist +
            this.hoverDist / 2;
        if (this.game.frameCount % (60 * 15) === 0) {
            const newRotIndex = Math.floor(
                Math.random() * this.potentialRots.length
            );

            this.targetRot = this.potentialRots[newRotIndex] - Math.PI / 4;
        }
        this.rot += (this.targetRot - this.rot) * 0.01;
        this.pos.y = offset;
    }

    private initKillPhrase() {
        const phrase = this.killPhrases.shift();
        return new KillPhrase(this.game, this, phrase);
    }

    private render() {
        this.renderBossShip();
    }

    private renderBossShip() {
        this.el.y = this.pos.y;
        this.container.rotation = this.rot;
    }

    private getRandomKillPhrases(num: number = 0) {
        const bossWords = [
            'Destroy',
            'Explode',
            'GrayMark',
            'Skat',
            'Target',
            'Retro',
        ];

        // const bossWords = ['AB', 'CD', 'EF', 'GF', 'ER'];

        // get a random index from the boss words
        const _randomIndex = () => {
            return Math.floor(Math.random() * bossWords.length);
        };

        // splice a random bossword out of the array
        const _spliceBossWord = (i: number) => {
            return bossWords.splice(i, 1)[0];
        };

        // fixes for edge cases

        // num isnt selected, return random
        if (num === 0) {
            num = Math.ceil(Math.random() * bossWords.length);
        }

        // num is longer than there are keys for
        if (num > bossWords.length) {
            num = bossWords.length;
        }

        // fill array with random bosswords
        const phraseArr = Array(num)
            .fill(0)
            .map((el) => _spliceBossWord(_randomIndex()));

        return phraseArr;
    }

    private getValidVisitedLetterCount() {
        const historyCount = this.killPhrase.length;
        const history = this.game.turret.history.slice(-historyCount);
        const phrase = this.killPhrase.phrase.split('');
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

    private handleFullyArmedMissilePods() {
        // fire ze missiles!
        this.killPhrase.tiles.forEach((letter) => {
            letter.wedge.missilePod.missilesToFire = 4;
            letter.wedge.missilePod.isArmed = false;
        });

        // reset valid visted letter count
        this.validVisitedLetterCount = 0;
        this.game.turret.history = [];

        // if more killphrases, process it
        if (this.killPhrases.length) {
            this.setupNewKillPhrase();
        } else {
            // otherwise, handle "killing" of the boss
            this.killPhrase.removePhrase();
            this.active = false;
            console.log('BOSS IS DED');
        }
    }

    private setupNewKillPhrase() {
        this.killPhrase.newPhrase(this.killPhrases.shift());
    }

    firstDamagedLetterIndex() {
        return this.killPhrase.tiles.findIndex((letter) => {
            return letter.wedge.isDamaged();
        });
    }

    public getWorldPos() {
        return new Victor(this.el.worldTransform.tx, this.el.worldTransform.ty);
    }
}
