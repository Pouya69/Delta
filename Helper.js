// Basic
const BASE_CHARACTER_WIDTH = 45;
const BASE_CHARACTER_HEIGHT = 65;
const TILE_SIZE = 32;
const GLOBAL_SCALE_TILES = 2.2;
const GLOBAL_SCALE_CHARACTERS = 1;
const FINAL_TILE_SIZE = TILE_SIZE*GLOBAL_SCALE_TILES;

// Player
const PLAYER_NAME = "Telvy Phil";
const PLAYER_BASE_SPEED = 1;
const PLAYER_SPRINT_SPEED_MULTIPLIER = 3;
const MAX_PLAYER_LIVES = 5;
const BASE_LIGHT_RADIUS = 50;
const PLAYER_INTERACT_RADIUS = 80;
const MAX_PLAYER_STAMINA = 100;
const STAMINA_DECREASE_RATE = 0.5;
const MAX_PLAYER_HEALTH = 100;
const STARTING_BULLETS_NUM = 60;
const MAX_PLAYER_ROCKETS_ALLOWED = 5;
const MAX_INVENTORY_NUM = 5;
let PLAYER_FIXED_POSITION;
let PLAYER_INVINCIBLE_IN_SECONDS = 0.5;  // For constant attacks
let HINT_TIMER = 2;

// Consumables
let CONSUMABLE_DESTROY_IN_SECONDS = 10;
const C_HEALTH_TYPE = 1;
const C_SUPERHEALTH_TYPE = 2;
const C_AMMO_TYPE = 3;
const C_ROCKET_TYPE = 4;
const C_RADDRUG_TYPE = 5;
const C_BATTERY_TYPE = 6;
const C_HAZMAT_TYPE = 7;
const C_RPG_TYPE = 98;
const C_FLASHLIGHT_TYPE = 99;
// Hazmat Suit
const HAZMAT_SUIT_RAD_RESISTANCE = 1000;  // For now
let MIN_SPAWN_CONSUMABLE_EVERY_SECONDS = 5;
let MAX_SPAWN_CONSUMABLE_EVERY_SECONDS = 10;

// Flashlight
const FLASHLIGHT_RADIUS = 100;
let FLASHLIGHT_MAXIMUM_BATTERY = 100;

// Weapons and Projectiles
const ROCKET_SPEED = 40;
const BULLET_SPEED = 50;

// Characters
let REMOVE_TIME_IN_SECONDS = 10;

// Radiation
const RADIATION_DECREASE_RATE = 0.03;
const RADIATION_MAX_DAMAGE_RATE = 2;
const MAX_RADIATION_ALLOWED = 10;
const RADIATION_MED_SOUND_RANGE = 0.5;  // 0 TO RADIATION_MED_SOUND_RANGE-1
const RADIATION_HIGH_SOUND_RANGE = 1;  // RADIATION_MED_SOUND_RANGE AND UP

// Cutscene
let TEXT_TYPING_NEXT_EVERY_SECONDS = 0.03;
let CUTSCENE_START_DELAY_IN_SECONDS = 1;

// Sound
let MIN_RANDOM_CHARACTER_SOUND_IN_SECONDS = 1;
let MAX_RANDOM_CHARACTER_SOUND_IN_SECONDS = 5;

// Ambience
let MIN_CHANGE_DARKMODE_EVERY_SECONDS = 1;
let MAX_CHANGE_DARKMODE_EVERY_SECONDS = 4;

// Effects

// Damages
const ROCKET_DAMAGE = 4;
const BULLET_DAMAGE = 1;
const EXPLOSION_RADIUS = 30;

// Enemy Spawner
const MAX_ENEMIES_SPAWNED_IN_LEVEL = 15;
let MIN_SPAWN_ENEMY_EVERY_SECONDS = 3;
let MAX_SPAWN_ENEMY_EVERY_SECONDS = 6;

// Enemies and NPCs
let MIN_ENEMY_CHANGE_DIRECTION_EVERY_SECONDS = 3;
let MAX_ENEMY_CHANGE_DIRECTION_EVERY_SECONDS = 7;
const NPC_RANGE = 400;
const ENEMY_RANGE_MULT = 1.8;
let STOP_MOVING_TIMER = 3;
const ENEMY_ATTACK = 0;
const RADIATION_ATTACK = 1;
let ENEMY_ATTACK_DELAY_IN_SECONDS = 0.5;

// Bossfight
let has_bossfight_started = false;
let BOSS_SHIELD_UP_IN_SECONDS = 5;
let MIN_BOSS_SHIELD_DOWN_IN_SECONDS = 3;
let MAX_BOSS_SHIELD_DOWN_IN_SECONDS = 6;
let BOSS_RAPID_SHOOT_IN_SECONDS = 0.15;
let BOSS_SPECIAL_SHOOT_IN_SECONDS = 1;
let BOSS_NORMAL_SHOOT_IN_SECONDS = 1;
let BOSS_RAGE_TIME_IN_SECONDS = 12;
let BOSS_DEFENSIVE_TIME_IN_SECONDS = 8;
const MAX_BOSS_HEALTH = 150;
const BOSS_DEFENSIVE_SPEED = 0.5;
const BOSS_NORMAL_SPEED = 1;
const BOSS_SPRINT_SPEED = 3;
let BOSS_TURNOFF_LIGHTS_IN_SECONDS = 25;
let BOSS_TALK_SOUND_TIMER_IN_SECONDS = 5;
const DEFENSIVE = 0;
const NORMALMODE = 1;
const RAGE = 2;
let BOSS_MOVEMENT_LOCATIONS = [];

// Facility
let FACILITY_SELF_DESTRUCT_TIME_IN_SECONDS = 150;
let FACILITY_SELF_DESTRUCT_ALARM_IN_SECONDS = 2;
let facility_alarm_timer;

function initVariables() {
  game_mini_map.width = width;
  game_mini_map.height = height;
  flashlight_bg_cover.width = width;
  flashlight_bg_cover.height = height;
  help_image.width = width;
  help_image.height = height;
  PLAYER_FIXED_POSITION = createVector(width/2+BASE_CHARACTER_WIDTH/2, height/2+BASE_CHARACTER_HEIGHT/2);
  TEXT_TYPING_NEXT_EVERY_SECONDS *= getTargetFrameRate();
  REMOVE_TIME_IN_SECONDS *= getTargetFrameRate();
  CUTSCENE_START_DELAY_IN_SECONDS *= getTargetFrameRate();
  MIN_RANDOM_CHARACTER_SOUND_IN_SECONDS *= getTargetFrameRate();
  MAX_RANDOM_CHARACTER_SOUND_IN_SECONDS *= getTargetFrameRate();
  MIN_CHANGE_DARKMODE_EVERY_SECONDS *= getTargetFrameRate();
  MAX_CHANGE_DARKMODE_EVERY_SECONDS *= getTargetFrameRate();
  MIN_SPAWN_ENEMY_EVERY_SECONDS *= getTargetFrameRate();
  MAX_SPAWN_ENEMY_EVERY_SECONDS *= getTargetFrameRate();
  MIN_ENEMY_CHANGE_DIRECTION_EVERY_SECONDS *= getTargetFrameRate();
  MAX_ENEMY_CHANGE_DIRECTION_EVERY_SECONDS *= getTargetFrameRate();
  MIN_BOSS_SHIELD_DOWN_IN_SECONDS *= getTargetFrameRate();
  MAX_BOSS_SHIELD_DOWN_IN_SECONDS *= getTargetFrameRate();
  CONSUMABLE_DESTROY_IN_SECONDS *= getTargetFrameRate();
  PLAYER_INVINCIBLE_IN_SECONDS *= getTargetFrameRate();
  FACILITY_SELF_DESTRUCT_TIME_IN_SECONDS *= getTargetFrameRate();
  facility_self_destruct_timer = FACILITY_SELF_DESTRUCT_TIME_IN_SECONDS;
  HINT_TIMER *= getTargetFrameRate();
  STOP_MOVING_TIMER *= getTargetFrameRate();
  hintTextTimer = 0;
  talk_sound.setVolume(0.1);
  collision_object_generic_sound.setVolume(0.3);
  FLASHLIGHT_MAXIMUM_BATTERY *= getTargetFrameRate();
  FINAL_SCREEN_TEXT_TIMER *= getTargetFrameRate();
  finalScreenTextTimer = FINAL_SCREEN_TEXT_TIMER;
  MIN_SPAWN_CONSUMABLE_EVERY_SECONDS *= getTargetFrameRate();
  MAX_SPAWN_CONSUMABLE_EVERY_SECONDS *= getTargetFrameRate();
  FACILITY_SELF_DESTRUCT_ALARM_IN_SECONDS *= getTargetFrameRate();
  facility_alarm_timer = FACILITY_SELF_DESTRUCT_ALARM_IN_SECONDS;
  BOSS_TURNOFF_LIGHTS_IN_SECONDS *= getTargetFrameRate();
  BOSS_TALK_SOUND_TIMER_IN_SECONDS *= getTargetFrameRate();
  // boss_lights_out_sound.setVolume(2);
  high_radiation_sound.setVolume(0.3);
  BOSS_RAGE_TIME_IN_SECONDS *= getTargetFrameRate();
  BOSS_DEFENSIVE_TIME_IN_SECONDS *= getTargetFrameRate();
  BOSS_SHIELD_UP_IN_SECONDS *= getTargetFrameRate();
  BOSS_SPECIAL_SHOOT_IN_SECONDS *= getTargetFrameRate();
  BOSS_RAPID_SHOOT_IN_SECONDS *= getTargetFrameRate();
  startGameEndTimer *= getTargetFrameRate();
  startSoundTimer *= getTargetFrameRate();
  ENEMY_ATTACK_DELAY_IN_SECONDS *= getTargetFrameRate();
}

function getDrawLocationTranslate(player, myPos, isCenteredObject=false, w=0, h=0) {
  if (!isCenteredObject) {
    return createVector(-player.pos.x + PLAYER_FIXED_POSITION.x + myPos.x, -player.pos.y + PLAYER_FIXED_POSITION.y + myPos.y);
  }
  return createVector(-player.pos.x + PLAYER_FIXED_POSITION.x + myPos.x - w/2, -player.pos.y + PLAYER_FIXED_POSITION.y + myPos.y - h/2);
}

function getCharacterBeginningTopDraw(c) {
  return createVector(-(c.currentImageRef.width-(BASE_CHARACTER_WIDTH))/1.8, -((c.currentImageRef.height-BASE_CHARACTER_HEIGHT))-(BASE_CHARACTER_HEIGHT/2));
}