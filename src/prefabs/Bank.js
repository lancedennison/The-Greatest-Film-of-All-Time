// Bank prefab
class Bank extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, number, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.opa = 1;
        this.timeLeft = 25;
        this.setDisplaySize(this.width, this.height);
        this.setSize(80, 240);
        this.active = 1;
        this.tiedObj = number;
    }
    create() {
    }
    update() {
    }
    overlapping() {
        if(this.opa > 0)
        {
            this.timeLeft -= 1;
            this.opa = this.timeLeft/25;
        }
        else {
            this.active = 0;
            this.tiedObj.setAlpha(0);
        }
        this.setAlpha(this.opa);
    }
    check() {
        return this.active;
    }
}