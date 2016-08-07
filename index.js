var canvas = document.getElementById('canvas');
       
var rr = new Renderer(canvas);

var gamearea = new GameArea(10, 20);
gamearea.init();
Game.gamearea = gamearea;
Game.pieces = createPieces();
var sprite = Game.nextPiece();
Game.update();


