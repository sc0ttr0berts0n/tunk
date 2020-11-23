import * as PIXI from 'pixi.js';
import Game from './game';
import KillPhraseUI from './kill-phrase-ui';
import Victor = require('victor');
import { HealthBar, HealthBarOptions } from './health-bar';
import Missile from './missile';

export default class Boss {
    private game: Game;
    private maxLetterTileWidth: number;
    private container = new PIXI.Container();
    public pos = new Victor(192, 192);
    public rot = Math.PI * 2 - Math.PI / 4;
    public targetRot = Math.PI * 2 - Math.PI / 4;
    private closestDist = -370;
    private hoverDist = -40;
    private hoverRate = 0.01;
    public alive = true;
    public validVisitedLetterCount: number;
    public el: PIXI.Sprite;
    public health: number = 1.0;
    public healthBar: HealthBar;
    public healthScore = 80;
    public canPlayMissileTravelAudio = true;
    public canPlayMissileDestroyAudio = true;
    public needsTextureUpdate = false;
    public oneThirdMissleShot = false;
    public twoThirdMissleShot = false;

    constructor(game: Game) {
        this.game = game;
        this.el = new PIXI.Sprite(this.game.graphics.bossOne);
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
        this.healthBar = new HealthBar(this.game, this, healthBarOptions);
        // healthbar placement
        this.healthBar.container.y += 46;
        this.healthBar.container.x -= 40;
        this.el.addChild(this.healthBar.container);
    }

    public update(delta: number) {
        if (this.alive) {
            this.validVisitedLetterCount = this.getValidVisitedLetterCount();
            const _everyLetterArmed =
                this.validVisitedLetterCount ===
                this.game.killPhraseUI.killNumber;

            if (_everyLetterArmed) {
                console.log('desssstroyh!');

                if (
                    this.game.killPhraseUI.tiles.every(
                        (tile) => tile.wedge.missilePod.isArmed
                    )
                ) {
                    this.handleFullyArmedMissilePods();
                }
            }

            if (this.health < 2 / 3 && !this.twoThirdMissleShot) {
                this.twoThirdMissleShot = true;
                this.shootMissileAtNearestWedge();
            }

            if (this.health <= 0) {
                this.endBoss();
            }
            this.updateBossShip();
            this.render();
        }
        this.healthBar.update();
    }

    public reinit() {
        this.rot = Math.PI * 2 - Math.PI / 4;
        this.targetRot = Math.PI * 2 - Math.PI / 4;
        this.validVisitedLetterCount = 0;
        this.health = 1;
        this.el.texture = this.game.graphics.bossOne;
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
        const backgroundRelTargetRot =
            this.game.turretBodyRotation + this.targetRot;
        this.rot += (backgroundRelTargetRot - this.rot) * 0.01;
        this.pos.y = offset;
    }

    private render() {
        this.renderBossShip();
    }

    private renderBossShip() {
        this.el.y = this.pos.y;
        this.container.rotation = this.rot;
        if (this.needsTextureUpdate) {
            if (this.health < 1 / 3) {
                this.el.texture = this.game.graphics.bossOneDamaged2;
            } else if (this.health < 2 / 3) {
                this.el.texture = this.game.graphics.bossOneDamaged1;
            } else {
                this.el.texture = this.game.graphics.bossOne;
            }
            this.needsTextureUpdate = false;
        }
    }

    private shootMissileAtNearestWedge() {
        const tau = Math.PI * 2;
        const bossAngle = (this.rot % tau) / tau;
        const targetIndex = Math.floor(
            bossAngle * this.game.turret.wedges.length
        );
        const target = this.game.turret.wedges[targetIndex];
        const options = {
            onDeath: () => {
                this.game.turret.destroyWallAndNeighbors(target, 3);
            },
            initialVel: 15,
            thrustStartAge: 80,
        };
        const missile = new Missile(
            this.game,
            this.getWorldPos(),
            target,
            options
        );
        this.game.missiles.push(missile);
    }

    private getValidVisitedLetterCount() {
        // Todo: Gut turret history feature
        const armedWedgeCount = this.game.turret.getArmedWedges().length;
        return armedWedgeCount ? armedWedgeCount : 0;
    }

    private handleFullyArmedMissilePods() {
        // fire ze missiles!
        this.game.killPhraseUI.tiles.forEach((letter) => {
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
            this.game.killPhraseUI.setupNewKillPhrase();
        }
    }

    private endBoss() {
        this.alive = false;
    }

    public cleanAndDestroy() {
        this.container.destroy();
        this.healthBar.container.destroy();
    }

    firstDamagedLetterIndex() {
        return this.game.killPhraseUI.tiles.findIndex((letter) => {
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
        this.needsTextureUpdate = true;
    }
}
