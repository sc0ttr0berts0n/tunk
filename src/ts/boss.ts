import * as PIXI from 'pixi.js';
import Game from './game';
import KillPhrase from './kill-phrase';
import Victor = require('victor');
import { HealthBar, HealthBarOptions } from './health-bar';

export default class Boss {
    private game: Game;
    public killPhrase: KillPhrase;
    private maxLetterTileWidth: number;
    private container = new PIXI.Container();
    public killPhraseContainer = new PIXI.Container();
    public pos: Vec2 = { x: 192, y: 192 };
    public rot = Math.PI * 2 - Math.PI / 4;
    public targetRot = Math.PI * 2 - Math.PI / 4;
    private closestDist = -370;
    private hoverDist = -40;
    private hoverRate = 0.01;
    public active = true;
    public validVisitedLetterCount: number;
    public el: PIXI.Sprite;
    public health: number = 1.0;
    public healthBarContainer = new PIXI.Container();
    public healthBar: HealthBar;
    public healthScore = 80;
    public canPlayMissileTravelAudio = true;
    public canPlayMissileDestroyAudio = true;
    public needsGraphicUpdate = false;

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

        const healthBarOptions: HealthBarOptions = {
            width: 92,
            height: 4,
            chunkPadding: 4,
            chunkCount: 10,
            angledCapWidth: 0,
        };
        this.healthBar = new HealthBar(
            this.game,
            this.killPhrase,
            this,
            healthBarOptions
        );
        // healthbar placement
        this.healthBarContainer.y += 10;
        // this.healthBarContainer.x -= 1;
        this.healthBarContainer.addChild(this.healthBar.container);
        this.el.addChild(this.healthBarContainer);
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
        this.healthBar.update();
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
            const rot = ((Math.floor(Math.random() * 3) - 1) * Math.PI) / 2;
            this.targetRot += rot;
        }
        this.rot += (this.targetRot - this.rot) * 0.01;
        this.pos.y = offset;

        // this.healthBar.container.rotation = -this.rot;
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
        if (this.needsGraphicUpdate) {
            if (this.health < 1 / 3) {
                this.el.texture = this.game.graphics.bossOneDamaged2;
            } else if (this.health < 2 / 3) {
                this.el.texture = this.game.graphics.bossOneDamaged1;
            } else {
                this.el.texture = this.game.graphics.bossOne;
            }
            this.needsGraphicUpdate = false;
        }
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

    public takeDamage(dmg: number) {
        this.health -= dmg;
        if (this.health < 0) {
            this.health = 0;
        }
        this.needsGraphicUpdate = true;
    }
}
