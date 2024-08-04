// PLEASE PRESS F11 (go to fullscreen mode in your browser) when starting the game to have the best experience!

const WIDTH = window.screen.availWidth;
const HEIGHT = window.screen.availHeight;

function preload() {
  loadFonts();
  loadAnimations();
  loadSounds();
  frameRate(30);
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  initVariables();
  InitializeControls();
  loadSpriteSheets();
  initializeAllLevels();
  initializeAllCutscenes();
  changeGameState(START_GAME_STATE);
}

function draw() {
  background(1, 1, 26);
  if (currentLevel == null) {
    return;
  }
  if (isInStartGameState()) {
    drawStartScreen();
    return;
  }
  if (isGameFinished()) {
    drawFinalScreen();
    return;
  }
  if (isInCutscene()) {
    drawCurrentCutscene();
    return;
  }
  drawAndHandleCurrentLevel();
  currentLevel.player.drawMe();
  currentLevel.player.update();  // Player and HUD and post processing should be the last thing to be drawn
  drawAndHandleLight();
  drawAndHandleExplosions();
  drawPostProcessing();
  drawPlayerHUD();
}
