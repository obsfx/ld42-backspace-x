const GAME = {
    BG_COLOR: 12,
    ROW: 30,
    COL: 30,
    TILE_SIZE: 16,
    SCORE: 0,
    PLAYER_SPRITES: [],
    METEOR_SPRITE: null,
    ALIEN_SPRITE: null,
    ALIEN_BULLET: null,
    WEAPON_SPRITES: [],
    MUSIC: null,
    PLAYER_CONTROLS: ["87", "65", "83", "68", "32"],
    WEAPONS: [
        {dmg:1, s: 10, fr: 20},
        {dmg:1.3, s: 12, fr: 18, cost: 100},
        {dmg:1.8, s: 13, fr: 17, cost: 300},
        {dmg:2.2, s: 13.5, fr: 15, cost: 550},
        {dmg:2.5, s: 15, fr: 10, cost: 800},
    ],
    HEALTH: [100],
}

GAME.RES = {
    WIDTH: GAME.ROW * GAME.TILE_SIZE,
    HEIGHT: GAME.COL * GAME.TILE_SIZE
}

GAME.INIT_SPRITES = function() {
    for (var i = 1; i < 6; i++) {
        GAME.PLAYER_SPRITES.push(loadImage("assets/P-000" + i + ".png"));
    }

    GAME.METEOR_SPRITE = loadImage("assets/meteor.png");
    GAME.ALIEN_SPRITE = loadImage("assets/alien_ship.png");
    GAME.ALIEN_BULLET = loadImage("assets/alien_bullet.png");

    for (var i = 1; i < 6; i++) {
        GAME.WEAPON_SPRITES.push(loadImage("assets/w" + i +".png"));
    }

    GAME.MUSIC = loadSound("assets/bg_music_c.mp3");
    GAME.MUSIC.setVolume(0.4);
}

GAME.STARS = {
    locations: [],
    stars: [],
    starw: 4,
    starvel: 10,
    star_q: 12,
    setLocations: function() {
        this.locations = [];
        for (var i = 0; i < GAME.ROW; i++) {
            for (var j = 0; j < GAME.COL; j++) {
                this.locations.push({r: i, c: j});
            }
        }
    },

    init: function() {
        this.setLocations();
        for (var i = 0; i < this.star_q; i++) {
            let index = floor(random(0, this.locations.length));
            this.stars.push({x: this.locations[index].r * GAME.TILE_SIZE + floor(random(width, width + 150)), y: this.locations[index].c * GAME.TILE_SIZE});

            this.locations.splice(index, 1);
        }
    },

    draw: function() {
        if (this.stars.length < this.star_q) {
            this.init();
        }

        for (var i in this.stars) {
            this.stars[i].x += -this.starvel;

            fill(255);
            rect(this.stars[i].x, this.stars[i].y, this.starw, this.starw);
            if (this.stars[i].x + this.starw < 0) {
                this.stars.splice(i, 1);
            }
        }
    }
}