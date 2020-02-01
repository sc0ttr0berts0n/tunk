class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true
        });
        this.background = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-map.png')
        );
        this.backgroundRot = Math.PI * 2;
        this.backgroundTargetRot = 0;
        this.backgroundNextMove = 0;
        // this.app.stage.filters = [new PIXI.filters.PixelateFilter()];
        // this.app.stage.filters[0].size = [1, 8];
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
}

const canvas = document.getElementById('game');
const game = new Game(canvas);

const loop = () => {
    requestAnimationFrame(loop);

    game.update();
};
loop();
