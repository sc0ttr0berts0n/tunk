class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.app = new PIXI.Application({
            view: canvas,
            width: 1024,
            height: 1024,
            transparent: true,
            maxFPS: 30,
        });
        this.graphics = new Graphics(this);
        this.flaks = [];
        this.score = 0;
        this.scoreValue = null;
        this.turretBodyRotation = Math.PI * 2;
        this.backgroundTargetRot = 0;
        this.backgroundNextMove = 0;
        this.turret = new Turret(this, 26);
        this.cannon = new Cannon(this);
        this.player = new Player(this);
        this.endGameOverlay = new EndGameOverlay(this);
        this.goon = new Goon(this);
        this.init();
        this.kb = new KeyboardObserver();
        this.damageChance = 0.0125;
        this.shootHoleChance = 0.0125;
        this.frameCount = 0;
        this.lastRestart = 0;
        this.firstShot = false;
        this.reduceMotion = false;
    }

    init() {
        this.graphics.background.x = this.app.renderer.width / 2;
        this.graphics.background.y = this.app.renderer.height / 2;
        this.graphics.background.anchor.set(0.5, 0.5);
        this.initScore();
        this.graphics.placeAssets();
        this.app.ticker.add(() => this.update());
    }

    update() {
        this.frameCount++;
        if (this.player.alive) {
            this.updateTurret();

            this.shootFlakAtWalls();

            if (this.score >= 3 || this.frameCount - this.lastRestart >= 6000) {
                this.shootFlakAtHoles();
            }

            this.turret.update();

            this.goon.update();

            this.updateScore();
        }
        this.player.update();
        if (this.turret.wedges) {
            this.turret.wedges.forEach((wedge) => wedge.update());
        }
        if (this.flaks.length > 0) {
            this.flaks.forEach((flak) => flak.update());
            this.flaks = this.flaks.filter((flak) => !flak.isDead);
        }
        this.endGameOverlay.update();
    }
    reinit() {
        this.flaks.forEach((flak) => flak.reinit());
        this.flaks = [];
        this.turret.wedges.forEach((wedge) => wedge.reinit());
        this.lastRestart = this.frameCount;
        this.kb.reinit();
        this.player.reinit();
        this.turret.reinit();
        this.score = 0;
        this.updateScore();
        this.endGameOverlay.reinit();
        this.goon.reinit();
    }

    updateTurret() {
        const target = this.backgroundTargetRot;
        const actual = this.turretBodyRotation;
        const diff = target - actual;
        const factor = 0.005;
        const offset = diff * factor;

        this.turretBodyRotation += offset;
        if (!this.reduceMotion) {
            this.graphics.background.rotation = this.turretBodyRotation;
        } else {
            this.graphics.turretExterior.rotation = this.turretBodyRotation;
            this.cannon.container.rotation = this.turretBodyRotation;
        }

        if (this.frameCount > this.backgroundNextMove) {
            this.backgroundTargetRot = Math.random() * (Math.PI * 4 - 2);
            this.backgroundNextMove =
                this.frameCount + Math.random() * 120 + 60;
        }
    }
    shootFlakAtWalls() {
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
    shootFlakAtHoles() {
        if (Math.random() < this.damageChance) {
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
    updateScore() {
        if (this.scoreValue) {
            this.scoreValue.text = this.score;
        }
    }
    initScore() {
        const scoreStyle = new PIXI.TextStyle();
        scoreStyle.fill = '#F13409';
        scoreStyle.fontFamily = 'Arial';
        scoreStyle.fontSize = 48;
        scoreStyle.fontWeight = 'bold';
        scoreStyle.stroke = '#000000';
        scoreStyle.strokeThickness = 10;
        this.scoreValue = new PIXI.Text(this.score, scoreStyle);
        this.scoreValue.anchor.set(0.5);
        this.scoreValue.y = this.app.renderer.height / 2 + 400;
        this.scoreValue.x = this.app.renderer.width / 2;
    }
}

const canvas = document.getElementById('game');
const game = new Game(canvas);
