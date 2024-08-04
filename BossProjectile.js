class BossProjectile extends RocketProjectile {
    constructor(pos, vel, is_right, owner, animation=boss_projectile_animation, dmgType=ROCKET_DAMAGE) {
        super(pos, vel, is_right, owner, animation, dmgType);
        this.movementRadius = 100;
        this.currentDegree = 0;
        this.lifeTime = 10*getTargetFrameRate();
    }

    hitCharacter(c) {
        if (!c.isAlive() || c == this.owner) return false;
        let realPos = this.getRealLocation();
        const diff = p5.Vector.sub(c.pos, realPos);
        const bResult = (abs(diff.x) < (c.w/2 + this.currentImgRef.width/2) && abs(diff.y) < (c.h/2+this.currentImgRef.height/2));
        return bResult;
    }

    update() {
        if (keyHelp || keyMiniMap) return;
        this.lifeTime--;
        if (!this.isAlive()) {
            this.destroyMe();
            return;
        }
        this.accelerate();
        this.pos.add(this.vel);
        const playerResult = this.hitCharacter(currentLevel.player, true);
        if (playerResult) {
            currentLevel.player.startBleeding();
            currentLevel.player.reduceHealth(this.damageType*5, 150, true);
            this.destroyMe();
            return;
        }
    }

    accelerate() {
        // if(this.vel.mag() <)
        this.movementRadius += 0.1;
        this.currentDegree += 0.1;
    }

    isAlive() {
        return this.lifeTime > 0;
    }

    getRealLocation() {
        let mPos = this.pos.copy();
        mPos.x += this.movementRadius*cos(this.currentDegree);
        mPos.y += this.movementRadius*sin(this.currentDegree);
        return mPos;
    }

    drawMe(player) {
        if (!this.shouldDraw(player)) return;
        push();
        translate(getDrawLocationTranslate(player, this.getRealLocation()));
        image(this.currentImgRef, 0, 0);
        pop();
    }

    destroyMe() {
        this.detonate();
        currentLevel.explosions.push(new Explosion(this.getRealLocation()));
        this.owner.projectiles.splice(this.owner.projectiles.indexOf(this), 1);
    }

    detonate() {
    }
    
}