'use strict';

var Cell = function(game, x, y, row, col, frame) {
    Phaser.Sprite.call(this, game, x, y, 'foods', frame);
    this.col = col;
    this.row = row;
    this.game.physics.arcade.enableBody(this);
};

Cell.prototype = Object.create(Phaser.Sprite.prototype);
Cell.prototype.constructor = Cell;

Cell.prototype.update = function() {
    // write your prefab's specific update code here
};

Cell.prototype.flip = function() {
    this.frame = (this.frame + 1) % 3;
}

module.exports = Cell;
