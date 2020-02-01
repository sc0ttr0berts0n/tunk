class Wedge {
    constructor(game, turret, id, wedgeCount) {
        this.game = game;
        this.turret = turret;
        this.fullTexture = PIXI.Texture.from('assets/da-wedge-full.png');
        this.damagedTexture = PIXI.Texture.from('assets/da-wedge-damaged.png');
        this.el =
            Math.random() >= 0.25
                ? new PIXI.Sprite(this.fullTexture)
                : new PIXI.Sprite(this.damagedTexture);
        this.id = id;
        this.wedgeCount = wedgeCount;
        this.damaged = true;
        this.letter = String.fromCharCode(65 + this.id);

        this.rot =
            (id * (2 * Math.PI)) / wedgeCount + (2 * Math.PI) / wedgeCount / 2;
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
        this.el.rotation = this.rot + 0.5 * Math.PI; // for exact placement
        this.el.scale.set(1.05);
        this.el.x = this.pos.x;
        this.el.y = this.pos.y;
        this.el.anchor.set(0.5);
    }
    update() {
        if (this.game.frameCount % (60 * 5) === 0) {
            const texture =
                Math.random() >= 0.25 ? this.fullTexture : this.damagedTexture;
            this.el.texture = texture;
        }
    }
}
