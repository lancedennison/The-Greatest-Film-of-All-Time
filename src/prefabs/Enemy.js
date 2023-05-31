// Player prefab
class Block extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene.add.existing(this);
    }
    create() {
        this.body.setVelocity(10);
    }
    update() {
        if(this.x < 0 - this.width) {
            this.destroy();
        }
    }
}