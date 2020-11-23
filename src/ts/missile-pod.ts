import * as PIXI from 'pixi.js';
import Victor = require('victor');
import Wedge from './wedge';
import Game from './game';
import Missile from './missile';

export default class MissilePod {
    private container = new PIXI.Container();
    private el: PIXI.Sprite;
    private wedge: Wedge;
    private game: Game;
    private readonly letter: string;
    public readonly yOffArmed = -15;
    public readonly yOffDisarmed = 40;
    public pos: Vec2 = { x: 0, y: this.yOffDisarmed };
    private isVisible = false;
    public readonly speed = 3;
    public isArmed = false;
    public missiles: Missile[] = [];
    public missilesToFire = 0;

    constructor(game: Game, wedge: Wedge) {
        this.game = game;
        this.wedge = wedge;
        this.letter = wedge.letter;
        this.el = new PIXI.Sprite(this.game.graphics.missilePodLoaded);
        this.init();
    }

    init() {
        this.el.anchor.set(0.5, 1);
        this.el.y = this.pos.y;
        this.container.addChild(this.el);
        this.wedge.container.addChild(this.container);
    }

    update() {
        this.isArmed = this.setIsArmed();
        const y = this.pos.y;
        if (this.isArmed) {
            this.isVisible = true;
            if (y > this.yOffArmed) {
                this.pos.y += -this.speed;
            }
        } else {
            if (y < this.yOffDisarmed) {
                this.pos.y += this.speed;
            } else {
                this.isVisible = false;
            }
        }
        const podFullyExtended = this.pos.y >= this.yOffArmed;
        if (podFullyExtended && this.missilesToFire > 0) {
            this.fireMissiles(this.missilesToFire);
        }
        this.render();
    }

    reinit() {
        this.isArmed = false;
        this.isVisible = false;
        this.pos.y = this.yOffDisarmed;
    }

    private render() {
        this.el.y = this.pos.y;
        this.el.visible = this.isVisible;
    }

    private setIsArmed() {
        const boss = this.game.boss;
        const wedge = this.wedge;

        if (
            boss?.alive &&
            wedge.isKillPhraseLetter &&
            wedge.isVisited &&
            wedge.health >= wedge.maxHealth
        ) {
            return true;
        }
    }

    public fireMissiles(num: number = 1) {
        this.missilesToFire += -num;
        if (this.missilesToFire < 0) {
            this.missilesToFire = 0;
        }
        for (let i = 0; i < num; i++) {
            const delay = this.wedge.id + i * 10 + 50;
            const options = {
                initialVel: 20,
                thrustStartAge: delay,
            };
            const missile = new Missile(
                this.game,
                this.wedge.getWorldPos(),
                this.game.boss,
                options
            );
            this.game.missiles.push(missile);
            // setTimeout(() => {
            // }, delay);
        }
    }

    getWorldPos() {
        return new Victor(this.el.worldTransform.tx, this.el.worldTransform.ty);
    }
}
