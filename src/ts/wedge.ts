import * as PIXI from 'pixi.js';
import Game from './game';
import Turret from './turret';

interface Vec2 {
    x: number;
    y: number;
}

export default class Wedge {
    private game: Game;
    private turret: Turret;
    public id: number;
    public wedgeCount: number;
    public maxHealth = 60;
    public repaired = true;
    public health = this.maxHealth;
    private healthBar = new PIXI.Graphics();
    public letter: string;
    public wall: PIXI.Sprite;
    private cautionFloorExpand: PIXI.Sprite;
    private cautionFloorBoundary: PIXI.Sprite;
    private outsideLight: PIXI.Sprite;
    public rot: number;
    public pos: Vec2;
    public playerPos: Vec2;
    public healthBarYOffset = -26;
    public letterYOffset = -50;
    public willBeShot = false;
    public isLethal = false;
    public scoreCheck = true;
    public container = new PIXI.Container();
    public misslePod: MisslePod;
    constructor(game: Game, turret: Turret, id: number, wedgeCount: number) {
        this.game = game;
        this.turret = turret;
        this.id = id;
        this.letter = String.fromCharCode(65 + this.id);
        this.wedgeCount = wedgeCount;
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
        this.misslePod = new MisslePod(game, this);
        this.init();
    }

    public init() {
        this.initWall();
        this.initLetters();
        this.initHealthBar();
        this.initCautionFloor();
        this.initOutsideLight();
    }

    public update(delta: number) {
        this.updateWallDamage();
        this.updateScore();
        this.updateHealthBar();
        this.updateCautionFloor(delta);
        this.updateOutsideLight();
        this.misslePod.update();
        if (this.playerIsPresent()) {
            this.turret.pushLetterToHistory(this.letter);
        }
    }

    public reinit() {
        this.willBeShot = false;
        this.isLethal = false;
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
        if (this.health < 60) {
            this.outsideLight.visible = true;

            // outside light anims
            if (this.outsideLight.alpha < 0.4) {
                this.outsideLight.alpha = 0.41;
            } else if (this.outsideLight.alpha > 0.6) {
                this.outsideLight.alpha = 0.59;
            } else {
                this.outsideLight.alpha +=
                    Math.sin(Math.random() - 0.5) * 0.005;
            }
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
        const letterStyle = new PIXI.TextStyle();
        letterStyle.fill = '#ffffff';
        letterStyle.stroke = '#282228';
        letterStyle.strokeThickness = 10;
        letterStyle.fontFamily = 'Arial';
        letterStyle.fontWeight = 'bold';
        const letter = new PIXI.Text(this.letter, letterStyle);
        letter.rotation = -this.wall.rotation;
        letter.anchor.set(0.5);
        letter.y = this.letterYOffset;
        this.wall.addChild(letter);
    }

    private initHealthBar() {
        this.healthBar.beginFill(0xff0050);
        this.healthBar.drawRect(0, 0, 64, 10);
        this.healthBar.y = this.healthBarYOffset;
        this.healthBar.x = -(64 / 2);
        this.wall.addChild(this.healthBar);
    }

    private updateHealthBar() {
        this.healthBar.scale.x = this.health / this.maxHealth;
        if (this.health === this.maxHealth) {
            this.healthBar.visible = false;
        } else {
            this.healthBar.visible = true;
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
}

class MisslePod {
    private container = new PIXI.Container();
    private el: PIXI.Sprite;
    private wedge: Wedge;
    private game: Game;
    private readonly yOffArmed = -15;
    private readonly yOffDisarmed = 40;
    private pos: Vec2 = { x: 0, y: this.yOffDisarmed };
    private readonly speed = 3;

    constructor(game: Game, wedge: Wedge) {
        this.game = game;
        this.wedge = wedge;
        this.el = new PIXI.Sprite(this.game.graphics.misslePodLoaded);
        this.init();
    }

    init() {
        this.el.anchor.set(0.5, 1);
        this.el.y = this.pos.y;
        this.container.addChild(this.el);
        this.wedge.container.addChild(this.container);
    }

    update() {
        const armed = this.isArmed();
        const y = this.el.y;
        if (armed) {
            this.el.visible = true;
            if (y > this.yOffArmed) {
                this.el.y += -this.speed;
            }
        } else {
            if (y < this.yOffDisarmed) {
                this.el.y += this.speed;
            } else {
                this.el.visible = false;
            }
        }
    }

    isArmed() {
        const boss = this.game.boss;

        if (boss.active) {
            const phrase = boss.activeKillPhrase.map((letter) => letter.letter);
            const letterIndex = phrase.indexOf(this.wedge.letter);
            if (letterIndex >= 0) {
                const vistedLetterCount = boss.getValidVisitedLetterCount();
                if (letterIndex < vistedLetterCount) {
                    const firstDamagedLetterIndex =
                        boss.firstDamagedLetterIndex() > 0
                            ? boss.firstDamagedLetterIndex()
                            : Infinity;
                    const damagedInputs = firstDamagedLetterIndex >= 0;
                    const damagedInputsBeforeCurrentLetter =
                        firstDamagedLetterIndex < vistedLetterCount - 1;
                    return !damagedInputsBeforeCurrentLetter;
                }
            }
        }

        return false;
    }
}
