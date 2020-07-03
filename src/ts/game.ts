import * as PIXI from 'pixi.js';
import { Howler } from 'howler';
import GraphicAssets from './graphics';
import AudioAssets from './audio-assets';
import ScoreManager from './score-manager';
import Player from './player';
import Turret from './turret';
import Cannon from './cannon';
import Flak from './flak';
import EndGameOverlay from './endgame-overlay';
import KeyboardObserver from './keyboard-observer';

export default class Game {
    private canvas: HTMLCanvasElement;
    public app: PIXI.Application;
    public scoreManager: ScoreManager;
    public graphics: GraphicAssets;
    public audio: AudioAssets;
    private flaks: Flak[] = [];
    private turretBodyRotation: number = Math.PI * 2;
    private backgroundTargetRot: number = 0;
    private backgroundNextMove: number = 0;
    public turret: Turret;
    public cannon: Cannon;
    public player: Player;
    private endGameOverlay: EndGameOverlay;
    public kb: KeyboardObserver;
    private damageChance: number = 0.008;
    private shootHoleChance: number = 0.0125;
    public frameCount: number = 0;
    private lastRestart: number = 0;
    private reduceMotion: boolean = false;
    private paused: boolean = false;
    private muted: boolean = false;
    private clearTitle: TimerHandler;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.app = new PIXI.Application({
            view: canvas,
            width: 1024,
            height: 1024,
            transparent: true,
        });
        this.scoreManager = new ScoreManager(this);
        this.graphics = new GraphicAssets(this);
        this.audio = new AudioAssets(this);
        this.turret = new Turret(this, 26);
        this.cannon = new Cannon(this);
        this.player = new Player(this);
        this.endGameOverlay = new EndGameOverlay(this, this.player);
        this.kb = new KeyboardObserver();
        this.init();
    }

    private init() {
        this.graphics.background.x = this.app.renderer.width / 2;
        this.graphics.background.y = this.app.renderer.height / 2;
        this.graphics.background.anchor.set(0.5, 0.5);
        this.graphics.placeAssets();
        this.scoreManager.init();
        Howler.volume(0.2);
        this.audio.bgm.loop(true);
        this.audio.bgm.play();
        this.app.ticker.add((delta) => this.update(delta));
        setTimeout(this.clearTitle, 5000);
    }

    private update(delta: number) {
        if (!this.paused) {
            this.frameCount++;
            if (this.player.alive) {
                this.updateTurret(delta);

                this.shootFlakAtWalls();

                if (
                    this.scoreManager.score >= 3 ||
                    this.frameCount - this.lastRestart >= 6000
                ) {
                    this.shootFlakAtHoles();
                }

                this.turret.update(delta);

                this.scoreManager.update();
            }
            this.player.update(delta);
            if (this.turret.wedges) {
                this.turret.wedges.forEach((wedge) => wedge.update(delta));
            }
            if (this.flaks.length) {
                this.flaks.forEach((flak) => flak.update(delta));
                this.flaks = this.flaks.filter((flak) => !flak.isDead);
            }
        }
        this.endGameOverlay.update();
    }
    public reinit() {
        this.flaks.forEach((flak) => flak.reinit());
        this.flaks = [];
        this.turret.wedges.forEach((wedge) => wedge.reinit());
        this.lastRestart = this.frameCount;
        this.kb.reinit();
        this.player.reinit();
        this.turret.reinit();
        this.scoreManager.reinit();
        this.endGameOverlay.reinit();
        this.audio.bgm.stop();
        this.audio.bgm.play();
    }

    private updateTurret(delta: number) {
        const target = this.backgroundTargetRot;
        const actual = this.turretBodyRotation;
        const diff = target - actual;
        const factor = 0.005;
        const offset = diff * factor * delta;

        this.turretBodyRotation += offset;
        if (!this.reduceMotion) {
            this.graphics.background.rotation = this.turretBodyRotation;
        } else {
            this.graphics.turretExterior.rotation =
                this.turretBodyRotation + Math.PI * 0.25;
            this.cannon.container.rotation = this.turretBodyRotation;
        }

        if (this.frameCount > this.backgroundNextMove) {
            this.backgroundTargetRot = Math.random() * (Math.PI * 4 - 2);
            this.backgroundNextMove =
                this.frameCount + Math.random() * 120 + 60;
        }
    }
    private shootFlakAtWalls() {
        if (this.frameCount - this.lastRestart >= 180) {
            if (Math.random() < this.damageChance) {
                const wedges = this.turret.getFullWedges();
                if (wedges.length > 0) {
                    // odds of doing damage depend on how many walls remain
                    // if less walls exist, there chances of damange diminish
                    if (
                        Math.random() <
                        1 - wedges.length / wedges[0].wedgeCount
                    ) {
                        return;
                    }

                    // choose a random wedge
                    const wedge =
                        wedges[Math.floor(Math.random() * wedges.length)];

                    // init flak animation
                    this.flaks.push(new Flak(this, wedge, wedge.rot, false));
                }
            }
        }
    }
    private shootFlakAtHoles() {
        if (Math.random() < this.shootHoleChance) {
            const wedges = this.turret.getDamagedWedges();
            if (wedges.length > 1) {
                const wedge = wedges[Math.floor(Math.random() * wedges.length)];
                const wedgeCount = wedge.wedgeCount;
                const oppositeWedgeId =
                    (wedge.id + wedgeCount / 2) % wedgeCount;
                const oppositeWedge = this.turret.wedges[oppositeWedgeId];
                this.flaks.push(new Flak(this, oppositeWedge, wedge.rot));
            }
        }
    }

    public resetHighScore() {
        // used so the UI can reset the high score
        this.scoreManager.resetHighScore();
    }
}
