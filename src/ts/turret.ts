import * as PIXI from 'pixi.js';
import Game from './game';
import Wedge from './wedge';

export default class Turret {
    private game: Game;
    private wedgeCount: number;
    public container: PIXI.Container;
    public radius: number = 256;
    public wedges: Array<Wedge>;
    public history: string[] = [];
    public historyLimit: number = 20;

    constructor(game: Game, wedgeCount: number) {
        this.game = game;
        this.wedgeCount = wedgeCount;
        this.container = new PIXI.Container();
        this.wedges = [...new Array(wedgeCount)].map(
            (el, index) => new Wedge(game, this, index, wedgeCount)
        );
        this.init();
    }

    public init() {
        this.container.x = this.game.app.renderer.width / 2;
        this.container.y = this.game.app.renderer.height / 2;
        this.container.rotation = -0.25 * Math.PI;

        this.game.graphics.turretExterior.anchor.set(0.5);
        this.game.graphics.turretExterior.rotation = 0.25 * Math.PI;

        this.game.graphics.turretFloor.anchor.set(0.5);
        this.game.graphics.turretFloor.rotation = 0.25 * Math.PI;
        this.game.graphics.turretFloor.scale.set(0.875);

        this.game.graphics.turretCeiling.x = this.game.app.renderer.width / 2;
        this.game.graphics.turretCeiling.y = this.game.app.renderer.height / 2;
        this.game.graphics.turretCeiling.anchor.set(0.5);
        this.game.graphics.turretCeiling.alpha = 1;
    }

    public update(delta: number) {
        this.openingUpdate();
        this.game.cannon.update(delta);
        this.limitHistory();
    }

    public reinit() {
        this.wedges.forEach((wedge) => {
            wedge.health = wedge.maxHealth;
        });
        this.history = [];
    }

    private openingUpdate() {
        if (
            this.game.frameCount >= 60 &&
            this.game.graphics.turretCeiling.alpha > 0
        ) {
            if (
                this.game.frameCount % 60 === 0 &&
                this.game.graphics.turretCeiling.alpha > 0
            ) {
                this.game.graphics.turretCeiling.alpha -= 0.34;
            }
        }
    }

    public getFullWedges() {
        return this.wedges.filter(
            (wedge) => wedge.health >= wedge.maxHealth && !wedge.willBeShot
        );
    }

    public getDamagedWedges() {
        return this.wedges.filter((wedge) => {
            return (
                wedge.health < wedge.maxHealth &&
                this.game.player.pos.x !== wedge.pos.x &&
                this.game.player.pos.y !== wedge.pos.y
            );
        });
    }

    public getArmedWedges() {
        return this.wedges.filter((wedge) => {
            return wedge.missilePod.isArmed;
        });
    }

    pushLetterToHistory(currentLetter: string) {
        const mostRecentLetter = this.history[this.history.length - 1];
        if (mostRecentLetter !== currentLetter) {
            this.history.push(currentLetter);
        }
    }

    limitHistory() {
        while (this.history.length > this.historyLimit) {
            this.history.shift();
        }
    }

    public getWedgeByLetter(letter: string): Wedge | undefined {
        const wedge = this.wedges.find(
            (wedge: Wedge) => wedge.letter === letter
        );
        if (!wedge) {
            throw new Error(`"${letter}" is not on the turret wedge list`);
        }
        return wedge;
    }
}
