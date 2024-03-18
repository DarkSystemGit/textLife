function load(this, assets) {
    assets.forEach(asset => {
        this.load.image(asset[1], asset[1])
    });
}
var game;

function loadScene(scene) {
    game = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        scene: {
            preload: scene.onStart,
            create: scene.onCreate,
            update: scene.onFrame
        }
    }
}
const main = {
    onStart: () => {},
    onCreate: () => {},
    onFrame: () => {}
}

const game = new Phaser.Game(game);