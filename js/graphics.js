class Graphics {
    constructor(game) {
        this.game = game;

        //BACKGROUND MAP
        this.background = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-map.png')
        );

        //BARREL GRAPHICS
        this.barrel = new PIXI.Sprite(
            PIXI.Texture.from('assets/turret-barrel.png')
        );
        this.cannonFire = new PIXI.Sprite(
            PIXI.Texture.from('assets/turret-flash.png')
        );
        this.cannonSmoke = new PIXI.Sprite(
            PIXI.Texture.from('assets/turret-smoke2.png')
        );
        this.cannonBarrelSmoke = new PIXI.Sprite(
            PIXI.Texture.from('assets/turret-barrel-smoke.png')
        );
<<<<<<< HEAD
        //EndGameOverlay
        this.endGameOverlay = new PIXI.Graphics();
=======
>>>>>>> aec7b6c4df20a1a72d91e17be45500c7234bd8b9

        //PLAYER
        this.player = new PIXI.Sprite(PIXI.Texture.from('assets/da-boi.png'));
        this.playerBlood = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-blood.png')
        );

        //TURRET
        this.turretExterior = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-turret.png')
        );
        this.turretFloor = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-floor.png')
        );
        this.turretCeiling = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-turret.png')
        );

        //WEDGE
        this.fullTexture = PIXI.Texture.from('assets/da-wedge-full.png');
        this.damagedTexture = PIXI.Texture.from('assets/da-wedge-damaged.png');
        this.floorWarningInner = PIXI.Texture.from(
            'assets/floor-warning-01.png'
        );
        this.floorWarningBoundary = PIXI.Texture.from(
            'assets/floor-warning-02.png'
        );
        this.damagedWallLight = PIXI.Texture.from('assets/crack-light.png');

        //FLAK
        this.flakGraphic = PIXI.Texture.from('assets/da-flak.png');
<<<<<<< HEAD

        //EndGameOverlay
        this.endGameOverlayBlack = new PIXI.Graphics();
        this.endGameOverlayWhite = new PIXI.Graphics();
=======
>>>>>>> aec7b6c4df20a1a72d91e17be45500c7234bd8b9
    }
    placeAssets() {
        // background
        this.game.app.stage.addChild(this.background);

        // turret container
        this.game.app.stage.addChild(this.game.turret.container);

        // cannon
        this.game.turret.container.addChild(this.game.cannon.container);
        this.game.cannon.container.addChild(this.cannonBarrelSmoke);
        this.game.cannon.container.addChild(this.cannonSmoke);
        this.game.cannon.container.addChild(this.cannonFire);
        this.game.cannon.container.addChild(this.barrel);

        //Turret objects
        this.game.turret.container.addChild(this.turretExterior);
        this.game.turret.container.addChild(this.turretFloor);

        //End Game Overlay
        this.game.app.stage.addChild(this.endGameOverlayBlack);
        this.game.app.stage.addChild(this.endGameOverlayWhite);

        //Player
        this.game.app.stage.addChild(this.player);
        this.player.addChild(this.playerBlood);

        //Turret Ceiling
        this.game.app.stage.addChild(this.turretCeiling);
    }
}
