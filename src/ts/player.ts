import Victor = require('victor');
import Game from './game';
import Wedge from './wedge';

export default class Player {
    private game: Game;
    public bloodRot: number = 0;
    public pos: Vec2 = { x: 0, y: 0 };
    private orientation: Vec2 = { x: 0, y: 0 };
    private targetPos: Vec2 = { x: 0, y: 0 };
    public targetWedge: Wedge;
    public alive: boolean = true;
    private lastAlive: boolean = true;
    private lastIsMoving: boolean = false;
    private isMoving: boolean = false;
    private speed: number = 12;

    constructor(game: Game) {
        this.game = game;
        this.init();
    }

    public init() {
        this.game.graphics.player.scale.set(0.65625, 0.65625);
        this.game.graphics.player.anchor.set(0.5);
        this.game.graphics.playerBlood.anchor.set(0.45, 0.9);
        this.game.graphics.playerBlood.visible = false;
    }

    public update(delta: number) {
        const justDied = this.lastAlive && !this.alive;

        if (this.alive) {
            this.findDestination();
        }
        this.movedaboi(delta);
        this.game.graphics.player.x =
            this.pos.x + this.game.app.renderer.width / 2;
        this.game.graphics.player.y =
            this.pos.y + this.game.app.renderer.height / 2;
        if (this.isAtTarget()) {
            this.repair();
            this.targetWedge.isVisited = true;
        }
        if (justDied) {
            this.game.graphics.playerBlood.visible = true;
            this.game.graphics.playerBlood.rotation =
                this.bloodRot + -this.game.graphics.player.rotation;
        }
        this.playSounds();
        this.lastIsMoving = this.isMoving;
        this.lastAlive = this.alive;
    }

    public reinit() {
        this.pos = { x: 0, y: 0 };
        this.orientation = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
        this.targetWedge = null;
        this.alive = true;
        this.game.graphics.playerBlood.visible = false;
    }

    private movedaboi(delta: number) {
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

    private playSounds() {
        const justDied = this.lastAlive && !this.alive;
        const isArriving = this.lastIsMoving && !this.isMoving;
        const isDeparting = !this.lastIsMoving && this.isMoving;
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

    public isAtTarget() {
        return (
            this.targetWedge &&
            this.pos.x === this.targetPos.x &&
            this.pos.y === this.targetPos.y
        );
    }

    private repair() {
        this.targetWedge.addHealth(1 / 60);
    }

    private findDestination() {
        const wedgeIndex = this.game.kb.code - 65;
        const targetWedge = this.game.turret.wedges[wedgeIndex];
        if (targetWedge) {
            this.targetPos = targetWedge.playerPos;
            this.targetWedge = targetWedge;
        }
    }

    getWorldPos() {
        return new Victor(
            this.game.graphics.player.worldTransform.tx,
            this.game.graphics.player.worldTransform.ty
        );
    }
}
