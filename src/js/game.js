"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var howler_1 = require("howler");
var graphics_1 = require("./graphics");
var audio_assets_1 = require("./audio-assets");
var player_1 = require("./player");
var turret_1 = require("./turret");
var cannon_1 = require("./cannon");
var flak_1 = require("./flak");
var endgame_overlay_1 = require("./endgame-overlay");
var Game = /** @class */ (function () {
    function Game(canvas) {
        this.canvas = canvas;
        this.app = new PIXI.Application({
            view: canvas,
            width: 1024,
            height: 1024,
            transparent: true,
        });
        this.graphics = new graphics_1.default(this);
        this.audio = new audio_assets_1.default(this);
        this.flaks = [];
        this.score = 0;
        this.scoreValue = null;
        this.scoreDomEl = document.querySelector('.game-ui--score');
        this.scoreDomElText = this.score.toString();
        this.highScore = parseInt(localStorage.getItem('tunk-high-score')) || 0;
        this.highScoreDomEl = document.querySelector('.game-ui--high-score');
        this.highScoreDomElText = "" + this.highScore;
        this.scoreDomEl = document.querySelector('.game-ui--score');
        this.scoreDomElText = this.score.toString();
        this.turretBodyRotation = Math.PI * 2;
        this.backgroundTargetRot = 0;
        this.backgroundNextMove = 0;
        this.turret = new turret_1.default(this, 26);
        this.cannon = new cannon_1.default(this);
        this.player = new player_1.default(this);
        this.endGameOverlay = new endgame_overlay_1.default(this, this.player);
        this.init();
        this.kb = new KeyboardObserver();
        this.damageChance = 0.008;
        this.shootHoleChance = 0.0125;
        this.frameCount = 0;
        this.lastRestart = 0;
        this.firstShot = false;
        this.reduceMotion = false;
        this.paused = true;
        this.muted = false;
    }
    Game.prototype.init = function () {
        var _this = this;
        this.graphics.background.x = this.app.renderer.width / 2;
        this.graphics.background.y = this.app.renderer.height / 2;
        this.graphics.background.anchor.set(0.5, 0.5);
        this.initScore();
        this.graphics.placeAssets();
        this.initScore();
        howler_1.Howler.volume(0.2);
        this.audio.bgm.loop(true);
        this.audio.bgm.play();
        this.app.ticker.add(function (delta) { return _this.update(delta); });
        setTimeout(this.clearTitle, 5000);
    };
    Game.prototype.update = function (delta) {
        if (!this.paused) {
            this.frameCount++;
            if (this.player.alive) {
                this.updateTurret(delta);
                this.shootFlakAtWalls();
                if (this.score >= 3 ||
                    this.frameCount - this.lastRestart >= 6000) {
                    this.shootFlakAtHoles();
                }
                this.turret.update(delta);
                this.updateScore();
            }
            this.player.update(delta);
            if (this.turret.wedges) {
                this.turret.wedges.forEach(function (wedge) { return wedge.update(); });
            }
            if (this.flaks.length) {
                this.flaks.forEach(function (flak) { return flak.update(delta); });
                this.flaks = this.flaks.filter(function (flak) { return !flak.isDead; });
                this.updateScore();
            }
        }
        this.endGameOverlay.update();
    };
    Game.prototype.reinit = function () {
        this.flaks.forEach(function (flak) { return flak.reinit(); });
        this.flaks = [];
        this.turret.wedges.forEach(function (wedge) { return wedge.reinit(); });
        this.lastRestart = this.frameCount;
        this.kb.reinit();
        this.player.reinit();
        this.turret.reinit();
        this.score = 0;
        this.updateScore();
        this.endGameOverlay.reinit();
        this.audio.bgm.stop();
        this.audio.bgm.play();
    };
    Game.prototype.updateTurret = function (delta) {
        var target = this.backgroundTargetRot;
        var actual = this.turretBodyRotation;
        var diff = target - actual;
        var factor = 0.005;
        var offset = diff * factor * delta;
        this.turretBodyRotation += offset;
        if (!this.reduceMotion) {
            this.graphics.background.rotation = this.turretBodyRotation;
        }
        else {
            this.graphics.turretExterior.rotation =
                this.turretBodyRotation + Math.PI * 0.25;
            this.cannon.container.rotation = this.turretBodyRotation;
        }
        if (this.frameCount > this.backgroundNextMove) {
            this.backgroundTargetRot = Math.random() * (Math.PI * 4 - 2);
            this.backgroundNextMove =
                this.frameCount + Math.random() * 120 + 60;
        }
    };
    Game.prototype.shootFlakAtWalls = function () {
        if (this.frameCount - this.lastRestart >= 180) {
            if (Math.random() < this.damageChance) {
                var wedges = this.turret.getFullWedges();
                if (wedges.length > 0) {
                    // odds of doing damage depend on how many walls remain
                    // if less walls exist, there chances of damange diminish
                    if (Math.random() <
                        1 - wedges.length / wedges[0].wedgeCount) {
                        return;
                    }
                    // choose a random wedge
                    var wedge = wedges[Math.floor(Math.random() * wedges.length)];
                    // init flak animation
                    this.flaks.push(new flak_1.default(this, wedge, wedge.rot, false));
                }
            }
        }
    };
    Game.prototype.shootFlakAtHoles = function () {
        if (Math.random() < this.damageChance) {
            var wedges = this.turret.getDamagedWedges();
            if (wedges.length > 1) {
                var wedge = wedges[Math.floor(Math.random() * wedges.length)];
                var wedgeCount = wedge.wedgeCount;
                var oppositeWedgeId = (wedge.id + wedgeCount / 2) % wedgeCount;
                var oppositeWedge = this.turret.wedges[oppositeWedgeId];
                this.flaks.push(new flak_1.default(this, oppositeWedge, wedge.rot));
            }
        }
    };
    Game.prototype.updateScore = function () {
        if (this.score.toString() !== this.scoreDomElText) {
            this.scoreDomElText = this.score.toString();
            this.scoreDomEl.textContent = this.score.toString();
        }
        if (this.score > Number(this.highScore)) {
            this.highScore = this.score;
            localStorage.setItem('tunk-high-score', this.score.toString());
            this.highScoreDomEl.textContent = this.highScore.toString();
        }
    };
    Game.prototype.resetHighScore = function () {
        localStorage.setItem('tunk-high-score', '0');
        if (this.player.alive) {
            this.highScore = this.score;
            this.highScoreDomElText = this.score.toString();
        }
        else {
            this.highScore = 0;
            this.highScoreDomElText = '0';
        }
        this.highScoreDomEl.textContent = this.highScoreDomElText;
    };
    Game.prototype.initScore = function () {
        this.highScoreDomEl.textContent = this.highScoreDomElText;
    };
    return Game;
}());
exports.default = Game;
//# sourceMappingURL=game.js.map