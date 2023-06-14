class Obelisk extends Phaser.Scene {
    constructor() {
        super("obeliskScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('monke', './assets/images/face.png');
        this.load.image('bone', './assets/images/bone.png');
        this.load.image('cover', './assets/images/cover.png');
        this.load.image('backgroundOB', './assets/images/eclipse.jpeg');
        this.load.image('moon', './assets/images/moon.png');
        // this.load.audio('scoreSfx', './assets/sounds/score.wav');
    }
    create() {
        this.sceneTime = this.time.now;
        //-----------------------------------------------------------------------------------------
        //  UI
        //-----------------------------------------------------------------------------------------
        this.backgroundOB = this.add.image(0, 0, 'backgroundOB').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height).setDepth(0);
        this.moon = this.add.image(game.config.width/2 - 12, 200, 'moon').setOrigin(0.5, 0.5).setDepth(2).setScale(1.2);
        //this.cover = this.add.image(0, 0, 'cover').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height).setDepth(2);
        this.timer = this.add.text(game.config.width/2, 40, Math.floor((this.time.now-this.sceneTime)/1000), timerConfig).setOrigin(0.5).setDepth(2);
        this.score = 3;
        this.scorePlayer = this.add.text(30, 15, this.score, scoreConfig)
        //-----------------------------------------------------------------------------------------
        //  SETUP VARS
        //-----------------------------------------------------------------------------------------
        this.gameOver = false;
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
        this.moonTime = true;
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
        }
        this.boneGroup = this.physics.add.group(this.groupConfig);
        this.physics.add.collider(this.boneGroup);
        this.seekGroup = this.physics.add.group(this.groupConfig);
        this.physics.add.collider(this.seekGroup);
        //-----------------------------------------------------------------------------------------
        //  SPAWN
        //-----------------------------------------------------------------------------------------
        this.player = new Player(this, game.config.width/3, game.config.height/2, 'monke');
        this.player.setDisplaySize(21.6, 21.6);

        const spawnEvent = this.time.addEvent({
            delay: 1500,   // Delay between each call in milliseconds (1.5 seconds)
            callback: this.spawn,
            callbackScope: this,
            loop: true     // Set to true for continuous repetition
          });
    }
    update() {
        if(this.moonTime && this.moon.y < this.game.config.height/2 + 54)
        {
            this.moon.setY(this.moon.y + 0.1);
        }
        this.timer.text = Math.floor((this.time.now-this.sceneTime)/1000);
        // this.backgroundOB.tilePositionX += 5;
        // check key input for restart
        if (this.gameOver) {       
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
        this.player.update();
        this.handleKeys();
        if(this.winCon == false && this.gameOver == false) {
            this.checkCollision();
            this.spawn();
        }
        if(this.winCon) {
            this.add.text(game.config.width/2, game.config.height/2, 'You Survived the Encounter with the Monoltih!', menuConfig).setOrigin(0.5).setDepth(2);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (ESC) to Restart or (+) for the Next Stage', menuConfig).setOrigin(0.5).setDepth(2);
        }
    }
    handleKeys()
    {
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.restart();
        }
        if (Phaser.Input.Keyboard.JustDown(keyPLUS)) {
            this.scene.start("halScene");
        }
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
    spawn() {
        this.boneGroup.add(new Projectile(this, this.moon.x, this.moon.y, 'bone', this.moon), true);
        this.seekGroup.add(new Enemy(this, this.moon.x, this.moon.y, 'bone', this.moon), true);
    }
}