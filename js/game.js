class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true
        });
        this.turret = new Turret(this, 26);
        this.player = new Player(this);
        this.frameCount = 0;
        this.init();
    }

    init() {}
    update() {
        // console.log('update ran');
        this.turret.update();
        if (this.turret.wedges) {
            this.turret.wedges.forEach(wedge => wedge.update());
        }
    }
}

const canvas = document.getElementById('game');
const game = new Game(canvas);

const loop = () => {
    requestAnimationFrame(loop);

    game.update();
};
loop();
