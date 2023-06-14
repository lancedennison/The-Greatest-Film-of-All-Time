// Enemy prefab
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, spawnObject, angle, time, frame) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.seekTime = 0;
        this.spawnObject = spawnObject;
        this.behind = true;
        this.target = angle;
        this.startTime = time;
        if(this.seekTime != undefined)
            this.go = false;
        else    
            this.go = true;
        this.create();
    }
    create() {
        this.setScale(0.1);
        if(this.go == false)
        {
            this.scene.time.delayedCall(this.startTime, () => {
                this.go = true;
            }, null, this);
        }
    }
    update() {
        if(this.target != undefined)
        {
            this.scene.physics.velocityFromAngle(this.target, 100, this.body.velocity);
            this.target = undefined;
        }
        this.angle += 5;//rotato potato
        if(this.go)
            this.seek();
        this.behindCheck();
        this.despawn();
    }
    seek() {
        if(this.seekTime++ < 100)
        {
            this.scene.physics.moveToObject(this, this.scene.player, 300);
        }
    }
    behindCheck() {
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
    despawn() {
        if(this.x < 0 - this.width ||
            this.x > game.config.width + this.width ||
            this.y < 0 - this.height ||
            this.y > game.config.height + this.height) {
            this.destroy();
        }
    }
}