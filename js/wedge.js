class Wedge {
    constructor(game, turret, id, wedgeCount) {
        this.game = game;
        this.turret = turret;
        this.fullTexture = PIXI.Texture.from('assets/da-wedge-full.png');
        this.damagedTexture = PIXI.Texture.from('assets/da-wedge-damaged.png');
        this.cautionFloorExpand = new PIXI.Sprite(
            PIXI.Texture.from('assets/floor-warning-01.png')
        );
        this.cautionFloorBoundary = new PIXI.Sprite(
            PIXI.Texture.from('assets/floor-warning-02.png')
        );
        this.el = new PIXI.Sprite(this.fullTexture);
        this.outsideLight = new PIXI.Sprite(
            PIXI.Texture.from('assets/crack-light.png')
        );
        this.healthBar = new PIXI.Graphics();
        this.id = id;
        this.wedgeCount = wedgeCount;
        this.maxHealth = 60;
        this.health = this.maxHealth;
        this.letter = String.fromCharCode(65 + this.id);

        this.rot = (id * (2 * Math.PI)) / wedgeCount - 0.5 * Math.PI;
        this.pos = {
            x: Math.cos(this.rot) * this.turret.radius,
            y: Math.sin(this.rot) * this.turret.radius,
        };
        this.playerPos = { x: this.pos.x * 0.88, y: this.pos.y * 0.88 };
        this.healthBarYOffset = -26;
        this.letterYOffset = -50;
        this.willBeShot = false;
        this.scoreCheck = true;
        this.init();
    }
    init() {
        this.turret.floorEl.addChild(this.el);
        this.el.rotation = this.rot + 0.5 * Math.PI; // for exact placement
        this.el.scale.set(1.05);
        this.el.x = this.pos.x;
        this.el.y = this.pos.y;
        this.el.anchor.set(0.5);
        this.initLetters();
        this.initHealthBar();
        this.cautionFloorInit();
        this.outsideLightInit();
    }
    update() {
        this.checkForDamage();
        this.updateHealthBar();
        this.checkRepairing();
        this.damageCheck();
    }
    cautionFloorInit() {
        this.cautionFloorExpand.anchor.set(0.5, 0.5);
        this.cautionFloorExpand.scale.y = 0.9;
        this.cautionFloorExpand.scale.x = 0;
        this.cautionFloorExpand.blendMode = PIXI.BLEND_MODES.ADD;
        this.cautionFloorExpand.visible = false;
        this.cautionFloorExpand.alpha = 1;
        this.cautionFloorExpand.y += 240;
        this.el.addChild(this.cautionFloorExpand);

        this.cautionFloorBoundary.anchor.set(0.5, 0.5);
        this.cautionFloorBoundary.scale.y = 0.9;
        this.cautionFloorBoundary.scale.x = 0.89;
        this.cautionFloorBoundary.blendMode = PIXI.BLEND_MODES.ADD;
        this.cautionFloorBoundary.visible = false;
        this.cautionFloorBoundary.alpha = 1;
        this.cautionFloorBoundary.y += 240;
        this.el.addChild(this.cautionFloorBoundary);
    }
    damageCheck() {
        if (this.health < 60) {
            this.outsideLight.visible = true;
        } else {
            this.outsideLight.visible = false;
        }
        if (this.willBeShot) {
            this.cautionFloorExpand.visible = true;
            this.cautionFloorBoundary.visible = true;
            if (this.cautionFloorExpand.scale.x < 0.9) {
                this.cautionFloorExpand.scale.x += 0.02;
            } else if (this.cautionFloorExpand.scale.x >= 0.89) {
                this.cautionFloorExpand.alpha = Math.random() * 0.5 + 0.5;
            }
        } else {
            this.cautionFloorExpand.visible = false;
            this.cautionFloorBoundary.visible = false;
            this.cautionFloorExpand.scale.x = 0;
        }

        if (this.outsideLight.alpha <= 0.4) {
            this.outsideLight.alpha = 0.41;
        } else if (this.outsideLight.alpha >= 0.6) {
            this.outsideLight.alpha = 0.59;
        } else {
            this.outsideLight.alpha += Math.sign(Math.random() - 0.5) * 0.005;
        }
    }

    outsideLightInit() {
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
        this.el.addChild(this.outsideLight);
    }

    initLetters() {
        const letterStyle = new PIXI.TextStyle();
        letterStyle.fill = '#ffffff';
        letterStyle.stroke = '#282228';
        letterStyle.strokeThickness = 10;
        letterStyle.fontFamily = 'Arial';
        letterStyle.fontWeight = 'bold';
        const letter = new PIXI.Text(this.letter, letterStyle);
        letter.rotation = -this.el.rotation;
        letter.anchor.set(0.5);
        letter.y = this.letterYOffset;
        this.el.addChild(letter);
    }
    initHealthBar() {
        this.healthBar.beginFill(0xff0050);
        this.healthBar.drawRect(0, 0, 64, 10);
        this.healthBar.y = this.healthBarYOffset;
        this.healthBar.x = -(64 / 2);
        this.el.addChild(this.healthBar);
    }
    updateHealthBar() {
        this.healthBar.scale.x = this.health / this.maxHealth;
        if (this.health === this.maxHealth) {
            this.healthBar.visible = false;
        } else {
            this.healthBar.visible = true;
        }
    }
    checkForDamage() {
        this.el.texture =
            this.health < this.maxHealth
                ? this.damagedTexture
                : this.fullTexture;
        if (this.el.texture === this.damagedTexture) {
            this.scoreCheck = false;
        }
        if (this.el.texture === this.fullTexture && this.scoreCheck === false) {
            this.game.score++;
            this.scoreCheck = true;
        }
    }
    setHealth(amt = 0) {
        this.health = amt;
    }
    checkRepairing() {
        if (
            this.game.player.pos.x === this.playerPos.x &&
            this.game.player.pos.y === this.playerPos.y
        ) {
            this.addHealth(2);
        }
    }
    addHealth(n) {
        this.health += n;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }
}
