class RocketProjectile extends Projectile {
    constructor(pos, vel, is_right, owner, animation=[rocket_img], dmgType=ROCKET_DAMAGE) {
        super(pos, vel, is_right, owner, animation, dmgType);
    }

    destroyMe() {
        this.detonate();
        currentLevel.explosions.push(new Explosion(this.pos.copy()));
        super.destroyMe();
    }

    detonate() {
        for (let i = 0; i < currentLevel.NPCs.length; i++) {
            let npc = currentLevel.NPCs[i];
            if (!npc.isAlive()) continue;
            if (npc.pos.dist(this.pos) > EXPLOSION_RADIUS+npc.w) continue;
            if (npc.canRecieveDamage) {
                npc.startBleeding();
                npc.reduceHealth(this.damageType);
            }
            
        }
        if (!currentLevel.player.isAlive()) return;
        if (currentLevel.player.pos.dist(this.pos) <= EXPLOSION_RADIUS) {
            currentLevel.player.startBleeding();
            currentLevel.player.reduceHealth(this.damageType, 150, true);
        }
    }

    hitCharacter(c) {
        if (!c.isAlive()) return false;
        const diff = p5.Vector.sub(c.pos, this.pos);
        const bResult = (abs(diff.x) < (c.w/2 + this.currentImgRef.width/2) && abs(diff.y) < (c.h/2+this.currentImgRef.height/2));
        return bResult;
    }

    update() {
        if (keyHelp || keyMiniMap) return;
        this.pos.add(this.vel);
        for (let i = 0; i < currentLevel.NPCs.length; i++) {
            let npc = currentLevel.NPCs[i];
            if (!this.hitCharacter(npc)) continue;
            // npc.startBleeding();
            this.destroyMe();
            return;
        }
        if (this.owner != currentLevel.player) {
            const playerResult = this.hitCharacter(currentLevel.player, true);
            if (playerResult) {
                // currentLevel.player.startBleeding();
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
}