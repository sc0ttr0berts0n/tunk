class Player {
  constructor(game) {
    this.game = game;
    this.el = new PIXI.Sprite(PIXI.Texture.from("assets/da-boi.png"));
    this.pos = { x: 0, y: 0 };
    this.targetPos = this.pos;
    this.alive = true;
    this.init();
  }
  init() {
    console.log(this.game);
    this.game.turret.el.addChild(this.el);
    this.el.scale.set(0.3, 0.3);
  }
  update() {}
}

console.log("player exists and is asdfkajsdf");
