var Renderer = function(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
	this.tileSize = 24;
	this.width = 900;
	this.height = 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.squareHeight = 24;
    this.offsetX = 100;
};

Renderer.prototype = {

    init : function () {
        // this.ctx.  
    },
    
	/**
	 * @param  {any} delta
	 * @param  {any} map
	 */
	render : function(delta, gamearea, sprite) {
		this.ctx.clearRect(0, 0, this.width, this.height);

         
        var containsPoint = function (sprite, x, y) {
            var tiles = sprite.tiles[sprite.current];
            if (tiles[y - sprite.y] == null) {
                return false;
            }
            return tiles[y - sprite.y][x - sprite.x] === 1;
        }

        
         // draw background
		for(var y = 0; y < gamearea.height; y++){
            for( var x = 0; x  < gamearea.width; x++){
                var color = gamearea.positions[y][x].col;
                
                var height = color === "white" ? 0 : this.squareHeight;
                if(containsPoint(sprite, x, y)){
                    this.drawSquare(x, y, sprite.color, this.squareHeight);
                } else {
                    this.drawSquare(x, y, color, height);
                }
            }
        }

        this.ctx.fillStyle = 'white';
        this.ctx.font = "bold 32px Arial";
        this.ctx.fillText("Score : " + Game.score, 32, 64 );
	},
    /**
     * @param  {any} sprite
     */
    drawSprite : function (sprite) {
        var tiles = sprite.tiles[sprite.current];

        tiles.forEach(function(p, yindex) {
            p.forEach(function(q, xindex) {
                if(q !== 0){
                    var x = xindex + sprite.x;
                    var y = yindex + sprite.y;
                    this.drawSquare(x, y, sprite.color, this.squareHeight);
                }
            }, this);
        }, this);
    },
	
	drawSquare : function(x, y, color, height, lineColor) {
		
		height = height == null ? 0 : height;
		
		lineColor = lineColor || 'black';
		// the centre of the isometric view, where we will start drawing
		var offset = this.width / 2;
		var isoPoint = this.convertToIsometric(x, y);
		var ctx = this.ctx;
		
		var isoX = isoPoint.x + this.offsetX;
		// offset for height of square
		var isoY = isoPoint.y - height;
		ctx.strokeStyle = lineColor;

    	ctx.beginPath();
        ctx.moveTo(isoX, isoY);// top
        ctx.lineTo(isoX + this.tileSize, isoY + (this.tileSize / 2) ); // right
        ctx.stroke();
        ctx.lineTo(isoX, isoY + this.tileSize ); // bottom
        ctx.stroke();
        ctx.lineTo(isoX - this.tileSize , isoY + ( this.tileSize / 2 ) ); // left
        ctx.stroke();
        ctx.lineTo(isoX, isoY); // top again
        ctx.stroke();
        // fill with colours
        // ctx.fillStyle = positions[x][y].col;
        ctx.fillStyle = color || 'white';
        // console.log();
        ctx.closePath();
        ctx.fill();
        
        // draw the sides if its a raised diamond
        if(height > 0) {
            //left rectangle
            ctx.beginPath();
            ctx.moveTo( isoX - this.tileSize + 1  , isoY + ( this.tileSize / 2 )  ); // left
            ctx.stroke();
            ctx.lineTo( isoX, isoY + (this.tileSize)  ); //bottom of diamond
            ctx.stroke();
            ctx.lineTo(isoX, isoY + this.tileSize + height); // bottom + 1=
            ctx.stroke();              
            ctx.lineTo(isoX - this.tileSize + 1, isoY+( this.tileSize / 2 ) + height ); //left
            ctx.stroke();
            // console.log();
            ctx.closePath();
            ctx.fill();

            // right triangle
            ctx.beginPath();
            ctx.moveTo( isoX + 1, isoY +  this.tileSize    );  // bottom
            ctx.stroke();
            ctx.lineTo(isoX + this.tileSize , isoY + (this.tileSize /2)   ); // right top
            ctx.stroke();
            ctx.lineTo(isoX + this.tileSize  , isoY + (this.tileSize /2)   + height ); // right bottom
            ctx.stroke();              
            ctx.lineTo(isoX + 1, isoY +  this.tileSize   + height ); // bottom + 10
            ctx.stroke();
          
            ctx.closePath();
            
            ctx.fill();


        }
	},
	/**
	*	converts a cartesian x, y coord to isometric
	*	returns a point 
	*
	*/
	convertToIsometric : function(x, y) {
		var offset = this.width / 2; 
		var xx = offset + this.tileSize * x;
		var yy = ( this.tileSize * y);
		return {
			x : xx - yy,
			y : (xx + yy) /2
		};
	}
}

