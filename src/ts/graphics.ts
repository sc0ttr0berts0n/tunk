import * as PIXI from 'pixi.js';
import Game from './game';

export default class GraphicAssets {
    private game: Game;

    public skyContainer = new PIXI.Container();

    //BACKGROUND MAP
    public background = new PIXI.Sprite(PIXI.Texture.from('assets/da-map.png'));

    //BARREL GRAPHICS
    public barrel = new PIXI.Sprite(
        PIXI.Texture.from('assets/turret-barrel.png')
    );
    public cannonFire = new PIXI.Sprite(
        PIXI.Texture.from('assets/turret-flash.png')
    );
    public cannonSmoke = new PIXI.Sprite(
        PIXI.Texture.from('assets/turret-smoke2.png')
    );
    public cannonBarrelSmoke = new PIXI.Sprite(
        PIXI.Texture.from('assets/turret-barrel-smoke.png')
    );
    //EndGameOverlay
    public endGameOverlay: PIXI.Graphics = new PIXI.Graphics();

    //PLAYER
    public player = new PIXI.Sprite(PIXI.Texture.from('assets/da-boi.png'));
    public playerBlood = new PIXI.Sprite(
        PIXI.Texture.from('assets/da-blood.png')
    );

    //TURRET
    public turretExterior = new PIXI.Sprite(
        PIXI.Texture.from('assets/da-turret.png')
    );
    public turretFloor = new PIXI.Sprite(
        PIXI.Texture.from('assets/da-floor.png')
    );
    public turretCeiling = new PIXI.Sprite(
        PIXI.Texture.from('assets/da-turret.png')
    );

    //WEDGE
    public fullTexture = PIXI.Texture.from('assets/da-wedge-full.png');
    public damagedTexture = PIXI.Texture.from('assets/da-wedge-damaged.png');
    public floorWarningInner = PIXI.Texture.from('assets/floor-warning-01.png');
    public floorWarningBoundary = PIXI.Texture.from(
        'assets/floor-warning-02.png'
    );
    public damagedWallLight = PIXI.Texture.from('assets/crack-light.png');
    public missilePodLoaded = PIXI.Texture.from(
        'assets/missile-pod-loaded.png'
    );

    //FLAK
    public flakGraphic = PIXI.Texture.from('assets/da-flak.png');

    // Missile
    public missile = PIXI.Texture.from('assets/missile.png');

    // Explosion(s)
    public explosion = PIXI.Texture.from('assets/da-boom.png');

    //EndGameOverlay
    public endGameOverlayBlack: PIXI.Graphics = new PIXI.Graphics();
    public endGameOverlayWhite: PIXI.Graphics = new PIXI.Graphics();

    // Boss One
    public bossOne = PIXI.Texture.from('assets/boss-one.png');
    public bossOneDamaged1 = PIXI.Texture.from('assets/boss-one-damaged-1.png');
    public bossOneDamaged2 = PIXI.Texture.from('assets/boss-one-damaged-2.png');

    constructor(game: Game) {
        this.game = game;
    }

    public placeAssets(): void {
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

        // Killphrase UI
        this.game.app.stage.addChild(this.game.boss.killPhrase.container);

        // Sky Container
        this.game.app.stage.addChild(this.skyContainer);

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
