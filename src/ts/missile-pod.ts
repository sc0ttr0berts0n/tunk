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
        this.el = new PIXI.Sprite(this.game.graphics.misslePodLoaded);
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
            this.fireMissles(this.missilesToFire);
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

    private canBeArmed() {
        const boss = this.game.boss;
        const phraseArr = boss.killPhrase.phrase.split('');
        const phraseIndex = phraseArr.indexOf(this.wedge.letter);
        return phraseIndex > -1;
    }

    private setIsArmed() {
        const boss = this.game.boss;
        const vistedLetterCount = boss.validVisitedLetterCount;
        const minIndexToVisit = Math.min(...this.wedge.missilePodArmingOrder);
        const hasBeenVisted = minIndexToVisit < vistedLetterCount;

        if (boss.active && this.canBeArmed() && hasBeenVisted) {
            const anyDamageBefore =
                boss.killPhrase.tiles
                    .slice(0, vistedLetterCount - 1)
                    .filter((el) => el.wedge.isDamaged()).length > 0;
            if (!anyDamageBefore) {
                return true;
            }
        }
        return false;
    }

    public fireMissles(num: number = 1) {
        this.missilesToFire += -num;
        if (this.missilesToFire < 0) {
            this.missilesToFire = 0;
        }
        for (let i = 0; i < num; i++) {
            const options = { initialVel: 10, thrustStartAge: 50 };
            const missile = new Missile(
                this.game,
                this.wedge.getWorldPos(),
                this.game.boss,
                options
            );
            const delay = this.wedge.id * 10 + i * 75;
            setTimeout(() => {
                this.game.missiles.push(missile);
            }, delay);
        }
        console.log(`Wedge "${this.letter}" Fired ${num} Missle(s)!`);
    }

    getWorldPos() {
        return new Victor(this.el.worldTransform.tx, this.el.worldTransform.ty);
    }
}
