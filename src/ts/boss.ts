import * as PIXI from 'pixi.js';
import Game from './game';
import KillPhrase from './kill-phrase';
import Victor = require('victor');

export default class Boss {
    private game: Game;
    public killPhrase: KillPhrase;
    private maxLetterTileWidth: number;
    private container = new PIXI.Container();
    public killPhraseContainer = new PIXI.Container();
    public pos: Vec2 = { x: 192, y: 192 };
    public rot = Math.PI * 2 - Math.PI / 4;
    public targetRot = Math.PI * 2 - Math.PI / 4;
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
    public validVisitedLetterCount: number;
    public el: PIXI.Sprite;
    public health: number = 1.0;
    public healthEl: PIXI.Text;
    public healthScore = 80;
    public canPlayMissileTravelAudio = true;
    public canPlayMissileDestroyAudio = true;

    constructor(game: Game) {
        this.game = game;
        this.el = new PIXI.Sprite(this.game.graphics.bossOne);
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

        // Todo: Permanant boss health solution
        const letterStyle = new PIXI.TextStyle();
        letterStyle.fill = '#cccccc';
        letterStyle.fontSize = 25;
        letterStyle.stroke = '#282228';
        letterStyle.strokeThickness = (10 / 28) * letterStyle.fontSize;
        letterStyle.fontFamily = 'Arial';
        letterStyle.fontWeight = 'bold';
        this.healthEl = new PIXI.Text(this.health.toString(), letterStyle);
        this.healthEl.anchor.set(0.5);
        this.healthEl.x = 0;
        this.healthEl.y = -80;
        this.el.addChild(this.healthEl);
        // this.killPhrase.container.addChild(this.container);
    }

    public update(delta: number) {
        if (this.active) {
            this.validVisitedLetterCount = this.getValidVisitedLetterCount();
            const _everyLetterArmed =
                this.validVisitedLetterCount === this.killPhrase.killNumber;

            if (_everyLetterArmed) {
                console.log('desssstroyh!');

                if (
                    this.killPhrase.tiles.every(
                        (tile) => tile.wedge.missilePod.isArmed
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

        // Todo: Permanant letter update solution
        this.healthEl.text = Math.floor(
            this.health * this.healthScore
        ).toString();
        this.healthEl.rotation = -this.rot;
    }

    private initKillPhrase() {
        const phrase = this.getRandomKillPhrase();
        return new KillPhrase(this.game, this, phrase);
    }

    private render() {
        this.renderBossShip();
    }

    private renderBossShip() {
        this.el.y = this.pos.y;
        this.container.rotation = this.rot;
    }

    private getRandomKillPhrase() {
        const phrases = [
            'GrayMarker',
            'Destroy',
            'Explode',
            'rockets',
            'Target',
            'Seeker',
            'pewpew',
            'kaboom',
            'blast',
            'Retro',
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

    private getValidVisitedLetterCount() {
        // Todo: Gut turret history feature
        const armedWedgeCount = this.game.turret.getArmedWedges().length;
        return armedWedgeCount ? armedWedgeCount : 0;
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
        if (this.health > 0) {
            this.canPlayMissileTravelAudio = true;
            this.canPlayMissileDestroyAudio = true;
            this.setupNewKillPhrase();
        } else {
            // otherwise, handle "killing" of the boss
            this.killPhrase.removePhrase();
            this.active = false;
            console.log('BOSS IS DED');
        }
    }

    private setupNewKillPhrase() {
        this.killPhrase.newPhrase(this.getRandomKillPhrase());
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
