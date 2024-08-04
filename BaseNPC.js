class BaseNPC extends BaseCharacter {
    constructor(name, pos, w, h, dampRate, health, hurtSound, deathSound, attackSound, normalRandomSound1, normalRandomSound2, cutsceneAttached=null, cutsceneOnceOnly=false, itemDropOnDeath="", itemDropAnimation=[]) {
        super(name, pos, w, h, dampRate, health, hurtSound, deathSound, attackSound, normalRandomSound1, normalRandomSound2, cutsceneAttached, cutsceneOnceOnly);
        this.isVillified = false;
        this.changeDirectionTimer = round(random(MIN_ENEMY_CHANGE_DIRECTION_EVERY_SECONDS, MAX_ENEMY_CHANGE_DIRECTION_EVERY_SECONDS));
        this.AIAcceleration = createVector(random(0, 0.1), random(0, 0.1));
        this.itemDropOnDeath = itemDropOnDeath;
        this.itemDropAnimation = itemDropAnimation;
        this.has_dropped_item = false;
        this.playerCollisionEnabled = false;
        this.cutsceneAttached = null;
        this.should_move = false;
        this.stopMovingTimer = STOP_MOVING_TIMER;
    }
    
    update() {
      super.update();
      if (!this.isAlive() || keyHelp || keyMiniMap) return;
      this.handleStopping();
      this.handleAIMovement(currentLevel.player);
    }

    interactNPC(player) {
        if (!this.cutsceneAttached || !this.isAlive()) return false;
        this.cutsceneAttached.resetCutscene();
        current_cutscene = this.cutsceneAttached;
        return true;
    }

    handleRandomSound() {
      if (!this.isInRange(currentLevel.player)) return;+
      super.handleRandomSound();
    }
    
    handleCollisions() {
      if (facility_self_destruct_active) return;
      super.handleCollisions();
    }
    
    /*handleCollisions() {
      for (let i = 0; i < currentLevel.gameMap.length; i++) {
        let tile = currentLevel.gameMap[i];
        tile.handleCollision(this);
      }
    }*/

    handleAIMovement(player, mult=1) {
      if (!this.isInRange(player, mult)) {
        this.handleChangeDirection();
        if (this.should_move) {
          this.accelerate(this.AIAcceleration);
          return false;
        }
      }
      else {
        this.is_looking_right = this.pos.x < player.pos.x;
        return true;
      }
    }

    handleStopping() {
      if (this.stopMovingTimer <= 0) {
        this.should_move = !this.should_move;
        this.stopMovingTimer = STOP_MOVING_TIMER;
        return;
      }
      this.stopMovingTimer--;
    }

    handleChangeDirection() {
      if (this.changeDirectionTimer <= 0) {
        this.changeDirectionTimer = round(random(MIN_ENEMY_CHANGE_DIRECTION_EVERY_SECONDS, MAX_ENEMY_CHANGE_DIRECTION_EVERY_SECONDS));
        this.should_move = true;
        this.is_looking_right = round(random(1,2)) == 1;
        if (!this.should_move) return;
        this.AIAcceleration.set(random(0.1, 0.4), random(0.1, 0.4));
        if (!this.is_looking_right) {
          this.AIAcceleration.mult(-1);
        }
        return;
      }
      this.changeDirectionTimer--;
    }

    handleCharacterCollision(c, cRange=0) {
      if (facility_self_destruct_active) return false;
      return super.handleCharacterCollision(c, cRange);
    }

    die() {
      if (!this.has_dropped_item) {
        if (this.itemDropOnDeath != "") {
          if (this.itemDropOnDeath === "Flashlight") {
            currentLevel.items.push(new ConsumableFlashlight(this.pos.copy(), this.itemDropAnimation));
          }
          else {
            currentLevel.items.push(new PickableItemOnce(this.pos.copy(), this.itemDropOnDeath, this.itemDropAnimation));
          }
          
          this.has_dropped_item = true;
        }
      }
      super.die();
    }

    drawMe(player) {
      if (facility_self_destruct_active) return;
      super.drawMe(player);
    }

    initAnims() {
      this.idle_animation = npc_idle_animaion;
      this.walking_RIGHT_animation = npc_walk_animaion;
      this.sprinting_RIGHT_animation = null;
      this.death_animation = npc_dead_animaion;
      this.hurt_animation = npc_hurt_animaion;
      this.currentImageRef = this.idle_animation[0];
    }
}
