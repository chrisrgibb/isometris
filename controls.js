 
    var controls = {
        pressed : {},
        UP : 38,
        DOWN : 40,
        LEFT : 37,
        RIGHT : 39,
        A : 65
    }

    window.addEventListener('keydown', function(e) {
        Game.actions.push(e.keyCode);
    });

