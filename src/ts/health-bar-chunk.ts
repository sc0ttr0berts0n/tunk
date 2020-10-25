import * as PIXI from 'pixi.js';
import Game from './game';
import Victor = require('victor');
import { HealthBar } from './health-bar';

export default class HealthBarChunk {
    private game: Game;
    private healthBar: HealthBar;
    public container = new PIXI.Container();
    private barElGraphics = new PIXI.Graphics();
    public barEl: PIXI.Sprite;
    public barElMask = new PIXI.Graphics();
    private pos: Victor;
    private order: number;
    private width: number;
    private value: number;

    constructor(game: Game, healthBar: HealthBar, order: number, pos: Victor) {
        this.game = game;
        this.healthBar = healthBar;
        this.width =
            healthBar.width / healthBar.chunkCount - healthBar.chunkPadding;
        this.order = order;
        this.pos = new Victor(
            this.width * order +
                healthBar.chunkPadding * order -
                healthBar.chunkPadding,
            0
        );
        this.init();
    }
    init() {
        // setup the graphics
        const graphics = new PIXI.Graphics();
        graphics.beginFill(this.healthBar.color);
        graphics.drawRect(0, 0, this.width, this.healthBar.height);
        graphics.endFill();

        // texture from graphics
        const texture = this.game.app.renderer.generateTexture(
            graphics,
            PIXI.SCALE_MODES.LINEAR,
            1
        );

        // sprite from texture
        this.barEl = new PIXI.Sprite(texture);

        // make mask
        this.barElMask.beginFill(0xff3300);
        this.barElMask.drawPolygon([
            this.pos.x + this.healthBar.angledCapWidth,
            -this.healthBar.height / 2,
            this.pos.x + this.barEl.width,
            -this.healthBar.height / 2,
            this.pos.x + this.barEl.width - this.healthBar.angledCapWidth,
            this.healthBar.height / 2,
            this.pos.x,
            this.healthBar.height / 2,
        ]);
        this.barElMask.endFill();
        this.container.addChild(this.barElMask);

        // associate mask with Bar El
        this.barEl.mask = this.barElMask;

        // place and anchor bar El, add to stage
        this.barEl.position.set(this.pos.x, this.pos.y);
        this.barEl.anchor.set(0, 0.5);
        this.container.addChild(this.barEl);

        // add container to healthbar
        this.healthBar.container.addChild(this.container);
    }
    update() {
        // calc value
        const health = this.healthBar.value;
        const count = this.healthBar.chunkCount;
        const order = this.order;
        const range = 1 / count;
        const min = order * range;
        const value = (health - min) * count;

        this.value = Math.max(0, Math.min(1, value));

        this.render();
    }
    render() {
        this.barEl.scale.set(this.value, 1);
    }
}
