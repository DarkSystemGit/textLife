var player;
function load(phaser, assets) {
    assets.forEach(asset => {
        switch (asset[1]) {
            case 'ss':
                phaser.load.spritesheet(asset[0], `assets/${asset[0]}.png`, {
                    frameWidth: 16,
                    frameHeight: 16
                })
            case 'img':
                phaser.load.image(asset[0], `assets/${asset[0]}.png`)
            case 'map':
                phaser.load.tilemapTiledJSON(asset[0], `assets/maps/${asset[0]}.json`)
        }

    });
}



function loadScene(scene) {
    return {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        pixelArt: true,
        parent: "game",
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
    onStart: function () {

        load(this, [['main', 'map'], ['citytiles', 'img'], ['schoolassets', 'img'],['player','ss']])
    },
    onCreate: function () {
        player = this.physics.add.sprite(0, 0, "spritesheet")
        this.anims.create({
            key: 'walkF',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 7, 8, 9] }),
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'walkB',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 4, 5, 6] }),
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'walkL',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 1, 2, 3] }),
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'walkR',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 10, 11, 12] }),
            frameRate: 8,
            repeat: -1
        })
        const map = this.make.tilemap({ key: "main" });
        const citytileset = map.addTilesetImage("schoolassets", "schoolassets");
        const itemstileset = map.addTilesetImage("citytiles", "citytiles");
        map.createLayer("Ground", ['citytiles', 'schoolassets'], 0, 0);
        var objs = map.createLayer("Objects", ['citytiles', 'schoolassets'], 0, 0);
        var coll = map.createLayer("Collision", ['citytiles', 'schoolassets'], 0, 0);
        coll.setCollisionByExclusion([])
        coll.setDepth(10)
        objs.setDepth(11)
        this.physics.add.collider(player, coll);
        const cursors = this.input.keyboard.createCursorKeys();
        const camera = this.cameras.main;
        camera.zoom = 10
        camera.startFollow(player);

        // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const width = this.scale.width
        const height = this.scale.height
        const rt = this.make.renderTexture({
            width,
            height
        }, true)

        // fill it with black
        rt.fill(0x000000, 1)
        rt.setTint(0x0a2948)
        const vision = this.make.image({
            x: this.player.x,
            y: this.player.y,
            key: 'vision',
            add: false
        })
        vision.scale = 2.5

        rt.mask = new Phaser.Display.Masks.BitmapMask(this, vision)
        rt.mask.invertAlpha = true
    },
    onFrame: function (time, delta) {
        controls.update(delta);

        if (this.vision) {
            this.vision.x = this.player.x
            this.vision.y = this.player.y
        }
        
         const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
    player.anims.play("walkL", true);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
    player.anims.play("walkR", true);
  }else if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
    player.anims.play("walkF", true);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
    player.anims.play("walkB", true);
  }else{
    player.anims.stop()
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

    }
}

const game = new Phaser.Game(loadScene(main));