class Obelisk extends Phaser.Scene {
    constructor() {
        super("obeliskScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('monke', './assets/images/face.png');
        this.load.image('bone', './assets/images/bone.png');
        this.load.image('backgroundOB', './assets/images/eclipse.jpeg');
        this.load.image('moon', './assets/images/moon.png');
        // this.load.audio('scoreSfx', './assets/sounds/score.wav');
    }
    create() {
        this.sceneTime = this.time.now;
        //add images
        this.backgroundOB = this.add.image(0, 0, 'backgroundOB').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height).setDepth(0);
        this.moon = this.add.sprite(game.config.width/2 - 12, 200, 'moon').setOrigin(0.5).setDepth(2).setScale(1.2);
        //-----------------------------------------------------------------------------------------
        //  UI
        //-----------------------------------------------------------------------------------------
        this.timer = this.add.text(game.config.width/2, 40, Math.floor((this.time.now-this.sceneTime)/1000), timerConfig).setOrigin(0.5).setDepth(2);
        this.score = 99999//3;
        this.scorePlayer = this.add.text(30, 15, this.score, scoreConfig)
        //-----------------------------------------------------------------------------------------
        //  SETUP VARS
        //-----------------------------------------------------------------------------------------
        this.gameOver = false;
        this.winCon = false;
        this.gate = true;
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
        this.moonTime = false;
        this.winTime = false;
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
            delay: 1000,
            callback: this.spawn,
            callbackScope: this,
            loop: true
        });//spawner time event
    }
    update() {
        this.timer.text = Math.floor((this.time.now-this.sceneTime)/1000);
        if(this.timer.text == "60") {//you win at 60 seconds
            this.winTime = true;
            this.moonTime = false;
        }
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
        if(this.moonTime == false && this.moon.y < this.game.config.height/2 + 54)
        {
            this.moon.setY(this.moon.y + 0.1);
        }
        else
            this.moonTime = true;
        if(this.moonTime)//MOON TIME!
            this.moon.angle += 5;//rotato potato

        if(this.winCon == false && this.gameOver == false) {
            this.checkCollision();
            //this.spawn();
        }
        if(this.winCon) {
            this.add.text(game.config.width/2, game.config.height/2, 'You Survived the Encounter with the Monoltih!', menuConfig).setOrigin(0.5).setDepth(2);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (ESC) to Restart or (+) for the Next Stage', menuConfig).setOrigin(0.5).setDepth(2);
        }
        this.player.update();
        this.handleKeys();
        this.winStuff();
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
            this.physics.collide(this.player, this.seekGroup, (plyerObj, seekObj) => 
            {
                seekObj.destroy();
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
        if(this.winCon || this.winTime)
            return;
        if(this.moonTime) {//moon time!
            this.seekGroup.add(new Enemy(this, this.moon.x, this.moon.y, 'bone', this.moon, this.moon.angle + 45, 5000), true);
        }
        else
        {
            this.boneGroup.add(new Projectile(this, this.moon.x, this.moon.y, 'bone', this.moon), true);
            //this.seekGroup.add(new Enemy(this, this.moon.x, this.moon.y, 'bone', this.moon), true);
        }
    }
    winStuff() {
        if(this.winTime) {
            (this.boneGroup.getChildren()).forEach(bone => {
                bone.destroy();
            });
            (this.seekGroup.getChildren()).forEach(seek => {
                seek.destroy();
            });
            if(this.gate) {
                this.timeline = this.add.timeline([
                    {
                        at: 40,
                        tween: {
                            targets: this.moon,
                            x: game.config.width/2 - 10,
                            ease: 'sine.out',
                            duration: 20,
                            yoyo: true,
                            repeat: -1,
                            repeatDelay: 40
                        }
                    },
                    {
                        at: 80,
                        tween: {
                            targets: this.moon,
                            x: game.config.width/2 + 10,
                            ease: 'sine.out',
                            duration: 20,
                            yoyo: true,
                            repeat: -1,
                            repeatDelay: 40
                        }
                    }
                ]);
                this.timeline.play();
                this.gate = false;
            }
            if(this.timeline.complete)
            {
                this.moon.setY(this.moon.y + 2);
            }
            if(this.moon.y > game.config.height + this.moon.height)
            {
                this.winCon = true;
            }
        }
    }
}