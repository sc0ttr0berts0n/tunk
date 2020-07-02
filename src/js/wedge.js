"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Wedge = /** @class */ (function () {
    function Wedge(game, turret, id, wedgeCount) {
        this.maxHealth = 60;
        this.health = this.maxHealth;
        this.healthBar = new PIXI.Graphics();
        this.letter = String.fromCharCode(65 + this.id);
        this.wall = new PIXI.Sprite(this.game.graphics.fullTexture);
        this.cautionFloorExpand = new PIXI.Sprite(this.game.graphics.floorWarningInner);
        this.cautionFloorBoundary = new PIXI.Sprite(this.game.graphics.floorWarningBoundary);
        this.outsideLight = new PIXI.Sprite(this.game.graphics.damagedWallLight);
        this.playerPos = { x: this.pos.x * 0.76, y: this.pos.y * 0.76 };
        this.healthBarYOffset = -26;
        this.letterYOffset = -50;
        this.willBeShot = false;
        this.isLethal = false;
        this.scoreCheck = true;
        this.game = game;
        this.turret = turret;
        this.id = id;
        this.wedgeCount = wedgeCount;
        this.rot = (id * (2 * Math.PI)) / wedgeCount - 0.5 * Math.PI;
        this.init();
    }
    Wedge.prototype.init = function () {
        this.initWall();
        this.initLetters();
        this.initHealthBar();
        this.initCautionFloor();
        this.initOutsideLight();
    };
    Wedge.prototype.update = function () {
        this.updateWallDamage();
        this.updateScore();
        this.updateHealthBar();
        this.updateCautionFloor();
        this.updateOutsideLight();
    };
    Wedge.prototype.reinit = function () {
        this.willBeShot = false;
        this.isLethal = false;
        this.scoreCheck = true;
        this.health = this.maxHealth;
    };
    Wedge.prototype.initWall = function () {
        this.wall.rotation = this.rot + 0.5 * Math.PI; // for exact placement
        this.wall.scale.set(1.05);
        this.wall.x = this.pos.x;
        this.wall.y = this.pos.y;
        this.wall.anchor.set(0.5);
        this.game.graphics.turretFloor.addChild(this.wall);
    };
    Wedge.prototype.initCautionFloor = function () {
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
    };
    Wedge.prototype.updateCautionFloor = function () {
        // caution floor anim
        if (this.isLethal) {
            this.cautionFloorExpand.visible = true;
            this.cautionFloorBoundary.visible = true;
            if (this.cautionFloorExpand.scale.x < 0.9) {
                this.cautionFloorExpand.scale.x += 0.02;
            }
            else if (this.cautionFloorExpand.scale.x >= 0.89) {
                this.cautionFloorExpand.alpha = Math.random() * 0.5 + 0.5;
            }
        }
        else {
            this.cautionFloorExpand.visible = false;
            this.cautionFloorBoundary.visible = false;
            this.cautionFloorExpand.scale.x = 0;
        }
    };
    Wedge.prototype.updateOutsideLight = function () {
        // show/hide light
        if (this.health < 60) {
            this.outsideLight.visible = true;
            // outside light anims
            if (this.outsideLight.alpha < 0.4) {
                this.outsideLight.alpha = 0.41;
            }
            else if (this.outsideLight.alpha > 0.6) {
                this.outsideLight.alpha = 0.59;
            }
            else {
                this.outsideLight.alpha +=
                    Math.sin(Math.random() - 0.5) * 0.005;
            }
        }
        else {
            this.outsideLight.visible = false;
        }
    };
    Wedge.prototype.initOutsideLight = function () {
        var lightScale = Math.random() * 0.7 + 0.3;
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
    };
    Wedge.prototype.updateScore = function () {
        if (this.health < this.maxHealth) {
            this.scoreCheck = false;
        }
        if (this.health >= this.maxHealth &&
            !this.scoreCheck &&
            this.game.player.alive) {
            this.game.score++;
            this.scoreCheck = true;
        }
    };
    Wedge.prototype.initLetters = function () {
        var letterStyle = new PIXI.TextStyle();
        letterStyle.fill = '#ffffff';
        letterStyle.stroke = '#282228';
        letterStyle.strokeThickness = 10;
        letterStyle.fontFamily = 'Arial';
        letterStyle.fontWeight = 'bold';
        var letter = new PIXI.Text(this.letter, letterStyle);
        letter.rotation = -this.wall.rotation;
        letter.anchor.set(0.5);
        letter.y = this.letterYOffset;
        this.wall.addChild(letter);
    };
    Wedge.prototype.initHealthBar = function () {
        this.healthBar.beginFill(0xff0050);
        this.healthBar.drawRect(0, 0, 64, 10);
        this.healthBar.y = this.healthBarYOffset;
        this.healthBar.x = -(64 / 2);
        this.wall.addChild(this.healthBar);
    };
    Wedge.prototype.updateHealthBar = function () {
        this.healthBar.scale.x = this.health / this.maxHealth;
        if (this.health === this.maxHealth) {
            this.healthBar.visible = false;
        }
        else {
            this.healthBar.visible = true;
        }
    };
    Wedge.prototype.updateWallDamage = function () {
        this.wall.texture =
            this.health < this.maxHealth
                ? this.game.graphics.damagedTexture
                : this.game.graphics.fullTexture;
    };
    Wedge.prototype.setHealth = function (amt) {
        if (amt === void 0) { amt = 0; }
        this.health = amt;
    };
    Wedge.prototype.addHealth = function (n) {
        this.health += n;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    };
    return Wedge;
}());
exports.default = Wedge;
//# sourceMappingURL=wedge.js.map