class Turret {
    constructor(game, wedgeCount) {
        this.game = game;
        this.el = new PIXI.Graphics();
        this.wedgeCount = wedgeCount;
        this.radius = 128;
        this.wedges = [...new Array(wedgeCount)].map(
            (el, index) => new Wedge(game, this, index, wedgeCount)
        );
        this.init();
    }
    init() {
        this.el.beginFill(0x9966ff);
        this.el.drawCircle(0, 0, this.radius * 2);
        this.el.endFill();
        this.el.x = window.innerWidth / 2;
        this.el.y = window.innerHeight / 2;
        this.game.app.stage.addChild(this.el);
    }
    update() {}
}
