let SM;
// -> drawSprites();
// -> collisions();
function setup() {
    createCanvas(GAME.RES.WIDTH, GAME.RES.HEIGHT);
    frameRate(60);
    noStroke();

    initObjects();

    TILE_MAP.init();

    SM = new SceneManager();

    SM.addScene(ARCADE_SCENE);
    SM.showScene(ARCADE_SCENE);
}

function keyPressed() {
    SM.handleEvent("keyPressed");
}

function keyReleased() {
    SM.handleEvent("keyReleased");
}

function draw() {
    background(GAME.BG_COLOR);
    SM.draw();
}

function ARCADE_SCENE() {
    let PLAYER;
    let Asteroids = [];
    //let Asteroids_S = new Group();

    this.enter = function() {
        PLAYER = new ARCADE.Player();
    }
    
    this.keyPressed = function() {
        if (GAME.PLAYER_CONTROLS.indexOf(key) > -1) {
            PLAYER.controls(key);
        }
    }

    this.keyReleased = function() {
        if (GAME.PLAYER_CONTROLS.indexOf(key) > -1) {
            PLAYER.controls(key);
        }
    }

    this.draw = function() {
        background(GAME.BG_COLOR);
        generateAsteroids();
        PLAYER.draw();

        for (let i in Asteroids) {
            Asteroids[i].draw();
        }

        //TILE_MAP.render();
    }

    let deltaFrame = false;
    let passedFrames = 0;
    function generateAsteroids() {
        if (!deltaFrame) {
            deltaFrame = floor(random(150, 350));
        } else {
            console.log(frameCount - passedFrames, deltaFrame);
            if (frameCount - passedFrames > deltaFrame) {
                for (let i = 0; i < random(2, 8); i++) {
                    Asteroids.push(new ARCADE.Asteroid());
                }
                passedFrames = frameCount;
                deltaFrame = false;
            }
            console.log(Asteroids);
        }
    }
}






// -------------------------------
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