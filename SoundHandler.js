const SOUNDS_BASE_PATH = "sounds/";

// Ambience
let ambience_1_music;
let ambience_2_music;
let ambience_3_music;
let ambience_4_music;
let bossfight_music;

// Player
let player_hurt_sound;
let player_death_sound;
let player_rocket_shoot_sound;
let player_rifle_shoot_sound;
let pickup_sound;

// Boss
let boss_death_sound;
let boss_hurt_sound;
let boss_rage_sound;
let boss_lights_out_sound;
let boss_say_die_sound;
let boss_say_wont_live_sound;
let boss_say_come_here;

// Enemy
let enemy_hurt_sound;
let enemy_death_sound;
let enemy_attack_sound;
let enemy_random1_sound;
let enemy_random2_sound;

// Collision
let collision_object_generic_sound;

// Explosion
let explosion_sound;

// Radiation Sound
let low_radiation_sound;
let med_radiation_sound;
let high_radiation_sound;

// Misc
let door_unlock_sound;
let talk_sound;
let lightSwitchSound;
let facility_alarm_sound;
let game_over_sound;
let thank_you_sound;
let begin_boom_sound;


function loadSounds() {
    loadAmbienceSounds();
    loadMiscSounds();
    loadPlayerSounds();
    loadEnemySounds();
    loadBossSounds();
}

function loadAmbienceSounds() {
    const basePath = SOUNDS_BASE_PATH + "ambience/";
    ambience_1_music = loadSound(basePath+"ambience_1.mp3");
    ambience_2_music = loadSound(basePath+"ambience_2.mp3");
    ambience_3_music = loadSound(basePath+"ambience_3.mp3");
    ambience_4_music = loadSound(basePath+"ambience_4.mp3");
    bossfight_music = loadSound(basePath+"bossfight.mp3");
}

function loadBossSounds() {
    const basePath = SOUNDS_BASE_PATH + "boss/";
    boss_death_sound = loadSound(basePath+"boss_death.wav");
    boss_hurt_sound = loadSound(basePath+"boss_hurt.wav");
    boss_rage_sound = loadSound(basePath+"boss_rage.wav");
    boss_lights_out_sound = loadSound(basePath+"lights_out.wav");
    boss_say_die_sound = loadSound(basePath+"say_die.wav");
    boss_say_wont_live_sound = loadSound(basePath+"say_you_wont_live.wav");
    boss_say_come_here = loadSound(basePath+"boss_say_come_here.wav");
}

function loadPlayerSounds() {
    const basePath = SOUNDS_BASE_PATH + "player/";
    player_rocket_shoot_sound = loadSound(basePath+"rocket_shoot.wav");
    low_radiation_sound = loadSound(basePath+"Geiger_Counter_low.wav");
    med_radiation_sound = loadSound(basePath+"Geiger_Counter_med.wav");
    high_radiation_sound = loadSound(basePath+"Geiger_Counter_high.wav");
    player_rifle_shoot_sound = loadSound(basePath+"rifle_shoot.mp3");
    player_death_sound = loadSound(basePath+"playerDeath.wav");
    player_hurt_sound = loadSound(basePath+"hitHurt.wav");
    pickup_sound = loadSound(basePath+"pickup.wav");
}

function loadEnemySounds() {
    const basePath = SOUNDS_BASE_PATH + "enemy/";
    enemy_hurt_sound = loadSound(basePath+"hitHurt.wav");
    enemy_death_sound = loadSound(basePath+"enemyDeath.wav");
    enemy_attack_sound = loadSound(basePath+"enemyAttack1.wav");
    enemy_random1_sound = loadSound(basePath+"random1Enemy.wav");
    enemy_random2_sound = loadSound(basePath+"random2Enemy.wav");
}

function loadMiscSounds() {
    explosion_sound = loadSound(SOUNDS_BASE_PATH+"rocket_explosion.wav");
    door_unlock_sound = loadSound(SOUNDS_BASE_PATH+"unlock.wav");
    collision_object_generic_sound = loadSound(SOUNDS_BASE_PATH+"collision_generic.wav");
    talk_sound = loadSound(SOUNDS_BASE_PATH+"talk.wav");
    lightSwitchSound = loadSound(SOUNDS_BASE_PATH+"lightSwitch.wav");
    facility_alarm_sound = loadSound(SOUNDS_BASE_PATH+"facility_alarm.wav");
    game_over_sound = loadSound(SOUNDS_BASE_PATH+"game_over_laugh.wav");
    thank_you_sound = loadSound(SOUNDS_BASE_PATH+"thank_you.wav");
    begin_boom_sound = loadSound(SOUNDS_BASE_PATH+"boom.mp3");
}
