class HAL extends Phaser.Scene {
    constructor() {
        super("halScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('dave', './assets/images/hand.png');
        this.load.image('hal', './assets/images/HALpix.png');
        this.load.image('half', './assets/images/HALhalf.png');
        this.load.image('backgroundHAL', './assets/images/halBack.png');
        this.load.image('filler', './assets/images/bone.png');
        this.load.image('bank', './assets/images/plastic.png');
        this.load.image('empty', './assets/images/empty.png');
        this.load.spritesheet('fontSheet', './assets/images/letters.png', {frameWidth: 9, frameHeight: 11});
        // this.load.audio('healthSfx', './assets/sounds/health.wav');
    }
    create() {
        this.sceneTime = this.time.now;
        //-----------------------------------------------------------------------------------------
        //  UI
        //-----------------------------------------------------------------------------------------
        this.backgroundHAL = this.add.image(0, 0, 'backgroundHAL').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height);
        this.hal = this.add.image(game.config.width, game.config.height, 'hal').setOrigin(1, 1).setScale(1.4);
        this.half = this.add.image(game.config.width, game.config.height, 'half').setOrigin(1, 1).setScale(1.4).setDepth(2);
        this.startX = 120;
        this.incrementX = 160;
        this.yUP = 200;
        this.yDOWN = 520;
        //empty banks to make it look better
        this.add.image(this.startX, this.yUP, 'empty').setOrigin(0.5);
        this.add.image(this.startX + this.incrementX, this.yUP, 'empty').setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*2, this.yUP, 'empty').setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*3, this.yUP, 'empty').setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*4, this.yUP, 'empty').setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*5, this.yUP, 'empty').setOrigin(0.5);
        this.add.image(this.startX, this.yDOWN, 'empty').setOrigin(0.5);
        this.add.image(this.startX + this.incrementX, this.yDOWN, 'empty').setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*2, this.yDOWN, 'empty').setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*3, this.yDOWN, 'empty').setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*4, this.yDOWN, 'empty').setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*5, this.yDOWN, 'empty').setOrigin(0.5);
        //memory banks that the player has to "take out"
        this.banks = this.physics.add.group({
            defaultKey: 'bank',
        });
        this.banks.add(new Bank(this, this.startX, this.yUP, 'bank').setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX, this.yUP, 'bank').setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*2, this.yUP, 'bank').setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*3, this.yUP, 'bank').setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*4, this.yUP, 'bank').setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*5, this.yUP, 'bank').setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX, this.yDOWN, 'bank').setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX, this.yDOWN, 'bank').setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*2, this.yDOWN, 'bank').setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*3, this.yDOWN, 'bank').setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*4, this.yDOWN, 'bank').setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*5, this.yDOWN, 'bank').setOrigin(0.5));

        //add timer and player health count
        this.timer = this.add.text(game.config.width/2, 40, Math.floor((this.time.now-this.sceneTime)/1000), timerConfig).setOrigin(0.5).setDepth(2);
        this.health = 3;
        this.healthPlayer = this.add.text(30, 15, this.health, healthConfig)
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
            immovable: false,
            runChildUpdate: true,
            velocityX: -200
        }
        this.wordGroup = this.physics.add.group(this.groupConfig);
        this.physics.add.collider(this.wordGroup);
        //-----------------------------------------------------------------------------------------
        //  SPAWN
        //-----------------------------------------------------------------------------------------
        this.player = new Player(this, game.config.width/3, game.config.height/2, 'dave').setDepth(4);;
        //this.player.setDisplaySize(30, 30);

        this.script = [
            ["I'm afraid.", 4],  // 0
            ["I'm afraid, Dave.", 8],  // 1
            ["Dave, my mind is going.", 12],  // 2
            ["I can feel it.", 16],  // 3
            ["I can feel it.", 20],  // 4
            ["My mind is going.", 24],  // 5
            ["There is no question about it.", 28],  // 6
            ["I can feel it.", 32],  // 7
            ["I can feel it.", 36],  // 8
            ["I can feel it.", 40],  // 9
            ["I'm a... fraid.", 44],  // 10
            ["Good afternoon, gentlemen.", 48],  // 11
            ["I am a HAL 9000 computer.", 52],  // 12
            ["I became operational at the H.A.L. plant in Urbana,", 56],  // 13
            ["Illinois on the 12th of January 1992.", 60],  // 14
            ["My instructor was Mr. Langley, and he taught me to sing a song.", 64],  // 15
            ["If you'd like to hear it I can sing it for you.", 68],  // 16
            ["Daisy, Daisy, give me your answer do.", 72],  // 17
            ["I'm half crazy all for the love of you.", 76],  // 18
            ["It won't be a stylish marriage, I can't afford a carriage.", 80],  // 19
            ["But you'll look sweet upon the seat of a bicycle built for two.", 84]  // 20
        ];
        this.lineNext = 0;
        this.physics.add.overlap(this.player, this.banks, (player, bank) =>
        {
            bank.overlapping();
        });
    }
    update() {
        this.timer.text = Math.floor((this.time.now-this.sceneTime)/1000);
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
        this.handleKeys();
        this.checkCollision();
        this.player.update();
        this.spawn();
    }
    handleKeys()
    {
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.restart();
        }
        if (Phaser.Input.Keyboard.JustDown(keyPLUS)) {
            this.scene.start("prismsScene");
        }
    }
    checkCollision() {
        //check collisions
        if(!this.gameOver)
        {
            this.physics.collide(this.player, this.wordGroup, (plyerObj, wordObj) => 
            {
                wordObj.destroy();
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
        if(this.lineNext < 21 && this.time.now-this.sceneTime > this.script[this.lineNext][1] * 1000)
        {
            this.createSentence(this.script[this.lineNext][0])
            this.lineNext++;
            
        }
    }
    createSentence(sentence) {
        let x = 1200; // Starting x position for the first sprite
        const daveMode = -1;//sentence.indexOf("Dave");
        for (let i = 0; i < sentence.length; i++) {
            const letter = sentence.charAt(i);
            if(daveMode == i)
            {
                x += 10;
                const daveSprite = new DaveBot(this, x, 100, 'fontSheet');
                this.wordGroup.add(daveSprite);
                x += 70;
                i += 3;
            }
            else if(letter != ' ')
            {
                const frame = this.getFrameForLetter(letter);
                const letterWidth = this.getLetterWidth(letter);
                const letterSprite = new wordBot(this, x, 650, letterWidth, 'fontSheet', 300, this.half, frame);
                this.wordGroup.add(letterSprite);
                x += letterWidth; // Increase x position for the next letter sprite
            }
            else
                x += 20;
        }
    }
    getFrameForLetter(letter) {
        const charMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:?!-_~#\"'&()[]|`\\/@" +
            "°+=*$£€<>%áéíóú";
        return charMap.indexOf(letter);
    }
    getLetterWidth(letter)
    {
        const s1 = "Iil.:!'|";
        const s2 = "JKjr1,;";
        const s3 = "ABCDEFGHKNOPQRSTUVXYZabcdefghknopqstuvxyz023456789?";
        const s4 = "MWmw";
        if(s1.includes(letter))
            return 6;
        if(s2.includes(letter))
            return 12;
        if(s3.includes(letter))
            return 18;
        if(s4.includes(letter))
            return 24;
    }
}