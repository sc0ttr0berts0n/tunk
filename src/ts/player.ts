import Game from './game';
import Wedge from './wedge';

interface Vec2 {
    x: number;
    y: number;
}

export default class Player {
    private game: Game;
    public bloodRot: number = 0;
    public pos: Vec2 = { x: 0, y: 0 };
    private orientation: Vec2 = { x: 0, y: 0 };
    private targetPos: Vec2 = { x: 0, y: 0 };
    private targetWedge: Wedge;
    public alive: boolean = true;
    private lastAlive: boolean = true;
    private lastIsMoving: boolean = false;
    private isMoving: boolean = false;
    private speed: number = 12;
    constructor(game: Game) {
        this.game = game;
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
        }
        this.movedaboi(delta);
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
        this.playSounds();
        this.lastIsMoving = this.isMoving;
        this.lastAlive = this.alive;
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
        if (!this.alive) return;
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
            this.isMoving = false;
        } else {
            this.pos.x += movex;
            this.pos.y += movey;
            this.isMoving = true;
        }
        if (angle !== 0) {
            this.game.graphics.player.rotation = angle + 0.5 * Math.PI;
        }
    }
    playSounds() {
        const isArriving = this.lastIsMoving && !this.isMoving;
        const isDeparting = !this.lastIsMoving && this.isMoving;
        const justDied = this.lastAlive && !this.alive;
        if (isArriving) {
            // this.game.audio.moveArrive.play();
        } else if (isDeparting) {
            // this.game.audio.moveDepart.play();
        }
        if (justDied) {
            this.game.audio.death.play();
            this.game.audio.bgm.stop();
        }
    }
    inMotion() {
        return this.isMoving && !this.atTarget();
    }
    atTarget() {
        return (
            this.pos.x === this.targetPos.x && this.pos.y === this.targetPos.y
        );
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
