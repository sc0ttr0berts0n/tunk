class Turret {
    constructor(game, wedgeCount) {
        this.game = game;
        this.headEl = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-turret.png')
        );
        this.el = new PIXI.Sprite(PIXI.Texture.from('assets/da-floor.png'));
        this.headElOpening = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-turret.png')
        );

        this.wedgeCount = wedgeCount;
        this.radius = 256;
        this.wedges = [...new Array(wedgeCount)].map(
            (el, index) => new Wedge(game, this, index, wedgeCount)
        );
        this.init();
    }
    init() {
        this.headEl.x = window.innerWidth / 2;
        this.headEl.y = window.innerHeight / 2;
        this.headEl.anchor.set(0.5);
        this.headEl.scale.set(1.15);
        this.headEl.rotation = -0.25 * Math.PI;
        this.game.app.stage.addChild(this.headEl);

        this.el.anchor.set(0.5);
        this.el.x = window.innerWidth / 2;
        this.el.y = window.innerHeight / 2;
        this.game.app.stage.addChild(this.el);

        this.headElOpening.x = window.innerWidth / 2;
        this.headElOpening.y = window.innerHeight / 2;
        this.headElOpening.anchor.set(0.5);
        this.headElOpening.scale.set(1.15);
        this.headElOpening.rotation = -0.25 * Math.PI;
        this.headElOpening.alpha = 1;
        this.game.app.stage.addChild(this.headElOpening);
    }
    update() {
        this.openingUpdate();
    }
    openingUpdate() {
        if (this.game.frameCount >= 120) {
            this.headElOpening.alpha -= 0.01;
        }
    }
    getFullWedges() {
        return this.wedges.filter(wedge => wedge.health >= wedge.maxHealth);
    }
    getDamagedWedges() {
        return this.wedges.filter(wedge => {
            return (
                wedge.health < wedge.maxHealth &&
                this.game.player.pos.x !== wedge.pos.x &&
                this.game.player.pos.y !== wedge.pos.y
            );
        });
    }
}
