var Game = {
    then : 0,
    counter : 0,
    gametick : 0,
    actions: [],
    pieces : [],
    score : 0,
    speed : 64,
    
    /**
     * main update function. calls the inner tick function 
     * and times it
     */
    update : function() {
        var now = Date.now();
        var delta = now - Game.then;
        
        Game.tick(delta);
        // render
        rr.render(delta, gamearea, sprite);

        Game.then = now;
        requestAnimationFrame(Game.update);
    },
    tick : function(delta) {
        this.counter++;
        var count = this.counter / this.speed | 0;
        if (count != this.gametick) {
            // update gametick

            var collish = this.collision(0, 1, this.gamearea, sprite);
            
            if (collish) {
                this.setTetrisPiece(sprite, gamearea);
                this.clearRows(sprite);

                sprite = this.nextPiece();
                // check for whole rows
            } else {
                sprite.y++;
            }
        }

        this.gametick = count;

        var action = this.actions.shift();

        if (action === controls.LEFT) {
            var dx = -1;
            var dY = 0;
            var collish = this.collision(dx, dY, this.gamearea, sprite);
            if(!collish){
                sprite.x--;
            }
        }
        if (action === controls.RIGHT) {
            var dx = 1;
            var dY = 0;
            var collish = this.collision(dx, dY, this.gamearea, sprite);
            if (!collish) {
                sprite.x++;
            }
        }
        if ( action === controls.UP) {
            // Rotate sprite
            var nextIndex = sprite.current + 1;
            if(nextIndex > sprite.tiles.length - 1){
                nextIndex = 0;
            }
            var isCollision = this.collision(0, 0, this.gamearea, sprite, nextIndex);
            if(!isCollision){
                sprite.current = nextIndex;
            }        
        }
        if(action === controls.DOWN) {

            var dx = 0;
            var dY = 1;
            if(dY > 20) {
                debugger;
            }
            var collish = this.collision(0, dY, this.gamearea, sprite);
   
            if (!collish) {
                sprite.y++;
            }
        }
    },
    nextPiece : function(){
        if(this.pieces.length === 0) {
            this.pieces = createPieces();
        }
        var index = Math.floor(Math.random() * this.pieces.length);
        var nextPiece = this.pieces.splice(index, 1)[0];

        var newPiece = createFallingBlock(5, 0, nextPiece);
        newPiece.tiles = nextPiece.tiles;
        return newPiece;
    },
    setTetrisPiece : function (sprite, gamearea) {
        var tiles = sprite.tiles[sprite.current];
        // apply sprite to game area
        tiles.forEach(function(row, yy) {
            row.forEach(function(b, xx) {
                if (b===1) {
                    gamearea.positions[yy + sprite.y][xx + sprite.x].col = sprite.color;
                }
            });
        });
    },
    /**
     * Checks to see if any rows are full and clears them if they are
     */
    clearRows : function (sprite) {
        var tiles = sprite.tiles[sprite.current];
        var completeLines = [];
        // first find all the lines that are complete, 
        // ie they go the whole way accross
        var re =  tiles.forEach(function(t, y) {
             if (this.checkLine(y + sprite.y)) {
                 completeLines.push(y + sprite.y);
                //  this.score += 100;
             }
        }, this);
        this.score += this.calculateScore(completeLines.length);

        // now remove all those lines
        completeLines.forEach(function(y) {
            this.gamearea.positions.splice(y, 1);
        }, this);
        // now for each one removed create a new empty one at the top of the game area
        completeLines.forEach(function(y){
            var newLine = this.gamearea.createNewLine(y);
            this.gamearea.positions.unshift(newLine);
        }, this);
    },
    /**
     * Check to see if a line has tetris blocks the whole way across
     */
    checkLine : function (y) {
        if(y > this.gamearea.height - 1){
            return false;
        }
        return this.gamearea.positions[y].every(function(t){
            return t.col !== 'white';
        });
    },
    /**
     * returns the approriate score to the number of rows that are cleared
     */
    calculateScore : function (numRowsCleared) {
        var points = {
            0 : 0,
            1 : 40,
            2 : 100,
            3 : 300,
            4 : 1200
        };
        return points[numRowsCleared];
    },

    collision : function(nextX, nextY, gamearea, sprite, index) {
        index = index != null ? index : sprite.current;
        var tiles = sprite.tiles[index];
        return tiles.some(function(row, yy) {
            return row.some(function(b, xx) {
                if(b !== 1) {
                    return false;
                }
                var px = sprite.x + xx + nextX;
                var py = sprite.y + yy + nextY;
                if(px < 0 || px > gamearea.width - 1 || py < 0 || py > gamearea.height -1 ||gamearea.positions[py][px].col !== "white" ) {
                    return true;
                } else {
                    var blockbelow = gamearea.positions[py][px]; //  [py + 1] : might need to change this later
                    if(blockbelow.col !== "white"){
                        return true;
                    }
                }
                return false;
            });
        });
    }
};