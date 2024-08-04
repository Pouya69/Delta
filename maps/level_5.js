let level_5_map =
[
    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
    [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7],
    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,6,7],
    [7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,6,7],
    [7,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,6,7,6,7],
    [7,6,7,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,6,7,6,7],
    [7,6,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,6,7],
    [7,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,6,7],
    [7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7],
    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
];

let romanNPC;

function initializeLevel5() {
    level_5.initializeLevel(false, true);
    initializeLevel5NPCS();
}

function initializeLevel5Doors() {
    level_5.doors = [
        new TileDoor(createVector(0, 70.4), door_tile_img, false, "", level_1, createVector(2082.4, 70.4)),
    ];
}
function initializeLevel5NPCS() {
    romanNPC = new BaseNPC("Roman", createVector(281.6, 362), BASE_CHARACTER_WIDTH, BASE_CHARACTER_HEIGHT, 0.8, 20, player_hurt_sound, player_death_sound, null, null, null, null, false);
    level_5.NPCs.push(romanNPC);
    level_5.NPCsCount = 1;
}
