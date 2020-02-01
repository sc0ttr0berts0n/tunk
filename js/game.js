class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true
        });
        // this.player = new Player();
        this.frameCount = 0;
        this.turret = new Turret(this, 26);
        this.init();
    }

    init() {
        this.app.ticker.add(animate);
    }
    update() {
        this.turret.update();
    }
}

const canvas = document.getElementById('game');
const game = new Game(canvas);
