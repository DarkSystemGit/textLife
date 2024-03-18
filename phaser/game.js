function load(phaser, assets) {
    assets.forEach(asset => {
        if (asset[1]) {
            phaser.load.spritesheet(asset[0], `assets/${asset[0]}.png`, {
                frameWidth: asset[1],
                frameHeight: asset[2]
            })
        }
        phaser.load.image(asset[0], `assets/${asset[0]}.png`)
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