
'use strict';

var Cell = require('../prefabs/cell.js');

function Play() {}
Play.prototype = {
    deltas: [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]],
    level: 1,
    score: 0,
    BASE_SCORE: 100,
    create: function() {
        this.score = this.BASE_SCORE * this.level;
        this.game.stage.backgroundColor = '#34495e';
        this.grid = new Array(5);
        for (var i = 0; i < 5; i++) {
            this.grid[i] = new Array(5);
            for (var j = 0; j < 5; j++) {
                this.grid[i][j] = new Cell(this.game, this.game.width/2 - 60*5/2 + i*60, 150 + j*60, j, i, 0);
                this.game.add.existing(this.grid[i][j]);
                this.grid[i][j].inputEnabled = true;
                this.grid[i][j].events.onInputDown.add(this.clickListener, this);
            }
        }
        
        this.bmpText = this.game.add.bitmapText(10, 30, 'carrier_command','Change all disc to sushi to win\r\n\r\nClick to flip', 12);
        this.bmpText.x = this.game.width / 2 - this.bmpText.textWidth / 2;
        
        this.explainGroup = this.game.add.group();
        this.explainGroup.add(this.game.add.sprite(0, 0, 'foods', 0));
        this.game.add.bitmapText(10, 60, 'carrier_command', 'sushi', 6, this.explainGroup);
        this.game.add.bitmapText(60, 28, 'carrier_command', '>', 12, this.explainGroup);
        this.explainGroup.add(this.game.add.sprite(80, 0, 'foods', 1));
        this.game.add.bitmapText(80, 60, 'carrier_command', 'onigiri', 6, this.explainGroup);
        this.game.add.bitmapText(145, 28, 'carrier_command', '>', 12, this.explainGroup);
        this.explainGroup.add(this.game.add.sprite(160, 0, 'foods', 2));
        this.game.add.bitmapText(160, 60, 'carrier_command', 'makizushi', 6, this.explainGroup);
        this.explainGroup.x = 380;
        this.explainGroup.y = 50;
        
        this.levelText = this.game.add.bitmapText(50, this.game.height - 50, 'carrier_command', 'level:' + this.level, 18);
        this.scoreText = this.game.add.bitmapText(this.game.width - 50, this.game.height - 120, 'carrier_command', '' + this.score, 24);
        this.scoreText.x = this.game.width / 2 - this.scoreText.textWidth / 2;
        this.generateLevel(this.level);
    },
    clickCell: function(col, row, changeScore){
        for (var i = 0; i < this.deltas.length; i++) {
            var targetCol = col + this.deltas[i][0];
            var targetRow = row + this.deltas[i][1];
            if (targetCol >= 0 && targetCol < 5 && targetRow >= 0 && targetRow < 5) {
                this.grid[targetRow][targetCol].flip();
            }
        }
        if (changeScore) {
            this.score -= 5;
        }
    },
    update: function() {
        this.scoreText.setText('' + this.score);
        this.scoreText.x = this.game.width / 2 - this.scoreText.textWidth / 2;
        
        var done = true;
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                if (this.grid[i][j].frame != 0) {
                    done = false;
                    break;
                }
            }
        }
        if (done) {
            this.score += this.BASE_SCORE * this.level;
            this.level += 1;
            this.levelText.setText('level:' + this.level);
            this.generateLevel(this.level);
        }
    },
    clickListener: function(object) {
        this.clickCell(object.row, object.col, true);
    },
    resetLevel: function() {
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                this.grid[i][j].frame = 0;
            }
        }
    },
    generateLevel: function(level) {
        this.resetLevel();
        for (var i = 0; i < level; i++) {
            var col = this.game.rnd.integerInRange(0, 4);
            var row = this.game.rnd.integerInRange(0, 4);
            this.clickCell(row, col, false);
        }
    }
};

module.exports = Play;