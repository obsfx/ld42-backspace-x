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
        this.fireRate = 10;
        this.firedFrame = null;
        this.bulletMovement = 20;
        this.score = 0;
        this.sprite = createSprite(this.pos.x + this.w / 2, this.pos.y + this.h / 2, this.w, this.h);
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

        this.sprite.position.x = this.pos.x + this.w / 2;
        this.sprite.position.y = this.pos.y + this.h / 2;

        if (this.sprite.collide(ARCADE.Asteroids_S)) {
            console.log("hit by asteroid")
        }

        if (this.keys[" "]) {
            this.shoot();
        }

        if (this.fired) {
            if (frameCount - this.firedFrame > this.fireRate) {
                this.fired = false;
            }
        }

        for (var i in ARCADE.Aliens) {
            for (var j in ARCADE.Aliens[i].bullets) {
                if (this.sprite.overlap(ARCADE.Aliens[i].bullets[j].sprite)) {
                    console.log("hit by alien");
                    ARCADE.Aliens[i].bullets.splice(j, 1);
                }
            }
        }
    }

    ARCADE.Player.prototype.draw = function() {
        this.update();
        this.bulletDraw();
        fill(255,0,0);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }

    ARCADE.Player.prototype.bulletDraw = function() {
        for (var i in this.bullets) {
            this.bullets[i].draw();

            if (this.bullets[i].pos.x > width) {
                this.bullets.splice(i, 1);
            } else {
                let this_ = this;
                let bulletCollide = false;
                
                if (!bulletCollide) {
                    this.bullets[i].sprite.overlap(ARCADE.Asteroids_S, function(collector, collected) {
                        this_.bullets.splice(i, 1);
    
    
                        let index = ARCADE.Asteroids_S.indexOf(collected);
                        ARCADE.Asteroids[index].hpbarshowcd = 80;
    
                        if (!ARCADE.Asteroids[index].hit()) {
                            this_.score += ARCADE.Asteroids[index].point;
    
                            HUD.ARCADE.updatePoint(this_.score);
    
                            ARCADE.Asteroids.splice(index, 1);
                            ARCADE.Asteroids_S.splice(index, 1);
                        }
                        
                        bulletCollide = true;
                    });
                }

                if (!bulletCollide) {
                    this.bullets[i].sprite.overlap(ARCADE.Aliens_S, function(collector, collected) {
                        this_.bullets.splice(i, 1);
    
    
                        let index = ARCADE.Aliens_S.indexOf(collected);
                        ARCADE.Aliens[index].hpbarshowcd = 80;
    
                        if (!ARCADE.Aliens[index].hit()) {
                            this_.score += ARCADE.Aliens[index].point;
    
                            HUD.ARCADE.updatePoint(this_.score);
    
                            ARCADE.Aliens.splice(index, 1);
                            ARCADE.Aliens_S.splice(index, 1);
                        }
                        
                        bulletCollide = true;
                    });
                }
            }
        }
    }

    ARCADE.Player.prototype.shoot = function() {
        if (!this.fired) {
            this.bullets.push(new ARCADE.Bullet(this.pos.x + this.w / 2, this.pos.y + this.h / 2, this.bulletMovement));
            this.fired = true;
            this.firedFrame = frameCount;
        }
    }

    //Bullets
    ARCADE.Bullet = function(x, y, d) {
        this.pos = createVector(x, y);
        this.w = 20;
        this.h = 5;
        this.vel = d;
        this.sprite = createSprite(this.pos.x, this.pos.y, this.w, this.h);
    }

    ARCADE.Bullet.prototype.update = function() {
        this.pos.x += this.vel;
        this.sprite.position.x = this.pos.x + this.w / 2;
        this.sprite.position.y = this.pos.y + this.h / 2;
    }

    ARCADE.Bullet.prototype.draw = function() {
        this.update();
        fill(0,0, 255);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }


    //Asteroids
    ARCADE.Asteroid = function() {
        this.t = floor(random(1, 5));
        this.size = this.t * 25;
        this.pos = createVector(random(width, random(width + this.size + 20, width + this.size + 100)), random(50, height - 50));
        this.hp = this.t * 2;
        this.hpbarw = 50,
        this.hpbarh = 5;
        this.hpbarshowcd = 0;
        this.dmg = this.t * 5;
        this.point = this.t * 3; 
        this.movement = createVector( -random(0.5, 2), random(-0.5, 0.5));
        this.sprite = createSprite(this.pos.x, this.pos.y, this.w, this.h);
        this.sprite.setCollider("circle", 0, 0, this.size / 2);
    }

    ARCADE.Asteroid.prototype.update = function() {
        this.pos.add(this.movement);  

        if (this.pos.x + this.size / 2 < 0) {
            let index = ARCADE.Asteroids.indexOf(this);

            ARCADE.Asteroids.splice(index, 1);
            ARCADE.Asteroids_S.splice(index, 1);
            console.log(ARCADE.Asteroids.length);
            
            return false;
        }

        this.sprite.position.x = this.pos.x;
        this.sprite.position.y = this.pos.y;
    }

    ARCADE.Asteroid.prototype.draw = function() {
        if (this.update() == false)
            return false;

        fill(0, 255, 0);
        ellipse(this.pos.x, this.pos.y, this.size, this.size);
        this.HPBar();
    }

    ARCADE.Asteroid.prototype.HPBar = function() {
        if (this.hpbarshowcd > 0) {
            fill(255, 0, 0);
            rect(this.pos.x - this.size / 2, this.pos.y - this.hpbarh / 2, (this.hpbarw / (this.t * 2)) * this.hp, this.hpbarh);
            this.hpbarshowcd -= 1;
        }
    }

    ARCADE.Asteroid.prototype.hit = function() {
        if (this.hp > 0) {
            this.hp -= 1;
            return true;
        } else {
            return false;
        }
    }

    //Aliens
    ARCADE.Alien = function(x, y) {
        this.pos = createVector(x, y);
        this.w = 50;
        this.h = 32;
        this.t = floor(random(1, 4));
        this.dmg = this.t * 5;
        this.hp = this.t * 2;
        this.hpbarw = 50,
        this.hpbarh = 5;
        this.hpbarshowcd = 0;
        this.point = this.t * 3; 
        this.movement = createVector( -random(0.5, 2), 0);
        this.sprite = createSprite(this.pos.x + this.w / 2, this.pos.y + this.h / 2, this.w, this.h);
        this.bullets = [];
        this.bulletMovement = 5;
        this.fired = false;
        this.fireRate = floor(random(100, 200));
        this.firedFrame = null;
    }

    ARCADE.Alien.prototype.update = function() {
        this.pos.add(this.movement);

        if (this.pos.x + this.w < 0) {
            let index = ARCADE.Aliens.indexOf(this);

            ARCADE.Aliens.splice(index, 1);
            ARCADE.Aliens_S.splice(index, 1);
            console.log(ARCADE.Aliens.length, "Aliens");
            
            return false;
        }

        this.sprite.position.x = this.pos.x + this.w / 2;
        this.sprite.position.y = this.pos.y + this.h / 2;

        if (this.fired) {
            if (frameCount - this.firedFrame > this.fireRate) {
                this.fired = false;
            }
        }
    }

    ARCADE.Alien.prototype.draw = function() {
        if (this.update() == false)
            return false;
        this.shoot();
        this.bulletDraw();
        fill(0, 0, 255);
        rect(this.pos.x, this.pos.y, this.w, this.h);
        this.HPBar();
    }

    ARCADE.Alien.prototype.shoot = function() {
        if (!this.fired) {
            this.bullets.push(new ARCADE.Bullet(this.pos.x, this.pos.y + this.h / 2, -this.bulletMovement));
            this.fired = true;
            this.firedFrame = frameCount;
        }
    }

    ARCADE.Alien.prototype.bulletDraw = function() {
        for (var i in this.bullets) {
            this.bullets[i].draw();

            if (this.bullets[i].pos.x + this.bullets[i].w < 0) {
                this.bullets.splice(i, 1);
            } 
        }
    }

    ARCADE.Alien.prototype.HPBar = function() {
        if (this.hpbarshowcd > 0) {
            fill(255, 0, 0);
            rect(this.pos.x, this.pos.y + this.h / 2, (this.hpbarw / (this.t * 2)) * this.hp, this.hpbarh);
            this.hpbarshowcd -= 1;
        }
    }

    ARCADE.Alien.prototype.hit = function() {
        if (this.hp > 0) {
            this.hp -= 1;
            return true;
        } else {
            return false;
        }
    }
}