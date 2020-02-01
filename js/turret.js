class Turret {
    constructor(game, wedgeCount) {
        this.game = game;
        this.wedgeCount = wedgeCount;
        this.wedges = Array(wedgeCount).fill(0);
    }
}
