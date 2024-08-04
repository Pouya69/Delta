class BaseEnemy extends BaseNPC {
  constructor(name, pos, w, h, dampRate, health, hurtSound, deathSound, attackSound, normalRandomSound1, normalRandomSound2, cutsceneAttached=null, cutsceneOnceOnly=false, itemDropOnDeath="", itemDropAnimation=[], isVillified=true) {
    super(name, pos, w, h, dampRate, health, hurtSound, deathSound, attackSound, normalRandomSound1, normalRandomSound2, cutsceneAttached, cutsceneOnceOnly, itemDropOnDeath, itemDropAnimation);
    super.playerCollisionEnabled = true;
    this.isVillified = isVillified;
    this.attacking_2_animation = null;
    this.min_speed = 2;
    this.max_speed = 3;
    this.rangeMult = ENEMY_RANGE_MULT;
    this.attackDelay = 0;
  }

  update() {
    if (!this.shouldDraw(currentLevel.player, 0.9)) {
      currentLevel.NPCs.splice(currentLevel.NPCs.indexOf(this), 1);
      return;
    }
    super.update();
    if (!this.isAlive()) return;
  }

  handleAIMovement(player) {
    const bPlayerInRange = super.handleAIMovement(player, this.rangeMult);
    if (!bPlayerInRange) return;
    this.AIAcceleration = this.getDirectionToPlayer(currentLevel.player).mult(random(this.min_speed, this.max_speed));
    this.accelerate(this.AIAcceleration);
  }

  getDirectionToPlayer(player) {
    return player.pos.copy().sub(this.pos).normalize();
  }

  handleAttackPlayer(c) {
    if (this.attackDelay <= 0) {
      this.changeAnimationState(ATTACKING_RIGHT_STATE);
      c.reduceHealth(10, ENEMY_ATTACK, false, (c.radiationAmount <= 0));
      this.attackDelay = ENEMY_ATTACK_DELAY_IN_SECONDS;
      return;
    }
    this.attackDelay--;
  }

  drawMe(player) {
    if (!this.shouldDraw(player)) return;
    const v = getCharacterBeginningTopDraw(this);
    push();
    translate(getDrawLocationTranslate(player, this.pos));
    // scale(1.04, 1.04);
    noTint();
    if (!this.is_looking_right) scale(-1, 1);
    image(this.currentImageRef, v.x, v.y);
    // image(this.currentImageRef, -this.currentImageRef.width/2, -this.currentImageRef.height/2);
    const blood_result = this.receiveDamageEffectHandle();
    if (blood_result != null) {
      image(blood_result, -blood_result.width/2, -blood_result.height/2);
    }
    pop();
  }

  handleCharacterCollision(c) {
    if (c != currentLevel.player || !this.isVillified) return false;
    let diff = p5.Vector.sub(c.pos, this.pos);
    if (this.isOverlappingCharacter(c, diff)) {
      //c.reduceHealth();
      this.pos.x -= diff.x*0.12;
      this.pos.y -= diff.y*0.12;
      c.pos.x += diff.x*0.02;
      c.pos.y += diff.y*0.02;
      c.vel.mult(0.0);
      this.handleAttackPlayer(c);
      return true;
    }
    return false;
  }
  
  

  die() {
    // Drop a random item
    currentLevel.spawnRandomConsumableAtLocation(this.pos, true);
    super.die();
  }

  handleCollisions() {
    for (let i = 0; i < currentLevel.gameMap.length; i++) {
      let tile = currentLevel.gameMap[i];
      tile.handleCollision(this);
    }
    for (let i = 0; i < currentLevel.doors.length; i++) {
      let door = currentLevel.doors[i];
      door.handleCollision(this);
    }
  }

  initAnims() {
    this.idle_animation = enemy1_idle_1_animaion;
    this.walking_RIGHT_animation = enemy1_walk_animaion;
    this.sprinting_RIGHT_animation = enemy1_run_animaion;
    this.attacking_RIGHT_animation = enemy1_attack_1_animaion;
    this.attacking_2_animation = enemy1_attack_2_animaion;
    this.death_animation = enemy1_dead_animaion;
    this.hurt_animation = enemy1_hurt_animaion;
    this.currentImageRef = this.idle_animation[0];
  }
}