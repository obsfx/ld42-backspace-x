let SM;
// -> drawSprites();
// -> collisions();
function setup() {
    createCanvas(GAME.RES.WIDTH, GAME.RES.HEIGHT);
    frameRate(60);
    noStroke();

    SM = new SceneManager();
    //SM.addScene(MENU_SCENE);
    SM.addScene(GAME_SCENE);

    SM.showScene( GAME_SCENE )
}

function draw() {
    background(GAME.BG_COLOR);
    SM.draw();
}

function keyPressed()
{
    /*// You can optionaly handle the key press at global level...
    switch(key)
    {
        case '1':
            SM.showScene( MENU_SCENE );
            break;
        case '2':
            SM.showScene( GAME_SCENE );
            break;
    }*/

}
/*
function MENU_SCENE() {

    this.enter = function() {
        alert("MAIN MENU EXECUTED");
    }

    this.draw = function() {
        background(GAME.BG_COLOR - 5);
    }
}
*/

function GAME_SCENE() {
    this.enter = function() {
        alert("GAME EXECUTED");
    }

    this.draw = function() {
        background(GAME.BG_COLOR + 5);
    }
}