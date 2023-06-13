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
        // this.load.audio('scoreSfx', './assets/sounds/score.wav');
    }
    create() {
        this.sceneTime = this.time.now;
        //-----------------------------------------------------------------------------------------
        //  UI
        //-----------------------------------------------------------------------------------------
        this.backgroundPRI = this.add.image(0, 0, 'backgroundPRI').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height);
        //this.prisms = this.add.image(0, 0, 'prisms').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height).setDepth(1);
        this.prism1 = this.add.image(200, 200, 'prism1').setOrigin(0.5).setDepth(2).setScale(0.6);
        this.prism2 = this.add.image(390, 200, 'prism2').setOrigin(0.5).setDepth(2).setScale(0.6);
        this.prism3 = this.add.image(620, 180, 'prism3').setOrigin(0.5).setDepth(2).setScale(0.6);
        this.prism4 = this.add.image(850, 200, 'prism4').setOrigin(0.5).setDepth(2).setScale(0.6);
        this.prism5 = this.add.image(1070, 200, 'prism5').setOrigin(0.5).setDepth(2).setScale(0.6);

        this.timer = this.add.text(game.config.width/2, 40, Math.floor((this.time.now-this.sceneTime)/1000), timerConfig).setOrigin(0.5).setDepth(2);
        this.score = 3;
        this.scorePlayer = this.add.text(30, 15, this.score, scoreConfig)
        //-----------------------------------------------------------------------------------------
        //  SETUP VARS
        //-----------------------------------------------------------------------------------------
        this.gameOver = false;
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
        // animation config
        // this.anims.create({
        //     key: '',
        //     frames: this.anims.generateFrameNumbers('', { start: 0, end: 9, first: 0}),
        //     frameRate: 60
        // });
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
        this.physics.add.collider(this.boneGroup);
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
        this.bone = new Projectile(this, 200, 200, 'monolith', this.prism1);
    }
    update() {
        this.timer.text = Math.floor((this.time.now-this.sceneTime)/1000);
        // this.backgroundPRI.tilePositionX += 5;
        // check key input for restart
        if(this.gameOver) {       
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', menuConfig).setOrigin(0.5).setDepth(2);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (ESC) to Restart or ← for Menu', menuConfig).setOrigin(0.5).setDepth(2);
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
        if(Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.restart();
        }
        if(Phaser.Input.Keyboard.JustDown(keyPLUS)) {
            this.scene.start("winScene");
        }
        this.handleKeys();
        this.checkCollision();
        this.player.update();
    }
    handleKeys()
    {
        //does nothing in this one
    }
    checkCollision() {
        //check collisions
        if(!this.gameOver)
        {
            this.physics.collide(this.player, this.boneGroup, (plyerObj, boneObj) => 
            {
                boneObj.destroy();
                if(this.score == 0)
                {
                    this.gameOver = true;
                    return;
                }
                this.score -= 1;
                this.scorePlayer.setText(this.score);

            });
            this.physics.collide(this.player, this.seekGroup, (plyerObj, boneObj) => 
            {
                boneObj.destroy();
                if(this.score == 0)
                {
                    this.gameOver = true;
                    return;
                }
                this.score -= 1;
                this.scorePlayer.setText(this.score);

            });
        }
    }
    hit() {
        if(this.score == 0)
        {
            this.gameOver = true;
            return;
        }
        this.score -= 1;
        this.scorePlayer.setText(this.score);
    }
    spawn() {
        this.boneGroup.add(new Projectile(this, 200, 200, 'monolith', this.prism1), true);
        this.boneGroup.add(new Projectile(this, 390, 200, 'monolith', this.prism2), true);
        this.boneGroup.add(new Projectile(this, 620, 180, 'monolith', this.prism3), true);
        this.boneGroup.add(new Projectile(this, 850, 200, 'monolith', this.prism4), true);
        this.boneGroup.add(new Projectile(this, 1070, 200, 'monolith', this.prism5), true);
    }
}