let ARCADE = {};

function initObjects() {

    //Player
    ARCADE.Player = function() {
        this.w = 50;
        this.h = 20;
        this.vel = 5;
        this.pos = createVector(15, (height / 2) - (this.h / 2));
        this.upgrades = {
            weapon: 0,
            healt: 0
        };
        this.keys = {
            "87": false,
            "65": false,
            "83": false,
            "68": false,
            "32": false
        };
        this.bullets = [];
        this.hp = GAME.HEALTH[this.upgrades.healt];
        this.currentHp = this.hp;
        this.dmg = GAME.WEAPONS[this.upgrades.weapon].dmg;
        this.fired = false;
        this.fireRate = GAME.WEAPONS[this.upgrades.weapon].fr;
        this.firedFrame = null;
        this.bulletMovement = GAME.WEAPONS[this.upgrades.weapon].s;
        this.score = 0;
        this.canTakeDmg = true;
        this.defaultctdCD = 150;
        this.ctdCD = this.defaultctdCD;
        this.blink = false;
        this.toggle = false;
    }

    ARCADE.Player.prototype.controls = function(key) {
        this.keys[key] = !this.keys[key];
    }

    ARCADE.Player.prototype.update = function() {
        if (this.keys["87"] && this.pos.y > 0) {
            this.pos.y -= this.vel;
        } 
        
        if (this.keys["65"] && this.pos.x > 0) {
            this.pos.x -= this.vel;
        }
        
        if (this.keys["83"] && this.pos.y + this.h < height) {
            this.pos.y += this.vel;
        } 
        
        if (this.keys["68"] && this.pos.x + this.w < width) {
            this.pos.x += this.vel;
        }

        if (this.canTakeDmg) {
            for (var i in ARCADE.Asteroids) {
                let col = collideRectCircle(this.pos.x, this.pos.y, this.w, this.h, ARCADE.Asteroids[i].pos.x, ARCADE.Asteroids[i].pos.y, ARCADE.Asteroids[i].size);
                if (col) {
                    this.currentHp -= ARCADE.Asteroids[i].dmg;
                    HUD.ARCADE.updateHP(this.hp, this.currentHp);
                    this.canTakeDmg = false;
                    this.blink = true;
                    break;
                }
            }
        }

        if (this.canTakeDmg) {
            for (var i in ARCADE.Aliens) {
                for (var j in ARCADE.Aliens[i].bullets) {
                    let p = collideRectRect(this.pos.x, this.pos.y, this.w, this.h, ARCADE.Aliens[i].bullets[j].pos.x, ARCADE.Aliens[i].bullets[j].pos.y, ARCADE.Aliens[i].bullets[j].w, ARCADE.Aliens[i].bullets[j].h);
                    if (p) {
                        this.currentHp -= ARCADE.Aliens[i].bullets[j].dmg;
                        ARCADE.Aliens[i].bullets.splice(j, 1);
                        HUD.ARCADE.updateHP(this.hp, this.currentHp);
                        this.canTakeDmg = false;
                        this.blink = true;
                        break;
                    }
                }
            }
        }

        if (this.canTakeDmg) {
            for (var i in ARCADE.Aliens) {
                let p = collideRectRect(this.pos.x, this.pos.y, this.w, this.h, ARCADE.Aliens[i].pos.x, ARCADE.Aliens[i].pos.y, ARCADE.Aliens[i].w, ARCADE.Aliens[i].h);
                if (p) {
                    this.currentHp -= floor(ARCADE.Aliens[i].dmg / 2);
                    ARCADE.Aliens[i].bullets.splice(j, 1);
                    HUD.ARCADE.updateHP(this.hp, this.currentHp);
                    this.canTakeDmg = false;
                    this.blink = true;
                    break;
                }
            }
        }

        if (!this.canTakeDmg) {
            if (this.ctdCD > 0) {
                console.log(this.ctdCD);
                this.ctdCD -= 1;
            } else {
                this.canTakeDmg = true;
                this.blink = false;
                this.ctdCD = this.defaultctdCD;
            }
        }

        if (this.keys["32"]) {
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
        this.bulletDraw();

        if (this.blink) {
            if (this.ctdCD % 5 == 0) {
                this.toggle = !this.toggle;
            }
        }

        if (this.toggle) {
            return true;
        } 
        
        fill(255, 0, 0);
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }

    ARCADE.Player.prototype.bulletDraw = function() {
        for (var i in this.bullets) {
            if (this.bullets[i].pos.x > width) {
                this.bullets.splice(i, 1);
            } else {

                let bulletCollide = false;

                for (var j in ARCADE.Asteroids) {
                    let p = collideRectCircle(this.bullets[i].pos.x, this.bullets[i].pos.y, this.bullets[i].w, this.bullets[i].h, ARCADE.Asteroids[j].pos.x, ARCADE.Asteroids[j].pos.y, ARCADE.Asteroids[j].size);
                    if (p) {

                        ARCADE.Asteroids[j].hpbarshowcd = 80;

                        if (!ARCADE.Asteroids[j].hit(this.bullets[i].dmg)) {
                            this.score += ARCADE.Asteroids[j].point;
    
                            HUD.ARCADE.updatePoint(this.score);
    
                            ARCADE.Asteroids.splice(j, 1);
                        }

                        bulletCollide = true;
                        break;
                    }
                }

                if (!bulletCollide) {
                    for (var j in ARCADE.Aliens) {
                        let p = collideRectRect(this.bullets[i].pos.x, this.bullets[i].pos.y, this.bullets[i].w, this.bullets[i].h, ARCADE.Aliens[j].pos.x, ARCADE.Aliens[j].pos.y, ARCADE.Aliens[j].w, ARCADE.Aliens[j].h);
                        if (p) {
    
                            ARCADE.Aliens[j].hpbarshowcd = 80;
    
                            if (!ARCADE.Aliens[j].hit(this.bullets[i].dmg)) {
                                this.score += ARCADE.Aliens[j].point;
        
                                HUD.ARCADE.updatePoint(this.score);
        
                                ARCADE.Aliens.splice(j, 1);
                            }
    
                            bulletCollide = true;
                            break;
                        }
                    }
                }

                if (bulletCollide) {
                    this.bullets.splice(i, 1);
                } else {
                    this.bullets[i].draw();
                }
                

                /*
                TRASH CODE
                this.bullets[i].sprite.overlap(ARCADE.Asteroids_S, function(collector, collected) {

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
                this.bullets[i].sprite.overlap(ARCADE.Aliens_S, function(collector, collected) {
                    let index = ARCADE.Aliens_S.indexOf(collected);
                    ARCADE.Aliens[index].hpbarshowcd = 80;

                    if (!ARCADE.Aliens[index].hit()) {
                        this_.score += ARCADE.Aliens[index].point;

                        HUD.ARCADE.updatePoint(this_.score);

                        ARCADE.Aliens.splice(index, 1);
                        ARCADE.Aliens_S.splice(index, 1);
                    }
                    
                    bulletCollide = true;
                });*/

            }
        }
    }

    ARCADE.Player.prototype.shoot = function() {
        if (!this.fired) {
            this.bullets.push(new ARCADE.Bullet(this.pos.x + this.w / 2, this.pos.y + this.h / 2, this.bulletMovement, this.dmg));
            this.fired = true;
            this.firedFrame = frameCount;
        }
    }

    //Bullets
    ARCADE.Bullet = function(x, y, d, dmg) {
        this.pos = createVector(x, y);
        this.w = 20;
        this.h = 5;
        this.dmg = dmg
        this.vel = d;
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
    }

    ARCADE.Asteroid.prototype.update = function() {
        this.pos.add(this.movement);  

        if (this.pos.x + this.size / 2 < 0) {
            let index = ARCADE.Asteroids.indexOf(this);

            ARCADE.Asteroids.splice(index, 1);
            //console.log(ARCADE.Asteroids.length);
            
            return false;
        }

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

    ARCADE.Asteroid.prototype.hit = function(dmg) {
        if (this.hp - dmg > 0) {
            this.hp -= dmg;
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
        this.bullets = [];
        this.bulletMovement = 5;
        this.fired = false;
        this.fireRate = floor(random(200, 300));
        this.firedFrame = null;
    }

    ARCADE.Alien.prototype.update = function() {
        this.pos.add(this.movement);

        if (this.pos.x + this.w < 0) {
            let index = ARCADE.Aliens.indexOf(this);

            ARCADE.Aliens.splice(index, 1);
            //console.log(ARCADE.Aliens.length, "Aliens");
            
            return false;
        }

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
            this.bullets.push(new ARCADE.Bullet(this.pos.x, this.pos.y + this.h / 2, -this.bulletMovement, this.dmg));
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

    ARCADE.Alien.prototype.hit = function(dmg) {
        if (this.hp - dmg > 0) {
            this.hp -= dmg;
            return true;
        } else {
            return false;
        }
    }
}