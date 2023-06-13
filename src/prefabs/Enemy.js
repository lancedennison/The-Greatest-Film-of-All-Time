// Enemy prefab
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, spawnObject, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.seekTime = 0;
        this.spawnObject = spawnObject;
        this.behind = true;
        this.create();
    }
    create() {
        this.setScale(0.1);
    }
    update() {
        if(this.x < 0 - this.width ||
            this.x > game.config.width + this.width ||
            this.y < 0 - this.height ||
            this.y > game.config.height + this.height) {
            this.destroy();
        }
        this.seek();
        if(this.behind)
        {
            if(this.x < this.spawnObject.x - this.spawnObject.width/2 ||
                this.x > this.spawnObject.x + this.spawnObject.width/2 ||
                this.y < this.spawnObject.y - this.spawnObject.width/2 ||
                this.y > this.spawnObject.y + this.spawnObject.width/2)
                {
                    this.setDepth(this.spawnObject.depth + 1);
                    this.behind = false;
                }
        }
    }
    seek() {
        if(this.seekTime++ < 100)
        {
            this.scene.physics.moveToObject(this, this.scene.player, 300);
        }
    }
}