class Player {
    constructor() {
        this.el = new PIXI.Texture();
        this.pos = { x: 0, y: 0 };
        this.targetPos = this.pos;
        this.alive = true;
        this.init();
    }
    init() {}
    update() {}
}
