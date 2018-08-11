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
        if (this.keys["w"] && this.pos.y > 0) {
            this.pos.y -= this.vel;
        } 
        
        if (this.keys["a"] && this.pos.x > 0) {
            this.pos.x -= this.vel;
        }
        
        if (this.keys["s"] && this.pos.y + this.h < height) {
            this.pos.y += this.vel;
        } 
        
        if (this.keys["d"] && this.pos.x + this.w < width) {
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

            if (this.bullets[i].pos.x > width) {
                this.bullets.slice(i, 1);
            }
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


    //Asteroids
    ARCADE.Asteroid = function() {
        this.pos = createVector(random(width, random(width + 25, width + 150)), random(50, height - 50));
        this.t = random(1, 3);
        this.hp = this.t * 3;
        this.movement = createVector( -random(0.5, 2), random(-0.5, 0.5));
        this.size = this.t * 25;
        this.sprite = createSprite(this.pos.x, this.pos.y, this.w, this.h);
    }

    ARCADE.Asteroid.prototype.update = function() {
        this.pos.add(this.movement);
        this.sprite.position.x = this.pos.x;
        this.sprite.position.y = this.pos.y;
    }

    ARCADE.Asteroid.prototype.draw = function() {
        this.update();
        fill(0, 255, 0);
        ellipse(this.pos.x, this.pos.y, this.size, this.size)
    }
}