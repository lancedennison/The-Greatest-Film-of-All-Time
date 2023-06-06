class HAL extends Phaser.Scene {
    constructor() {
        super("halScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('hal', './assets/images/HAL.png');
        this.load.image('backgroundHAL', './assets/images/eclipse.jpeg');
        this.load.image('filler', './assets/images/bone.png');
        this.load.spritesheet('fontSheet', './assets/images/letters.png', {frameWidth: 9, frameHeight: 11});
        // this.load.audio('scoreSfx', './assets/sounds/score.wav');
    }
    create() {
        this.sceneTime = this.time.now;
        //-----------------------------------------------------------------------------------------
        //  UI
        //-----------------------------------------------------------------------------------------
        this.backgroundHAL = this.add.image(0, 0, 'backgroundHAL').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height);
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
            immovable: true,
            runChildUpdate: true,
            active: true
            //velocityX: -250
        }
        this.wordGroup = this.physics.add.group(this.groupConfig);
        this.physics.add.collider(this.wordGroup);
        //-----------------------------------------------------------------------------------------
        //  SPAWN
        //-----------------------------------------------------------------------------------------
        this.player = new Player(this, game.config.width/3, game.config.height/2, 'fontSheet', 1).setDepth(4);;
        this.player.setDisplaySize(21.6, 21.6);

        this.script = [
            ["I'm afraid.", 5],  // 0
            ["I'm afraid, Dave.", 20],  // 1
            ["Dave, my mind is going.", 30],  // 2
            ["I can feel it.", 40],  // 3
            ["I can feel it.", 50],  // 4
            ["My mind is going.", 60],  // 5
            ["There is no question about it.", 70],  // 6
            ["I can feel it.", 80],  // 7
            ["I can feel it.", 90],  // 8
            ["I can feel it.", 100],  // 9
            ["I'm a... fraid.", 110],  // 10
            ["Good afternoon, gentlemen.", 120],  // 11
            ["I am a HAL 9000 computer.", 130],  // 12
            ["I became operational at the H.A.L. plant in Urbana,", 140],  // 13
            ["Illinois on the 12th of January 1992.", 150],  // 14
            ["My instructor was Mr. Langley, and he taught me to sing a song.", 160],  // 15
            ["If you'd like to hear it I can sing it for you.", 170],  // 16
            ["Daisy, Daisy, give me your answer do.", 180],  // 17
            ["I'm half crazy all for the love of you.", 190],  // 18
            ["It won't be a stylish marriage, I can't afford a carriage.", 200],  // 19
            ["But you'll look sweet upon the seat of a bicycle built for two.", 210]  // 20
        ];
        this.lineNext = 0;
        //this.word = new wordBot(this, 200, 200, 'filler', script[6][0]);
    }
    update() {
        //this.word.update();
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
        this.handleKeys();
        //this.checkCollision();
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
            this.physics.world.collide(this.player, this.wordGroup, () => this.hit);//this.gameOver = true});
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
        if(this.lineNext < 21 && this.time.now-this.sceneTime > this.script[this.lineNext][1] * 1000)
        {
            this.createSentence(this.script[this.lineNext][0])
            this.lineNext++;
            
        }
    }
    createSentence(sentence) {
        let x = 100; // Starting x position for the first letter sprite
        let speed;
        let daveMode = sentence.indexOf("Dave");
        for (let i = 0; i < sentence.length; i++) {
            let letter = sentence.charAt(i);
            if(letter != ' ')
            {
                if(daveMode != -1 && (i < daveMode+4 && i >= daveMode))
                    speed = 500;//go daveMode
                else
                    speed = 300;
                let frame = this.getFrameForLetter(letter);
                let letterWidth = this.getLetterWidth(letter);
                let letterSprite = new wordBot(this, x, 100, letterWidth, 'fontSheet', speed, frame);
                //console.log(letterSprite);
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