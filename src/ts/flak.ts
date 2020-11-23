import * as PIXI from 'pixi.js';
import Game from './game';
import Wedge from './wedge';
import Victor = require('victor');

export default class Flak {
    private game: Game;
    private angle: number;
    private container = new PIXI.Container();
    private el: PIXI.Sprite;
    public target: Wedge;
    private speed: number;
    public isLethal: boolean;
    private yOff: number;
    public isDead = false;

    constructor(
        game: Game,
        target: Wedge,
        angle: number,
        isLethal = true,
        speed = 20
    ) {
        this.game = game;
        this.el = new PIXI.Sprite(this.game.graphics.flakGraphic);
        this.angle = angle + 0.5 * Math.PI;
        this.target = target;
        this.speed = speed;
        this.angle = angle + 0.5 * Math.PI;
        this.yOff = -this.game.turret.radius - this.game.app.renderer.width * 4;
        this.isLethal = isLethal;
        this.init();
    }
    public init() {
        this.container.rotation = this.angle;
        this.el.rotation = Math.PI * 0.5;
        this.el.anchor.set(1, 0.5);
        this.el.y = this.yOff;
        this.container.position.set(
            this.game.app.renderer.width / 2,
            this.game.app.renderer.height / 2
        );
        this.container.addChild(this.el);
        this.game.app.stage.addChild(this.container);

        this.target.willBeShot = true;
        if (this.isLethal) {
            this.target.isLethal = true;
        }
    }
    public update(delta: number) {
        // Todo: fork this into a few private methods

        this.el.y += this.speed;
        // calc player-flak distance
        const player = this.game.graphics.player.worldTransform;
        const flak = this.el.worldTransform;
        const xDistPlayerFlak = player.tx - flak.tx;
        const yDistPlayerFlak = player.ty - flak.ty;
        const hypotPlayerFlak = Math.sqrt(
            xDistPlayerFlak ** 2 + yDistPlayerFlak ** 2
        );

        // kill 'em
        if (hypotPlayerFlak < 20 && this.isLethal) {
            this.game.player.bloodRot = this.container.rotation + Math.PI;
            this.game.player.alive = false;
        }

        // calc flak-wedge distance
        const wedge = this.target.wall.worldTransform;
        const xDistFlakWedge = flak.tx - wedge.tx;
        const yDistFlakWedge = flak.ty - wedge.ty;
        const hypotFlakWedge = Math.sqrt(
            Math.pow(xDistFlakWedge, 2) + Math.pow(yDistFlakWedge, 2)
        );

        // move flak
        this.el.y += this.speed * delta;

        // collide and remove
        const wedgeHealthAboveZero = this.target.health > 0;
        const flakWentReallyFar = this.el.y > this.game.app.renderer.width;
        const flakFlewThroughTurret = this.el.y > this.game.turret.radius;
        const flakAtItsTarget = hypotFlakWedge < 30;

        if (this.isLethal) {
            this.target.isLethal = true;
        }

        if (flakAtItsTarget && wedgeHealthAboveZero) {
            this.isDead = true;
            this.container.visible = false;
            this.container.destroy();
            this.game.turret.destroyWall(this.target);
            this.target.willBeShot = false;
            if (this.isLethal) {
                this.target.isLethal = false;
            }

            // play sound
            this.game.audio.wallBreak.pos(
                this.target.pos.x / 175,
                0,
                this.target.pos.y / 175
            );
            this.game.audio.wallBreak.play();
        }

        if (flakFlewThroughTurret) {
            if (flakWentReallyFar) {
                this.isDead = true;
                this.container.visible = false;
                this.container.destroy();
            }
            this.target.willBeShot = false;
            this.target.isLethal = false;
        }
    }

    public getWorldPos() {
        return new Victor(this.el.worldTransform.tx, this.el.worldTransform.ty);
    }

    public reinit() {
        this.isLethal = false;
        this.isDead = true;
        this.el.alpha = 0;
    }
}
