class ConsumableSpawner {
    constructor(pos, img, spawnEverySeconds=round(random(0, MAX_SPAWN_CONSUMABLE_EVERY_SECONDS*3))) {
        this.pos = pos;
        this.img = img;
        this.spawnEverySeconds = spawnEverySeconds;
        this.spawnRadius = 100;
    }

    update() {
        if (keyHelp || keyMiniMap) return;
        this.handleSpawnConsumable();
    }

    drawMe(player) {
        if (!this.shouldDraw(player)) return;
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

    handleSpawnConsumable() {
        if (this.spawnEverySeconds <= 0) {
            this.spawnConsumable();
            this.spawnEverySeconds = round(random(MIN_SPAWN_CONSUMABLE_EVERY_SECONDS, MAX_SPAWN_CONSUMABLE_EVERY_SECONDS));
            return;
        }
        this.spawnEverySeconds--;
    }

    spawnConsumable() {
        currentLevel.spawnRandomConsumableAtLocation(this.pos.copy().add(createVector(random(0, this.spawnRadius), random(0, this.spawnRadius))))
    }

    handleCharacterCollision(c) {
        if (c != currentLevel.player) return;
        const bResult = super.handleCharacterCollision(c);
        if (!bResult) return;
        c.reduceHealth(1);
    }
}
