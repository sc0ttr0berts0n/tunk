class Game {
    constructor() {
        this.frameCount = 0;
        this.turret = new Turret();
        this.player = new Player();
    }
}

const canvas = document.getElementById('game');
let _w = window.innerWidth;
let _h = window.innerHeight;

const app = new PIXI.Application({
    view: canvas,
    width: _w,
    height: _h,
    transparent: true
});

window.addEventListener('resize', resize);

let circle = new PIXI.Graphics();
circle.beginFill(0x9966ff);
circle.drawCircle(0, 0, 100);
circle.endFill();
circle.x = _w / 2;
circle.y = _h / 2;
app.stage.addChild(circle);

function resize() {
    _w = window.innerWidth;
    _h = window.innerHeight;

    app.renderer.resize(_w, _h);
}
