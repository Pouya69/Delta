let keyUp, keyDown, keyRight, keyLeft, keySprint, keyMiniMap, keyHelp = false;
let upVector, downVector, rightVector, leftVector;


function InitializeControls() {
  upVector = createVector(0, -PLAYER_BASE_SPEED);
  downVector = createVector(0, PLAYER_BASE_SPEED);
  rightVector = createVector(PLAYER_BASE_SPEED, 0);
  leftVector = createVector(-PLAYER_BASE_SPEED, 0);
}

function keyPressed() {
  if (currentLevel == null) return;
  if (isGameFinished()) return;
  if (keyCode === ENTER) {
    if (isInCutscene()) {
      current_cutscene.goToNextLine();
      return;
    }
    // else if (isInStartGameState()) {
    //   StartGame();
    //   return;
    // }
    currentLevel.player.interact();
  }
  if (isGameFinished() || isInCutscene() || isInStartGameState()) return;
  if (key == "h" || key == "H") {
    keyHelp = true;
  }
  if (key == "m" || key == "M") {
    keyMiniMap = true;
  }
  if (keyHelp || keyMiniMap) {
    return;
  }
  if (key == " ") {
    currentLevel.player.attack();
  }
  if (key == "W" || key == "w") keyUp = true;
  if (key == "A" || key == "a") keyLeft = true;
  if (key == "S" || key == "s") keyDown = true;
  if (key == "D" || key == "d") keyRight = true;
  if (key == "Shift") keySprint = true;
  if (key == "f" || key == "F") {
    currentLevel.player.toggleFlashlight();
  }
  if (keyCode === 219) {
    currentLevel.player.equipWeapon(1);
  }
  else if (keyCode === 221) {
    currentLevel.player.equipWeapon(2);
  }
  
}

function keyReleased() {
  if (isGameFinished() || isInCutscene()) return;
  if (key == "W" || key == "w") keyUp = false;
  if (key == "A" || key == "a") keyLeft = false;
  if (key == "S" || key == "s") keyDown = false;
  if (key == "D" || key == "d") keyRight = false;
  if (key == "Shift") keySprint = false;
  if (key == "m" || key == "M") {
    keyMiniMap = false;
  }
  if (key == "h" || key == "H") {
    keyHelp = false;
  }
}