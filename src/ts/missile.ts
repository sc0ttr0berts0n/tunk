import * as PIXI from 'pixi.js';
import Victor = require('victor');
import Game from './game';
import Boss from './boss';
import Player from './player';
import Wedge from './wedge';
import MissilePod from './missile-pod';

interface Vec2 {
    x: number;
    y: number;
}

interface MissileOptions {
    initialVel?: number;
    thrustStartAge?: number;
    thrustStrength?: number;
    lifespan?: number;
}

export default class Missile {
    private game: Game;
    private pos: Victor;
    private lastWorldPos = new Victor(0, 0);
    private vel: Victor;
    private acc = new Victor(0, 0);
    private friction = new Victor(0.98, 0.98);
    private source: Boss | Player | Wedge | MissilePod;
    private target: Boss | Player | Wedge | MissilePod;
    private thrustStartAge: number;
    private thrustStrength: number;
    private targetPos: Vec2;
    private el: PIXI.Sprite;
    private birth: number;
    private age: number = 0;
    public isDead = false;
    public lifespan: number;
    public options: MissileOptions;
    private shadowRotation = Math.random() * Math.PI * 4;
    private rotationLerp = 0.05;
    constructor(
        game: Game,
        source: Boss | Player | Wedge | MissilePod,
        target: Boss | Player | Wedge | MissilePod,
        options: MissileOptions
    ) {
        this.options = {
            initialVel: 2,
            thrustStartAge: 0,
            thrustStrength: 0.001,
            lifespan: 60 * 10,
        };
        Object.assign(this.options, options);
        this.game = game;
        this.source = source;
        this.pos = source.getWorldPos();
        this.target = target;
        this.el = new PIXI.Sprite(this.game.graphics.missile);
        this.vel = new Victor(
            Math.random() * this.options.initialVel * 2 -
                this.options.initialVel,
            Math.random() * this.options.initialVel * 2 -
                this.options.initialVel
        );
        this.thrustStartAge = this.options.thrustStartAge;
        this.thrustStrength = this.options.thrustStrength;
        this.lifespan = this.options.lifespan;
        this.init();
    }
    init() {
        this.el.x = this.pos.x;
        this.el.y = this.pos.y;
        this.game.graphics.skyContainer.addChild(this.el);
    }
    update() {
        this.age++;
        if (this.age > this.lifespan) {
            this.isDead = true;
            this.el.destroy();
        }
        if (!this.isDead) {
            this.flyAtTarget();
        }
    }

    getWorldPos() {
        return new Victor(
            this.game.graphics.player.worldTransform.tx,
            this.game.graphics.player.worldTransform.ty
        );
    }

    flyAtTarget() {
        const targetPos = this.target.getWorldPos();
        const dist = targetPos.clone().subtract(this.pos);
        const unit = dist.normalize();
        const worldPos = this.getWorldPos();

        const thrustStrength = new Victor(
            this.thrustStrength,
            this.thrustStrength
        );
        this.acc = this.acc.add(unit.multiply(thrustStrength));
        if (this.age > this.thrustStartAge) {
            // calc accel
            this.vel = this.vel.add(this.acc);
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

        if (this.age === 200) {
            // debugger;
        }
        // store last postition
        this.lastWorldPos = worldPos.clone();
    }
}
