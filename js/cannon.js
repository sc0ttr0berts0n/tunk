class Cannon {
    constructor(Game) {
        this.game = Game;
        this.barrel = new PIXI.Sprite(
            PIXI.Texture.from('assets/turret-barrel.png')
        );
        this.cannonFire = new PIXI.Sprite(
            PIXI.Texture.from('assets/turret-flash.png')
        );
        this.cannonSmoke = new PIXI.Sprite(
            PIXI.Texture.from('assets/turret-smoke2.png')
        );
        this.cannonBarrelSmoke = new PIXI.Sprite(
            PIXI.Texture.from('assets/turret-barrel-smoke.png')
        );
        this.cannonTargetX = this.game.app.renderer.width / 2 + 100;
        this.cannonTargetY = this.game.app.renderer.height / 2 - 120;

        this.nextShot = 4;

        this.init();
    }

    init() {
        this.game.app.stage.addChild(this.cannonBarrelSmoke);
        this.cannonBarrelSmoke.anchor.set(0, 0.5);
        this.cannonBarrelSmoke.x = this.cannonTargetX + 50;
        this.cannonBarrelSmoke.y = this.cannonTargetY - 50;
        this.cannonBarrelSmoke.rotation = -0.25 * Math.PI;
        this.cannonBarrelSmoke.scale.set(0.9);
        this.cannonBarrelSmoke.blendMode = PIXI.BLEND_MODES.OVERLAY;
        // this.cannonBarrelSmoke.alpha = 0;

        this.game.app.stage.addChild(this.cannonSmoke);
        this.cannonSmoke.anchor.set(0, 0.5);
        this.cannonSmoke.x = this.cannonTargetX + 285;
        this.cannonSmoke.y = this.cannonTargetY - 285;
        this.cannonSmoke.rotation = -0.25 * Math.PI;
        this.cannonSmoke.scale.set(2);
        this.cannonSmoke.blendMode = PIXI.BLEND_MODES.OVERLAY;
        this.cannonSmoke.alpha = 0;

        this.game.app.stage.addChild(this.cannonFire);
        this.cannonFire.anchor.set(0, 0.5);
        this.cannonFire.x = this.cannonTargetX + 285;
        this.cannonFire.y = this.cannonTargetY - 285;
        this.cannonFire.rotation = -0.25 * Math.PI;
        this.cannonFire.alpha = 0;

        this.game.app.stage.addChild(this.barrel);
        this.barrel.anchor.set(0, 0.5);
        this.barrel.x = this.cannonTargetX;
        this.barrel.y = this.cannonTargetY;
        this.barrel.rotation = -0.25 * Math.PI;
    }

    update() {
        if (this.game.frameCount > this.nextShot - 4) {
            this.cannonFire.alpha = 1;
            this.cannonSmoke.alpha += 0.3;
            this.cannonSmoke.scale.set(2);
            this.cannonBarrelSmoke.alpha += 0.3;
            this.cannonBarrelSmoke.scale.set(2);
        }
        if (this.game.frameCount > this.nextShot - 1) {
            this.cannonFire.alpha = 0;
        }
        if (this.cannonSmoke.alpha > 0) {
            this.cannonSmoke.alpha -= 0.1;
            this.cannonSmoke.scale.x += 0.05;
            this.cannonSmoke.scale.y += 0.05;
        }
        if (this.cannonBarrelSmoke.alpha > 0) {
            this.cannonBarrelSmoke.alpha -= 0.1;
            this.cannonBarrelSmoke.scale.x += 0.05;
            this.cannonBarrelSmoke.scale.y += 0.05;
        }
        const factor = 0.06;
        const xDist = this.barrel.x - this.cannonTargetX;
        const yDist = this.barrel.y - this.cannonTargetY;
        const xOff = xDist * factor;
        const yOff = yDist * factor;
        this.barrel.x -= xOff;
        this.barrel.y -= yOff;

        if (this.game.frameCount > this.nextShot) {
            this.barrel.x -= 140;
            this.barrel.y += 140;
            this.cannonBarrelSmoke.alpha += 0.3;
            this.cannonBarrelSmoke.scale.set(0.9);
            this.nextShot = this.game.frameCount + Math.random() * 270 + 60;
        }
    }
}
