"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var wedge_1 = require("./wedge");
var Turret = /** @class */ (function () {
    function Turret(game, wedgeCount) {
        var _this = this;
        this.radius = 256;
        this.game = game;
        this.wedgeCount = wedgeCount;
        this.container = new PIXI.Container();
        this.wedges = __spreadArrays(new Array(wedgeCount)).map(function (el, index) { return new wedge_1.default(game, _this, index, wedgeCount); });
        this.init();
    }
    Turret.prototype.init = function () {
        this.container.x = this.game.app.renderer.width / 2;
        this.container.y = this.game.app.renderer.height / 2;
        this.container.rotation = -0.25 * Math.PI;
        this.game.graphics.turretExterior.anchor.set(0.5);
        this.game.graphics.turretExterior.rotation = 0.25 * Math.PI;
        this.game.graphics.turretFloor.anchor.set(0.5);
        this.game.graphics.turretFloor.rotation = 0.25 * Math.PI;
        this.game.graphics.turretFloor.scale.set(0.875);
        this.game.graphics.turretCeiling.x = this.game.app.renderer.width / 2;
        this.game.graphics.turretCeiling.y = this.game.app.renderer.height / 2;
        this.game.graphics.turretCeiling.anchor.set(0.5);
        this.game.graphics.turretCeiling.alpha = 1;
    };
    Turret.prototype.update = function (delta) {
        this.openingUpdate();
        this.game.cannon.update(delta);
    };
    Turret.prototype.reinit = function () {
        this.wedges.forEach(function (wedge) {
            wedge.health = wedge.maxHealth;
        });
    };
    Turret.prototype.openingUpdate = function () {
        if (this.game.frameCount >= 60 &&
            this.game.graphics.turretCeiling.alpha > 0) {
            if (this.game.frameCount % 60 === 0 &&
                this.game.graphics.turretCeiling.alpha > 0) {
                this.game.graphics.turretCeiling.alpha -= 0.34;
            }
        }
    };
    Turret.prototype.getFullWedges = function () {
        return this.wedges.filter(function (wedge) { return wedge.health >= wedge.maxHealth && !wedge.willBeShot; });
    };
    Turret.prototype.getDamagedWedges = function () {
        var _this = this;
        return this.wedges.filter(function (wedge) {
            return (wedge.health < wedge.maxHealth &&
                _this.game.player.pos.x !== wedge.pos.x &&
                _this.game.player.pos.y !== wedge.pos.y);
        });
    };
    return Turret;
}());
exports.default = Turret;
//# sourceMappingURL=turret.js.map