class Player {
    constructor(game) {
        this.game = game;
        this.el = new PIXI.Sprite(PIXI.Texture.from('assets/da-boi.png'));
        this.pos = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
        this.targetWedge = null;
        this.alive = true;
        this.speed = 15;
        this.init();
    }
    init() {
        this.game.turret.el.addChild(this.el);
        this.el.scale.set(0.75, 0.75);
        this.el.anchor.set(0.5);
    }
    update() {
        this.findDestination();
        this.movedaboi();
        this.el.x = this.pos.x;
        this.el.y = this.pos.y;
    }
    movedaboi() {
        const distx = this.targetPos.x - this.pos.x;
        const disty = this.targetPos.y - this.pos.y;
        const movex =
            (distx / Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))) *
            this.speed;
        const movey =
            (disty / Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))) *
            this.speed;
        if (
            Math.abs(distx) < Math.abs(this.speed) &&
            Math.abs(disty) < Math.abs(this.speed)
        ) {
            this.pos.x = this.targetPos.x;
            this.pos.y = this.targetPos.y;
        } else {
            this.pos.x += movex;
            this.pos.y += movey;
        }
    }
    findDestination() {
        const wedgeIndex = this.game.kb.code - 65;
        const targetWedge = this.game.turret.wedges[wedgeIndex];
        if (targetWedge) {
            this.targetPos = targetWedge.playerPos;
            this.targetWedge = targetWedge;
        }
    }
}
