// wordBot prefab
class wordBot extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, width, texture, speed, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.seeking = false;
        this.seekTime = 0;
        this.speed = speed;
        this.w = width;
        this.create();
    }
    create() {
        //this.text = this.scene.add.text(this.spawnLocation.x, this.spawnLocation.y, this.word, wordBotConfig).setOrigin(0.5).setDepth(this.depth + 1);
        //this.body.customBoundsRectangle = this.text.getBounds();
        //this.setDisplaySize(this.text.width, this.text.height);
        //this.setAlpha(0);
        this.body.setSize(this.w/4, this.height * 0.8, 0);
        this.setDisplaySize(40, 40);
        this.setDepth(4);
        this.scene.time.delayedCall(2000, this.activateBody, [], this);
    }
    update() {
        if(this.x < 0 - this.width ||
            this.x > game.config.width + this.width ||
            this.y < 0 - this.height ||
            this.y > game.config.height + this.height) {
            this.destroy();
        }
        //this.text.x = this.x;
        //this.text.y = this.y;
        if(this.seeking)
            this.seek();
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