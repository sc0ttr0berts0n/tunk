class Goon {
    constructor(game) {
        this.game = game;
        this.speed = 0.5;
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
    constructor(game, goon) {
        this.pos = {
            x: this.game.graphics.goon.x,
            y: this.game.graphics.goon.y,
        };
    }
}
