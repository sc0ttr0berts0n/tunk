"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Flak = /** @class */ (function () {
    function Flak(game, target, angle, isLethal, speed) {
        if (isLethal === void 0) { isLethal = true; }
        if (speed === void 0) { speed = 20; }
        this.container = new PIXI.Container();
        this.el = new PIXI.Sprite(this.game.graphics.flakGraphic);
        this.yOff = -this.game.turret.radius - this.game.app.renderer.width * 4;
        this.isDead = false;
        this.game = game;
        this.angle = angle + 0.5 * Math.PI;
        this.target = target;
        this.speed = speed;
        this.angle = angle + 0.5 * Math.PI;
        this.isLethal = isLethal;
        this.init();
    }
    Flak.prototype.init = function () {
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
    };
    Flak.prototype.update = function (delta) {
        this.el.y += this.speed;
        // calc player-flak distance
        var player = this.game.graphics.player.worldTransform;
        var flak = this.el.worldTransform;
        var xDistPlayerFlak = player.tx - flak.tx;
        var yDistPlayerFlak = player.ty - flak.ty;
        var hypotPlayerFlak = Math.sqrt(Math.pow(xDistPlayerFlak, 2) + Math.pow(yDistPlayerFlak, 2));
        // kill 'em
        if (hypotPlayerFlak < 20 && this.isLethal) {
            this.game.player.bloodRot = this.container.rotation + Math.PI;
            this.game.player.alive = false;
        }
        // calc flak-wedge distance
        var wedge = this.target.wall.worldTransform;
        var xDistFlakWedge = flak.tx - wedge.tx;
        var yDistFlakWedge = flak.ty - wedge.ty;
        var hypotFlakWedge = Math.sqrt(Math.pow(xDistFlakWedge, 2) + Math.pow(yDistFlakWedge, 2));
        // move flak
        this.el.y += this.speed * delta;
        // collide and remove
        var wedgeHealthAboveZero = this.target.health > 0;
        var flakWentReallyFar = this.el.y > this.game.app.renderer.width;
        var flakFlewThroughTurret = this.el.y > this.game.turret.radius;
        var flakAtItsTarget = hypotFlakWedge < 30;
        if (this.isLethal) {
            this.target.isLethal = true;
        }
        if (flakAtItsTarget && wedgeHealthAboveZero) {
            this.isDead = true;
            this.container.visible = false;
            this.container.destroy();
            this.target.setHealth();
            this.target.willBeShot = false;
            if (this.isLethal) {
                this.target.isLethal = false;
            }
            // play sound
            this.game.audio.wallBreak.pos(this.target.pos.x / 175, 0, this.target.pos.y / 175);
            this.game.audio.wallBreak.play();
        }
        if (flakFlewThroughTurret) {
            if (flakWentReallyFar) {
                this.isDead = true;
                this.container.visible = false;
                this.container.destroy();
            }
            this.target.willBeShot = false;
            this.target.isLethal = false;
        }
    };
    Flak.prototype.reinit = function () {
        this.isLethal = false;
        this.isDead = true;
        this.el.alpha = 0;
    };
    return Flak;
}());
exports.default = Flak;
//# sourceMappingURL=flak.js.map