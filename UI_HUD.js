let currentDoorRef = null;
let hintTextTimer = 0;
let cIndexFinalScreen = 0;
let cIndexStartScreen = 0;
let FINAL_SCREEN_TEXT_TIMER = 0.06;
let finalScreenTextTimer;
const lostText = "You failed to save the facility and solve the mystery...\n";
const won1Text = "The facility got contaminated and destroyed while you\nand others escape. You care about humans and people... That's what a real hero should be...\nThe world will never see the sacrifice that you did.\nBut you are a hero for doing the right thing...\nNot all heros wear capes...!";
const won2Text = "General Fang got his lesson... However\nThe facility remains active and hostile towards the outer world...\nYou leave the facility alone for a hope that\nsomeone someday will use it for a better cause.\n";
const won3Text = "You decided to agree with General Fang as you leave the facility and others behind.\nchoosing to become the villian was your choice...\nAnd you took it for good.\nThe world will go to a catastrophe with what you did...\n";
const startText = "Subject: Telvy Phil\nLocation: Platonia Facility\n\nMission: An explosion just happened in the facility...\nGo and find out why\n\n(Press and hold [H] for help in game...)";

let startGameEndTimer = 3;
let startSoundTimer = 6;
let played_begin = false;

function showHintItemText() {
    if (currentDoorRef == null) return;
    hintTextTimer--;
    if (hintTextTimer <= 0) {
        currentDoorRef = null;
        return;
    }
    push();
    translate(getDrawLocationTranslate(currentLevel.player, currentDoorRef.pos));
    textAlign(CENTER);
    textFont(character_speech_font);
    textSize(20);
    fill(255, 255, 255);
    text("I need\nthe " + currentDoorRef.needsItemToUnlock + "\nto open this door.", 0, 0);
    pop();
}

function drawPlayerHUD() {
    drawInventory();
    drawGeigerCounter();
    drawFlashlightStatus();
    drawBodyRadiation();
    drawGunInfo();
    drawHealthBar();
    drawLivesLeft();
    drawStaminaBar();
    drawHazmatSuitMeter();
    drawBossHealth();
    drawFacilitySelfDestructTimer();
    showHintItemText();
    drawMiniMap();
    drawHelp();
}

function drawLivesLeft() {
    push();
    translate(width/2-(heart_img.width*MAX_PLAYER_LIVES/2)-((MAX_PLAYER_LIVES-1)*30), height-100);
    for (let i = 0; i < currentLevel.player.lives; i++) {
        image(heart_img, -heart_img.width/2, heart_img.height/2);
        translate(heart_img.width+30, 0);
    }
    pop();
}

function drawHealthBar() {
    push();
    translate(50, height-100);
    fill(255, 255, 255);
    textFont(character_speech_font);
    textSize(30);
    text("Health:", 0, 10);
    translate(80, 0);
    rect(20, 0, 100, 10);
    fill(255, 0, 0);
    rect(20, 0, map(currentLevel.player.health, 0, MAX_PLAYER_HEALTH, 0, 100), 10);
    pop();
}

function drawStaminaBar() {
    push();
    translate(50, height-150);
    fill(255, 255, 255);
    textFont(character_speech_font);
    textSize(30);
    text("Stamina:", 0, 10);
    translate(100, 0);
    rect(0, 0, 100, 10);
    fill(0, 0, 255);
    rect(0, 0, map(currentLevel.player.stamina, 0, MAX_PLAYER_STAMINA, 0, 100), 10);
    pop();
}

function drawInventory() {
    const l = currentLevel.player.inventory.length;
    if (l <= 0) return;
    push();
    fill('white');
    textAlign(CENTER);
    translate(width/2-(l*50), height-150);
    for (let i = 0; i < l; i++) {
        let item = currentLevel.player.inventory[i];
        let itemImage = item.animation[0];
        let itemName = item.name;
        image(itemImage, -itemImage.width/2, -itemImage.height/2);
        text(itemName, 0, (-itemImage.height/2));
        translate(100, 0);
    }
    pop();
}

function drawGeigerCounter() {
    push();
    translate(width-320, height-150);
    fill(255, 255, 255);
    image(nuclear_img, 0, 0);
    translate(nuclear_img.width + 20, nuclear_img.height/2+10);
    textFont(geiger_counter_font);
    textStyle(BOLD);
    textSize(35);
    stroke(255, 255, 255);
    text((currentLevel.player.getAreaRadiation() + " CPM"), 0, 0);
    pop();
}

function drawFlashlightStatus() {
    const amount = round(map(currentLevel.player.flashlight_battery, 0, FLASHLIGHT_MAXIMUM_BATTERY, 0, 4));
    push();
    translate(width-100, height-250);
    scale(2, 2);
    for (let i = 0; i < amount; i++) {
        image(battery_img, -battery_img.width/2, -battery_img.height/2);
        translate(0, -battery_img.height/2-30);
    }
    pop();
}

function drawBodyRadiation() {
    const radAmount = currentLevel.player.radiationAmount;
   
    if (radAmount <= 0) return;
    let radImage = radAmount <= MAX_RADIATION_ALLOWED/3 ? lowRad_img : (radAmount <= MAX_RADIATION_ALLOWED*(2/3) ? medRad_img : highRad_img);
    push();
    translate(PLAYER_FIXED_POSITION);
    translate(0, -80);
    image(radImage, -radImage.width/2, -radImage.height/2);
    pop();
}

function drawHazmatSuitMeter() {
    const hazmatRes = currentLevel.player.hazmatResistance;
    if (hazmatRes <= 0) return;
    push();
    translate(PLAYER_FIXED_POSITION);
    translate(0, 50);
    rectMode(CENTER);
    fill(255, 255, 255);
    rect(0, 0, 50, 20);
    fill(255, 162, 0);
    rect(0, 0, map(hazmatRes, 0, HAZMAT_SUIT_RAD_RESISTANCE, 0, 50), 20);
    pop();
}

function drawGunInfo() {
    push();
    translate(80, height-250);
    fill(255, 255, 255);
    textFont(character_speech_font);
    textSize(30);
    if (currentLevel.player.currentWeapon.name == "Rifle") {
        image(rifle_ammo_img, -rifle_ammo_img.width/2-20, -rifle_ammo_img.height/2-5);
        // translate(rifle_ammo_img.width + 20, 10);
        text(currentLevel.player.bullets, 0, 0);
    }
    else if (currentLevel.player.currentWeapon.name == "RPG") {
        image(rocket_img, 0, 0);
        translate(rocket_img.width + 20, 10);
        text(currentLevel.player.rocketsNum, 0, 0);
    }
    pop();
}

function drawFacilitySelfDestructTimer() {
    if (!facility_self_destruct_active) return;
    push();
    translate(width/2-300, 300);
    textFont(character_speech_font);
    textSize(70);
    fill(255, 0, 0);
    text("Self destruction in: " + round((facility_self_destruct_timer/getTargetFrameRate()), 2), 0, 0);
    text("seconds", 500, 0);
    pop();
}

function drawBossHealth() {
    if (!has_bossfight_started || !bossNPC.isAlive()) return;
    push();
    translate(width/2, 50);
    textFont(character_speech_font);
    textSize(40);
    fill(0, 255, 0);
    textAlign(CENTER);
    text("General Fang", 0, 0);
    translate(0, 40);
    rectMode(CENTER);
    fill(255, 255, 255);
    rect(0, 0, 500, 50);
    fill(255, 0, 0);
    rect(0, 0, map(bossNPC.health, 0, MAX_BOSS_HEALTH, 0, 500), 50);
    pop();
}

function drawMiniMap() {
    if (!keyMiniMap) return;
    image(game_mini_map, 0, 0);
}

function drawHelp() {
    if (!keyHelp) return;
    image(help_image, 0, 0);
}

function drawFinalScreen() {
    if (currentGameState == LOST_STATE) {
        drawLostScreen();
    }
    else if (currentGameState == WON_1_STATE) {
        drawWon1Screen();
    }
    else if (currentGameState == WON_2_STATE) {
        drawWon2Screen();
    }
    else if (currentGameState == WON_3_STATE) {
        drawWon3Screen();
    }
}

function drawLostScreen() {
    push();
    fill(0);
    rect(0, 0, width, height);
    fill(255, 0, 0);
    textAlign(CENTER);
    translate(width/2, height/2);
    textFont(character_speech_font);
    textSize(50);
    text(getFinalScreenText(lostText), 0, 0);
    pop();
}

function drawWon1Screen() {
    // Killed the boss AND self destruct
    push();
    fill(0, 255, 0);
    rect(0, 0, width, height);
    fill(0);
    textAlign(CENTER);
    translate(width/2, height/2);
    textFont(character_speech_font);
    textSize(40);
    text(getFinalScreenText(won1Text), 0, 0);
    pop();
}

function drawWon2Screen() {
    // Killed the boss BUT NO self destruct
    push();
    fill(0, 255, 0);
    rect(0, 0, width, height);
    fill(0);
    textAlign(CENTER);
    translate(width/2, height/2);
    textFont(character_speech_font);
    textSize(40);
    text(getFinalScreenText(won2Text), 0, 0);
    pop();
}

function drawWon3Screen() {
    // Just escaped no kill no nothing
    push();
    fill(0);
    rect(0, 0, width, height);
    fill(255, 0, 0);
    textAlign(CENTER);
    translate(width/2, height/2);
    textFont(character_speech_font);
    textSize(40);
    text(getFinalScreenText(won3Text), 0, 0);
    pop();
}

function getFinalScreenText(txt) {
    if (cIndexFinalScreen >= txt.length-1) return txt;
    if (finalScreenTextTimer <= 0) {
        cIndexFinalScreen++;
        finalScreenTextTimer = FINAL_SCREEN_TEXT_TIMER;
        if (cIndexFinalScreen >= txt.length-1) return txt;
        return txt.substring(0, cIndexFinalScreen);
    }
    finalScreenTextTimer--;
    return txt.substring(0, cIndexFinalScreen);
}

function getStartScreenText(txt) {
    if (cIndexStartScreen >= txt.length-1) return txt;
    if (finalScreenTextTimer <= 0) {
        cIndexStartScreen++;
        finalScreenTextTimer = FINAL_SCREEN_TEXT_TIMER/2;
        if (cIndexStartScreen >= txt.length-1) return txt;
        return txt.substring(0, cIndexStartScreen);
    }
    finalScreenTextTimer--;
    return txt.substring(0, cIndexStartScreen);
}

function drawStartScreen() {
    if (!played_begin) {
        startSoundTimer--;
        if (startSoundTimer <= 0) {
            begin_boom_sound.play();
            played_begin = true;
        }
    }
    push();
    fill(0);
    rect(0, 0, width, height);
    textAlign(CENTER);
    translate(width/2, height/2);
    fill(255, 0, 0);
    textFont(character_speech_font);
    textSize(40);
    text(getStartScreenText(startText), 0, 0);
    pop();
    if (cIndexStartScreen >= startText.length-1) {
        if (startGameEndTimer <= 0) {
            StartGame();
            return;
        }
        startGameEndTimer--;
    }
}
