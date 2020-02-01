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
        this.init();
        this.turret = new Turret(this, 26);
        this.player = new Player(this);
        this.kb = new KeyboardObserver();
        this.damageChance = 0.0125;
        this.frameCount = 0;
    }

    init() {
        this.app.stage.addChild(this.cannon);

        this.cannon.anchor.set(0, 0.5);
        this.cannon.x = this.cannonTargetX;
        this.cannon.y = this.cannonTargetY;
        console.log(this.cannonTargetX);
        this.cannon.rotation = -0.25 * Math.PI;
    }

    update() {
        // console.log('update ran');
        this.frameCount++;

        this.attemptDamage();

        this.turret.update();
        if (this.turret.wedges) {
            this.turret.wedges.forEach(wedge => wedge.update());
        }
        this.player.update();
        this.cannonUpdate();
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

    // cannonShot() {
    //     if (this.frameCount > this.nextShot) {
    //         game.cannon.x += 140;
    //         game.cannon.y += 140;
    //         this.nextShot = this.framecount + Math.random() * 540 + 60;
    //     }
    // }

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
