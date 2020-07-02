"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EndGameOverlay = /** @class */ (function () {
    function EndGameOverlay(game, player) {
        this.deathFlash = false;
        this.whiteDeathFrame = NaN;
        this.game = game;
        this.player = player;
        this.init();
    }
    EndGameOverlay.prototype.init = function () {
        this.initBlack();
        this.initWhite();
    };
    EndGameOverlay.prototype.initBlack = function () {
        this.game.graphics.endGameOverlayBlack.beginFill(0x000000);
        this.game.graphics.endGameOverlayBlack.drawRect(0, 0, 1024, 1024);
        this.game.graphics.endGameOverlayBlack.blendMode =
            PIXI.BLEND_MODES.MULTIPLY;
        this.game.graphics.endGameOverlayBlack.alpha = 0;
    };
    EndGameOverlay.prototype.initWhite = function () {
        this.game.graphics.endGameOverlayWhite.beginFill(0xfffff5);
        this.game.graphics.endGameOverlayWhite.drawRect(0, 0, 1024, 1024);
        this.game.graphics.endGameOverlayWhite.alpha = 0;
    };
    EndGameOverlay.prototype.reinit = function () {
        this.game.graphics.endGameOverlayBlack.alpha = 0;
        this.game.graphics.endGameOverlayWhite.alpha = 0;
        this.deathFlash = false;
        this.whiteDeathFrame = NaN;
    };
    EndGameOverlay.prototype.update = function () {
        if (!this.game.player.alive) {
            if (!this.whiteDeathFrame) {
                this.whiteDeathFrame = this.game.frameCount + 10;
            }
            if (this.game.graphics.endGameOverlayWhite.alpha === 0 &&
                this.deathFlash === false) {
                this.game.graphics.endGameOverlayWhite.alpha = 0.9;
                this.deathFlash = true;
            }
            if (this.deathFlash === true &&
                this.game.frameCount > this.whiteDeathFrame &&
                this.game.graphics.endGameOverlayBlack.alpha < 0.5) {
                this.game.graphics.endGameOverlayWhite.alpha = 0.01;
                this.game.graphics.endGameOverlayBlack.alpha = 0.6;
            }
            if (this.game.frameCount % 20 === 0 &&
                this.game.graphics.endGameOverlayBlack.alpha > 0.5 &&
                this.game.graphics.endGameOverlayBlack.alpha < 0.8) {
                this.game.graphics.endGameOverlayBlack.alpha += 0.1;
            }
        }
    };
    return EndGameOverlay;
}());
exports.default = EndGameOverlay;
//# sourceMappingURL=endgame-overlay.js.map