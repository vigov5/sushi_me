(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'green_me');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":3,"./states/gameover":4,"./states/menu":5,"./states/play":6,"./states/preload":7}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],4:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
    preload: function () {
    },
    create: function () {
    },
    update: function () {
    }
};
module.exports = GameOver;

},{}],5:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
    preload: function() {
    },
    create: function() {
    },
    update: function() {
    }
};

module.exports = Menu;

},{}],6:[function(require,module,exports){

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
},{"../prefabs/cell.js":2}],7:[function(require,module,exports){

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

},{}]},{},[1])