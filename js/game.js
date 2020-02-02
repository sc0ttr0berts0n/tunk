class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true
        });
        this.cannon = new PIXI.Sprite(
            PIXI.Texture.from('assets/turret-barrel.png')
        );
        // this.app.stage.filters = [new PIXI.filters.PixelateFilter()];
        // this.app.stage.filters[0].size = [1, 8];
        this.cannonTargetX = window.innerWidth / 2 + 100;
        this.cannonTargetY = window.innerHeight / 2 - 100;
        this.nextShot = 0;
        this.score = 0;
        this.scoreValue = null;
        this.background = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-map.png')
        );
        this.backgroundRot = Math.PI * 2;
        this.backgroundTargetRot = 0;
        this.backgroundNextMove = 0;
        this.init();
        this.turret = new Turret(this, 26);
        this.player = new Player(this);
        this.kb = new KeyboardObserver();
        this.damageChance = 0.0125;
        this.frameCount = 0;
    }

    init() {
        this.app.stage.addChild(this.background);
        this.background.x = window.innerWidth / 2;
        this.background.y = window.innerHeight / 2;
        this.background.anchor.set(0.5, 0.5);

        this.app.stage.addChild(this.cannon);
        this.cannon.anchor.set(0, 0.5);
        this.cannon.x = this.cannonTargetX;
        this.cannon.y = this.cannonTargetY;
        this.cannon.rotation = -0.25 * Math.PI;
        this.scoreInit();
    }
    update() {
        // console.log('update ran');
        this.frameCount++;

        this.updateTurret();

        this.attemptDamage();

        this.turret.update();
        if (this.turret.wedges) {
            this.turret.wedges.forEach(wedge => wedge.update());
        }
        this.player.update();
        this.cannonUpdate();
        this.scoreUpdate();
    }
    cannonUpdate() {
        const factor = 0.06;
        const xDist = this.cannon.x - this.cannonTargetX;
        const yDist = this.cannon.y - this.cannonTargetY;
        const xOff = xDist * factor;
        const yOff = yDist * factor;
        this.cannon.x -= xOff;
        this.cannon.y -= yOff;
        if (this.frameCount > this.nextShot) {
            game.cannon.x -= 140;
            game.cannon.y += 140;
            this.nextShot = this.frameCount + Math.random() * 270 + 60;
        }
    }

    updateTurret() {
        const target = this.backgroundTargetRot;
        const actual = this.backgroundRot;
        const diff = target - actual;
        const factor = 0.005;
        const offset = diff * factor;

        this.backgroundRot += offset;
        this.background.rotation = this.backgroundRot;

        if (this.frameCount > this.backgroundNextMove) {
            this.backgroundTargetRot = Math.random() * (Math.PI * 4 - 2);
            this.backgroundNextMove =
                this.frameCount + Math.random() * 120 + 60;
        }
    }
    attemptDamage() {
        if (Math.random() < this.damageChance) {
            const wedges = this.turret.getFullWedges();
            if (wedges.length > 0) {
                const wedge = wedges[Math.floor(Math.random() * wedges.length)];
                wedge.setHealth();
            }
        }
    }
    scoreUpdate() {
        if (this.scoreValue) {
            this.scoreValue.text = this.score;
        }
    }
    scoreInit() {
        const scoreStyle = new PIXI.TextStyle();
        scoreStyle.fill = '#F13409';
        scoreStyle.fontFamily = 'Arial';
        scoreStyle.fontSize = 48;
        scoreStyle.fontWeight = 'bold';
        scoreStyle.stroke = '#000000';
        scoreStyle.strokeThickness = 10;
        this.scoreValue = new PIXI.Text(this.score, scoreStyle);
        this.scoreValue.anchor.set(0.5);
        this.scoreValue.y = window.innerHeight / 2 + 400;
        this.scoreValue.x = window.innerWidth / 2;
        this.app.stage.addChild(this.scoreValue);
    }
}

const canvas = document.getElementById('game');
const game = new Game(canvas);

const loop = () => {
    requestAnimationFrame(loop);

    game.update();
};
loop();
