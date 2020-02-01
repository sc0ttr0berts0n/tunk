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

  init() {
    //this.app.ticker.add(animate);
  }
  update() {
    this.turret.update();
  }
}

const canvas = document.getElementById("game");
const game = new Game(canvas);
