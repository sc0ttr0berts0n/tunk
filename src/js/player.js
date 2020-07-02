"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player = /** @class */ (function () {
    function Player(game) {
        this.bloodRot = 0;
        this.pos = { x: 0, y: 0 };
        this.orientation = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
        this.alive = true;
        this.lastAlive = true;
        this.lastIsMoving = false;
        this.isMoving = false;
        this.speed = 12;
        this.game = game;
        this.init();
    }
    Player.prototype.init = function () {
        this.game.graphics.player.scale.set(0.65625, 0.65625);
        this.game.graphics.player.anchor.set(0.5);
        this.game.graphics.playerBlood.anchor.set(0.45, 0.9);
        this.game.graphics.playerBlood.visible = false;
    };
    Player.prototype.update = function (delta) {
        if (this.alive) {
            this.findDestination();
        }
        this.movedaboi(delta);
        this.game.graphics.player.x =
            this.pos.x + this.game.app.renderer.width / 2;
        this.game.graphics.player.y =
            this.pos.y + this.game.app.renderer.height / 2;
        this.game.graphics.playerBlood.rotation =
            this.bloodRot + -this.game.graphics.player.rotation;
        this.checkRepairing();
        if (!this.alive) {
            this.game.graphics.playerBlood.visible = true;
        }
        this.playSounds();
        this.lastIsMoving = this.isMoving;
        this.lastAlive = this.alive;
    };
    Player.prototype.reinit = function () {
        this.pos = { x: 0, y: 0 };
        this.orientation = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
        this.targetWedge = null;
        this.alive = true;
        this.game.graphics.playerBlood.visible = false;
    };
    Player.prototype.movedaboi = function (delta) {
        if (!this.alive)
            return;
        var distx = this.targetPos.x - this.pos.x;
        var disty = this.targetPos.y - this.pos.y;
        var angle = Math.atan2(disty, distx);
        var movex = (distx / Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))) *
            this.speed *
            delta;
        var movey = (disty / Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))) *
            this.speed *
            delta;
        if (Math.abs(distx) < Math.abs(this.speed) &&
            Math.abs(disty) < Math.abs(this.speed)) {
            this.pos.x = this.targetPos.x;
            this.pos.y = this.targetPos.y;
            this.isMoving = false;
        }
        else {
            this.pos.x += movex;
            this.pos.y += movey;
            this.isMoving = true;
        }
        if (angle !== 0) {
            this.game.graphics.player.rotation = angle + 0.5 * Math.PI;
        }
    };
    Player.prototype.playSounds = function () {
        var isArriving = this.lastIsMoving && !this.isMoving;
        var isDeparting = !this.lastIsMoving && this.isMoving;
        var justDied = this.lastAlive && !this.alive;
        if (isArriving) {
            // this.game.audio.moveArrive.play();
        }
        else if (isDeparting) {
            // this.game.audio.moveDepart.play();
        }
        if (justDied) {
            this.game.audio.death.play();
            this.game.audio.bgm.stop();
        }
    };
    Player.prototype.inMotion = function () {
        return this.isMoving && !this.atTarget();
    };
    Player.prototype.atTarget = function () {
        return (this.pos.x === this.targetPos.x && this.pos.y === this.targetPos.y);
    };
    Player.prototype.checkRepairing = function () {
        if (this.targetWedge &&
            this.pos.x === this.targetPos.x &&
            this.pos.y === this.targetPos.y) {
            this.targetWedge.addHealth(2);
        }
    };
    Player.prototype.findDestination = function () {
        var wedgeIndex = this.game.kb.code - 65;
        var targetWedge = this.game.turret.wedges[wedgeIndex];
        if (targetWedge) {
            this.targetPos = targetWedge.playerPos;
            this.targetWedge = targetWedge;
        }
    };
    return Player;
}());
exports.default = Player;
//# sourceMappingURL=player.js.map