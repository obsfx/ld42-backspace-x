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
    let WAVE_PHASE;
    let PHASE_DIF;
    let PHASE_CHANGE_TIME;
    let PLAYER;

    let locations = [];

    ARCADE.Asteroids = [];
    ARCADE.Asteroids_S = new Group();

    ARCADE.Aliens = [];
    ARCADE.Aliens_S = new Group();

    ARCADE.Frame_Count = 0;

    this.enter = function() {
        HUD.ARCADE.init();
        PLAYER = new ARCADE.Player();
        WAVE_PHASE = "ALIEN";
        PHASE_DIF = [4, 8];
        PHASE_CHANGE_TIME = 1600;
    }
    
    this.keyPressed = function() {
        console.log("log_p");
        if (GAME.PLAYER_CONTROLS.indexOf(key) > -1) {
            PLAYER.controls(key);
        }
    }

    this.keyReleased = function() {
        console.log("log_r");
        if (GAME.PLAYER_CONTROLS.indexOf(key) > -1) {
            PLAYER.controls(key);
        }
    }

    this.draw = function() {
        ARCADE.Frame_Count += 1;

        background(GAME.BG_COLOR);

        if (ARCADE.Frame_Count % PHASE_CHANGE_TIME == 0) {
            //WAVE_PHASE = (WAVE_PHASE == "ASTEROIDS") ? "ALIEN" : "ASTEROIDS";

            if (PHASE_DIF[0] < 7) {
                PHASE_DIF[0] += 1;
            }

            if (PHASE_DIF[1] < 7) {
                PHASE_DIF[1] += 1;
            }

            if (PHASE_CHANGE_TIME < 5400) {
                PHASE_CHANGE_TIME += 400;
            }
        }

        if (WAVE_PHASE == "ASTEROIDS") {
            generateAsteroids();
        } else {
            generateAliens();
        }

        PLAYER.draw();

        for (let i in ARCADE.Asteroids) {
            ARCADE.Asteroids[i].draw();
            ARCADE.Asteroids[i].sprite.debug = mouseIsPressed;
        }

        for (let i in ARCADE.Aliens) {
            ARCADE.Aliens[i].draw();
            ARCADE.Aliens[i].sprite.debug = mouseIsPressed;
        }
        

        //TILE_MAP.render();
        if (mouseIsPressed) {
            drawSprites();
        }
    }

    let deltaFrame = false;
    let passedFrames = 0;
    function generateAsteroids() {
        if (!deltaFrame) {
            deltaFrame = floor(random(150, 350));
        } else {
            //console.log(ARCADE.Frame_Count - passedFrames, deltaFrame);
            if (ARCADE.Frame_Count - passedFrames > deltaFrame) {
                for (let i = 0; i < random(PHASE_DIF[0], PHASE_DIF[1]); i++) {
                    let asteroid_ = new ARCADE.Asteroid();
                    ARCADE.Asteroids.push(asteroid_);
                    ARCADE.Asteroids_S.push(asteroid_.sprite);
                }
                passedFrames = ARCADE.Frame_Count;
                deltaFrame = false;
            }
            //console.log(Asteroids);
        }
    }

    function generateAliens() {
        if (!deltaFrame) {
            deltaFrame = floor(random(150, 300));
        } else {
            //console.log(ARCADE.Frame_Count - passedFrames, deltaFrame);

            locations = [];
            for (let i = 0; i < GAME.COL; i++) {
                locations.push(i);
            }

            if (ARCADE.Frame_Count - passedFrames > deltaFrame) {
                for (let i = 0; i < random(PHASE_DIF[0], PHASE_DIF[1]); i++) {
                    let x = (GAME.ROW + floor(random(2, 5))) * GAME.TILE_SIZE;

                    let y_index = floor(random(0, locations.length));
                    let y = locations[y_index] * GAME.TILE_SIZE * 2;

                    locations.splice(y_index, 1);
                    console.log(locations);
                    let alien_ = new ARCADE.Alien(x, y);
                    ARCADE.Aliens.push(alien_);
                    ARCADE.Aliens_S.push(alien_.sprite);
                }
                passedFrames = ARCADE.Frame_Count;
                deltaFrame = false;
            }
            //console.log(Asteroids);
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