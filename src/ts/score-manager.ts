import Game from './game';

export default class ScoreManager {
    private game: Game;
    public score: number = 0;
    private scoreDomEl: HTMLElement = document.querySelector('.game-ui--score');
    private scoreDomElText: string = this.score.toString();
    private highScore: number =
        parseInt(localStorage.getItem('tunk-high-score')) || 0;
    private highScoreDomEl: HTMLElement = document.querySelector(
        '.game-ui--high-score'
    );

    constructor(game: Game) {
        this.game = game;
    }

    public init() {
        this.initHighScore();
    }

    public reinit() {
        this.score = 0;
        this.update();
    }

    private renderScore() {
        if (this.score.toString() !== this.scoreDomElText) {
            this.scoreDomElText = this.score.toString();
            this.scoreDomEl.textContent = this.score.toString();
        }
    }

    public update() {
        this.renderScore();
        this.renderHighScore();
    }

    private renderHighScore() {
        const _isNewHighScore = this.score > Number(this.highScore);
        if (_isNewHighScore) {
            this.highScore = this.score;
            localStorage.setItem('tunk-high-score', this.score.toString());
            this.highScoreDomEl.textContent = this.highScore.toString();
        }
    }

    public resetHighScore() {
        localStorage.setItem('tunk-high-score', '0');
        this.highScore = 0;
        this.highScoreDomEl.textContent = this.highScore.toString();
    }

    private initHighScore() {
        this.highScoreDomEl.textContent = this.highScore.toString();
    }
}
