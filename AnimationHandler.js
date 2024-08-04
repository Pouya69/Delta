// Animations
const ANIM_SWITCH_RATE = 3;  // this is for framecount % ANIM_SWITCH_RATE == 0
const ANIM_SWITCH_RATE_CHARACTERS = 2;

function canPlayAnimaion(RATE=ANIM_SWITCH_RATE) {
  return frameCount % RATE == 0;
}

function canCharacterPlayAnimaion() {
  return frameCount % ANIM_SWITCH_RATE_CHARACTERS == 0;
}

// Animation States
const IDLE_STATE = 0;
const WALKING_DOWN_STATE = 1;
const WALKING_UP_STATE = 2;
const WALKING_RIGHT_STATE = 3;
const WALKING_LEFT_STATE = 4;
const ATTACKING_RIGHT_STATE = 5;
const ATTACKING_LEFT_STATE = 6;
const ATTACKING_UP_STATE = 7;
const ATTACKING_DOWN_STATE = 8;
const DEATH_STATE = 9;
const SPRINT_RIGHT_STATE = 10;
const SPRINT_UP_STATE = 11;
const SPRINT_LEFT_STATE = 12;
const SPRINT_DOWN_STATE = 13;
const HURT_STATE = 14;
// for the assignment, up/down are the same as left/right (previous state)




// Player 
let player_idle_sheet;
let player_shoot_sheet;
let player_walk_sheet;
let player_run_sheet;
let player_dead_sheet;
let player_hurt_sheet;
let player_idle_animaion = [];
let player_shoot_animaion = [];
let player_walk_animaion = [];
let player_run_animaion = [];
let player_dead_animaion = [];
let player_hurt_animaion = [];
let heart_img;

// Enemy 1
let enemy1_idle_1_sheet;
let enemy1_attack_1_sheet;
let enemy1_attack_2_sheet;
let enemy1_attack_3_sheet;
let enemy1_walk_sheet;
let enemy1_run_sheet;
let enemy1_dead_sheet;
let enemy1_hurt_sheet;
let enemy1_idle_1_animaion = [];
let enemy1_attack_1_animaion = [];
let enemy1_attack_2_animaion = [];
let enemy1_attack_3_animaion = [];
let enemy1_walk_animaion = [];
let enemy1_run_animaion = [];
let enemy1_dead_animaion = [];
let enemy1_hurt_animaion = [];

// Enemy 2
let enemy2_idle_1_sheet;
let enemy2_attack_1_sheet;
let enemy2_attack_2_sheet;
let enemy2_walk_sheet;
let enemy2_run_sheet;
let enemy2_dead_sheet;
let enemy2_hurt_sheet;
let enemy2_idle_1_animaion = [];
let enemy2_attack_1_animaion = [];
let enemy2_attack_2_animaion = [];
let enemy2_walk_animaion = [];
let enemy2_run_animaion = [];
let enemy2_dead_animaion = [];
let enemy2_hurt_animaion = [];

// NPC
let npc_idle_sheet;
let npc_dead_sheet;
let npc_hurt_sheet;
let npc_walk_sheet;
let npc_idle_animaion = [];
let npc_dead_animaion = [];
let npc_hurt_animaion = [];
let npc_walk_animaion = [];

// Boss
let boss_attack_sheet;
let boss_death_sheet;
let boss_hurt_sheet;
let boss_idle_sheet;
let boss_walk_sheet;
let boss_attack_animaion = [];
let boss_death_animaion = [];
let boss_hurt_animaion = [];
let boss_idle_animaion = [];
let boss_walk_animaion = [];
let boss_projectile_sheet;
let boss_projectile_animation = [];


// Explosion
let rpg_explosion_animation = [];
let reactor_explosion_animation = [];
let explosion_1;
let explosion_2;
let explosion_3;
let explosion_4;
let explosion_5;
let explosion_6;
let explosion_7;
let explosion_8;

// Tiles
let door_tile_img;
let door_tile_open_img;
let TILE_1_Icon;
let TILE_WALLS_Icon;
let TILE_2_Icon;
let TILE_WALLS_2_Icon;
let TILE_3_Icon;
let TILE_WALLS_3_Icon;


// Misc
let RPG_Icon;
let bullet_img;
let nuclear_img;
let blood_animation = [];
let game_mini_map;
let help_image;
let light_sheet;
let light_animation = [];
let lowRad_img;
let medRad_img;
let highRad_img;
let flashlight_bg_cover;
let control_panel_sheet;
let control_panel_animation = [];
let BOX_DECORATION_IMG;
let decoration_locker_img;
let enemy_spawner_img;
let REACTOR_img;
let REACTOR2_img;
let CONSUMABLE_SPAWNER_ICON;

// Resources
let flashlight_img;
let keycard_sheet;
let keycard_animation = [];
let battery_img;
let antirad_img;
let hazmat_img;
let rifle_ammo_img;
let medpack_img;
let medpack_super_img;
let rocket_img;


function loadAnimations() {
  loadPlayerAnimations();
  loadEnemy1Animations();
  loadEnemy2Animations();
  loadNPCAnimations();
  loadBossAnimations();
  loadExplosionsAnimations();
  loadMisc();
  loadTileImages();
  loadResourceIcons();
}

function loadTileImages() {
  TILE_1_Icon = loadImage("assets/tiles/Tile_61.png");
  TILE_2_Icon = loadImage("assets/tiles/Tile_37.png");
  TILE_3_Icon = loadImage("assets/tiles/IndustrialTile_29.png");
  TILE_WALLS_Icon = loadImage("assets/tiles/Tile_51.png");
  TILE_WALLS_2_Icon = loadImage("assets/tiles/Tile_26.png");
  TILE_WALLS_3_Icon = loadImage("assets/tiles/IndustrialTile_25.png");
  door_tile_img = loadImage("assets/tiles/Tile_48.png");
  door_tile_open_img = loadImage("assets/tiles/Tile_47.png");
}

function loadResourceIcons() {
  battery_img = loadImage("assets/resources/battery.png");
  antirad_img = loadImage("assets/resources/antirad.png");
  hazmat_img = loadImage("assets/resources/hazmat.png");
  rifle_ammo_img = loadImage("assets/resources/rifle_ammo.png");
  medpack_img = loadImage("assets/resources/health.png");
  medpack_super_img = loadImage("assets/resources/health_super.png");
}

function loadNPCAnimations() {
  npc_idle_sheet = loadImage("assets/npc/Idle.png");
  npc_dead_sheet = loadImage("assets/npc/Dead.png");
  npc_hurt_sheet = loadImage("assets/npc/Hurt.png");
  npc_walk_sheet = loadImage("assets/npc/Walk.png");
}

function loadPlayerAnimations() {
  player_idle_sheet = loadImage("assets/player/Idle.png");
  player_shoot_sheet = loadImage("assets/player/Shot_1.png");
  player_walk_sheet = loadImage("assets/player/Walk.png");
  player_run_sheet = loadImage("assets/player/Run.png");
  player_dead_sheet = loadImage("assets/player/Dead.png");
  player_hurt_sheet = loadImage("assets/player/Hurt.png");
}
  
function loadEnemy1Animations() {
  enemy1_idle_1_sheet = loadImage("assets/enemy1/Idle.png");
  enemy1_idle_2_sheet = loadImage("assets/enemy1/Eating.png");
  enemy1_attack_1_sheet = loadImage("assets/enemy1/Attack_1.png");
  enemy1_attack_2_sheet = loadImage("assets/enemy1/Attack_2.png");
  enemy1_attack_3_sheet = loadImage("assets/enemy1/Attack_3.png");
  enemy1_walk_sheet = loadImage("assets/enemy1/Walk.png");
  enemy1_run_sheet = loadImage("assets/enemy1/Run.png");
  enemy1_dead_sheet = loadImage("assets/enemy1/Dead.png");
  enemy1_hurt_sheet = loadImage("assets/enemy1/Hurt.png");
}

function loadEnemy2Animations() {
  enemy2_idle_1_sheet = loadImage("assets/enemy2/Idle.png");
  enemy2_attack_1_sheet = loadImage("assets/enemy2/Attack_1.png");
  enemy2_attack_2_sheet = loadImage("assets/enemy2/Attack_2.png");
  enemy2_walk_sheet = loadImage("assets/enemy2/Walk.png");
  enemy2_run_sheet = loadImage("assets/enemy2/Run.png");
  enemy2_dead_sheet = loadImage("assets/enemy2/Dead.png");
  enemy2_hurt_sheet = loadImage("assets/enemy2/Hurt.png");
}

function loadBossAnimations() {
  boss_attack_sheet = loadImage("assets/boss/Attack.png");
  boss_death_sheet = loadImage("assets/boss/Death.png");
  boss_hurt_sheet = loadImage("assets/boss/Hurt.png");
  boss_idle_sheet = loadImage("assets/boss/Idle.png");
  boss_walk_sheet = loadImage("assets/boss/Walk.png");
  boss_projectile_sheet = loadImage("assets/boss/boss_projectile.png");
}

function loadExplosionsAnimations() {
  for (let i = 1; i <= 12; i++) {
    let img = loadImage(("assets/explosions/reactor/explosion-d" + i + ".png"));
    reactor_explosion_animation[i-1] = img;
  }
  for (let i = 1; i <= 8; i++) {
    let img = loadImage(("assets/explosions/rpg/explosion-f" + i + ".png"));
    img.width *= 3;
    img.height *= 3;
    rpg_explosion_animation[i-1] = img;
  }
}


function loadSpriteSheetIntoAnimation(arr, sheet, framesNum) {
  const sectionWidth = sheet.width / framesNum;
  const sectionHeight = sheet.height;
  for (let i=0; i<framesNum; i++) {
    let finalImg = createImage(sectionWidth, sectionHeight);
    finalImg.copy(sheet, i*sectionWidth, 0, sectionWidth, sectionHeight, 0, 0, sectionWidth, sectionHeight);
    // finalImg.resize(finalImg.width/charWidth, finalImg.height/charHeight);
    arr[i] = finalImg;
  }
}

function loadMisc() {
  heart_img = loadImage("assets/player/heart.png");
  keycard_sheet = loadImage("assets/resources/Card.png");
  flashlight_img = loadImage("assets/resources/flashlight_icon.png");


  light_sheet = loadImage("assets/light.png");
  game_mini_map = loadImage("assets/GameMap.png");
  help_image = loadImage("assets/HelpPage.png");
  RPG_Icon = loadImage("assets/guns/RPG.png");
  bullet_img = loadImage("assets/guns/bullet.png");
  rocket_img = loadImage("assets/guns/rocket.png");
  nuclear_img = loadImage("assets/Nuclear.png");
  lowRad_img = loadImage("assets/lowRadiation.png");
  medRad_img = loadImage("assets/medRadiation.png");
  highRad_img = loadImage("assets/highRadiation.png");
  flashlight_bg_cover = loadImage("assets/Flashlight.png");
  for (let i = 3; i <= 9; i++) {
    blood_animation.push(loadImage(("assets/effects/blood/1_" + i + ".png")));
  }
  control_panel_sheet = loadImage("assets/Screen2.png");
  BOX_DECORATION_IMG = loadImage("assets/decoration/Box1.png");
  decoration_locker_img = loadImage("assets/decoration/Locker4.png");
  enemy_spawner_img = loadImage("assets/tiles/IndustrialTile_26.png");
  REACTOR_img = loadImage("assets/decoration/24.png");
  REACTOR2_img = loadImage("assets/decoration/25.png");
  CONSUMABLE_SPAWNER_ICON = loadImage("assets/tiles/IndustrialTile_71.png");
}

function loadSpriteSheets() {
  loadNPCSpriteSheets();
  loadPlayerSpriteSheets();
  loadEnemy1SpriteSheets();
  loadEnemy2SpriteSheets();
  loadBossSpriteSheets();
  loadMiscSprites();
}

function loadNPCSpriteSheets() {
  loadSpriteSheetIntoAnimation(npc_idle_animaion, npc_idle_sheet, 9);
  loadSpriteSheetIntoAnimation(npc_dead_animaion, npc_dead_sheet, 4);
  loadSpriteSheetIntoAnimation(npc_hurt_animaion, npc_hurt_sheet, 3);
  loadSpriteSheetIntoAnimation(npc_walk_animaion, npc_walk_sheet, 8);
}

function loadPlayerSpriteSheets() {
  loadSpriteSheetIntoAnimation(player_idle_animaion, player_idle_sheet, 7);
  loadSpriteSheetIntoAnimation(player_shoot_animaion, player_shoot_sheet, 4);
  loadSpriteSheetIntoAnimation(player_walk_animaion, player_walk_sheet, 8);
  loadSpriteSheetIntoAnimation(player_run_animaion, player_run_sheet, 6);
  loadSpriteSheetIntoAnimation(player_dead_animaion, player_dead_sheet, 5);
  loadSpriteSheetIntoAnimation(player_hurt_animaion, player_hurt_sheet, 4);
}

function loadEnemy1SpriteSheets() {
  loadSpriteSheetIntoAnimation(enemy1_idle_1_animaion, enemy1_idle_1_sheet, 9);
  loadSpriteSheetIntoAnimation(enemy1_attack_1_animaion, enemy1_attack_1_sheet, 4);
  loadSpriteSheetIntoAnimation(enemy1_attack_2_animaion, enemy1_attack_2_sheet, 4);
  loadSpriteSheetIntoAnimation(enemy1_attack_3_animaion, enemy1_attack_3_sheet, 4);
  loadSpriteSheetIntoAnimation(enemy1_walk_animaion, enemy1_walk_sheet, 10);
  loadSpriteSheetIntoAnimation(enemy1_run_animaion, enemy1_run_sheet, 8);
  loadSpriteSheetIntoAnimation(enemy1_dead_animaion, enemy1_dead_sheet, 5);
  loadSpriteSheetIntoAnimation(enemy1_hurt_animaion, enemy1_hurt_sheet, 5);
}

function loadEnemy2SpriteSheets() {
  loadSpriteSheetIntoAnimation(enemy2_idle_1_animaion, enemy2_idle_1_sheet, 8);
  loadSpriteSheetIntoAnimation(enemy2_attack_1_animaion, enemy2_attack_1_sheet, 5);
  loadSpriteSheetIntoAnimation(enemy2_attack_2_animaion, enemy2_attack_2_sheet, 4);
  loadSpriteSheetIntoAnimation(enemy2_walk_animaion, enemy2_walk_sheet, 8);
  loadSpriteSheetIntoAnimation(enemy2_run_animaion, enemy2_run_sheet, 7);
  loadSpriteSheetIntoAnimation(enemy2_dead_animaion, enemy2_dead_sheet, 5);
  loadSpriteSheetIntoAnimation(enemy2_hurt_animaion, enemy2_hurt_sheet, 5);
}

function loadBossSpriteSheets() {
  loadSpriteSheetIntoAnimation(boss_attack_animaion, boss_attack_sheet, 9);
  loadSpriteSheetIntoAnimation(boss_death_animaion, boss_death_sheet, 6);
  loadSpriteSheetIntoAnimation(boss_hurt_animaion, boss_hurt_sheet, 2);
  loadSpriteSheetIntoAnimation(boss_idle_animaion, boss_idle_sheet, 4);
  loadSpriteSheetIntoAnimation(boss_walk_animaion, boss_walk_sheet, 6);
  loadSpriteSheetIntoAnimation(boss_projectile_animation, boss_projectile_sheet, 4);
}

function loadMiscSprites() {
  loadSpriteSheetIntoAnimation(keycard_animation, keycard_sheet, 8);
  loadSpriteSheetIntoAnimation(light_animation, light_sheet, 4);
  loadSpriteSheetIntoAnimation(control_panel_animation, control_panel_sheet, 4);
  
  TILE_1_Icon.width = FINAL_TILE_SIZE;
  TILE_1_Icon.height = FINAL_TILE_SIZE;
  TILE_2_Icon.width = FINAL_TILE_SIZE;
  TILE_2_Icon.height = FINAL_TILE_SIZE;
  TILE_3_Icon.width = FINAL_TILE_SIZE;
  TILE_3_Icon.height = FINAL_TILE_SIZE;
  TILE_WALLS_Icon.width = FINAL_TILE_SIZE;
  TILE_WALLS_Icon.height = FINAL_TILE_SIZE;
  TILE_WALLS_2_Icon.width = FINAL_TILE_SIZE;
  TILE_WALLS_2_Icon.height = FINAL_TILE_SIZE;
  TILE_WALLS_3_Icon.width = FINAL_TILE_SIZE;
  TILE_WALLS_3_Icon.height = FINAL_TILE_SIZE;
  door_tile_img.width = FINAL_TILE_SIZE;
  door_tile_img.height = FINAL_TILE_SIZE;
  door_tile_open_img.width = FINAL_TILE_SIZE;
  door_tile_open_img.height = FINAL_TILE_SIZE;
}
