class Prisms extends Phaser.Scene {
    constructor() {
        super("prismsScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('backgroundPRI', './assets/images/prismsback.png');
        this.load.image('prisms', './assets/images/prisms.png');
        this.load.image('prism1', './assets/images/prism1.png');
        this.load.image('prism2', './assets/images/prism2.png');
        this.load.image('prism3', './assets/images/prism3.png');
        this.load.image('prism4', './assets/images/prism4.png');
        this.load.image('prism5', './assets/images/prism5.png');
        this.load.image('monolith', './assets/images/monolith.png');
        this.load.image('pod', './assets/images/pod.png');
        //this.load.image('', './assets/images/.png');
        // this.load.audio('healthSfx', './assets/sounds/health.wav');
    }
    create() {
        this.sceneTime = this.time.now;
        //add images
        this.backgroundPRI = this.add.image(0, 0, 'backgroundPRI').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height);
        this.prism1 = this.add.image(200, 200, 'prism1').setOrigin(0.5).setDepth(2).setScale(0.6);
        this.prism2 = this.add.image(390, 200, 'prism2').setOrigin(0.5).setDepth(2).setScale(0.6);
        this.prism3 = this.add.image(620, 180, 'prism3').setOrigin(0.5).setDepth(2).setScale(0.6);
        this.prism4 = this.add.image(850, 200, 'prism4').setOrigin(0.5).setDepth(2).setScale(0.6);
        this.prism5 = this.add.image(1070, 200, 'prism5').setOrigin(0.5).setDepth(2).setScale(0.6);
        this.prismSpawnCount = [12, 18, 50, 18, 12];
        //-----------------------------------------------------------------------------------------
        //  UI
        //-----------------------------------------------------------------------------------------
        this.timer = this.add.text(game.config.width/2, 40, Math.floor((this.time.now-this.sceneTime)/1000), timerConfig).setOrigin(0.5).setDepth(2);
        this.health = 10;
        this.healthPlayer = this.add.text(30, 15, this.health, scoreConfig);
        this.add.image(35, 37, 'pod').setDisplaySize(30, 30);
        //-----------------------------------------------------------------------------------------
        //  SETUP VARS
        //-----------------------------------------------------------------------------------------
        this.graderMode = false;
        this.gameOver = false;
        this.count = 0;
        this.winCon = false;
        this.speed = -250;
        this.blockER = {
            blockNumber: 0,
            spawnDelay: 5000,
            timeGate: 0,
        }
        this.validRange = {
            min: 200,
            max: (game.config.height - 200)
        }
        this.spawnTimer;
        //-----------------------------------------------------------------------------------------
        //  KEYS
        //-----------------------------------------------------------------------------------------
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyPLUS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS);
        //-----------------------------------------------------------------------------------------
        //  !!! GROUPS
        //-----------------------------------------------------------------------------------------
        this.groupConfig = {
            collideWorldBounds: false,
            runChildUpdate: true,
            immovable: false,
            velocity: 100
        }
        this.boneGroup = this.physics.add.group(this.groupConfig);
        //this.physics.add.collider(this.boneGroup);
        this.seekGroup = this.physics.add.group(this.groupConfig);
        //this.physics.add.collider(this.seekGroup);
        //-----------------------------------------------------------------------------------------
        //  SPAWN
        //-----------------------------------------------------------------------------------------
        this.player = new Player(this, game.config.width/3, game.config.height/2, 'pod');
        this.player.setDisplaySize(21.6, 21.6);

        const spawnEvent = this.time.addEvent({
            delay: 1500,   // Delay between each call in milliseconds (1.5 seconds)
            callback: this.spawn,
            callbackScope: this,
            loop: true     // Set to true for continuous repetition
        });
    }
    update() {
        this.timer.text = Math.floor((this.time.now-this.sceneTime)/1000);
        if(this.timer.text == "80")
            this.winCon = true;
        if(this.gameOver) {       
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', menuConfig).setOrigin(0.5).setDepth(2);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (ESC) to Restart or ← for Menu', menuConfig).setOrigin(0.5).setDepth(2);
            this.graderMode = true;
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }
            //do death animation
            this.player.setAlpha(0);
            // if(!this.playedSFX)
            // {
            //     this.sound.play('loseSfx');
            //     this.playedSFX = true;
            // }
        }
        this.player.update();
        this.handleKeys();
        if(this.winCon == false && this.gameOver == false) {
            this.checkCollision();
            //this.spawn();
        }
        if(this.winCon) {
            this.add.text(game.config.width/2, game.config.height/2, 'Nothing Stands in Your Way', menuConfig).setOrigin(0.5).setDepth(2);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (ESC) to Restart or (+) for the Next Stage', menuConfig).setOrigin(0.5).setDepth(2);
        }
    }
    handleKeys()
    {
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.restart();
        }
        if(Phaser.Input.Keyboard.JustDown(keyPLUS)) {
            if(this.graderMode)
                this.scene.start("winScene");
            else{ 
                this.graderMode = true;
                this.health = 999;
                this.healthPlayer.setText(this.health);
            }
        }
    }
    checkCollision() {
        //check collisions
        if(!this.gameOver)
        {
            this.physics.collide(this.player, this.boneGroup, (plyerObj, boneObj) => 
            {
                boneObj.destroy();
                if(this.health == 0)
                {
                    this.gameOver = true;
                    return;
                }
                this.health -= 1;
                this.healthPlayer.setText(this.health);

            });
            this.physics.collide(this.player, this.seekGroup, (plyerObj, boneObj) => 
            {
                boneObj.destroy();
                if(this.health == 0)
                {
                    this.gameOver = true;
                    return;
                }
                this.health -= 1;
                this.healthPlayer.setText(this.health);

            });
        }
    }
    hit() {
        if(this.health == 0)
        {
            this.gameOver = true;
            return;
        }
        this.health -= 1;
        this.healthPlayer.setText(this.health);
    }
    spawn() {
        if(this.winCon)
            return;
        if(this.prismSpawnCount[0] > 0) {
            this.boneGroup.add(new Projectile(this, 200, 200, 'monolith', this.prism1), true);
            this.prismSpawnCount[0]--;
        }
        else {
            this.disappear(this.prism1);
        }
        if(this.prismSpawnCount[1] > 0) {
            this.boneGroup.add(new Projectile(this, 390, 200, 'monolith', this.prism2), true);
            this.prismSpawnCount[1]--;
        }
        //-----------------------------------------------------------------------------------------
        //  THIS THE SPECIAL ONE
        //-----------------------------------------------------------------------------------------
        if(this.prismSpawnCount[2] > 30) {
            this.boneGroup.add(new Projectile(this, 390, 200, 'monolith', this.prism2), true);
            this.seekGroup.add(new Enemy(this, 620, 180, 'monolith', this.prism3, 90, 500), true);
            this.boneGroup.add(new Projectile(this, 850, 200, 'monolith', this.prism4), true);
            this.prismSpawnCount[2]--;
        }
        else if(this.prismSpawnCount[2] > 20) {
            this.disappear(this.prism2);
            this.disappear(this.prism4);
            this.seekGroup.add(new Enemy(this, 620, 180, 'monolith', this.prism3, 90 + 45, 7000), true);
            this.seekGroup.add(new Enemy(this, 620, 180, 'monolith', this.prism3, 90, 500), true);
            this.seekGroup.add(new Enemy(this, 620, 180, 'monolith', this.prism3, 90 + -45, 7000), true);
            this.prismSpawnCount[2]--;
        }
        else if(this.prismSpawnCount[2] > 0) {
            this.seekGroup.add(new Enemy(this, 620, 180, 'monolith', this.prism3, 90 + 65, 7000), true);
            this.seekGroup.add(new Enemy(this, 620, 180, 'monolith', this.prism3, 90 + 25, 7000), true);
            this.seekGroup.add(new Enemy(this, 620, 180, 'monolith', this.prism3, 90, 500), true);
            this.seekGroup.add(new Enemy(this, 620, 180, 'monolith', this.prism3, 90 + -25, 7000), true);
            this.seekGroup.add(new Enemy(this, 620, 180, 'monolith', this.prism3, 90 + -65, 7000), true);
            this.prismSpawnCount[2]--;
        }
        else {
            this.disappear(this.prism3);
        }
        //-----------------------------------------------------------------------------------------
        //  NO MORE
        //-----------------------------------------------------------------------------------------
        if(this.prismSpawnCount[3] > 0) {
            this.boneGroup.add(new Projectile(this, 850, 200, 'monolith', this.prism4), true);
            this.prismSpawnCount[3]--;
        }
        if(this.prismSpawnCount[4] > 0) {
            this.boneGroup.add(new Projectile(this, 1070, 200, 'monolith', this.prism5), true);
            this.prismSpawnCount[4]--;
        }
        else {
            this.disappear(this.prism5);
        }
    }
    disappear(object) {
        var tween = this.tweens.add({
            targets: object,
            alpha: 0,
            ease: 'Linear',
            duration: 2000, // Duration in milliseconds
        });
    }
}