//------------------------------------------------------------------------------------------------------------------
//  Lance Dennison
//  Greatest Film of All Time
//  Hours spent:
//------------------------------------------------------------------------------------------------------------------
let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 720,
    backgroundColor: '#CECECE',
    pixelArt: true,
    // Sets game scaling
    scale: {
        // Fit to window
        mode: Phaser.Scale.FIT,
        // Center vertically and horizontally
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        pixelArt: 'true',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Menu, Obelisk, HAL, Prisms, Win ]
}
let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
// reserve keyboard vars
let keyESC, keyUP, keyDOWN, keyLEFT, keyRIGHT, keyPLUS;
// set text configs
let menuConfig = {
    fontFamily: 'CustomFont',
    fontSize: '28px',
    color: '#ffffff',
    shadow: {
        color: '#000000',
        offsetX: 2,
        offsetY: 2,
        fontSize: '32px',
        fill: true
    },
    align: 'right',
    padding: {
    x: 20,
    y: 5
    },
    fixedWidth: 0
}
let scoreConfig = {
    fontFamily: 'CustomFont',
    fontSize: '28px',
    color: '#ffffff',
    shadow: {
        color: '#4682B4',
        offsetX: 4,
        offsetY: 4,
        fill: true
    },
    align: 'center',
    padding: {
    x: 10,
    y: 5
    },
    fixedWidth: 100
}
let timerConfig = {
    fontFamily: 'CustomFont',
    fontSize: '40px',
    color: '#ffffff',
    shadow: {
        color: '#4682B4',
        offsetX: 4,
        offsetY: 4,
        fill: true
    },
    align: 'right',
    fixedWidth: 0
}