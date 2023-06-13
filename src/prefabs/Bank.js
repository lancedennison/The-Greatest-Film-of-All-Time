// Bank prefab
class Bank extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.opa = 1;
        this.timeLeft = 500;
    }
    create() {
    }
    update() {
    }
    overlapping(){
        console.log(this.timeLeft);
        if(this.opa > 0.3)
        {
            this.timeLeft -= 1;
            this.opa = this.timeLeft/500;
        }
        this.setAlpha(this.opa);
    }
}