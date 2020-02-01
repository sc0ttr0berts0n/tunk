class Turret {
    constructor(game, wedgeCount) {
        this.game = game;
        this.wedgeCount = wedgeCount;
        this.radius = 256;

        this.el = new PIXI.Graphics();
        // this.wedges = Array(wedgeCount).fill(0);
        this.init();
    }
    init() {
        this.el.beginFill(0x60757c);
        this.el.drawCircle(0, 0, this.radius);
        this.el.endFill();
        this.el.x = window.innerWidth / 2;
        this.el.y = window.innerHeight / 2;
        this.game.app.stage.addChild(this.el);
    }
}

const circle = new PIXI.Graphics();

const gun = new PIXI.Graphics();
gun.beginFill(0xff5050);
gun.drawCircle(50, 50, 50);
gun.endFill();
circle.addChild(gun);
