class Player {
    constructor(game) {
        this.game = game;
        this.bloodRot = 0;
        this.pos = { x: 0, y: 0 };
        this.orientation = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
        this.targetWedge = null;
        this.alive = true;
        this.speed = 15;
        this.init();
    }
    init() {
        this.game.graphics.player.scale.set(0.65625, 0.65625);
        this.game.graphics.player.anchor.set(0.5);
        this.game.graphics.playerBlood.anchor.set(0.45, 0.9);
        this.game.graphics.playerBlood.visible = false;
    }
    update(delta) {
        if (this.alive) {
            this.findDestination();
            this.movedaboi(delta);
        }
        this.game.graphics.player.x =
            this.pos.x + this.game.app.renderer.width / 2;
        this.game.graphics.player.y =
            this.pos.y + this.game.app.renderer.height / 2;
        this.game.graphics.playerBlood.rotation =
            this.bloodRot + -this.game.graphics.player.rotation;
        this.checkRepairing();
        if (!this.alive) {
            this.game.graphics.playerBlood.visible = true;
        }
    }
    reinit() {
        this.pos = { x: 0, y: 0 };
        this.orientation = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
        this.targetWedge = null;
        this.alive = true;
        this.game.graphics.playerBlood.visible = false;
    }
    movedaboi(delta) {
        const distx = this.targetPos.x - this.pos.x;
        const disty = this.targetPos.y - this.pos.y;
        const angle = Math.atan2(disty, distx);

        const movex =
            (distx / Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))) *
            this.speed *
            delta;
        const movey =
            (disty / Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))) *
            this.speed *
            delta;
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
        if (angle !== 0) {
            this.game.graphics.player.rotation = angle + 0.5 * Math.PI;
        }
    }
    checkRepairing() {
        if (
            this.targetWedge &&
            this.pos.x === this.targetPos.x &&
            this.pos.y === this.targetPos.y
        ) {
            this.targetWedge.addHealth(2);
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
