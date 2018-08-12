let SM;

function preload() {
    GAME.INIT_SPRITES();
}

function setup() {
    createCanvas(GAME.RES.WIDTH, GAME.RES.HEIGHT);
    frameRate(60);
    noStroke();

    initObjects();

    SM = new SceneManager();

    SM.addScene(ARCADE_SCENE);
    SM.addScene(GAME_OVER);
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

let PLAYER;
function ARCADE_SCENE() {
    
    let WAVE_PHASE;
    let PHASE_DIF;
    let PHASE_CHANGE_TIME;

    let locations = [];

    ARCADE.Meteors = [];
    //ARCADE.Meteors_S = new Group();

    ARCADE.Aliens = [];
    //ARCADE.Aliens_S = new Group();

    frameCount = 0;

    this.enter = function() {
        PLAYER = new ARCADE.Player();
        HUD.ARCADE.init();
        HUD.ARCADE.updateHP(PLAYER.hp, PLAYER.currentHp);
        HUD.ARCADE.updateWeapon(PLAYER.upgrades.weapon);
        WAVE_PHASE = true;
        PHASE_DIF = [3, 6];
        PHASE_CHANGE_TIME = 600;
    }
    
    this.keyPressed = function() {
        if (GAME.PLAYER_CONTROLS.indexOf(keyCode.toString()) > -1) {
            PLAYER.controls(keyCode.toString());
        }
    }

    this.keyReleased = function() {
        if (GAME.PLAYER_CONTROLS.indexOf(keyCode.toString()) > -1) {
            PLAYER.controls(keyCode.toString());
        }
    }

    this.draw = function() {
        background(GAME.BG_COLOR);
        GAME.STARS.draw();
        /*console.log(ARCADE.Aliens.length, ARCADE.Aliens_S.length, "ALIEN");
        console.log(ARCADE.Meteors.length, ARCADE.Meteors_S.length, "Meteors");*/

        if (frameCount % PHASE_CHANGE_TIME == 0) {
            WAVE_PHASE = !WAVE_PHASE
            //console.log(WAVE_PHASE);
        }

        if (WAVE_PHASE) {
            generateMeteors();
        } else {
            generateAliens();
        }

        for (let i in ARCADE.Meteors) {
            //ARCADE.Meteors[i].sprite.debug = mouseIsPressed;
            ARCADE.Meteors[i].draw();
        }

        for (let i in ARCADE.Aliens) {
            //ARCADE.Aliens[i].sprite.debug = mouseIsPressed;
            ARCADE.Aliens[i].draw();
        }

        PLAYER.draw();

        if (PLAYER.currentHp <= 0) {
            HUD.ARCADE.delete();
            SM.showScene(GAME_OVER);
        }

        if (frameCount % 60 == 0) {
            GAME.SCORE += 1;
            HUD.ARCADE.updateScore(GAME.SCORE);
        }

        if (!GAME.MUSIC.isPlaying()) {
            GAME.MUSIC.play();
        }
    }

    let deltaFrame = false;
    let passedFrames = 0;
    function generateMeteors() {
        if (!deltaFrame) {
            deltaFrame = floor(random(150, 350));
        } else {
            //console.log(frameCount - passedFrames, deltaFrame);
            if (frameCount - passedFrames > deltaFrame) {
                for (let i = 0; i < floor(random(PHASE_DIF[0], PHASE_DIF[1])); i++) {
                    let Meteor_ = new ARCADE.Meteor();
                    ARCADE.Meteors.push(Meteor_);
                }
                passedFrames = frameCount;
                deltaFrame = false;
            }
            //console.log(Meteors);
        }
    }

    function generateAliens() {
        if (!deltaFrame) {
            deltaFrame = floor(random(150, 300));
        } else {
            //console.log(frameCount - passedFrames, deltaFrame);

            locations = [];
            for (let i = 0; i < GAME.COL; i++) {
                locations.push(i);
            }

            if (frameCount - passedFrames > deltaFrame) {
                for (let i = 0; i < floor(random(PHASE_DIF[0], PHASE_DIF[1])); i++) {
                    let x = (GAME.ROW + floor(random(2, 5))) * GAME.TILE_SIZE;

                    let y_index = floor(random(0, locations.length));
                    let y = locations[y_index] * GAME.TILE_SIZE * 2;

                    locations.splice(y_index, 1);
                    //console.log(locations);
                    let alien_ = new ARCADE.Alien(x, y);
                    ARCADE.Aliens.push(alien_);
                }
                passedFrames = frameCount;
                deltaFrame = false;
            }
            //console.log(Meteors);
        }
    }
}

function GAME_OVER() {
    this.enter = function() {
        alert("OYUN BİTTİ BROM");
    }

    this.draw = function() {
        background(0);
    }
}


let pPressed = false; // 80
window.addEventListener("keydown", function(e) {
    if (e.keyCode == 32) {
        e.preventDefault();
    }

    if (e.keyCode == 80 && !pPressed) {
        pPressed = true;
        PLAYER.upgrade();
    }
});

window.addEventListener("keyup", function(e) {
    if (e.keyCode == 80) {
        pPressed = false;
    }
});