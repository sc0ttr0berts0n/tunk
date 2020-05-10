class Goon {
    constructor(game) {
        this.game = game;
        this.smokes = [];
        this.init();
    }
    init() {
        const goon = this.game.graphics.goon;
        goon.anchor.set(0.5, 0.5);
        goon.scale.set(0.5, 0.5);
        this.spawn();
    }
    update() {
        const player = this.game.graphics.player.worldTransform;
        const goon = this.game.graphics.goon.worldTransform;
        const xDist = player.tx - goon.tx;
        const yDist = player.ty - goon.ty;
        const rotation = Math.atan2(yDist, xDist);
        const hypot = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
        const factor = 0.0025;

        // move goon
        this.game.graphics.goon.x += xDist * factor;
        this.game.graphics.goon.y += yDist * factor;

        // rotate goon at player
        this.game.graphics.goon.rotation = rotation;

        // player death check
        if (hypot < 50 && hypot !== 0) {
            this.game.player.alive = false;
        }

        // check to goon death by flak
        if (this.game.flaks.length > 0) {
            this.game.flaks.forEach((flak) => {
                const goon = this.game.graphics.goon.worldTransform;
                const pos = flak.el.worldTransform;
                const xDist = goon.tx - pos.tx;
                const yDist = goon.ty - pos.ty;
                const dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

                if (dist < 40) {
                    this.spawn();
                }
            });
        }

        // add smoke
        this.smokes = this.smokes.filter((smoke) => !smoke.dead);
        if (this.game.frameCount % 15 === 0) {
            this.smokes.push(new GoonSmoke(game));
        }
        this.smokes.forEach((smoke) => smoke.update());
    }
    reinit() {
        this.spawn();
    }
    spawn() {
        const sign = () => Math.sign(Math.random() - 0.5);
        this.game.graphics.goon.x =
            sign() * this.game.app.renderer.width +
            (Math.random() * this.game.app.renderer.width) / 4;
        this.game.graphics.goon.y =
            sign() * this.game.app.renderer.height +
            (Math.random() * this.game.app.renderer.height) / 4;
    }
}

class GoonSmoke {
    constructor(game) {
        this.game = game;
        this.el = new PIXI.Sprite(this.game.graphics.goonSmoke);
        this.lifespan = Math.floor(Math.random() * 600 + 20);
        this.age = 0;
        this.dead = false;
        this.sign = Math.sign(Math.random() - 0.5);

        this.init();
    }
    init() {
        this.el.x = this.game.graphics.goon.x;
        this.el.y = this.game.graphics.goon.y;
        this.el.anchor.set(0.5, 0.5);
        this.el.scale.set(Math.random() * 0.25 + 0.25);
        this.el.rotation = Math.PI * 2 * Math.random();
        this.el.alpha = 0;
        this.game.app.stage.addChild(this.el);
    }
    update() {
        this.age++;
        if (this.age > this.lifespan) {
            this.dead = true;
            this.el.destroy();
        } else {
            if (this.age < 50) {
                this.el.alpha += 1 / 50;
            }
            if (this.age > this.lifespan - 10) {
                this.el.alpha += -0.1;
            }
            this.el.rotation += ((Math.PI * 2) / 360) * this.sign;
        }
    }
}
