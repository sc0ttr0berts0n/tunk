import * as PIXI from 'pixi.js';
import Victor = require('victor');
import Game from './game';
import Turret from './turret';
import MissilePod from './missile-pod';
import { HealthBar, HealthBarOptions } from './health-bar';
import { Explosion, ExplosionOptions } from './explosion';

interface Vec2 {
    x: number;
    y: number;
}

export default class Wedge {
    private game: Game;
    private turret: Turret;
    public id: number;
    public wedgeCount: number;
    public maxHealth = 1;
    public repaired = true;
    public health = this.maxHealth;
    private healthBar: HealthBar;
    public letter: string;
    public letterEl: PIXI.Text;
    public wall: PIXI.Sprite;
    private cautionFloorExpand: PIXI.Sprite;
    private cautionFloorBoundary: PIXI.Sprite;
    private outsideLight: PIXI.Sprite;
    public rot: number;
    public pos: Vec2;
    public playerPos: Vec2;
    public healthBarYOffset = -26;
    public letterYOffsetArmed = -105;
    public letterYOffsetDisarmed = -55;
    private letterPos: Vec2 = { x: 0, y: this.letterYOffsetDisarmed };
    public willBeShot = false;
    public isLethal = false;
    public isVisited = false;
    public isKillPhraseLetter = false;
    public scoreCheck = true;
    public container = new PIXI.Container();
    public missilePod: MissilePod;
    constructor(game: Game, turret: Turret, id: number, wedgeCount: number) {
        this.game = game;
        this.turret = turret;
        this.id = id;
        this.letter = String.fromCharCode(65 + this.id);
        this.wedgeCount = wedgeCount;
        this.healthBar = new HealthBar(this.game, this, {
            width: 64,
            height: 10,
            chunkCount: 1,
            angledCapWidth: 0,
        });
        this.rot = (id * (2 * Math.PI)) / wedgeCount - 0.5 * Math.PI;
        this.pos = {
            x: Math.cos(this.rot) * turret.radius,
            y: Math.sin(this.rot) * turret.radius,
        };
        this.playerPos = { x: this.pos.x * 0.76, y: this.pos.y * 0.76 };
        this.wall = new PIXI.Sprite(this.game.graphics.fullTexture);
        this.cautionFloorExpand = new PIXI.Sprite(
            this.game.graphics.floorWarningInner
        );
        this.cautionFloorBoundary = new PIXI.Sprite(
            this.game.graphics.floorWarningBoundary
        );
        this.outsideLight = new PIXI.Sprite(
            this.game.graphics.damagedWallLight
        );
        this.missilePod = new MissilePod(game, this);
        this.init();
    }

    public init() {
        this.initLetters();
        this.initHealthBar();
        this.initCautionFloor();
        this.initOutsideLight();
        this.initWall();
    }

    public update(delta: number) {
        this.updateWallDamage();
        this.updateScore();
        this.updateHealthBar();
        this.updateCautionFloor(delta);
        this.updateOutsideLight();
        this.missilePod.update();
        if (this.playerIsPresent()) {
            this.turret.pushLetterToHistory(this.letter);
        }
        this.updateLetters();
        this.render();
    }

    private render() {
        this.renderLetters();
    }

    public reinit() {
        this.willBeShot = false;
        this.isLethal = false;
        this.isVisited = false;
        this.scoreCheck = true;
        this.health = this.maxHealth;
    }

    private initWall() {
        this.container.rotation = this.rot + 0.5 * Math.PI; // for exact placement
        this.container.scale.set(1.05);
        this.container.x = this.pos.x;
        this.container.y = this.pos.y;
        this.container.addChild(this.wall);
        this.wall.anchor.set(0.5);
        this.game.graphics.turretFloor.addChild(this.container);
    }

    private initCautionFloor() {
        this.cautionFloorExpand.anchor.set(0.5, 0.5);
        this.cautionFloorExpand.scale.y = 0.9;
        this.cautionFloorExpand.scale.x = 0;
        this.cautionFloorExpand.blendMode = PIXI.BLEND_MODES.ADD;
        this.cautionFloorExpand.visible = false;
        this.cautionFloorExpand.alpha = 1;
        this.cautionFloorExpand.y += 240;
        this.wall.addChild(this.cautionFloorExpand);

        this.cautionFloorBoundary.anchor.set(0.5, 0.5);
        this.cautionFloorBoundary.scale.y = 0.9;
        this.cautionFloorBoundary.scale.x = 0.89;
        this.cautionFloorBoundary.blendMode = PIXI.BLEND_MODES.ADD;
        this.cautionFloorBoundary.visible = false;
        this.cautionFloorBoundary.alpha = 1;
        this.cautionFloorBoundary.y += 240;
        this.wall.addChild(this.cautionFloorBoundary);
    }

    private updateCautionFloor(delta: number) {
        // caution floor anim
        if (this.isLethal) {
            this.cautionFloorExpand.visible = true;
            this.cautionFloorBoundary.visible = true;
            if (this.cautionFloorExpand.scale.x < 0.9) {
                this.cautionFloorExpand.scale.x += 0.02 * delta;
            } else if (this.cautionFloorExpand.scale.x >= 0.89) {
                this.cautionFloorExpand.alpha = Math.random() * 0.5 + 0.5;
            }
        } else {
            this.cautionFloorExpand.visible = false;
            this.cautionFloorBoundary.visible = false;
            this.cautionFloorExpand.scale.x = 0;
        }
    }

    private updateOutsideLight() {
        // show/hide light
        if (this.isDamaged()) {
            this.outsideLight.visible = true;

            // clamp if it wanders
            this.outsideLight.alpha = Math.max(
                Math.min(this.outsideLight.alpha, 0.6),
                0.4
            );

            // wiggle by sin function
            const wiggleDistance = Math.sin(Math.random() - 0.5) * 0.0125;
            this.outsideLight.alpha += wiggleDistance;
        } else {
            this.outsideLight.visible = false;
        }
    }

    private initOutsideLight() {
        const lightScale = Math.random() * 0.7 + 0.3;
        this.outsideLight.anchor.set(0.5, 0);
        this.outsideLight.y += 15;
        this.outsideLight.scale.x =
            Math.random() > 0.5 ? lightScale : -lightScale;
        this.outsideLight.scale.y = lightScale;
        // this.outsideLight.tint = 0xf7f2f0;
        this.outsideLight.blendMode = PIXI.BLEND_MODES.ADD;
        this.outsideLight.alpha = 0.5;
        this.outsideLight.visible = false;
        this.wall.addChild(this.outsideLight);
    }

    private updateScore() {
        if (this.health < this.maxHealth) {
            this.scoreCheck = false;
        }
        if (
            this.health >= this.maxHealth &&
            !this.scoreCheck &&
            this.game.player.alive
        ) {
            this.game.scoreManager.score++;
            this.scoreCheck = true;
        }
    }

    private initLetters() {
        const textStyle = new PIXI.TextStyle();
        textStyle.fill = '#ffffff';
        textStyle.stroke = '#000000';
        textStyle.strokeThickness = 10;
        textStyle.fontSize = 30;
        textStyle.fontFamily = 'Noto Sans';
        textStyle.fontWeight = 'bold';
        textStyle.miterLimit = 0;
        textStyle.lineJoin = 'round';
        this.letterEl = new PIXI.Text(this.letter, textStyle);
        this.letterEl.rotation = -this.wall.rotation;
        this.letterEl.anchor.set(0.5);
        this.letterPos.y = this.letterYOffsetDisarmed;
        this.wall.addChild(this.letterEl);
    }

    private initHealthBar() {
        this.healthBar.container.y = this.healthBarYOffset;
        this.healthBar.container.x = -(this.healthBar.container.width / 2);
        this.wall.addChild(this.healthBar.container);
    }

    private updateLetters() {
        if (this.missilePod.isArmed) {
            if (this.letterPos.y > this.letterYOffsetArmed) {
                this.letterPos.y += -this.missilePod.speed;
            }
        } else {
            if (this.letterPos.y < this.letterYOffsetDisarmed) {
                this.letterPos.y += this.missilePod.speed;
            }
        }
    }

    private renderLetters() {
        this.letterEl.y = this.letterPos.y;
    }

    private updateHealthBar() {
        this.healthBar.update();
        if (this.health === this.maxHealth) {
            this.healthBar.container.visible = false;
        } else {
            this.healthBar.container.visible = true;
        }
    }

    private updateWallDamage() {
        this.wall.texture = this.isDamaged()
            ? this.game.graphics.damagedTexture
            : this.game.graphics.fullTexture;
    }

    public setHealth(amt = 0) {
        this.health = amt;
        if (amt < this.maxHealth) {
            this.repaired = false;
            this.explodeWallAnimation();
        }
    }

    public playerIsPresent() {
        return (
            this.game.player.isAtTarget() &&
            this.game.player.targetWedge === this
        );
    }

    public addHealth(n: number) {
        if (!this.repaired && this.health < this.maxHealth) {
            this.health += n;
            if (this.health >= this.maxHealth) {
                this.health = this.maxHealth;
                this.setRepaired();
            }
        }
    }

    public setRepaired() {
        this.repaired = true;
    }

    public isDamaged() {
        return this.health < this.maxHealth;
    }

    private explodeWallAnimation() {
        // create explosion
        const center = new Victor(
            this.game.app.renderer.width / 2,
            this.game.app.renderer.height / 2
        );
        const pos = this.getWorldPos();
        const angle = Math.atan2(center.y - pos.y, center.x - pos.x);
        const vel = new Victor(5, 0).rotate(angle);
        // debugger;
        const explosionOptions: ExplosionOptions = {
            lifespan: 20,
            sprite: new PIXI.Sprite(this.game.graphics.explosionBlue),
            vel: vel,
        };
        const explosion = new Explosion(this.game, pos, explosionOptions);
        this.game.explosions.push(explosion);
    }

    getWorldPos() {
        return new Victor(
            this.wall.worldTransform.tx,
            this.wall.worldTransform.ty
        );
    }
}
