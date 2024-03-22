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
        type: Phaser.WEBGL,
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

        load(this, [['main', 'map'], ['citytiles', 'img'], ['ground', 'img'], ['mask', 'img'], ['schoolassets', 'img'], ['player', 'ss']])
    },
    onCreate: function () {
        const map = this.make.tilemap({ key: "main" });
        const sp = map.findObject("data", obj => obj.name === "Spawn Point");
        player = this.player = this.physics.add.sprite(sp.x, sp.y, 'player')
        //player.frame=6
        this.anims.create({
            key: 'walkF',
            frames: this.anims.generateFrameNumbers('player', { frames: [6, 7, 8] }),
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'walkB',
            frames: this.anims.generateFrameNumbers('player', { frames: [3, 4, 5] }),
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'walkL',
            frames: this.anims.generateFrameNumbers('player', { frames: [0, 1, 2] }),
            frameRate: 8,
            repeat: -1
        })
        this.anims.create({
            key: 'walkR',
            frames: this.anims.generateFrameNumbers('player', { frames: [9, 10, 11] }),
            frameRate: 8,
            repeat: -1
        })

        map.addTilesetImage("schoolassets", "schoolassets");
        map.addTilesetImage("citytiles", "citytiles");
        map.addTilesetImage("ground", "ground");
        var grnd = map.createLayer("Ground", ['citytiles', 'schoolassets', 'ground'], 0, 0);
        var objs = map.createLayer("Objects", ['citytiles', 'schoolassets', 'ground'], 0, 0);
        var coll = map.createLayer("Collision", ['citytiles', 'schoolassets', 'ground'], 0, 0);
        var cl = map.createLayer("cleanup", ['citytiles', 'schoolassets', 'ground'], 0, 0);
        coll.setCollisionByExclusion([]);
        cl.setCollisonByProperty({ col: true })
        coll.setDepth(11)
        objs.setDepth(12)
        grnd.setDepth(9)
        cl.setDepth(10)
        this.physics.add.collider(player, coll);
        const cursors = this.cursors = this.input.keyboard.createCursorKeys();
        const camera = this.cameras.main;
        camera.zoom = 10
        camera.startFollow(player);

        // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const width = this.scale.width
        const height = this.scale.height
        const rt = this.rt=this.make.renderTexture({
            width,
            height
        }, true)

        // fill it with black


        rt.setDepth(15)
        player.setDepth(15)
    },
    onFrame: function (time, delta) {


        if (this.vision) {
            this.vision.x = this.player.x
            this.vision.y = this.player.y
        }

        const speed = 175;
        const prevVelocity = player.body.velocity.clone();

        // Stop any previous movement from the last frame
        player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            player.body.setVelocityX(-speed);
            player.anims.play("walkL", true);
        } else if (this.cursors.right.isDown) {
            player.body.setVelocityX(speed);
            player.anims.play("walkR", true);
        } else if (this.cursors.up.isDown) {
            player.body.setVelocityY(-speed);
            player.anims.play("walkF", true);
        } else if (this.cursors.down.isDown) {
            player.body.setVelocityY(speed);
            player.anims.play("walkB", true);
        } else {
            player.anims.stop()
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        player.body.velocity.normalize().scale(speed);
        this.rt.clear();
        this.rt.fill(0x000000, 1)
        this.rt.setTint(0x0a2948)
        this.rt.erase('mask', this.player.x - 107, this.player.y - 107)

    }
}

const game = new Phaser.Game(loadScene(main));