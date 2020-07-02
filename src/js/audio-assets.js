"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var howler_1 = require("howler");
var AudioAssets = /** @class */ (function () {
    function AudioAssets(game) {
        this.game = game;
        this.bgm = new howler_1.Howl({ src: ['/assets/audio/fsharptunk_vD.mp3'] });
        this.death = new howler_1.Howl({ src: ['/assets/audio/deathsound.mp3'] });
        this.cannonFire = new howler_1.Howl({ src: ['/assets/audio/canon1.mp3'] });
        this.moveDepart = new howler_1.Howl({ src: ['/assets/audio/depart.mp3'] });
        this.moveArrive = new howler_1.Howl({ src: ['/assets/audio/arrive.mp3'] });
        this.wallBreak = new howler_1.Howl({ src: ['/assets/audio/wallbreak2.mp3'] });
    }
    return AudioAssets;
}());
exports.default = AudioAssets;
//# sourceMappingURL=audio-assets.js.map