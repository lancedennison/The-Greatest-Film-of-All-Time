class Win extends Phaser.Scene {
    constructor() {
        super("winScene");
    }
    preload() {
        this.load.image('bab', './assets/images/baby.png');
        // this.load.audio('redSfx', './assets/sounds/red.wav');
    }
    create() {
        this.baby = this.add.image(0, 0, 'bab').setOrigin(0, 0).setDisplaySize(game.config.width, game.config.height);
        // set keys
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // show menu text
        this.add.text(game.config.width/2, 30, 'Made by Lance Dennison', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - 75, 'You have reached enlightenment and are', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 - 20, 'VICTORIOUS', menuConfig).setOrigin(0.5).setFontSize(80);
        this.add.text(game.config.width/2, game.config.height/2 + 45, 'Use → To Return to Main Menu', menuConfig).setOrigin(0.5);
    }
    update() {
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT))
        {
            this.scene.start("menuScene");
        }
    }
}