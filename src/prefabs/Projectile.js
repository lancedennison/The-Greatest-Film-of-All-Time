// Projectile prefab
class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, spawnObject, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.spawnObject = spawnObject;
        this.behind = true;
        this.create();
    }
    create() {
        this.angleDeg = (Math.atan2(this.scene.player.y - this.y, this.scene.player.x - this.x) * 180 / Math.PI);
        this.setDepth(1);
        this.setScale(0.10);
    }
    update() {
        this.scene.physics.velocityFromAngle(this.angleDeg, 100, this.body.velocity);
        if(this.x < 0 - this.width ||
            this.x > game.config.width + this.width ||
            this.y < 0 - this.height ||
            this.y > game.config.height + this.height) {
            this.destroy();
        }
        this.angle += 5;
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
}