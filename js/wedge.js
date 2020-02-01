class Wedge {
    constructor(game, turret, id, wedgeCount) {
        this.game = game;
        this.turret = turret;
        this.el = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-wedge-full.png')
        );
        this.id = id;
        this.wedgeCount = wedgeCount;
        this.shield = true;
        this.letter = String.fromCharCode(65 + this.id);

        this.rot = (id * (2 * Math.PI)) / wedgeCount;
        this.pos = {
            x: Math.cos(this.rot) * this.turret.radius * 2,
            y: Math.sin(this.rot) * this.turret.radius * 2
        };
        this.playerPos = { x: this.pos.x * 0.9, y: this.pos.y * 0.9 };
        this.letterPos = { x: this.pos.x * 1.1, y: this.pos.y * 1.1 };
        this.init();
    }
    init() {
        this.turret.el.addChild(this.el);
        this.el.rotation =
            this.rot + Math.PI * 0.5 + (1.5 * Math.PI) / this.wedgeCount / 2; // for exact placement
        this.el.x = this.pos.x;
        this.el.y = this.pos.y;
    }
    update() {}
}
