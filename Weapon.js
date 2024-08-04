class Weapon {
    constructor(owner, name, offset) {
        this.owner = owner;
        this.name = name;
        this.offset = offset;
    }

    shoot(shootLocation, direction, is_right) {}
    drawMe(characterCenterLocation, is_right) {}
}

class WeaponRocket extends Weapon {
    constructor(owner, name="RPG") {
        super(owner, name, createVector(20, 2));
    }
    shoot(shootLocation, direction, is_right) {
        let projectile = new RocketProjectile(shootLocation, direction.mult(ROCKET_SPEED), is_right, this.owner);
        this.owner.projectiles.push(projectile);
        player_rocket_shoot_sound.stop();
        player_rocket_shoot_sound.play();
    }

    drawMe(characterCenterLocation, is_right) {
        push();
        translate(PLAYER_FIXED_POSITION);
        translate(this.offset);
        
        if (!is_right) {
            translate(-30, 0);
            scale(-1, 1);
        }
        rotate(PI/4);
        scale(2.5, 2.5);
        image(RPG_Icon, -RPG_Icon.width/2, -RPG_Icon.height/2);
        pop();
    }
}

class WeaponRifle extends Weapon {
    constructor(owner, name="Rifle") {
        super(owner, name, createVector(0, 0));
    }
    shoot(shootLocation, direction, is_right) {
        let projectile = new Projectile(shootLocation, direction.mult(BULLET_SPEED), is_right, this.owner);
        this.owner.projectiles.push(projectile);
        player_rifle_shoot_sound.stop();
        player_rifle_shoot_sound.play();
    }

}