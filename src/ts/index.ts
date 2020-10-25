declare global {
    interface Window {
        game: Game;
    }

    interface Vec2 {
        x: number;
        y: number;
    }
}

import Game from './game';
import ui from './ui';
import audioUi from './audio-ui';
import WebFont = require('webfontloader');

const startGame = () => {
    const canvas = document.getElementById('game') as HTMLCanvasElement;
    const game = new Game(canvas);
    window.game = game;
};

WebFont.load({
    google: {
        families: ['Noto Sans:700'],
    },
    active: function () {
        startGame();
    },
});

ui();
audioUi();
