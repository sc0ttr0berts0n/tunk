class Turret {
    constructor(game, wedgeCount) {
        this.game = game;
        this.container = new PIXI.Container();
        this.wedgeCount = wedgeCount;
        this.radius = 256;
        this.wedges = [...new Array(wedgeCount)].map(
            (el, index) => new Wedge(game, this, index, wedgeCount)
        );
        this.init();
    }
    init() {
        this.container.x = this.game.app.renderer.width / 2;
        this.container.y = this.game.app.renderer.height / 2;
        this.container.rotation = -0.25 * Math.PI;

        this.game.graphics.turretExterior.anchor.set(0.5);

        this.game.graphics.turretFloor.anchor.set(0.5);
        this.game.graphics.turretFloor.rotation = 0.25 * Math.PI;
        this.game.graphics.turretFloor.scale.set(0.875);

        this.game.graphics.turretCeiling.x = this.game.app.renderer.width / 2;
        this.game.graphics.turretCeiling.y = this.game.app.renderer.height / 2;
        this.game.graphics.turretCeiling.rotation = -0.25 * Math.PI;
        this.game.graphics.turretCeiling.anchor.set(0.5);
        this.game.graphics.turretCeiling.alpha = 1;
    }
    update() {
        this.openingUpdate();
        this.game.cannon.update();
    }
    reinit() {
        this.wedges.forEach((wedge) => {
            wedge.health = wedge.maxHealth;
        });
    }
    openingUpdate() {
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
    getFullWedges() {
        return this.wedges.filter(
            (wedge) => wedge.health >= wedge.maxHealth && !wedge.willBeShot
        );
    }
    getDamagedWedges() {
        return this.wedges.filter((wedge) => {
            return (
                wedge.health < wedge.maxHealth &&
                this.game.player.pos.x !== wedge.pos.x &&
                this.game.player.pos.y !== wedge.pos.y
            );
        });
    }
}
