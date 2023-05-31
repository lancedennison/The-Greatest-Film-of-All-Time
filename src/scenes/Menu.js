class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        this.load.image('poster', './assets/images/poster.jpg');
        // this.load.audio('redSfx', './assets/sounds/red.wav');
    }
    create() {
        this.poster = this.add.image(game.config.width/2, game.config.height/2, 'poster').setOrigin(0.5, 0.5).setScale(0.375);
        // set keys
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // show menu text
        this.add.text(game.config.width/2, 30, 'Made by Lance Dennison', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - 55, 'Greatest Film of All Time:', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 - 20, 'The Game', menuConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, game.config.height/2 + 45, 'Use → To Start', menuConfig).setOrigin(0.5);
    }
    update() {
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT))
        {
            this.scene.start("obeliskScene");
        }
    }
}