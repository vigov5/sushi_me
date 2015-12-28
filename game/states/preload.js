
'use strict';
function Preload() {
    this.asset = null;
    this.ready = false;
}

Preload.prototype = {
    preload: function() {
        this.asset = this.add.sprite(this.game.width/2, this.game.height/2, 'preloader');
        this.asset.anchor.setTo(0.5, 0.5);

        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.asset);
        this.load.spritesheet('foods', 'assets/foods.png', 56, 56, 3);
        this.load.bitmapFont('carrier_command', 'assets/carrier_command.png', 'assets/carrier_command.xml');
    },
    create: function() {
        this.asset.cropEnabled = false;
    },
    update: function() {
        if(!!this.ready) {
            this.game.state.start('play');
        }
    },
    onLoadComplete: function() {
        this.ready = true;
    }
};

module.exports = Preload;
