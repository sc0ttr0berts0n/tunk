class Turret {
    constructor(game, wedgeCount) {
        this.game = game;
        // this.el = new PIXI.Graphics();
        this.headEl = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-turret.png')
        );
        this.el = new PIXI.Sprite(PIXI.Texture.from('assets/da-floor.png'));

        this.wedgeCount = wedgeCount;
        this.radius = 128;
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
    }
    update() {}
    getFullWedges() {
        return this.wedges.filter(wedge => wedge.health >= wedge.maxHealth);
    }
    getDamagedWedges() {
        return this.wedges.filter(wedge => wedge.health < wedge.maxHealth);
    }
}
