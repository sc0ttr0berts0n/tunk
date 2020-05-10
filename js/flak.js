class Flak {
    constructor(game, target, angle, isLethal = true, speed = 20) {
        this.game = game;
        this.angle = angle + 0.5 * Math.PI;
        this.container = new PIXI.Container();
        this.el = new PIXI.Sprite(this.game.graphics.flakGraphic);
        this.target = target;
        this.speed = speed;
        this.angle = angle + 0.5 * Math.PI;
        this.isLethal = isLethal;
        this.yOff = -this.game.turret.radius - this.game.app.renderer.width * 4;
        this.isDead = false;
        this.init();
    }
    init() {
        this.container.rotation = this.angle;
        this.el.rotation = Math.PI * 0.5;
        this.el.anchor.set(1, 0.5);
        this.el.y = this.yOff;
        this.container.x = this.game.app.renderer.width / 2;
        this.container.y = this.game.app.renderer.height / 2;
        this.container.addChild(this.el);
        this.game.app.stage.addChild(this.container);

        this.target.willBeShot = true;
        if (this.isLethal) {
            this.target.isLethal = true;
        }
    }
    update() {
        this.el.y += this.speed;
        // calc player-flak distance
        const player = this.game.graphics.player.worldTransform;
        const flak = this.el.worldTransform;
        const xDistPlayerFlak = player.tx - flak.tx;
        const yDistPlayerFlak = player.ty - flak.ty;
        const hypotPlayerFlak = Math.sqrt(
            Math.pow(xDistPlayerFlak, 2) + Math.pow(yDistPlayerFlak, 2)
        );

        // kill 'em
        if (hypotPlayerFlak < 20 && this.isLethal) {
            this.game.player.bloodRot = this.container.rotation + Math.PI;
            this.game.player.alive = false;
        }

        // calc flak-wedge distance
        const wedge = this.target.wall.worldTransform;
        const xDistFlakWedge = flak.tx - wedge.tx;
        const yDistFlakWedge = flak.ty - wedge.ty;
        const hypotFlakWedge = Math.sqrt(
            Math.pow(xDistFlakWedge, 2) + Math.pow(yDistFlakWedge, 2)
        );

        // move flak
        this.el.y += this.speed;

        // collide and remove
        const wedgeHealthAboveZero = this.target.health > 0;
        const flakWentReallyFar = this.el.y > this.game.app.renderer.width;
        const flakFlewThroughTurret = this.el.y > this.game.turret.radius;
        const flakAtItsTarget = hypotFlakWedge < 30;

        if (flakAtItsTarget && wedgeHealthAboveZero) {
            this.isDead = true;
            this.container.visible = false;
            this.container.destroy();
            this.target.setHealth();
            this.target.willBeShot = false;
            if (this.isLethal) {
                this.target.isLethal = false;
            }
        }

        if (flakFlewThroughTurret) {
            if (flakWentReallyFar) {
                this.isDead = true;
                this.container.visible = false;
                this.container.destroy();
            }
            this.target.willBeShot = false;
            if (this.isLethal) {
                this.target.isLethal = false;
            }
        }
    }
    reinit() {
        this.isLethal = false;
        this.isDead = true;
        this.el.alpha = 0;
    }
}
