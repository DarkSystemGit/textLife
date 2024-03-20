function load(phaser, assets) {
    assets.forEach(asset => {
        switch (asset[1]) {
            case 'ss':
            phaser.load.spritesheet(asset[0], `assets/${asset[0]}.png`, {
                frameWidth: asset[1],
                frameHeight: asset[2]
            })
            case 'img':
            phaser.load.image(asset[0], `assets/${asset[0]}.png`)
            case 'map':
            phaser.load.tilemapTiledJSON(asset[0],`assets/maps/${asset[0]}.json`)
        }
        
    });
}



function loadScene(scene) {
    return {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        pixelArt: true,
        scene: {
            preload: scene.onStart,
            create: scene.onCreate,
            update: scene.onFrame
        },
        physics: {
            default: "arcade",
            arcade: {
              gravity: { y: 0 } // Top down game, so no gravity
            }
          }
    }
}
var player;
const main = {
    onStart: () => {
        load(this,[['main','map'],['citytiles','img'],['schoolassets','img']])
    },
    onCreate: () => {
        const map = this.make.tilemap({ key: "main" });
        const citytileset = map.addTilesetImage("schoolassets", "schoolassets");
        const itemstileset = map.addTilesetImage("citytiles", "citytiles");
        map.createLayer("Ground", [citytileset,itemstileset], 0, 0);
        map.createLayer("Objects", [citytileset,itemstileset], 0, 0);
        map.createLayer("Collision", [citytileset,itemstileset], 0, 0);
        const cursors = this.input.keyboard.createCursorKeys();
        controls = new Phaser.Cameras.Controls.FixedKeyControl({
          camera: camera,
          left: cursors.left,
          right: cursors.right,
          up: cursors.up,
          down: cursors.down,
          speed: 0.5
        });
      
        // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    },
    onFrame: (time,delta) => {
        controls.update(delta);
    }
}

const game = new Phaser.Game(loadScene(main));