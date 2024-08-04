class Enemy2 extends BaseEnemy {
    constructor(name, pos, w, h, dampRate, health, hurtSound, deathSound, attackSound, normalRandomSound1, normalRandomSound2, cutsceneAttached=null, cutsceneOnceOnly=false, itemDropOnDeath="", itemDropAnimation=[], isVillified=true) {
        super(name, pos, w, h, dampRate, health, hurtSound, deathSound, attackSound, normalRandomSound1, normalRandomSound2, cutsceneAttached, cutsceneOnceOnly, itemDropOnDeath, itemDropAnimation, isVillified);
        this.min_speed = 0.5;
        this.max_speed = 0.8;
        this.rangeMult = ENEMY_RANGE_MULT*2;
    }

    handleCollisions() {
    }
    
    initAnims() {
        this.idle_animation = enemy2_idle_1_animaion;
        this.walking_RIGHT_animation = enemy2_walk_animaion;
        this.sprinting_RIGHT_animation = enemy2_run_animaion;
        this.attacking_RIGHT_animation = enemy2_attack_1_animaion;
        this.attacking_2_animation = enemy2_attack_2_animaion;
        this.death_animation = enemy2_dead_animaion;
        this.hurt_animation = enemy2_hurt_animaion;
        this.currentImageRef = this.idle_animation[0];
    }

    drawMe(player) {
        if (!this.shouldDraw(player)) return;
        const v = getCharacterBeginningTopDraw(this);
        push();
        translate(getDrawLocationTranslate(player, this.pos));
        // scale(1.04, 1.04);
        noTint();
        if (!this.is_looking_right) scale(-1, 1);
        tint(255, 127);
        image(this.currentImageRef, v.x, v.y);
        // image(this.currentImageRef, -this.currentImageRef.width/2, -this.currentImageRef.height/2);
        const blood_result = this.receiveDamageEffectHandle();
        if (blood_result != null) {
          image(blood_result, -blood_result.width/2, -blood_result.height/2);
        }
        pop();
      }
}