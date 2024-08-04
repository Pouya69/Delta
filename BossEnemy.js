class BossEnemy extends BaseEnemy {
  constructor(name, pos, w, h, dampRate, health, hurtSound, deathSound, attackSound, normalRandomSound1, normalRandomSound2, cutsceneAttached=null, cutsceneOnceOnly=false, itemDropOnDeath="", itemDropAnimation=keycard_animation, isVillified=false) {
    super(name, pos, w, h, dampRate, health, hurtSound, deathSound, attackSound, normalRandomSound1, normalRandomSound2, cutsceneAttached, cutsceneOnceOnly, itemDropOnDeath, itemDropAnimation, isVillified)
    this.canRecieveDamage = true;
    this.shieldTimer = round(random(MIN_BOSS_SHIELD_DOWN_IN_SECONDS, MAX_BOSS_SHIELD_DOWN_IN_SECONDS));
    //this.shootTimer = 
    this.combatMode = DEFENSIVE;
    this.lightsTimer = BOSS_TURNOFF_LIGHTS_IN_SECONDS;
    this.currentTargetLocationIndex = 0;
    this.talkSoundTimer = BOSS_TALK_SOUND_TIMER_IN_SECONDS;
    this.hasTalked = false;
    this.isRunning = false;
    this.rageTimer = BOSS_RAGE_TIME_IN_SECONDS;
    this.defensiveTimer = BOSS_DEFENSIVE_TIME_IN_SECONDS;
    this.projectiles = [];
    this.shootTimer = BOSS_SPECIAL_SHOOT_IN_SECONDS;
  }

  update() {
    if (keyHelp || keyMiniMap) return;
    if (this.shouldRemove) {
      this.handleRemove();
      return;
    }
    this.handleAnimation();
    if (currentLevel.player != this) {
      if (!this.shouldDraw(currentLevel.player)) return;
    }
    
    if (!isGameOngoing()) {
      return;
    }
    
    if (!this.isAlive()) return;
    this.handleProjectiles();
    this.handleShield();
    this.handleTalkSoundTimer();
    this.handleStopping();
    this.handleAIMovement(currentLevel.player);
    // this.handleRandomSound();
    this.moveCharacter();
    this.handleCollisions();
  }

  isAtLocation(loc, acceptance=100) {
    return loc.dist(this.pos) < acceptance;
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

  
  startBleeding() {
    if (!has_bossfight_started) level_boss.initializeBossFight();
    has_bossfight_started = true;
    this.isVillified = true;
    boss_hurt_sound.play();
    super.startBleeding();
  }

  handleAIMovement(player) {
    if (!this.isVillified) {
      this.defaultMovement(player);
      return;
    }
    // In bossfight
    this.handleCombat();
  }

  handleCombat() {
    if (this.combatMode > 2) this.combatMode = 0;
    this.handleLookDirection();
    if (this.combatMode == RAGE) {
      const bShouldChangeCombatMode = this.handleRage();
      if (bShouldChangeCombatMode) this.combatMode++;
    }
    else if (this.combatMode == DEFENSIVE) {
      const bShouldChangeCombatMode = this.handleDefensive();
      if (bShouldChangeCombatMode) {
        this.combatMode++;
        this.isRunning = round(random(1,4)) > 1;
      }
      else {
        this.canRecieveDamage = false;
      }
    }
    else if (this.combatMode == NORMALMODE) {
      const bShouldChangeCombatMode = this.handleNormal();
      if (bShouldChangeCombatMode) this.combatMode++;
    }
    this.handleShootingPlayer();
    this.handleTurnOffLights();
  }

  handleTurnOffLights() {
    if (this.combatMode != DEFENSIVE) return;
    if (this.lightsTimer <= 0) {
      boss_lights_out_sound.stop();
      boss_lights_out_sound.play();
      for (let i = 0; i < currentLevel.lights.length; i++) {
        currentLevel.lights[i].is_on = false;
      }
      this.lightsTimer = BOSS_TURNOFF_LIGHTS_IN_SECONDS;
      return;
    }
    this.lightsTimer--;
  }

  handleProjectiles() {
    for (let i = 0; i < this.projectiles.length; i++) {
      let p = this.projectiles[i];
      p.drawMe(currentLevel.player);
      p.update();
    }
  }

  handleShootingPlayer() {
    if (this.combatMode != RAGE && currentLevel.isDark) return;  // Will not shoot when the environment is dark
    // const bShouldPlaySound = round(random(1,2)) == 1;
    if (this.canTalk()) {
      this.talk(boss_say_die_sound);
    }
    // TODO: SHOOT THE PLAYER
    if (this.combatMode == RAGE) {
      // Shoot special projectile
      if (this.shootTimer <= 0) {
        this.shootTimer = BOSS_SPECIAL_SHOOT_IN_SECONDS;
        this.projectiles.push(new BossProjectile(this.pos.copy(), this.getDirectionTo(currentLevel.player.pos).mult(5), false, this));
        this.changeAnimationState(ATTACKING_RIGHT_STATE);
        player_rocket_shoot_sound.stop();
        player_rocket_shoot_sound.play();
        return;
      }
      this.shootTimer--;
    }
    else if (this.combatMode == DEFENSIVE) {
      if (this.shootTimer <= 0) {
        this.shootTimer = BOSS_RAPID_SHOOT_IN_SECONDS;
        this.projectiles.push(new Projectile(this.pos.copy(), this.getDirectionTo(currentLevel.player.pos).mult(20), this.is_looking_right, this, [bullet_img], BULLET_DAMAGE*5));
        this.changeAnimationState(ATTACKING_RIGHT_STATE);
        player_rifle_shoot_sound.stop();
        player_rifle_shoot_sound.play();
        return;
      }
      this.shootTimer--;
    }
  }

  handleRage() {
    if (this.rageTimer <= 0) {
      this.rageTimer = BOSS_RAGE_TIME_IN_SECONDS;
      return true;
    }
    if (this.canTalk()) {
      const bShouldTalk = round(random(1,2)) == 1;
      if (bShouldTalk) {
        this.talk(boss_rage_sound);
      }
    }
    this.rageTimer--;
    return false;
  }

  handleDefensive() {
    if (this.defensiveTimer <= 0) {
      this.defensiveTimer = BOSS_DEFENSIVE_TIME_IN_SECONDS;
      return true;
    }
    this.accelerate(this.getDirectionTo(currentLevel.player.pos).mult(-BOSS_DEFENSIVE_SPEED));
    this.defensiveTimer--;
    return false;
  }

  handleNormal() {
    // Move between the locations
    const loc = BOSS_MOVEMENT_LOCATIONS[this.currentTargetLocationIndex];
    if (this.isAtLocation(loc)) {
      this.currentTargetLocationIndex++;
      if (this.currentTargetLocationIndex >= BOSS_MOVEMENT_LOCATIONS.length-1) this.currentTargetLocationIndex = 0;
      return true;
    }
    // Is moving to location
    this.accelerate(this.getDirectionTo(loc).mult(this.isRunning ? BOSS_SPRINT_SPEED : BOSS_NORMAL_SPEED));
    return false;
  }

  handleTalkSoundTimer() {
    if (!this.hasTalked) return;
    if (this.talkSoundTimer <= 0) {
      this.talkSoundTimer = BOSS_TALK_SOUND_TIMER_IN_SECONDS;
      this.hasTalked = false;
    }
    this.talkSoundTimer--;
  }

  canTalk() {
    return this.hasTalked == false;
  }

  talk(s) {
    s.stop();
    s.play();
    this.hasTalked = true;
  }

  defaultMovement(player) {
    if (!this.isInRange(player)) {
      this.handleChangeDirection();
      if (this.should_move) {
        this.accelerate(this.AIAcceleration);
        return false;
      }
    }
    else {
      this.handleLookDirection();
      return true;
    }
  }

  handleLookDirection() {
    this.is_looking_right = this.pos.x < currentLevel.player.pos.x;
  }

  handleShield() {
    if (!this.isVillified) return;
    if (this.shieldTimer <= 0) {
      this.canRecieveDamage = !this.canRecieveDamage;
      this.shieldTimer = !this.canRecieveDamage ? BOSS_SHIELD_UP_IN_SECONDS : round(random(MIN_BOSS_SHIELD_DOWN_IN_SECONDS, MAX_BOSS_SHIELD_DOWN_IN_SECONDS));
    }
    this.shieldTimer--;
  }

  handleCharacterCollision(c) {
    if (c == this || !this.isOverlappingCharacter(c, null, 40) || !this.isVillified) return;
    this.handleAttackPlayer(c);
    c.startBleeding();
  }

  handleAttackPlayer(c) {
    this.changeAnimationState(ATTACKING_RIGHT_STATE);
    c.reduceHealth(1, 55);
  }

  die() {
    level_boss.items.push(new PickableItemOnce(this.pos.copy(), "Control Room Key", this.itemDropAnimation));
    if (!this.has_dropped_item) {
      let v = this.getDirectionTo(currentLevel.player.pos).mult(100);
      level_boss.items.push(new PickableItemOnce(this.pos.copy().add(v), "Master Key", this.itemDropAnimation));  
    }
    level_boss.ambienceMusic.stop();
    boss_death_sound.stop();
    boss_death_sound.play();

    super.die();
  }

  interactNPC(player) {
    if (this.isVillified) return false;
    return super.interactNPC(player);
  }

  drawMe(player) {
    if (!this.shouldDraw(player)) return;
    const v = getCharacterBeginningTopDraw(this);
    push();
    // scale(1.04, 1.04);
    noTint();
    translate(getDrawLocationTranslate(player, this.pos));
    translate(v.mult(0.8));
    
    if (!this.is_looking_right) scale(-1, 1);
    translate(30, -10);
    scale(3,3);
    // image(this.currentImageRef, 0, 0);
    image(this.currentImageRef, -this.currentImageRef.width/2, -this.currentImageRef.height/2);
    const blood_result = this.receiveDamageEffectHandle();
    if (blood_result != null) {
      image(blood_result, -blood_result.width/2, -blood_result.height/2);
    }
    pop();
    if (this.canRecieveDamage) return;
    push();
    translate(getDrawLocationTranslate(player, this.pos));
    stroke(0);
    strokeWeight(2);
    fill(100, 100, 100, 200);
    rect(-this.w/2, -this.h/2, this.w, this.h);
    fill(255, 255, 255, 100);
    translate(0, -15);
    triangle(0, 0, 5, 15, -5, 15);
    pop();
  }

  initAnims() {
    this.idle_animation = boss_idle_animaion;
    this.walking_RIGHT_animation = boss_walk_animaion;
    this.sprinting_RIGHT_animation = null;
    this.attacking_RIGHT_animation = boss_attack_animaion;
    this.death_animation = boss_death_animaion;
    this.hurt_animation = boss_hurt_animaion;
    this.currentImageRef = this.idle_animation[0];
  }
}
