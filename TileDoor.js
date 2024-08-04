class TileDoor extends Tile {
    constructor(pos, img, is_locked=false, needsItemToUnlock, levelAttached, levelAttachedSpawnPoint=createVector()) {
        super(pos, img, true);
        this.is_locked = is_locked;
        this.needsItemToUnlock = needsItemToUnlock;
        this.levelAttached = levelAttached;
        this.levelAttachedSpawnPoint = levelAttachedSpawnPoint;
        this.collision_enabled = true;
        this.is_open = false;
        this.imgOpen = door_tile_open_img;
    }
    
    drawMe(player) {
        if (!this.shouldDraw(player)) return;
        push();
        translate(getDrawLocationTranslate(player, this.pos));
        if (this.is_open) {
            if (this.hasNextLevel()) {
                fill(0);
                rect(-FINAL_TILE_SIZE/2, -FINAL_TILE_SIZE/2, FINAL_TILE_SIZE, FINAL_TILE_SIZE);
            }
            else {
                noTint();
                image(this.imgOpen, -this.imgOpen.width/2, -this.imgOpen.height/2);
            }
        }
        else {
            noTint();
            image(this.img, -this.img.width/2, -this.img.height/2);
            //image(this.img, GLOBAL_SCALE_TILES*-this.img.width/2, GLOBAL_SCALE_TILES*-this.img.height/2);
        }
        pop();
    }

    goToAttachedLevel() {
        if (!this.hasNextLevel()) return false;
        goToLevel(this.levelAttached, this.levelAttachedSpawnPoint);
        return true;
    }
    
    unlock(player) {
        this.is_locked = false;
        this.is_open = true;
        this.collision_enabled = false;
        door_unlock_sound.stop();
        door_unlock_sound.play();
    }

    hasNextLevel() {
        return this.levelAttached != null;
    }

    interactDoor(player) {
        if (!this.is_locked) {
            const bResult = this.goToAttachedLevel();
            if (!bResult) {
                // When there is no next level
                this.is_open = !this.is_open;
                this.collision_enabled = !this.collision_enabled;
                return true;
            }
            return bResult;
        }
        const index = player.getItemIndexInInvetory(this.needsItemToUnlock);
        if (index == -1) {
            hintTextTimer = HINT_TIMER;
            currentDoorRef = this;
            return false;
        }
        if (this.needsItemToUnlock != "Master Key") {
            player.removeItemFromInventory(index, false);
        }
        this.unlock();
        return true;
    }
}

class FinalTileDoor extends TileDoor {
    constructor(pos, img, is_locked=true, needsItemToUnlock="Master Key", levelAttached=null, levelAttachedSpawnPoint=createVector()) {
        super(pos, img, is_locked, needsItemToUnlock, levelAttached, levelAttachedSpawnPoint);
    }

    unlock() {
        EndGame();
    }
}