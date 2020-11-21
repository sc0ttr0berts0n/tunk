import * as PIXI from 'pixi.js';
import Victor = require('victor');
import Game from './game';

export interface ExplosionOptions {
    lifespan?: number;
    sprite?: PIXI.Sprite;
    vel?: Victor;
    momentum?: number;
    parentContainer?: PIXI.Container;
}

export class Explosion {
    private game: Game;
    private pos: Victor;
    private vel: Victor;
    private rot = 0;
    private scale = 1;
    private alpha = 1;
    private age = 0;
    private momentum: number;
    private el: PIXI.Sprite;
    public isDead = false;
    public lifespan: number;
    public options: ExplosionOptions;
    constructor(game: Game, startPos: Victor, options?: ExplosionOptions) {
        this.game = game;
        this.options = {
            lifespan: options?.lifespan ?? 20,
            sprite:
                options?.sprite ??
                new PIXI.Sprite(this.game.graphics.explosion),
            vel: options?.vel ?? new Victor(0, 0),
            momentum: options?.momentum ?? Math.random() * 0.4 - 0.2,
            parentContainer:
                options?.parentContainer ?? this.game.graphics.skyContainer,
        };
        Object.assign(this.options, options);
        this.pos = startPos;
        this.vel = this.options.vel;
        this.el = this.options.sprite;
        this.lifespan = this.options.lifespan;
        this.momentum = this.options.momentum;
        this.init();
    }
    init() {
        this.el.x = this.pos.x;
        this.el.y = this.pos.y;
        this.el.rotation = Math.random() * Math.PI * 4 - Math.PI * 2;
        this.el.anchor.set(0.5);
        this.el.scale.set(0.66);
        this.options.parentContainer.addChild(this.el);
    }
    update() {
        this.age++;
        this.pos.add(this.vel);
        this.rot += this.momentum;
        this.scale += this.momentum * 0.2;
        if (this.age > this.lifespan - 10) {
            this.alpha -= 0.1;
        }
        if (this.age > this.lifespan) {
            this.isDead = true;
        }
        if (this.isDead) {
            this.el.destroy();
        } else {
            this.render();
        }
    }

    render() {
        this.el.position.set(this.pos.x, this.pos.y);
        this.el.rotation = this.rot;
        this.el.scale.set(this.scale);
        this.el.alpha = this.alpha;
    }

    getWorldPos() {
        return new Victor(this.el.worldTransform.tx, this.el.worldTransform.ty);
    }
}
