import * as PIXI from 'pixi.js';
import Game from './game';
import Boss from './boss';
import Wedge from './wedge';
import HealthBarChunk from './health-bar-chunk';
import Victor = require('victor');
import KillPhrase from './kill-phrase';

export interface HealthBarOptions {
    width?: number;
    height?: number;
    color?: number;
    chunkCount?: number;
    chunkPadding?: number;
    angledCaps?: boolean;
    angledCapWidth?: number;
    outline?: boolean;
}

export class HealthBar {
    private game: Game;
    private options: HealthBarOptions;
    public container = new PIXI.Container();
    public target: Boss | Wedge;
    public value: number;
    public width: number;
    public height: number;
    public color: number;
    public chunkCount: number;
    public chunkPadding: number;
    public angledCaps: boolean;
    public angledCapWidth: number;
    public outline: boolean;
    private chunks: HealthBarChunk[];
    public pos: Victor;

    constructor(game: Game, target: Boss | Wedge, options?: HealthBarOptions) {
        this.game = game;
        this.target = target;
        this.options = {
            width: options?.width ?? 300,
            height: options?.height ?? 22,
            color: options?.color ?? 0xff5050,
            chunkCount: options?.chunkCount ?? 3,
            chunkPadding: options?.chunkPadding ?? 0,
            angledCaps: options?.angledCaps ?? false,
            angledCapWidth: options?.angledCapWidth ?? 12,
            outline: options?.outline ?? false,
        };
        this.width = this.options.width;
        this.height = this.options.height;
        this.color = this.options.color;
        this.chunkCount = this.options.chunkCount;
        this.chunkPadding = this.options.chunkPadding;
        this.angledCaps = this.options.angledCaps;
        this.angledCapWidth = this.options.angledCapWidth;
        this.outline = this.options.outline;
        this.pos = new Victor(0, 0);
        this.chunks = new Array(this.chunkCount).fill(0).map((chunk, index) => {
            return new HealthBarChunk(this.game, this, index, this.pos);
        });
        this.init();
    }

    init() {
        this.container.position.set(this.pos.x, this.pos.y);
    }
    update() {
        this.value = this.target.health;
        this.chunks.forEach((chunk) => chunk.update());
    }
}
