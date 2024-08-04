class PlayerCharacter extends BaseCharacter {
  constructor(name, pos, w, h, dampRate=0.8, health=MAX_PLAYER_HEALTH, hurtSound=player_hurt_sound, deathSound=player_death_sound, attackSound=null, normalRandomSound1=null, normalRandomSound2=null) {
    super(name, pos, w, h, dampRate, health, hurtSound, deathSound, attackSound, normalRandomSound1, normalRandomSound2);
    this.lives = MAX_PLAYER_LIVES;
    this.is_flashlight_on = false;
    this.hasFlashlight = false;
    this.flashlight_battery = FLASHLIGHT_MAXIMUM_BATTERY / 2;
    this.canRecieveRadiation = true;
    this.stamina = MAX_PLAYER_STAMINA;
    this.rocketsNum = 0;
    this.bullets = STARTING_BULLETS_NUM;
    this.baseSpeed = PLAYER_BASE_SPEED;
    this.totalRadInArea = 0;
    this.hazmatResistance = 0;
    this.weapons = [new WeaponRifle(this)];
    this.currentWeapon = this.weapons[0];
    this.shootLocationOffsetFIXED = createVector(0, -this.h/2+10);  // Test this
    this.shootLocationOffset = createVector(this.w/2, 0);  // Test this
    this.inventory = [];
    this.projectiles = [];
    this.invincibleTimer = 0;
    this.removeTimer = round(REMOVE_TIME_IN_SECONDS/3);
  }
  
  drawMe(player) {
    const v = getCharacterBeginningTopDraw(this);
    push();
    translate(PLAYER_FIXED_POSITION);
    // scale(1.04, 1.04);
    if (this.hasHazmatSuitOn()) {
      tint(255, 0, 255, 180);
    }
    else {
      noTint();
    }
    if (!this.is_looking_right) {
      scale(-1, 1);
    }
    image(this.currentImageRef, v.x, v.y);
    const blood_result = this.receiveDamageEffectHandle();
    if (blood_result != null) {
      image(blood_result, -blood_result.width/2, -blood_result.height/2);
    }
    pop();
    if (this.currentWeapon != null) {
      this.drawWeapon(this.pos);
    }
    push();
    translate(PLAYER_FIXED_POSITION);
    // translate(v);
    pop();
  }

  drawWeapon(location) {
    this.currentWeapon.drawMe(location, this.is_looking_right);
  }

  update() {
    if (keyHelp || keyMiniMap) return;
    super.update();
    if (!this.isAlive()) return;
    this.handleControls();
    this.handleFlashLight();
    this.handleRadAreas();
    this.handleInvincible();
    this.handleProjectiles();
    this.handleStamina();
  }

  getAreaRadiation() {
    return round(300*this.totalRadInArea,2);
  }
  
  initAnims() {
    this.idle_animation = player_idle_animaion;
    this.walking_RIGHT_animation = player_walk_animaion;
    this.sprinting_RIGHT_animation = player_run_animaion;
    this.attacking_RIGHT_animation = player_shoot_animaion;
    this.death_animation = player_dead_animaion;
    this.hurt_animation = player_hurt_animaion;
    this.currentImageRef = this.idle_animation[0];
  }
  
  handleControls() {
    if (!this.isAlive()) return;
    const bSprint = this.baseSpeed > PLAYER_BASE_SPEED;
    if (keyUp) {
      this.accelerate(upVector, bSprint);
    }
    if (keyDown) {
      this.accelerate(downVector, bSprint);
    }
    if (keyRight) {
      this.accelerate(rightVector, bSprint);
      this.is_looking_right = true;
    }
    if (keyLeft) {
      this.accelerate(leftVector, bSprint);
      this.is_looking_right = false;
    }
    if (keySprint) {
      this.sprint();
    }
    else {
      this.stopSprint();
    }
  }

  accelerate(acc, sprinting=false) {
    super.accelerate(acc.copy().mult(this.baseSpeed), sprinting);
  }

  interact() {
    // Only checks NPC and doors and items
    for (let i = 0; i < currentLevel.items.length; i++) {
      let item = currentLevel.items[i]; 
      if (!this.inInteractRange(item.pos)) continue;
      const bResult = item.use(this);
      if (bResult) return;
    }
    for (let i = 0; i < currentLevel.NPCs.length; i++) {
      let npc = currentLevel.NPCs[i];
      if (currentLevel.name === "level_boss") {
        if (!this.inInteractRange(npc.pos, true, npc)) continue;
      }
      else {
        if (!this.inInteractRange(npc.pos)) continue;
      }
      const bResult = npc.interactNPC(this);
      if (bResult) return;
    }
    for (let i = 0; i < currentLevel.doors.length; i++) {
      let door = currentLevel.doors[i];
      if (!this.inInteractRange(door.pos)) continue;
      const bResult = door.interactDoor(this);
      if (bResult) return;
    }
    for (let i = 0; i < currentLevel.lights.length; i++) {
      let light = currentLevel.lights[i]; 
      if (!this.inInteractRange(light.pos)) continue;
      const bResult = light.use(this);
      if (bResult) return;
    }
  }

  sprint() {
    if (this.stamina <= 0) {
      this.stopSprint();
      keySprint = false;
      return;
    }
    this.baseSpeed = PLAYER_SPRINT_SPEED_MULTIPLIER*PLAYER_BASE_SPEED;
  }

  stopSprint() {
    this.baseSpeed = PLAYER_BASE_SPEED;
  }

  removeFromGame() {
    // Respawn
  }

  die() {
    this.lives--;
    if (this.lives < 0) {
      super.die();
    }
    else {
      respawnPlayer(this);
    }
  }

  handleFlashLight() {
    /** Will not use this... Causes everything to crash due to high processing... */
    // Handle Dark

    if (!isGameOngoing()) return;
    if (this.is_flashlight_on) {
      if (this.flashlight_battery <= 0) {
        this.is_flashlight_on = false;
      }
      else {
        this.flashlight_battery--;
      }
    }
    return;
    /*
    // These are things that get drawn before the effect
    push();
    fill(255, 0, 0);
    rect(0, 0, width, height);
    fill(0, 255, 100);
    rectMode(CENTER);
    rect(width/2, height/2, 200, 50);
    pop();*/
    loadPixels();
    // img.loadPixels();
    for (var y = 0; y < height; y++ ) {
      for (var x = 0; x < width; x++ ) {
        const loc = (x + y * width) * 4;
        var r = pixels[loc];
        var g = pixels[loc + 1];
        var b = pixels[loc + 2];
        const distance = dist(x, y, this.pos.x, this.pos.y);
        const adjustBrightness = currentLevel.isDark ? ((this.isAlive() && this.is_flashlight_on) ? map(distance, 0, FLASHLIGHT_RADIUS, 1, 0) : 0) : ((this.isAlive() && this.is_flashlight_on) ? map(distance, 0, FLASHLIGHT_RADIUS, 2, 1) : 1);
        r *= adjustBrightness;
        g *= adjustBrightness;
        b *= adjustBrightness;

        r = constrain(r, 0, 255);
        g = constrain(g, 0, 255);
        b = constrain(b, 0, 255);
        
        pixels[loc] = r;
        pixels[loc + 1] = g;
        pixels[loc + 2] = b;
        pixels[loc + 3] = 255;
      }
    }
    updatePixels();
    // Everything drawn after is not affected by flashlight
    // rect(200, 20, 50, 50);
  }

  handleRadAreas() {
    this.totalRadInArea = 0;
    for (let i = 0; i < currentLevel.radiation_areas.length; i++) {
      let radArea = currentLevel.radiation_areas[i];
      // radArea.drawDebug(this);  // TODO: DELETE THIS AFTER TEST
      if (radArea.inRange(this)) {
        const radiation = radArea.handleApplyRadiation(this);
        this.totalRadInArea += radiation;
      }
    }
    // this.playGeigerCounterSound();
  }

  playGeigerCounterSound() {
    if (this.totalRadInArea <= 0) {
      low_radiation_sound.stop();
      med_radiation_sound.stop();
      high_radiation_sound.stop();
      return;
    }
    
    // if (this.totalRadInArea < RADIATION_MED_SOUND_RANGE) {
    //   // low_radiation_sound.stop();
    //   if (!low_radiation_sound.isPlaying()) low_radiation_sound.loop();
    //   med_radiation_sound.stop();
    //   high_radiation_sound.stop();
    // }
    // else if (this.totalRadInArea < RADIATION_HIGH_SOUND_RANGE) {
    //   if (!med_radiation_sound.isPlaying()) med_radiation_sound.loop();
    //   low_radiation_sound.stop();
    //   high_radiation_sound.stop();
    // }
    // else if (this.totalRadInArea >= RADIATION_HIGH_SOUND_RANGE) {
    //   if (!high_radiation_sound.isPlaying()) high_radiation_sound.loop();
    //   low_radiation_sound.stop();
    //   med_radiation_sound.stop();
    // }


    if (this.totalRadInArea < RADIATION_MED_SOUND_RANGE) {
      med_radiation_sound.stop();
      high_radiation_sound.stop();
      low_radiation_sound.stop();
      low_radiation_sound.play();
      
    }
    else if (this.totalRadInArea < RADIATION_HIGH_SOUND_RANGE) {
      low_radiation_sound.stop();
      high_radiation_sound.stop();
      med_radiation_sound.stop();
      med_radiation_sound.play();
      
    }
    else if (this.totalRadInArea >= RADIATION_HIGH_SOUND_RANGE) {
      low_radiation_sound.stop();
      med_radiation_sound.stop();
      high_radiation_sound.stop();
      high_radiation_sound.play();
      
    }
  }

  equipWeapon(index=1) {
    if (index === 1) this.equipRifle();
    else if (index === 2) this.equipRPG();
  }

  addHealth(amount=1) {
    if (this.health >= MAX_PLAYER_HEALTH) return false;
    super.addHealth(amount);
    if (this.health >= MAX_PLAYER_HEALTH) this.health = MAX_PLAYER_HEALTH;
    return true;
  }

  resetStamina() {
    this.stamina = MAX_PLAYER_STAMINA;
  }

  handleStamina() {
    if (this.baseSpeed > PLAYER_BASE_SPEED && this.animationState === SPRINT_RIGHT_STATE) {
      this.stamina -= STAMINA_DECREASE_RATE;
      if (this.stamina < 0) this.stamina = 0;
    }
    else {
      this.stamina += STAMINA_DECREASE_RATE* (this.animationState === WALKING_RIGHT_STATE ? 0.8 : 2);
      if (this.stamina > MAX_PLAYER_STAMINA) this.stamina = MAX_PLAYER_STAMINA;
    }
    
  }

  addBullets(amount=1) {
    this.bullets += amount;
    return true;
  }

  addRockets(amount=1) {
    //if (this.rocketsNum >= MAX_PLAYER_ROCKETS_ALLOWED) return false;
    this.rocketsNum += amount;
    //if (this.rocketsNum >= MAX_PLAYER_ROCKETS_ALLOWED) this.rocketsNum = MAX_PLAYER_ROCKETS_ALLOWED;
    return true;
  }

  addFlashlightBattery(amount=1) {
    if (this.flashlight_battery >= FLASHLIGHT_MAXIMUM_BATTERY) return false;
    this.flashlight_battery += amount;
    if (this.flashlight_battery >= FLASHLIGHT_MAXIMUM_BATTERY) this.flashlight_battery = FLASHLIGHT_MAXIMUM_BATTERY;
    return true;
  }

  hasHazmatSuitOn() {
    return this.hazmatResistance > 0;
  }

  addHazmatSuit(amount=HAZMAT_SUIT_RAD_RESISTANCE) {
    this.hazmatResistance = amount;
    return true;
  }

  applyRadiation(amount=1) {
    if (!this.canRecieveRadiation) return;
    if (this.hasHazmatSuitOn()) {
      this.hazmatResistance -= amount;
      return;
    }
    super.applyRadiation(amount);
  }

  addRPG() {
    if (this.alreadyHasRPG()) return;
    this.weapons[1] = new WeaponRocket(this);
    this.currentWeapon = this.weapons[1];
    return true;
  }

  equipRPG() {
    if (!this.alreadyHasRPG()) return;
    this.currentWeapon = this.weapons[1];
  }

  equipRifle() {
    this.currentWeapon = this.weapons[0];
  }

  hasRPGEquipped() {
    return this.currentWeapon.name === "RPG";
  }

  alreadyHasRPG() {
    return this.weapons.length > 1;
  }

  attack() {
    if (this.hasRPGEquipped()) {
      if (this.rocketsNum <= 0) return;
    }
    else {
      if (this.bullets <= 0) return;
    }
    super.attack();
    if (this.is_looking_right) {
      this.currentWeapon.shoot(this.pos.copy().add(this.shootLocationOffsetFIXED).add(this.shootLocationOffset), rightVector.copy(), true);
    }
    else {
      this.currentWeapon.shoot(this.pos.copy().add(this.shootLocationOffsetFIXED).sub(this.shootLocationOffset), leftVector.copy(), false);
    }
    if (this.hasRPGEquipped()) {
      this.rocketsNum--;
    }
    else {
      this.bullets--;
    }
  }

  toggleFlashlight() {
    if (!this.hasFlashlight) return;
    this.is_flashlight_on = !this.is_flashlight_on;
  }

  addFlashlight() {
    this.hasFlashlight = true;
    level_1.shouldChangeDarkMode=true;
    level_2.shouldChangeDarkMode=false;
    level_3.shouldChangeDarkMode=true;
    level_4.shouldChangeDarkMode=true;
    level_5.shouldChangeDarkMode=false;
    // level_1.changeDarkEverySeconds=round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS));
    can_global_go_dark = true;
    return true;
  }
  
  handleProjectiles() {
    for (let i = 0; i < this.projectiles.length; i++) {
      let projectile = this.projectiles[i];
      projectile.drawMe(this);
      projectile.update();
    }
  }

  handleNPCCollisions() {
    for (let i = 0; i < currentLevel.NPCs.length; i++) {
      let npc = currentLevel.NPCs[i];
      if (!npc.isAlive()) continue;
      npc.handleCharacterCollision(this);
    }
  }

  handleCollisions() {
    this.handleNPCCollisions();
    super.handleCollisions();
  }

  getItemIndexInInvetory(itemName) {
    for (let i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i].name === itemName) return i;
    }
    return -1;
  }

  removeItemFromInventory(index, drop=true) {
    if (index > this.inventory.length-1) return;
    if (drop) {
      // Dropping item
      let item = player.inventory[i];
      item.pos = this.pos.copy();
      currentLevel.items.push(item);
    }
    this.inventory.splice(index, 1);
  }

  itemExistsInInventory(itemName) {
    const index = this.getItemIndexInInvetory(itemName);
    return index != -1;
  }

  addItemToInventory(itemRef, onceOnly=false) {
    if (this.inventory.length >= MAX_INVENTORY_NUM) return false;
    currentLevel.items.splice(currentLevel.items.indexOf(itemRef), 1);
    if (onceOnly) {
      if (this.itemExistsInInventory(itemRef.name)) {
        return;
      }
    }
    this.inventory.push(itemRef);
    return true;
  }

  startBleeding() {
    this.invincibleTimer = PLAYER_INVINCIBLE_IN_SECONDS;
    this.canRecieveDamage = false;
    super.startBleeding();
  }

  handleInvincible() {
    if (this.canRecieveDamage) return;
    if (this.invincibleTimer <= 0) {
      this.canRecieveDamage = true;
      return;
    }
    this.canRecieveDamage = false;
    this.invincibleTimer--;
  }
}