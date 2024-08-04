class Projectile {
    constructor(pos, vel, is_right, owner, animation=[bullet_img], dmgType=BULLET_DAMAGE) {
        this.pos = pos;
        this.vel = vel;
        this.animation = animation;
        this.damageType = dmgType;
        this.owner = owner;
        this.is_right = is_right;
        this.currentImgIndex = 0;
        this.currentImgRef = this.animation[0];
    }

    isAnimated() {
        this.animation.length > 1;
    }

    update() {
        if (keyHelp || keyMiniMap) return;
        if (this.isAnimated()) {
            if(canPlayAnimaion(2)) {
                this.currentImgIndex++;
                if (this.currentImgIndex >= this.animation.length) this.currentImgIndex = 0;
                this.currentImgRef = this.animation[this.currentImgIndex];
            }
        }
        this.pos.add(this.vel);
        for (let i = 0; i < currentLevel.NPCs.length; i++) {
            let npc = currentLevel.NPCs[i];
            if (!this.hitCharacter(npc)) continue;
            // npc.startBleeding();
            npc.reduceHealth(this.damageType, 99);
            this.destroyMe();
            return;
        }
        if (this.owner != currentLevel.player) {
            const playerResult = this.hitCharacter(currentLevel.player, true);
            if (playerResult) {
                // currentLevel.player.startBleeding();
                collision_object_generic_sound.stop();
                collision_object_generic_sound.play();
                currentLevel.player.reduceHealth(this.damageType, 1, true);
                this.destroyMe();
                return;
            }
        }
        for (let i = 0; i < currentLevel.gameMap.length; i++) {
            let tile =  currentLevel.gameMap[i];
            if (!tile.handleProjectileCollision(this)) continue;
            collision_object_generic_sound.stop();
            collision_object_generic_sound.play();
            this.destroyMe();
            return;
        }
        for (let i = 0; i < currentLevel.doors.length; i++) {
            let door =  currentLevel.doors[i];
            if (!door.handleProjectileCollision(this)) continue;
            collision_object_generic_sound.stop();
            collision_object_generic_sound.play();
            this.destroyMe();
            return;
        }
    }

    destroyMe() {
        this.owner.projectiles.splice(this.owner.projectiles.indexOf(this), 1);
    }

    hitCharacter(c) {
        if (c == this.owner || !c.isAlive()) return false;
        const diff = p5.Vector.sub(c.pos, this.pos);
        const bResult = (abs(diff.x) < (c.w/2 + this.currentImgRef.width/2) && abs(diff.y) < (c.h/2+this.currentImgRef.height/2));
        return bResult;
    }

    hitTile(t) {
        if (!t.collision_enabled) return false;
        const diff = p5.Vector.sub(t.pos, this.pos);
        return (abs(diff.x) < (t.w/2 + this.currentImgRef.width/2) && abs(diff.y) < (t.h/2+this.currentImgRef.height/2));
    }
    
    drawMe(player) {
        if (!this.shouldDraw(player)) return;
        push();
        translate(getDrawLocationTranslate(player, this.pos));
        if (!this.is_right) scale(-1, 1);
        image(this.currentImgRef, 0, 0);
        pop();
    }

    shouldDraw(player) {
        return this.pos.dist(player.pos) <= width;
    }
}
