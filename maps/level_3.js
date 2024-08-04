let level_3_map =
[
    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
    [7,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,7],
    [7,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,7],
    [7,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,7],
    [6,6,6,6,6,6,6,6,6,0,0,0,0,0,6,6,6,6,6,6,6,6,7],
    [7,6,6,6,6,6,6,6,6,0,0,7,0,0,6,6,6,6,6,6,6,6,7],
    [7,6,6,6,6,6,6,6,6,0,0,7,0,0,6,6,6,6,6,6,6,6,7],
    [7,6,6,6,0,0,6,6,6,0,0,7,0,0,6,6,6,0,0,6,6,6,7],
    [7,6,6,6,0,0,6,6,6,0,0,7,0,0,6,6,6,0,0,6,6,6,7],
    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
];

let cameronNPC;

function initializeLevel3() {
    level_3.initializeLevel(false, true);
    initializeLevel3StaticObjects();
    initializeLevel3RadAreas();
    initializeLevel3NPCs();
    initializeLevel3EnemySpawners();
}

function initializeLevel3NPCs() {
    cameronNPC = new BaseNPC("Cameron", createVector(1408, 492.80000000000007), BASE_CHARACTER_WIDTH, BASE_CHARACTER_HEIGHT, 0.8, 20, player_hurt_sound, player_death_sound, null, null, null, null, false, "Flashlight", [flashlight_img]);
    level_3.NPCs.push(cameronNPC);
    level_3.NPCsCount = 1;
}

function initializeLevel3RadAreas() {
    level_3.radiation_areas = [
        new RadiationArea(createVector(211.20000000000002, 492.80000000000007), 200, 2),
        new RadiationArea(createVector(492.80000000000007, 211.20000000000002), 100, 3),
    ];
}

function initializeLevel3StaticObjects() {
    //level_3.items.push();
}

function initializeLevel3Doors() {
    level_3.doors = [
        new TileDoor(createVector(0, 281.6), door_tile_img, false, "", level_1, createVector(2545.6000000000004, 2493.6000000000004)),
        new TileDoor(createVector(774.4000000000001, 281.6), door_tile_img, false),
    ];
}

function initializeLevel3EnemySpawners() {
    level_3.enemySpawners = [
        new EnemySpawner(createVector(316.8, 105.60000000000001), enemy_spawner_img),
        // new EnemySpawner(createVector(1654.4, 1302.4), enemy_spawner_img),
    ];
}