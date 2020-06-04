class Cannon {
    constructor(game) {
        this.game = game;
        this.container = new PIXI.Container();
        this.cannonTargetX = 120;
        this.cannonTargetY = -10;
        this.nextShot = 4;
        this.init();
    }

    init() {
        this.game.graphics.cannonBarrelSmoke.anchor.set(0, 0.5);
        this.game.graphics.cannonBarrelSmoke.x = this.cannonTargetX + 0;
        this.game.graphics.cannonBarrelSmoke.y = this.cannonTargetY - 0;
        this.game.graphics.cannonBarrelSmoke.rotation = 0 * Math.PI;
        this.game.graphics.cannonBarrelSmoke.scale.set(0.9);
        this.game.graphics.cannonBarrelSmoke.blendMode =
            PIXI.BLEND_MODES.OVERLAY;

        this.game.graphics.cannonSmoke.anchor.set(0, 0.5);
        this.game.graphics.cannonSmoke.x = this.cannonTargetX + 370;
        this.game.graphics.cannonSmoke.y = this.cannonTargetY - 10;
        this.game.graphics.cannonSmoke.rotation = 0 * Math.PI;
        this.game.graphics.cannonSmoke.scale.set(2);
        this.game.graphics.cannonSmoke.blendMode = PIXI.BLEND_MODES.OVERLAY;
        this.game.graphics.cannonSmoke.alpha = 0;

        this.game.graphics.cannonFire.anchor.set(0, 0.5);
        this.game.graphics.cannonFire.x = this.cannonTargetX + 370;
        this.game.graphics.cannonFire.y = this.cannonTargetY - 0;
        this.game.graphics.cannonFire.rotation = 0 * Math.PI;
        this.game.graphics.cannonFire.alpha = 0;

        this.game.graphics.barrel.anchor.set(0, 0.5);
        this.game.graphics.barrel.x = this.cannonTargetX;
        this.game.graphics.barrel.y = this.cannonTargetY;
        this.game.graphics.barrel.scale.set(0.85);
        this.game.graphics.barrel.rotation = 0 * Math.PI;
    }

    update(delta) {
        if (this.game.frameCount > this.nextShot - 4) {
            this.game.graphics.cannonFire.alpha = 1;
            this.game.graphics.cannonSmoke.alpha += 0.3;
            this.game.graphics.cannonSmoke.scale.set(2);
            this.game.graphics.cannonBarrelSmoke.alpha += 0.3;
            this.game.graphics.cannonBarrelSmoke.scale.set(2);
        }
        if (this.game.frameCount > this.nextShot - 1) {
            this.game.graphics.cannonFire.alpha = 0;
        }
        if (this.game.graphics.cannonSmoke.alpha > 0) {
            this.game.graphics.cannonSmoke.alpha -= 0.1;
            this.game.graphics.cannonSmoke.scale.x += 0.05;
            this.game.graphics.cannonSmoke.scale.y += 0.05;
        }
        if (this.game.graphics.cannonBarrelSmoke.alpha > 0) {
            this.game.graphics.cannonBarrelSmoke.alpha -= 0.1;
            this.game.graphics.cannonBarrelSmoke.scale.x += 0.05;
            this.game.graphics.cannonBarrelSmoke.scale.y += 0.05;
        }
        const factor = 0.06;
        const xDist = this.game.graphics.barrel.x - this.cannonTargetX;
        const yDist = this.game.graphics.barrel.y - this.cannonTargetY;
        const xOff = xDist * factor;
        const yOff = yDist * factor;
        this.game.graphics.barrel.x -= xOff;
        this.game.graphics.barrel.y -= yOff;

        if (this.game.frameCount > this.nextShot) {
            this.game.audio.cannonFire.play();
            this.game.graphics.barrel.x -= 140;
            this.game.graphics.cannonBarrelSmoke.alpha += 0.3;
            this.game.graphics.cannonBarrelSmoke.scale.set(0.9);
            this.nextShot = this.game.frameCount + Math.random() * 270 + 60;
        }
    }
}
