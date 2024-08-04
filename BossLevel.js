class BossLevel extends Level {
    constructor(gameMap, levelName, player, ambienceMusic, radiation_areas, NPCs, isDark=true, shouldChangeDarkMode=false, changeDarkEverySeconds=5) {
      super(gameMap, levelName, player, ambienceMusic, radiation_areas, NPCs, isDark, shouldChangeDarkMode, changeDarkEverySeconds);
    }
  
    update() {
      super.update();
    }
    
    initializeBossFight() {
      this.ambienceMusic.stop();
      this.ambienceMusic = bossfight_music;
      this.ambienceMusic.loop();
      this.changeDarkEverySeconds = random(MIN_CHANGE_DARKMODE_EVERY_SECONDS, MAX_CHANGE_DARKMODE_EVERY_SECONDS);
      this.shouldChangeDarkMode = true;
      this.player.lives = 5;
    }

    restartLevel() {
      currentLevel.player.addHazmatSuit(HAZMAT_SUIT_RAD_RESISTANCE);
      super.restartLevel();
    }

    initializeLevel() {
      super.initializeLevel();
      if (this.player != null && !has_bossfight_started) {
        if (this.player.getItemIndexInInvetory("Master Key") === -1) {
          boss_say_come_here.stop();
          boss_say_come_here.play();
        }
      }
    }
}
