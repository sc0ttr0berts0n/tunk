import * as PIXI from 'pixi.js';
import Victor = require('victor');
import Game from './game';
import Boss from './boss';
import Player from './player';
import Wedge from './wedge';
import MissilePod from './missile-pod';
import { Explosion, ExplosionOptions } from './explosion';
import { Howl } from 'howler';

interface Vec2 {
    x: number;
    y: number;
}

export interface MissileOptions {
    sprite?: PIXI.Sprite;
    initialVel?: number;
    thrustStartAge?: number;
    thrustStrength?: number;
    lifespan?: number;
    onDeath?: Function | null;
}

export class Missile {
    private game: Game;
    public pos: Victor;
    private lastWorldPos = new Victor(0, 0);
    private vel: Victor;
    private acc = new Victor(0, 0);
    private friction = new Victor(0.97, 0.97);
    private target: Boss | Player | Wedge | MissilePod | null;
    private thrustStartAge: number;
    private thrustStrength: number;
    private el: PIXI.Sprite;
    private age: number = 0;
    public isDead = false;
    public onDeath: Function | null;
    private initialVel: number;
    public lifespan: number;
    public options: MissileOptions;
    private shadowRotation = Math.random() * Math.PI * 4;
    private rotationLerp = 0.04;
    private killRange = 25;

    constructor(
        game: Game,
        startPos: Victor,
        target: Boss | Player | Wedge | MissilePod,
        options?: MissileOptions
    ) {
        this.game = game;
        this.pos = startPos;
        this.target = target;
        this.el = options?.sprite ?? new PIXI.Sprite(game.graphics.missile);
        this.thrustStartAge = options?.thrustStartAge ?? 150;
        this.thrustStrength = options?.thrustStrength ?? 1.5;
        this.onDeath = options?.onDeath ?? null;
        this.initialVel = options?.initialVel ?? 5;
        this.lifespan = options?.lifespan ?? 600;
        this.vel = this.getInitialVel();
        this.init();
    }
    init() {
        this.el.x = this.pos.x;
        this.el.y = this.pos.y;
        this.el.anchor.set(0.5);
        if (this.lifespan === 180) {
            console.log(this.el.worldVisible);
            console.log(this.el.worldTransform.tx, this.el.worldTransform.ty);
        }
        this.game.graphics.skyContainer.addChild(this.el);
    }
    update() {
        this.age++;
        if (this.age > this.lifespan) {
            this.isDead = true;
        }
        if (this.isDead) {
            this.handleDeath();
        } else {
            if (this.target) {
                this.flyAtTarget();
                this.checkCollision();
            }
        }
    }

    getWorldPos() {
        return new Victor(this.el.worldTransform.tx, this.el.worldTransform.ty);
    }

    getInitialVel() {
        const targetPos = this.target?.getWorldPos() ?? new Victor(0, 0);
        const dist = targetPos.clone().subtract(this.pos);
        const variance = new Victor(Math.random(), Math.random());
        const unit = dist.normalize().multiply(variance);
        const thrustStrength = new Victor(-this.initialVel, -this.initialVel);

        return unit.multiply(thrustStrength);
    }

    flyAtTarget() {
        const targetPos = this.target.getWorldPos();
        const dist = targetPos.clone().subtract(this.pos);
        const unit = dist.normalize();
        const worldPos = this.getWorldPos();

        this.acc = unit.multiplyScalar(this.thrustStrength);
        if (this.age > this.thrustStartAge) {
            // calc accel
            this.vel = this.vel.add(this.acc);
        }

        // play missle travel sounds at age 1
        if (this.game.audio.canPlayMissileTravelAudio) {
            this.game.audio.canPlayMissileTravelAudio = false;
            this.game.audio.missileTravel.play();
        }

        // calc vel
        this.vel.multiply(this.friction);

        // calc pos
        this.pos = this.pos.add(this.vel);
        this.el.x = this.pos.x;
        this.el.y = this.pos.y;

        // calc rotation
        const rawRot = this.acc.angle() + Math.PI * 0.5 + Math.PI * 2;
        this.shadowRotation =
            (rawRot - this.shadowRotation) * this.rotationLerp +
            this.shadowRotation;
        this.el.rotation = this.shadowRotation;

        // send puff of smoke
        const vel = this.vel.clone().multiplyScalar(0.05);
        this.game.explosions.push(
            new Explosion(this.game, this.pos.clone(), {
                lifespan: 40,
                sprite: new PIXI.Sprite(this.game.graphics.smoke),
                momentum: Math.random() * 0.3 - 0.15,
                vel: vel,
                parentContainer: this.game.graphics.missileSmokeContainer,
            })
        );

        // store last postition
        this.lastWorldPos = worldPos.clone();
    }

    handleDeath() {
        if (this.game.audio.canPlayMissileDestroyAudio) {
            this.game.audio.canPlayMissileDestroyAudio = false;
            this.game.audio.missileDestroy.play();
        }
        if (this.onDeath) {
            this.onDeath();
        }
        this.el.destroy();
    }

    checkCollision() {
        const targetPos = this.target.getWorldPos();
        const dist = targetPos.clone().subtract(this.pos).magnitude();
        if (dist < this.killRange) {
            this.isDead = true;
            this.handleDeath();
            this.handleCollision();
        }
    }
    handleCollision() {
        // create explosion
        const options = { vel: this.vel.clone().multiplyScalar(0.1) };
        const explosion = new Explosion(this.game, this.lastWorldPos, options);
        this.game.explosions.push(explosion);

        if (this.game.boss) {
            // damage boss
            const dmg = 1 / this.game.boss.healthScore;
            // const dmg = 1 / 4;
            this.game.boss.takeDamage(dmg);
        }
    }
}
