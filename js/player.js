class Player {
    constructor(game) {
        this.game = game;
        this.el = new PIXI.Sprite(PIXI.Texture.from('assets/da-boi.png'));
        this.bloodEl = new PIXI.Sprite(
            PIXI.Texture.from('assets/da-blood.png')
        );
        this.bloodRot = 0;
        this.pos = { x: 0, y: 0 };
        this.orientation = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
        this.targetWedge = null;
        this.alive = true;
        this.speed = 15;
        this.invincible = false;
        this.health = 100;
        this.init();
    }
    init() {
        this.game.turret.el.addChild(this.el);
        this.el.scale.set(0.75, 0.75);
        this.el.anchor.set(0.5);
        this.el.addChild(this.bloodEl);
        this.bloodEl.anchor.set(0.45, 0.9);
        this.bloodEl.visible = false;
    }
    update() {
        if (this.alive) {
            this.findDestination();
            this.movedaboi();
        }
        this.el.x = this.pos.x;
        this.el.y = this.pos.y;
        this.bloodEl.rotation = this.bloodRot + -this.el.rotation;
        if (!this.alive) {
            this.bloodEl.visible = true;
        }
    }
    movedaboi() {
        const distx = this.targetPos.x - this.pos.x;
        const disty = this.targetPos.y - this.pos.y;
        const angle = Math.atan2(disty, distx);

        const movex =
            (distx / Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))) *
            this.speed;
        const movey =
            (disty / Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))) *
            this.speed;
        if (
            Math.abs(distx) < Math.abs(this.speed) &&
            Math.abs(disty) < Math.abs(this.speed)
        ) {
            this.pos.x = this.targetPos.x;
            this.pos.y = this.targetPos.y;
        } else {
            this.pos.x += movex;
            this.pos.y += movey;
        }
        if (angle !== 0) {
            this.el.rotation = angle + 0.5 * Math.PI;
        }
    }
    findDestination() {
        if (this.game.kb.code != 0){
            var wedgeIndex;
            if (this.targetWedge){
                wedgeIndex = this.targetWedge.id;
                if (this.game.kb.code == 37){ // Left arrow
                    if (wedgeIndex > 0){
                        wedgeIndex -= 1;
                    }else{
                        wedgeIndex = this.game.turret.wedgeCount-1;
                    }
                }else if (this.game.kb.code == 39){ // Right arrow
                    if (wedgeIndex < this.game.turret.wedgeCount-1){
                        wedgeIndex += 1;
                    }else{
                        wedgeIndex = 0;
                    }
                }else{ // Any letter keypress
                    wedgeIndex = this.game.kb.code - 65;
                }
            }else{ // Any starting letter keypress
                wedgeIndex = this.game.kb.code - 65;
            }
            
            const targetWedge = this.game.turret.wedges[wedgeIndex];
            
            if (targetWedge) {
                console.log(targetWedge.id);
                this.targetPos = targetWedge.playerPos;
                this.targetWedge = targetWedge;
                this.game.kb.code = 0;
            }
        }
    }
}
