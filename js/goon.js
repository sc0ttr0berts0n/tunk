class Goon {
    constructor(game) {
        this.game = game;
        this.speed = 0.5;
        this.init();
    }
    init() {
        const goon = this.game.graphics.goon;
        goon.anchor.set(0.5, 0.5);
        goon.scale.set(0.75, 0.75);
        goon.x = Math.random() * this.game.app.renderer.width;
        goon.y = Math.random() * this.game.app.renderer.height;
    }
    update() {
        const player = this.game.graphics.player.worldTransform;
        const goon = this.game.graphics.goon.worldTransform;
        const xDist = player.tx - goon.tx;
        const yDist = player.ty - goon.ty;
        const hypot = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
        const factor = 0.001;
        this.game.graphics.goon.x += xDist * factor;
        this.game.graphics.goon.y += yDist * factor;

        if (hypot < 50 && hypot !== 0) {
            this.game.player.alive = false;
        }
    }
}
