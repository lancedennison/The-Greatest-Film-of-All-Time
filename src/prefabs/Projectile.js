// Projectile prefab
class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.create();
    }
    create() {
        this.angleDeg = (Math.atan2(this.scene.player.y - this.y, this.scene.player.x - this.x) * 180 / Math.PI)
        this.scene.physics.velocityFromAngle(this.angleDeg, 100, this.body.velocity);
        this.setScale(0.10);
    }
    update() {
        if(this.x < 0 - this.width ||
            this.x > game.config.width + this.width ||
            this.y < 0 - this.height ||
            this.y > game.config.height + this.height) {
            this.destroy();
        }
        this.angle += 5;
    }
}