class Wedge {
    constructor(game, id) {
        this.game = game;
        this.el = new PIXI.Sprite(PIXI.Texture.from('assets/da-boi.png'));
        this.id = id;
        this.shield = true;
        this.letter = String.fromCharCode(94 + this.id);
        // console.log(this.letter);

        this.rot = null;
        this.playerPos = null;
    }

    init() {}
}
