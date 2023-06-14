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
        this.load.spritesheet('nums', './assets/images/banknums.png', {frameWidth: 57, frameHeight: 57});
        this.load.spritesheet('out', './assets/images/bankOUT.png', {frameWidth: 57, frameHeight: 57});
        this.load.spritesheet('fontSheet', './assets/images/letters.png', {frameWidth: 9, frameHeight: 11});
        // this.load.audio('healthSfx', './assets/sounds/health.wav');
    }
    create() {
        this.sceneTime = this.time.now;
        //add images
        this.backgroundHAL = this.add.image(0, 0, 'backgroundHAL').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height);
        this.hal = this.add.image(game.config.width, game.config.height, 'hal').setOrigin(1, 1).setScale(1.4);
        this.half = this.add.image(game.config.width, game.config.height, 'half').setOrigin(1, 1).setScale(1.4).setDepth(2);
        //-----------------------------------------------------------------------------------------
        //  UI
        //-----------------------------------------------------------------------------------------
        //add timer and player health count
        this.timer = this.add.text(game.config.width/2, 40, Math.floor((this.time.now-this.sceneTime)/1000), timerConfig).setOrigin(0.5).setDepth(2);
        this.health = 5;
        this.healthPlayer = this.add.text(30, 15, this.health, scoreConfig);
        this.add.image(35, 37, 'dave');
        //-----------------------------------------------------------------------------------------
        //  SETUP VARS
        //-----------------------------------------------------------------------------------------
        this.startX = 120;
        this.incrementX = 160;
        this.yUP = 200;
        this.yDOWN = 520;
        this.graderMode = false;
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
            immovable: false,
            runChildUpdate: true,
            velocityX: -200
        }
        this.wordGroup = this.physics.add.group(this.groupConfig);
        this.physics.add.collider(this.wordGroup);
        //light indicators
        this.add.image(this.startX, this.yUP + 160, 'out', 10).setOrigin(0.5);
        this.add.image(this.startX + this.incrementX, this.yUP + 160, 'out', 0).setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*2, this.yUP + 160, 'out', 1).setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*3, this.yUP + 160, 'out', 2).setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*4, this.yUP + 160, 'out', 3).setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*5, this.yUP + 160, 'out', 4).setOrigin(0.5);
        this.add.image(this.startX, this.yDOWN + 160, 'out', 11).setOrigin(0.5);
        this.add.image(this.startX + this.incrementX, this.yDOWN + 160, 'out', 5).setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*2, this.yDOWN + 160, 'out', 6).setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*3, this.yDOWN + 160, 'out', 7).setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*4, this.yDOWN + 160, 'out', 8).setOrigin(0.5);
        this.add.image(this.startX + this.incrementX*5, this.yDOWN + 160, 'out', 9).setOrigin(0.5);
        //light indicators
        this.num5 = this.add.image(this.startX, this.yUP + 160, 'nums', 10).setOrigin(0.5);
        this.num4 = this.add.image(this.startX + this.incrementX, this.yUP + 160, 'nums', 0).setOrigin(0.5);
        this.num3 = this.add.image(this.startX + this.incrementX*2, this.yUP + 160, 'nums', 1).setOrigin(0.5);
        this.num2 = this.add.image(this.startX + this.incrementX*3, this.yUP + 160, 'nums', 2).setOrigin(0.5);
        this.num1 = this.add.image(this.startX + this.incrementX*4, this.yUP + 160, 'nums', 3).setOrigin(0.5);
        this.num0 = this.add.image(this.startX + this.incrementX*5, this.yUP + 160, 'nums', 4).setOrigin(0.5);
        this.num11 = this.add.image(this.startX, this.yDOWN + 160, 'nums', 11).setOrigin(0.5);
        this.num10 = this.add.image(this.startX + this.incrementX, this.yDOWN + 160, 'nums', 5).setOrigin(0.5);
        this.num9 = this.add.image(this.startX + this.incrementX*2, this.yDOWN + 160, 'nums', 6).setOrigin(0.5);
        this.num8 = this.add.image(this.startX + this.incrementX*3, this.yDOWN + 160, 'nums', 7).setOrigin(0.5);
        this.num7 = this.add.image(this.startX + this.incrementX*4, this.yDOWN + 160, 'nums', 8).setOrigin(0.5);
        this.num6 = this.add.image(this.startX + this.incrementX*5, this.yDOWN + 160, 'nums', 9).setOrigin(0.5);
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
        this.banks.add(new Bank(this, this.startX, this.yUP, 'bank', this.num5).setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX, this.yUP, 'bank', this.num4).setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*2, this.yUP, 'bank', this.num3).setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*3, this.yUP, 'bank', this.num2).setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*4, this.yUP, 'bank', this.num1).setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*5, this.yUP, 'bank', this.num0).setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX, this.yDOWN, 'bank', this.num11).setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX, this.yDOWN, 'bank', this.num10).setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*2, this.yDOWN, 'bank', this.num9).setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*3, this.yDOWN, 'bank', this.num8).setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*4, this.yDOWN, 'bank', this.num7).setOrigin(0.5));
        this.banks.add(new Bank(this, this.startX + this.incrementX*5, this.yDOWN, 'bank', this.num6).setOrigin(0.5));
        //-----------------------------------------------------------------------------------------
        //  SPAWN
        //-----------------------------------------------------------------------------------------
        this.player = new Player(this, game.config.width/3, game.config.height/2, 'dave').setDepth(4);

        this.delta = 1;
        this.physics.add.overlap(this.player, this.banks, (player, bank) =>
        {
            bank.overlapping(this.delta);
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
            this.checkBanks();
        }
        if(this.winCon) {
            this.add.text(game.config.width/2, game.config.height/2, 'HAL-9000 Decommissioned', menuConfig).setOrigin(0.5).setDepth(2);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (ESC) to Restart or (+) for the Next Stage', menuConfig).setOrigin(0.5).setDepth(2);
        }
    }
    handleKeys()
    {
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.restart();
        }
        if(Phaser.Input.Keyboard.JustDown(keyPLUS)) {
            if(this.graderMode)
                this.scene.start("prismsScene");
            else{ 
                this.graderMode = true;
                this.health = 999;
                this.delta = 10;
                this.healthPlayer.setText(this.health);
            }
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
    checkBanks() {
        var sum = 0;
        (this.banks.getChildren()).forEach(Bank => {
            sum += Bank.check();
        });
        if(sum == 0)
            this.winCon = true;
    }
}