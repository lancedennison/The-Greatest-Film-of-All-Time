// Enemy prefab
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.seekTime = 0;
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
    }
    seek() {
        if(this.seekTime++ < 100)
        {
            this.scene.physics.moveToObject(this, this.scene.player, 300);
        }
    }
}