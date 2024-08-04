class BaseCharacter {
  constructor(name, pos, w, h, dampRate, health, hurtSound, deathSound, attackSound, normalRandomSound1, normalRandomSound2, cutsceneAttached=null, cutsceneOnceOnly=false) {
    this.name = name;
    // Animations
    this.idle_animation = [];
    this.walking_RIGHT_animation = [];
    this.sprinting_RIGHT_animation = [];
    this.attacking_RIGHT_animation = [];
    this.death_animation = [];
    this.hurt_animation = [];
    this.blood_animation = blood_animation;
    this.blood_index = 0;
    this.is_bleeding = false;
    this.currentAnimationIndex = 0;
    this.animationState = IDLE_STATE;
    this.is_looking_right = true;  // For flipping images
    this.currentImageRef = null;  // For getting the width and height
    
    // Movement
    this.pos = pos;
    this.dampRate = dampRate;
    this.vel = createVector();
    this.w = w;
    this.h = h;
    
    // health and rad
    this.radiationAmount = 0;
    this.health = health;
    this.shouldRemove = false;
    this.removeTimer = REMOVE_TIME_IN_SECONDS;
    this.canRecieveRadiation = false;
    this.canRecieveDamage = true;
    this.last_attack_type = RADIATION_ATTACK;

    // Sound
    this.hurtSound = hurtSound;
    this.deathSound = deathSound;
    this.attackSound = attackSound;
    this.normalRandomSound1 = normalRandomSound1;
    this.normalRandomSound2 = normalRandomSound2;
    this.normalRandomSoundTimer = round(random(MIN_RANDOM_CHARACTER_SOUND_IN_SECONDS, 4*MAX_RANDOM_CHARACTER_SOUND_IN_SECONDS));

    // Misc
    this.cutsceneAttached = cutsceneAttached;
    this.cutsceneOnceOnly = cutsceneOnceOnly;
    this.initAnims();
  }
  
  update() {
    if (keyHelp || keyMiniMap) return;
    if (this.shouldRemove) {
      this.handleRemove();
      return;
    }
    if (currentLevel.player != this) {
      if (!this.shouldDraw(currentLevel.player)) return;
    }
    
    if (!isGameOngoing()) {
      return;
    }
    
    
    
    this.handleAnimation();
    if (!this.isAlive()) return;
    this.handleRandomSound();
    this.handleRadiation();
    this.moveCharacter();
    this.handleCollisions();
  }

  handleCollisions() {
    for (let i = 0; i < currentLevel.NPCs.length; i++) {
      let npc = currentLevel.NPCs[i];
      this.handleCharacterCollision(npc);
    }
    for (let i = 0; i < currentLevel.gameMap.length; i++) {
      let tile = currentLevel.gameMap[i];
      tile.handleCollision(this);
    }
    for (let i = 0; i < currentLevel.doors.length; i++) {
      let door = currentLevel.doors[i];
      door.handleCollision(this);
    }
  }

  handleCharacterCollision(c, cRange=0) {
    if (c == this || !c.isAlive()) return;
    let diff = p5.Vector.sub(c.pos, this.pos);
    if (this.isOverlappingCharacter(c, diff, cRange)) {
      //c.reduceHealth();
      this.pos.x -= diff.x*0.09;
      this.pos.y -= diff.y*0.09;
      c.pos.x += diff.x*0.09;
      c.pos.y += diff.y*0.09;
      c.vel.mult(0.0);
      return true;
    }
    return false;
  }
  
  isOverlappingCharacter(c, diff=null, addition=0) {
    if (diff == null) {
      diff = p5.Vector.sub(c.pos, this.pos);
    }
    return (abs(diff.x) < (c.w/2 + this.w/2+addition) && abs(diff.y) < (c.h/2+this.h/2+addition/2));
  }

  initAnims(){}
  
  shouldDraw(player, mult=1) {
    return this.pos.dist(player.pos) <= mult*width;
  }

  getCharacterBeginningTopDraw() {
    return createVector(-(this.currentImageRef.width-(this.w))/2, -((this.currentImageRef.height-this.h))-(this.h/2));
  }

  removeFromGame() {
    const i = currentLevel.NPCs.indexOf(this);
    if (i < 0) return;
    currentLevel.NPCs.splice(i, 1);
  }

  handleRemove() {
    if (this.removeTimer <= 0) {
      this.removeFromGame();
      return;
    }
    this.removeTimer--;
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

  receiveDamageEffectHandle() {
    if (!this.is_bleeding) return null;
    if (!canPlayAnimaion()) return null;
    this.blood_index++;
    if (this.blood_index >= this.blood_animation.length-1) {
      this.is_bleeding = false;
      return;
    }
    return this.blood_animation[this.blood_index];
  }

  getDirectionTo(loc) {
    return loc.copy().sub(this.pos).normalize();
  }

  startBleeding() {
    if (!this.isAlive()) return;
    this.is_bleeding = true;
    this.blood_index = 0;
  }
  
  isInRange(player, mult=1) {
    return this.pos.dist(player.pos) < (NPC_RANGE*mult);
  }

  handleRandomSound() {
    if (this == currentLevel.player || !this.isAlive() || !this.isInRange(currentLevel.player, 1.2)) return;
    if (this.normalRandomSound1 == null || this.normalRandomSound2 == null) return;
    if (this.normalRandomSoundTimer <= 0) {
      this.normalRandomSoundTimer = round(random(MIN_RANDOM_CHARACTER_SOUND_IN_SECONDS, MAX_RANDOM_CHARACTER_SOUND_IN_SECONDS));
      if (this.normalRandomSound1 != null && this.normalRandomSound2 != null) {
        let s = round(random(1,2)) == 2 ? this.normalRandomSound2 : this.normalRandomSound1;
        s.stop();
        s.play();
      }
      else if (this.normalRandomSound1 != null) {
        this.normalRandomSound1.stop();
        this.normalRandomSound1.play();
      }
    }
    this.normalRandomSoundTimer--;
  }

  handleAnimation() {
    if (!canCharacterPlayAnimaion()) return;
    this.currentAnimationIndex++;
    if (this.animationState == DEATH_STATE) {
      if (this.currentAnimationIndex >= this.death_animation.length-1) {
        this.shouldRemove = true;
        this.currentImageRef = this.death_animation[this.death_animation.length-1];
        return;
      }
      this.currentImageRef = this.death_animation[this.currentAnimationIndex];
    }
    if (this.animationState == IDLE_STATE) {
      if (this.currentAnimationIndex >= this.idle_animation.length-1) {
        this.currentAnimationIndex = 0;
        this.animationState = IDLE_STATE;
      }
      this.currentImageRef = this.idle_animation[this.currentAnimationIndex];
    }
    if (this.animationState == HURT_STATE) {
      if (this.currentAnimationIndex >= this.hurt_animation.length-1) {
        this.currentAnimationIndex = 0;
        this.animationState = IDLE_STATE;
      }
      this.currentImageRef = this.hurt_animation[this.currentAnimationIndex];
    }
    if (this.animationState == WALKING_RIGHT_STATE || this.animationState == WALKING_LEFT_STATE) {
      if (this.currentAnimationIndex >= this.walking_RIGHT_animation.length-1) {
        this.currentAnimationIndex = 0;
        this.animationState = IDLE_STATE;
      }
      this.currentImageRef = this.walking_RIGHT_animation[this.currentAnimationIndex];
    }
    if (this.animationState == SPRINT_RIGHT_STATE || this.animationState == SPRINT_LEFT_STATE) {
      if (this.currentAnimationIndex >= this.sprinting_RIGHT_animation.length-1) {
        this.currentAnimationIndex = 0;
        this.animationState = IDLE_STATE;
      }
      this.currentImageRef = this.sprinting_RIGHT_animation[this.currentAnimationIndex];
    }
    if (this.animationState == ATTACKING_RIGHT_STATE || this.animationState == ATTACKING_LEFT_STATE) {
      if (this.currentAnimationIndex >= this.attacking_RIGHT_animation.length-1) {
        this.currentAnimationIndex = 0;
        this.animationState = IDLE_STATE;
      }
      this.currentImageRef = this.attacking_RIGHT_animation[this.currentAnimationIndex];
    }
  }
  
  changeAnimationState(animState) {
    if (this.animationState === animState) return;
    if (animState == WALKING_DOWN_STATE || animState == WALKING_UP_STATE) {
      animState = this.animationState;
    }
    this.animationState = animState;
    this.currentAnimationIndex = 0;
  }
  
  isAlive() {
    return this.health > 0;
  }
  
  moveCharacter() {
    this.pos.add(this.vel);
    this.vel.mult(this.dampRate);
  }
  
  accelerate(acc, sprinting=false) {
    this.vel.add(acc);
    if (this.animationState == ATTACKING_RIGHT_STATE) return;
    this.changeAnimationState(sprinting ? SPRINT_RIGHT_STATE : WALKING_RIGHT_STATE);
  }
    
  attack() {
    this.changeAnimationState(ATTACKING_RIGHT_STATE);
    if (this.attackSound == null) return;
    this.attackSound.stop();
    this.attackSound.play();
  }
  
  die() {
    this.changeAnimationState(DEATH_STATE);
    this.deathSound.stop();
    this.deathSound.play();
  }
  
  reduceHealth(amount=1, attack_type=ENEMY_ATTACK, bForced=false, bSound=true) {
    if (!this.isAlive()) return;
    if (!bForced) {
      if (this.last_attack_type == attack_type) {
        if (!this.canRecieveDamage) return;
      }
    }
    this.last_attack_type = attack_type;
    this.health -= amount;
    if (!this.isAlive()) {
      this.die();
      return;
    }
    this.startBleeding();
    if (bSound) {
      this.hurtSound.stop();
      this.hurtSound.play();
    }
    
    
    if (this.animationState === IDLE_STATE) this.changeAnimationState(HURT_STATE);
  }
  
  reduceRadiation(amount=1) {
    if (this.radiationAmount <= 0) return false;
    this.radiationAmount -= amount;
    if (this.radiationAmount < 0) this.radiationAmount = 0;
    return true;
  }
  
  applyRadiation(amount=1) {
    if (!this.canRecieveRadiation) return;
    this.radiationAmount += amount;
    if (this.radiationAmount > MAX_RADIATION_ALLOWED) this.radiationAmount = MAX_RADIATION_ALLOWED;
  }
  
  handleRadiation() {
    if (this.canRecieveRadiation) {
      if (this.radiationAmount > 0) {
        this.reduceHealth(map(this.radiationAmount, 0, MAX_RADIATION_ALLOWED, 0, RADIATION_MAX_DAMAGE_RATE), RADIATION_ATTACK, false);
      }
      this.reduceRadiation(RADIATION_DECREASE_RATE);
    }
    
  }

  addHealth(amount=1) {
    this.health += amount;
    if (this.health > MAX_PLAYER_HEALTH) this.health = MAX_PLAYER_HEALTH;
  }
  
  getDifferenceToPlayer(player) {
    if (player == null) return;
    return this.pos.dist(player.pos);
  }

  hasCutscene() {
    return this.cutsceneAttached != null;
  }

  cutsceneEnd() {
    if (this.cutsceneOnceOnly) {
      this.cutsceneAttached = null;
    }
  }

  inInteractRange(mPos, isNpc=false, c) {
    if (isNpc) {
      return this.isOverlappingCharacter(c, p5.Vector.sub(c.pos, this.is_looking_right ? this.pos.copy().add(createVector(PLAYER_INTERACT_RADIUS*1.8, 0)) : this.pos.copy().sub(createVector(PLAYER_INTERACT_RADIUS*1.8, 0))));
    }
    return abs(this.pos.x - mPos.x) < (this.w/2+PLAYER_INTERACT_RADIUS) && abs(this.pos.y - mPos.y) < (this.h/2+PLAYER_INTERACT_RADIUS);
  }
}