const LEVEL_1_STATE = 1;
const LEVEL_2_STATE = 2;
const LEVEL_3_STATE = 3;
const LEVEL_4_STATE = 4;
const LEVEL_5_STATE = 5;
const LEVEL_6_STATE = 6;
const START_GAME_STATE = 7;
const LOST_STATE = 8;
const WON_1_STATE = 9;
const WON_2_STATE = 10;
const WON_3_STATE = 11;
const LOADING_STATE = 12;
let can_global_go_dark = false;
let facility_self_destruct_active = false;
let facility_self_destruct_timer;
let showing_alarm = true;

let beforeGameState = LEVEL_1_STATE;
let currentGameState = LEVEL_1_STATE;

let current_cutscene = null;
let currentLevel = null;
let levels_json = {
  "TEST_1_DEV" : "LEVEL_OBJECT_GOES_HERE"
};
let level_1;
let level_2;
let level_3;
let level_4;
let level_5;
let level_boss;
let game_started = false;

function initializeAllLevels() {
  let playerC = new PlayerCharacter(PLAYER_NAME, createVector(200, 150), BASE_CHARACTER_WIDTH, BASE_CHARACTER_HEIGHT, 0.8, MAX_PLAYER_HEALTH);
  

  level_1 = new Level(level_1_map, "level_1", playerC, ambience_2_music, [], [], false, true, round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS)));
  // level_1 = new Level(level_1_map, "level_1", null, ambience_2_music, [], [], false, true, round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS)));

  level_2 = new Level(level_2_map, "level_2", null, ambience_1_music, [], [], true, false, round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS)));
  // level_2 = new Level(level_2_map, "level_2", playerC, ambience_1_music, [], [], false, false, round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS)));

  level_3 = new Level(level_3_map, "level_3", null, ambience_3_music, [], [], false, false, round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS)));
  level_4 = new Level(level_4_map, "level_4", null, ambience_3_music, [], [], true, false, round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS)));
  // level_4 = new Level(level_4_map, "level_4", playerC, ambience_3_music, [], [], true, false, round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS)));
  level_5 = new Level(level_5_map, "level_5", null, ambience_1_music, [], [], true, false, round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS)));
  level_boss = new BossLevel(level_boss_map, "level_boss", null, ambience_4_music, [], [], false, true, round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS)));

  // level_boss = new BossLevel(level_boss_map, "level_boss", playerC, ambience_4_music, [], [], false, true, round(random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS)));
  initializeLevel1();
  initializeLevel2();
  initializeLevel3();
  initializeLevel4();
  initializeLevel5();
  initializeBossLevel();
  initializeAllDoors();
  currentLevel = level_1;
  // currentLevel = level_boss;
  // can_global_go_dark = true;
  // facility_self_destruct_active = true;
  
  // currentLevel = level_4;
  // playerC.lives = 1;
  // currentLevel = level_2;
  // playerC.addRPG();
  // playerC.equipRPG();
  // playerC.addRockets(20);
  // playerC.addFlashlight();
  // playerC.addItemToInventory(new PickableItemOnce(createVector(500, 3580), "Master Key", keycard_animation), true);
  // bossNPC.health = 0;
  // playerC.addItemToInventory(new PickableItemOnce(createVector(500, 3580), "Reactor Room Key", keycard_animation), true);
  // playerC.addItemToInventory(new PickableItemOnce(createVector(500, 3580), "Control Room Key", keycard_animation), true);
}

function drawAndHandleCurrentLevel() {
  // Draws the current level and static stuff and radiation and doors and NPCs
  currentLevel.drawAndHandleMe();
  handleFacilitySelfDestruct();
}

function drawAndHandleExplosions() {
  // should be drawn after everything
  currentLevel.drawAndhandleExplosions();
}

function drawCurrentCutscene() {
  current_cutscene.drawCutscene();
  current_cutscene.update();
}

function drawPostProcessing() {
  if (!facility_self_destruct_active) return;
  if (showing_alarm) {
    push();
    fill(255, 0, 0, 50);
    rect(0, 0, width, height);
    pop();
  }
}

function drawAndHandleLight() {
  if (!currentLevel.isDark) return;
  if (currentLevel.player.is_flashlight_on) {
    push();
    image(flashlight_bg_cover, 0, 0);
    pop();
    return;
  }
  push();
  fill(0);
  rect(0, 0, width, height);
  pop();
}

function initializeAllDoors() {
  initializeLevel1Doors();
  initializeLevel2Doors();
  initializeLevel3Doors();
  initializeLevel4Doors();
  initializeLevel5Doors();
  initializeBossLevelDoors();

  // TEMP FIX FOR DOORS
  level_1.TEMPFIXDOORS();
  level_2.TEMPFIXDOORS();
  level_3.TEMPFIXDOORS();
  level_4.TEMPFIXDOORS();
  level_5.TEMPFIXDOORS();
  level_boss.TEMPFIXDOORS();
}

function goToLevel(levelRef, levelSpawnPoint) {
  /* let l = getLevelByName(levelAttachedName);
  if (l == null) {
    print("levelName is null in goToLevel.")
    return;
  } */
  if (levelRef.name === "level_boss") {
    can_global_go_dark = true;
    currentLevel.player.addHazmatSuit(HAZMAT_SUIT_RAD_RESISTANCE/2);
  }
  levelRef.player = currentLevel.player;
  currentLevel.player = null;
  currentLevel.ambienceMusic.stop();
  currentLevel = levelRef;
  // Set values for when the player respawns
  currentLevel.player.pos = levelSpawnPoint.copy();
  currentLevel.lastplayerLocation = levelSpawnPoint.copy();
  currentLevel.initializeLevel();
}

function getLevelByName(name) {
  if (!levels_json.hasOwnProperty(name)) return null;
  return levels_json[name];
}

function loseGame() {
  currentLevel.ambienceMusic.stop();
  game_over_sound.loop();
  changeGameState(LOST_STATE);
}

function respawnPlayer(player) {
  if (player.lives <= 0) {
    loseGame();
    return;
  }
  currentLevel.restartLevel();
}

function endCurrentCutScene() {
  current_cutscene.owner.cutsceneEnd();
  changeGameState(beforeGameState);
  current_cutscene = null;
}

function changeGameState(inState) {
  if (currentGameState != START_GAME_STATE) beforeGameState = currentGameState;
  else beforeGameState = inState;
  currentGameState = inState;
}

function isGameFinished() {
  return currentGameState == LOST_STATE || currentGameState == WON_1_STATE || currentGameState == WON_2_STATE || currentGameState == WON_3_STATE;
}

function isInCutscene() {
  return current_cutscene != null;
}

function isInStartGameState() {
  return currentGameState == START_GAME_STATE;
}

function isGameOngoing() {
  return !isInCutscene() && !isGameFinished() && !isInStartGameState();
}

function handleFacilitySelfDestruct() {
  if (!facility_self_destruct_active) return;
  handleFacilitySelfDestructAlarm();
  if (facility_self_destruct_timer <= 0) {
    currentLevel.player.lives--;
    facility_self_destruct_timer = FACILITY_SELF_DESTRUCT_TIME_IN_SECONDS;
    respawnPlayer(currentLevel.player);
    return;
  }
  facility_self_destruct_timer--;
}

function handleFacilitySelfDestructAlarm() {
  if (facility_alarm_timer <= 0) {
    facility_alarm_sound.stop();
    facility_alarm_sound.play();
    facility_alarm_timer = FACILITY_SELF_DESTRUCT_ALARM_IN_SECONDS;
    showing_alarm = !showing_alarm;
    return;
  }
  facility_alarm_timer--;
}

function EndGame() {
  currentLevel.ambienceMusic.stop();
  thank_you_sound.play();
  // Evaluate the win condition.
  if (bossNPC.isAlive()) {
    // Left the facility
    changeGameState(WON_3_STATE);
    return;
  }
  // Killed the boss
  if (facility_self_destruct_active) {
    // Also did self destruct
    changeGameState(WON_1_STATE);
    return;
  }
  // Killed boss but no self destruct
  changeGameState(WON_2_STATE);
}

function StartGame() {
  changeGameState(LEVEL_1_STATE);
  game_started = true;
  currentLevel.ambienceMusic.stop();
  currentLevel.ambienceMusic.loop();
}