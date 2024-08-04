class EnemySpawner {
    constructor(pos, img, spawnEverySeconds=round(random(0, MAX_SPAWN_ENEMY_EVERY_SECONDS*3))) {
        this.pos = pos;
        this.img = img;
        this.spawnEverySeconds = spawnEverySeconds;
    }

    update() {
        if (!this.shouldDraw(currentLevel.player) || keyHelp || keyMiniMap) return;
        this.handleSpawnEnemy();
    }

    drawMe(player) {
        if (!this.shouldDraw(player) || keyHelp) return;
        push();
        translate(getDrawLocationTranslate(player, this.pos));
        // scale(1.04, 1.04);
        noTint();
        image(this.img, -this.img.width/2, -this.img.height/2);
        pop();
      }
      
      shouldDraw(player, mult=1) {
        return this.pos.dist(player.pos) <= mult*width;
      }

    handleSpawnEnemy() {
        if (!currentLevel.canSpawnEnemies()) return;
        if (this.spawnEverySeconds <= 0) {
            this.spawnEnemy();
            this.spawnEverySeconds = round(random(MIN_SPAWN_ENEMY_EVERY_SECONDS, MAX_SPAWN_ENEMY_EVERY_SECONDS));
            return;
        }
        this.spawnEverySeconds--;
    }

    spawnEnemy() {
        const eType = round(random(1,2));
        if (eType == 1) {
            currentLevel.NPCs.push(new BaseEnemy("Enemy", this.pos.copy(), BASE_CHARACTER_WIDTH, BASE_CHARACTER_HEIGHT, 0.8, round(random(2,4)), enemy_hurt_sound, enemy_death_sound, enemy_attack_sound, enemy_random1_sound, enemy_random2_sound, null, true));
        }
        else {
            currentLevel.NPCs.push(new Enemy2("Enemy 2", this.pos.copy(), BASE_CHARACTER_WIDTH, BASE_CHARACTER_HEIGHT, 0.8, round(random(2,4)), enemy_hurt_sound, enemy_death_sound, enemy_attack_sound, enemy_random1_sound, enemy_random2_sound, null, true));
        }
    }

    handleCharacterCollision(c) {
        if (c != currentLevel.player) return;
        const bResult = super.handleCharacterCollision(c);
        if (!bResult) return;
        c.reduceHealth(1);
    }
}
