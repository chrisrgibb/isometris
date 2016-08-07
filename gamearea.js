function Position(x, y, col){
    this.x = x;
    this.y = y;
    this.col = col;
}

function GameArea(width, height){
    this.width = width;
    this.height = height;
    this.positions = [];
}

GameArea.prototype = {
    init : function () {
        for(var y = 0; y < this.height; y++){
            var row = [];
            for(var j = 0; j < this.width; j++){
                row.push(new Position(j, y, 'white'));
            }
            this.positions.push(row);
        }
        return this.positions;
    },
    createNewLine : function (y) {
        var row = [];
        for(var j = 0; j < this.width; j++){
                row.push(new Position(j, y, 'white'));
        }
        return row;
    }
}