let ARCADE = {};

function initObjects() {

    //Player
    ARCADE.Player = function() {
        this.w = 50;
        this.h = 20;
        this.vel = 5;
        this.pos = createVector(10, 10);
        this.keys = {
            "w": false,
            "a": false,
            "s": false,
            "d": false,
            " ": false
        },
        this.bullets = [];
        this.fired = false;
        this.fireRate = 15;
        this.firedFrame = null;
    }

    ARCADE.Player.prototype.controls = function() {
        this.keys[key] = !this.keys[key];
    }

    ARCADE.Player.prototype.update = function() {
        if (this.keys["w"]) {
            this.pos.y -= this.vel;
        } 
        
        if (this.keys["a"]) {
            this.pos.x -= this.vel;
        }
        
        if (this.keys["s"]) {
            this.pos.y += this.vel;
        } 
        
        if (this.keys["d"]) {
            this.pos.x += this.vel;
        }

        if (this.keys[" "]) {
            this.shoot();
        }

        if (this.fired) {
            if (frameCount - this.firedFrame > this.fireRate) {
                this.fired = false;
            }
        }
    }

    ARCADE.Player.prototype.draw = function() {
        this.update();
        fill(255,0,0);
        rect(this.pos.x, this.pos.y, this.w, this.h);

        for (var i in this.bullets) {
            this.bullets[i].draw();
        }
    }

    ARCADE.Player.prototype.shoot = function() {
        if (!this.fired) {
            this.bullets.push(new ARCADE.Bullet(this.pos.x + this.w, this.pos.y + this.h / 2));
            this.fired = true;
            this.firedFrame = frameCount;
        }
    }

    //Bullets
    ARCADE.Bullet = function(x, y) {
        this.pos = createVector(x, y);
        this.w = 20;
        this.h = 5;
        this.vel = 20;
    }

    ARCADE.Bullet.prototype.update = function() {
        this.pos.x += this.vel;
    }

    ARCADE.Bullet.prototype.draw = function() {
        this.update();
        fill(0,0, 255);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }

}