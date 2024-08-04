let level_boss_map = [
    [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5],
    [5,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
];

let bossNPC;

function initializeBossLevel() {
    level_boss.initializeLevel();
    initializeBossLevelStaticObjects();
    initializeBossLevelBoss();
    initializeBossLevelRads();
    initializeBossLevelConsumableSpawners();
    initializeBossLevelLocations();
    // initializeBossLevelDoors();
}

function initializeBossLevelStaticObjects() {
    level_boss.items.push(
        new Item(createVector(400, 200), "Reactor", [REACTOR2_img]),
        new Item(createVector(600, 150), "Reactor 2", [REACTOR_img]),
        new Item(createVector(400, 10), "Reactor", [REACTOR2_img]),
        new Item(createVector(1600, 10), "Reactor 2", [REACTOR_img]),
        new Item(createVector(1600, 300), "Reactor 2", [REACTOR_img]),
    );
    level_boss.lights = [
        new LightItem(createVector(300, 50), "Light", light_animation, true),
        new LightItem(createVector(800, 450), "Light", light_animation, true),
        new LightItem(createVector(1300, 50), "Light", light_animation, true),
    ];
}

function initializeBossLevelBoss() {
    bossNPC = new BossEnemy("General Fang", createVector(1700, 350), BASE_CHARACTER_WIDTH*1.3, BASE_CHARACTER_HEIGHT*1.7, 0.8, MAX_BOSS_HEALTH, enemy_hurt_sound, enemy_death_sound, enemy_attack_sound, enemy_random1_sound, enemy_random2_sound, null, true);
    level_boss.NPCs.push(bossNPC);
}

function initializeBossLevelRads() {
    level_boss.radiation_areas = [
        new RadiationArea(createVector(400, 300), 100, 0.6),
        new RadiationArea(createVector(600, 350), 150, 1),
        new RadiationArea(createVector(400, 100), 140, 0.5),
        new RadiationArea(createVector(1600, 250), 300, 2),
        new RadiationArea(createVector(300, 500), 70, 0.5),
        new RadiationArea(createVector(1600, 500), 40, 0.6),
        new RadiationArea(createVector(1000, 300), 250, 1),
    ];
}

function initializeBossLevelDoors() {
    level_boss.doors = [
        new TileDoor(createVector(70.4, 633.6), door_tile_img, true, "Master Key", level_1, createVector(2956.8, 100)),
    ];
}

function initializeBossLevelConsumableSpawners() {
    level_boss.consumableSpawners = [
        new ConsumableSpawner(createVector(500, 450), CONSUMABLE_SPAWNER_ICON),
        new ConsumableSpawner(createVector(1500, 450), CONSUMABLE_SPAWNER_ICON)
    ];
}

function initializeBossLevelLocations() {
    BOSS_MOVEMENT_LOCATIONS = [
        createVector(215, 415),
        createVector(400, 150),
        createVector(1685, 120),
        createVector(1800, 430),
    ];
}