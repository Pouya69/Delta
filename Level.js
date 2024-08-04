class Level {
  constructor(tileMap, levelName, player, ambienceMusicc, radiation_areas, NPCs, isDark=false, shouldChangeDarkMode=false, changeDarkEverySeconds=round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS))) {
    this.gameMap = [];
    this.initializeLevelTiles(tileMap);
    this.levelName = levelName;
    this.player = player;
    this.radiation_areas = radiation_areas;
    this.NPCs = [];
    this.NPCsCount = 0;  // For spawning enemies since NPCs and enemies are in the same list
    this.explosions = [];
    this.isDark = isDark;
    this.changeDarkEverySeconds = changeDarkEverySeconds;
    this.shouldChangeDarkMode = shouldChangeDarkMode;
    this.doors = [];  // For interaction and faster and optimization
    this.items = [];
    this.lights = [];
    this.enemySpawners = [];
    this.consumableSpawners = [];
    this.lastplayerLocation = createVector();
    this.ambienceMusic = ambienceMusicc;
    this.playerRespawnData = {};
    this.setPlayerRespawnData();
  }
  
  update() {
    if (this.player == null) return;  // If player is not in level we ignore the level
    this.handleDark();
    // Env related stuff not related to player and stuff is in GameState
  }

  drawAndhandleExplosions() {
    for (let i = 0; i < this.explosions.length; i++) {
      let explosion = this.explosions[i];
      explosion.drawMe(this.player);
      explosion.update();
    }
  }

  drawAndHandleMe() {
    this.drawLevelBackground();
    this.drawAndHandleLevelTiles();
    this.drawAndHandleDynamicObjects();
    this.drawAndHandleNPCs();
    this.update();
  }

  drawAndHandleLevelTiles() {
    for (let i = 0; i < this.gameMap.length; i++) {
      let t = this.gameMap[i];
      t.drawMe(this.player, this.isDark);
      t.update();
    }
  }

  canSpawnEnemies() {
    return (this.NPCs.length-this.NPCsCount) < MAX_ENEMIES_SPAWNED_IN_LEVEL;
  }

  drawAndHandleDynamicObjects() {
    // items
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      item.drawMe(this.player);
      item.update();
    }
    for (let i = 0; i < this.lights.length; i++) {
      let light = this.lights[i];
      light.drawMe(this.player);
      light.update();
    }
    // Doors
    for (let i = 0; i < this.doors.length; i++) {
      let door = this.doors[i];
      door.drawMe(this.player);
      door.update();
    }
    for (let i = 0; i < this.enemySpawners.length; i++) {
      let spawner = this.enemySpawners[i];
      spawner.drawMe(this.player);
      spawner.update();
    }
    for (let i = 0; i < this.consumableSpawners.length; i++) {
      let consSpawner = this.consumableSpawners[i];
      consSpawner.drawMe(this.player);
      consSpawner.update();
    }
  }

  drawAndHandleNPCs() {
    for (let i = 0; i < this.NPCs.length; i++) {
      let npc = this.NPCs[i];
      npc.drawMe(this.player);
      npc.update();
    }
  }

  spawnConsumableRandom() {
    // TODO
    let p = createVector();  // The position

    this.spawnRandomConsumableAtLocation(p);
  }

  spawnRandomConsumableAtLocation(pos, fromNpc=false) {
    if (fromNpc) {
      const t = round(random(1, 3));
      if (t == 1) {
        // Health Only
        this.spawnConsumableAtLocation(pos, round(random(1, 2)));
      }
      else if (t == 2) {
        // Ammo only
        this.spawnConsumableAtLocation(pos, round(random(3, 4)));
      }
      else {
        // Battery and antirad
        this.spawnConsumableAtLocation(pos, round(random(5, 6)));
      }
      
      return;
    }
    this.spawnConsumableAtLocation(pos, round(random(1, 7)));
  }

  spawnConsumableAtLocation(pos, consumable_type) {
    let mPos = pos.copy();
    if (consumable_type === C_HEALTH_TYPE) {
      this.items.push(new ConsumableHealth(mPos));
    }
    else if (consumable_type === C_SUPERHEALTH_TYPE) {
      this.items.push(new ConsumableSuperHealth(mPos));
    }
    else if (consumable_type === C_AMMO_TYPE) {
      this.items.push(new ConsumableAmmo(mPos));
    }
    else if (consumable_type === C_ROCKET_TYPE) {
      this.items.push(new ConsumableRocket(mPos));
    }
    else if (consumable_type === C_RADDRUG_TYPE) {
      this.items.push(new ConsumableAntiRad(mPos));
    }
    else if (consumable_type === C_HAZMAT_TYPE) {
      this.items.push(new ConsumableHazmatSuit(mPos));
    }
    else if (consumable_type === C_RPG_TYPE) {
      this.items.push(new ConsumableRPG(mPos));
    }
    else if (consumable_type === C_FLASHLIGHT_TYPE) {
      this.items.push(new ConsumableFlashlight(mPos));
    }
    else if (consumable_type === C_BATTERY_TYPE) {
      this.items.push(new ConsumableBattery(mPos));
    }
  }



  setPlayerRespawnData(health=MAX_PLAYER_HEALTH, rocketsNum=0, bullets=STARTING_BULLETS_NUM) {
    this.playerRespawnData = {
      "health": health,
      "rocketsNum": rocketsNum,
      "bullets": bullets,
    };
  }

  handleDark() {
    if (!this.isDark) {
      if (!can_global_go_dark) return;
    }
    if (!this.shouldChangeDarkMode) return;
    const lightLen = this.lights.length;
    let areAllLightsOn = true;
    if (lightLen > 0) {
      for (let i = 0; i < lightLen; i++) {
        if (!this.lights[i].is_on) {
          areAllLightsOn = false;
          break;
        }
      }
    }
    else {
      areAllLightsOn = false;
    }
    if (areAllLightsOn) {
      this.isDark = false;
      return;
    }
    if (this.changeDarkEverySeconds <= 0) {
      this.isDark = !this.isDark;
      this.changeDarkEverySeconds = round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS));
      return;
    }
    this.changeDarkEverySeconds--;
  }

  initializeLevel(respawning=false, start=false) {
    // For the level elements that are static and don't change
    if (this.player != null && game_started) {
      this.ambienceMusic.stop();
      this.ambienceMusic.loop();
    }
    
    this.explosions = [];
    if (this.player == null) return;
    if (!respawning) {
      if (this.player != null) {
        if (start) {
          this.lastplayerLocation = this.player.pos.copy();
          this.setPlayerRespawnData(this.player.health, this.player.rocketsNum, this.player.bullets);
        }
      }
      else {
        this.setPlayerRespawnData(100, 2, 30);
      }
      
      
      // this.setPlayerRespawnData(this.player.health, this.player.rocketsNum, this.player.bullets);
    }
  }

  TEMPFIXDOORS() {
    for (let i = 0; i < this.doors.length; i++) {
      let door = this.doors[i];
      door.pos.y -= FINAL_TILE_SIZE/2;
      door.pos.x -= FINAL_TILE_SIZE/2;
    }
  }

  restartLevel() {
    this.player.stamina = MAX_PLAYER_STAMINA;
    this.player.radiationAmount = 0;
    this.player.flashlight_battery = FLASHLIGHT_MAXIMUM_BATTERY;
    this.player.health = this.playerRespawnData["health"];
    this.player.rocketsNum = this.playerRespawnData["rocketsNum"];
    this.player.bullets = this.playerRespawnData["bullets"];
    this.player.pos = this.lastplayerLocation.copy();
    this.player.changeAnimationState(IDLE_STATE);
    this.initializeLevel(true);
    
    
  }
  
  getLevelName() {
    return this.levelName;
  }

  getRandomConsumableSpawnPoint() {
    return createVector(random(FINAL_TILE_SIZE, (this.gameMap[0].length*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE)), random(FINAL_TILE_SIZE, (this.gameMap.length*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE)));
  }
  
  drawLevelBackground() {
    // For when out of the tiles.
    push();
    fill(19, 11, 23);
    rect(0, 0, width, height);
    pop();
  }

  initializeLevelTiles(tileMap) {  // Tiles
    
    for (let i=0; i<tileMap.length; i++) {
      for (let j=0; j<tileMap[i].length; j++) {
        const e = tileMap[i][j];
        let img = null;
        let is_collision = false;
        switch (e) {
          case 0:
            img = TILE_1_Icon;
            break;
          case 1:
            img = TILE_WALLS_Icon;
            is_collision = true;
            break;
          case 2:
            img = TILE_2_Icon;
            break;
          case 3:
            img = TILE_DOOR_ICON;
            print("new TileDoor(createVector(" + (j*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE/2) + ", " + (i*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE/2) + "), img, is_locked=false, needsItemToUnlock, levelAttached, levelAttachedSpawnPoint=createVector()),");
            break;
          case 4:
            img = TILE_1_Icon;
            print("Custom location: (" + ((j*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE/2)) + ", " + ((i*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE/2)) + ")");
            break;
          case 5:
            img = TILE_WALLS_2_Icon;
            is_collision = true;
            break;
          case 6:
            img = TILE_3_Icon;
            break;
          case 7:
            img = TILE_WALLS_3_Icon;
            is_collision = true;
            break;
          case 8:
            img = TILE_1_Icon
            print("new RadiationArea(createVector(" + (j*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE/2) + ", " + (i*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE/2) + "), radius, maxRadAtCenter),");
            this.radiation_areas.push(new RadiationArea(createVector(j*FINAL_TILE_SIZE, i*FINAL_TILE_SIZE), 200, 10));
            break;
          case 9:
            //  img = TILE_WALLS_3_Icon
            print("new EnemySpawner(createVector(" + (j*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE/2) + ", " + (i*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE/2) + "), img),");
            this.radiation_areas.push(new RadiationArea(createVector(j*FINAL_TILE_SIZE-(FINAL_TILE_SIZE/2), i*FINAL_TILE_SIZE-(FINAL_TILE_SIZE/2)), 200, 10));
            break;
        }
        this.gameMap.push(new Tile(createVector((j*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE/2), (i*FINAL_TILE_SIZE)-(FINAL_TILE_SIZE/2)), img, is_collision));
      }
    }
  }
}

