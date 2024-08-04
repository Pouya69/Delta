let level_4_map =
[
    [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
    [7,0,0,0,0,0,0,0,2,0,0,7,0,0,2,0,0,0,0,0,0,0,7],
    [7,0,0,0,0,0,0,2,0,2,0,7,0,2,0,2,0,0,0,0,0,0,7],
    [7,0,0,0,0,0,2,0,0,0,2,7,2,0,0,0,2,0,0,0,0,0,7],
    [7,2,0,0,0,2,0,0,0,0,0,7,0,0,0,0,0,2,0,0,0,2,7],
    [7,0,2,0,2,0,0,0,0,0,0,7,0,0,0,0,0,0,2,0,2,0,7],
    [7,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,7],
    [7,0,2,0,2,0,0,0,0,0,0,7,0,0,0,0,0,0,2,0,2,0,7],
    [7,2,0,0,0,2,0,0,0,0,0,7,0,0,0,0,0,2,0,0,0,2,7],
    [7,2,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7]
];
let pouyaNPC;

function initializeLevel4() {
    level_4.initializeLevel(false, true);
    initializeLevel4Rads();
    initializeLevel4ConsumablesAndObjects();
    initializeLevel4NPCs();
}

function initializeLevel4Rads() {
    level_4.radiation_areas = [
        new RadiationArea(createVector(1196.8000000000002, 211.20000000000002), 150, 2),
        new RadiationArea(createVector(296.8000000000002, 501.20000000000002), 90, 1),
    ];
}

function initializeLevel4Doors() {
    level_4.doors = [
        new TileDoor(createVector(70.4, 633.6), door_tile_img, false, "", level_1, createVector(6750, 704)),
    ];
}

function initializeLevel4NPCs() {
    pouyaNPC = new BaseNPC("Pouya", createVector(1475, 250), BASE_CHARACTER_WIDTH, BASE_CHARACTER_HEIGHT, 0.8, 20, player_hurt_sound, player_death_sound, null, null, null, null, false, "Reactor Room Key", keycard_animation);
    level_4.NPCs.push(pouyaNPC);
    level_4.NPCsCount = 1;
}

function initializeLevel4ConsumablesAndObjects() {
    // The RPG and the rockets
    
    level_4.items.push(new ConsumableRocket(createVector(1125, 475), [rocket_img]));
    level_4.items.push(new ConsumableRocket(createVector(1225, 525), [rocket_img]));
    level_4.items.push(new ConsumableRocket(createVector(1200, 525), [rocket_img]));
    level_4.items.push(new ConsumableRocket(createVector(1175, 515), [rocket_img]));
    level_4.items.push(new ConsumableRPG(createVector(1325, 450), [RPG_Icon]));
    
    level_4.items.push(new Item(createVector(200, 50), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(400, 50), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(600, 50), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(250, 50), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(450, 50), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(650, 50), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(225, 75), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(425, 75), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(625, 75), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(1225, 75), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(1020, 75), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(1325, 500), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(650, 500), "Box", [BOX_DECORATION_IMG]));
    level_4.items.push(new Item(createVector(1425, 500), "Box", [BOX_DECORATION_IMG]));
    
}