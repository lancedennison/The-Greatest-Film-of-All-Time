class HAL extends Phaser.Scene {
    constructor() {
        super("halScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('hal', './assets/images/HAL.png');
        this.load.image('backgroundHAL', './assets/images/eclipse.jpeg');
        // this.load.audio('scoreSfx', './assets/sounds/score.wav');
    }
    create() {
        this.sceneTime = this.time.now;
        //-----------------------------------------------------------------------------------------
        //  UI
        //-----------------------------------------------------------------------------------------
        this.backgroundHAL = this.add.image(0, 0, 'backgroundHAL').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height);
        this.timer = this.add.text(game.config.width/2, 40, Math.floor((this.time.now-this.sceneTime)/1000), timerConfig).setOrigin(0.5).setDepth(2);
        this.score = 0;
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
        // this.groupConfig = {
        //     collideWorldBounds: false,
        //     immovable: true,
        //     velocityX: -250
        // }
        // this.redGroup = this.physics.add.group(this.groupConfig);
        // this.physics.add.collider(this.redGroup);
        //-----------------------------------------------------------------------------------------
        //  SPAWN
        //-----------------------------------------------------------------------------------------
        this.player = new Player(this, game.config.width/3, game.config.height/2, 'playerSprite');
        this.player.setDisplaySize(21.6, 21.6);
        // this.player.setDisplaySize(21.6, 21.6);
        // this.player.setCircle(75, 33, 33);

        // this.spawn();
        // this.spawnTimer = this.time.addEvent({
        //     delay: this.blockER.spawnDelay,
        //     callback: this.spawn,
        //     callbackScope: this,
        //     loop: true
        // });
    }
    update() {
        this.timer.text = Math.floor((this.time.now-this.sceneTime)/1000);
        // this.backgroundHAL.tilePositionX += 5;
        // check key input for restart
        if (this.gameOver) {       
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', menuConfig).setOrigin(0.5).setDepth(2);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (ESC) to Restart or ← for Menu', menuConfig).setOrigin(0.5).setDepth(2);
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }
            //do death animation
            this.player.setAlpha(0);
            if(!this.playedSFX)
            {
                this.sound.play('loseSfx');
                this.playedSFX = true;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.restart();
        }
        if (Phaser.Input.Keyboard.JustDown(keyPLUS)) {
            this.scene.start("prismsScene");
        }
        this.handleKeys();
        //this.blockSpawner()
        //this.checkCollision();
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
            // if()
            // {
            //     this.physics.world.collide(this.player, this.redGroup, () => {this.gameOver = true});
            // }
        }
    }
    scorePass() {
        // this.score += 10;
        // this.scorePlayer.setText(this.score);
        // // this.sound.play('scoreSfx');
    }
    blockSpawner() {
        if(Math.floor((this.time.now-this.sceneTime)/1000) > this.blockER.timeGate)
        {
            if(this.blockER.spawnDelay > 2000)
                this.blockER.spawnDelay -= 500;
            this.blockER.timeGate += 10;
            if(this.speed > -700)
                this.speed -= 75;
            this.time.addEvent({
                delay: this.blockER.spawnDelay,
                callback: this.spawn,
                callbackScope: this,
                loop: true
            });
        }
    }
    spawn() {
        let rC, rH;
        // rC = Math.floor(Math.random() * 4) + 1;
        rH = (Math.random() * this.validRange.max) + this.validRange.min;
        this.redGroup.add(new Block(this, game.config.width + 60, rH, 20, 200, redFILL), true);
    }
}