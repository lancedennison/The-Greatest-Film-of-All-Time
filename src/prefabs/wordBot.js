// wordBot prefab
class wordBot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, width, texture, speed, spawnObject, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.seeking = false;
        this.seekTime = 0;
        this.speed = speed;
        this.w = width;
        this.spawnObject = spawnObject;
        this.behind = true;
        this.create();
    }
    create() {
        this.body.setSize(this.w/4, this.height * 0.8, 0);
        this.setDisplaySize(40, 40);
        this.setDepth(1);
        this.body.setVelocityX(-100);
        this.scene.time.delayedCall(3000, this.activateBody, [], this);
    }
    update() {
        if(this.seeking && (this.x < 0 - this.width ||
            this.x > game.config.width + this.width ||
            this.y < 0 - this.height ||
            this.y > game.config.height + this.height))
            {
                this.seeking = false;
                this.destroy();
            }
        if(this.seeking)
        {
            this.seek();
        }
        if(this.behind)
        {
            if(this.x < this.spawnObject.x - this.spawnObject.width)
            {
                this.setDepth(this.spawnObject.depth + 1);
                this.behind = false;
            }
        }
    }
    activateBody() {
        this.seeking = true;
    }
    seek() {
        if(this.seekTime++ < 100)
        {
            this.scene.physics.moveToObject(this, this.scene.player, this.speed);
        }
    }
}