declare global {
    interface Window {
        game: Game;
    }
}

import Game from './game';
import ui from './ui';
import audioUi from './audio-ui';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const game = new Game(canvas);
window.game = game;
ui();
audioUi();
