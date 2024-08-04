class Consumable extends Item {
    constructor(pos, animation, cType, addition, destructable=false, name) {
        super(pos, name, animation);
        this.cType = cType;
        this.addition = addition;
        this.name = name;
        this.initialPos = this.pos.copy();
        this.changePosAnimationAmount = 20;
        this.animVel = createVector(0, 1);
        this.destructable = destructable;
        this.destroyTimer = CONSUMABLE_DESTROY_IN_SECONDS;
    }

    update() {
        if (keyHelp || keyMiniMap) return;
        this.pos.add(this.animVel);
        if (this.pos.y < this.initialPos.y-this.changePosAnimationAmount || this.pos.y > this.initialPos.y) {
            this.animVel.mult(-1);
        }
        super.handleAnimation();
        this.handleDestroy();
    }

    use(player) {
        pickup_sound.stop();
        pickup_sound.play();
        this.destroyMe(player);
    }

    destroyMe() {
        const i = currentLevel.items.indexOf(this);
        if (i < 0) {
            print("Consumable " + this.name + " in level " + currentLevel.levelName + " is invalid in destroyMe()");
            return false;
        }
        currentLevel.items.splice(i, 1);
        return true;
    }

    handleDestroy() {
        if (!this.destructable) return;
        if (this.destroyTimer <= 0) {
            this.destroyMe();
            return;
        }
        this.destroyTimer--;
    }
}

class ConsumableHealth extends Consumable {
    constructor(pos, animation=[medpack_img], cType=C_HEALTH_TYPE, addition=30, name="Med Pack") {
        super(pos, animation, cType, addition, true, name);
    }

    use(player) {
        const bConsumed = player.addHealth(this.addition);
        if (!bConsumed) return false;
        super.use(player);
        return true;
    }
}


class ConsumableSuperHealth extends Consumable {
    constructor(pos, animation=[medpack_super_img], cType=C_SUPERHEALTH_TYPE, addition=100, name="Trauma Kit") {
        super(pos, animation, cType, addition, true, name);
    }

    use(player) {
        const bConsumed = player.addHealth(this.addition);
        if (!bConsumed) return false;
        super.use(player);
        return true;
    }
}


class ConsumableAntiRad extends Consumable {
    constructor(pos, animation=[antirad_img], cType=C_RADDRUG_TYPE, addition=20000, name="Anti Rad Drug") {
        super(pos, animation, cType, addition, true, name);
    }
    use(player) {
        const bConsumed = player.reduceRadiation(this.addition);
        if (!bConsumed) return false;
        super.use(player);
        return true;
    }
}

class ConsumableBattery extends Consumable {
    constructor(pos, animation=[battery_img], cType=C_BATTERY_TYPE, addition=FLASHLIGHT_MAXIMUM_BATTERY/2, name="Flashlight Battery") {
        super(pos, animation, cType, addition, true, name);
    }
    use(player) {
        const bConsumed = player.addFlashlightBattery(this.addition);
        if (!bConsumed) return false;
        super.use(player);
        return true;
    }
}

class ConsumableFlashlight extends Consumable {
    constructor(pos, animation=[flashlight_img], cType=C_FLASHLIGHT_TYPE, addition, name="Flashlight") {
        super(pos, animation, cType, addition, false, name);
    }
    use(player) {
        player.addFlashlight();
        super.use(player);
        return true;
    }
}

class ConsumableAmmo extends Consumable {
    constructor(pos, animation=[rifle_ammo_img], cType=C_AMMO_TYPE, addition=15, name="Rifle Ammo") {
        super(pos, animation, cType, addition, true, name);
    }
    use(player) {
        const bConsumed = player.addBullets(this.addition);
        if (!bConsumed) return false;
        super.use(player);
        return true;
    }
}

class ConsumableRocket extends Consumable {
    constructor(pos, animation=[rocket_img], cType=C_ROCKET_TYPE, addition=2, name="Rocket Ammo", disappearing=false) {
        super(pos, animation, cType, addition, disappearing, name);
    }
    use(player) {
        const bConsumed = player.addRockets(this.addition);
        if (!bConsumed) return false;
        super.use(player);
        return true;
    }
}

class ConsumableHazmatSuit extends Consumable {
    constructor(pos, animation=[hazmat_img], cType=C_HAZMAT_TYPE, addition, name="Hazmat Suit") {
        super(pos, animation, cType, addition, true, name);
    }
    use(player) {
        const bConsumed = player.addHazmatSuit();
        if (!bConsumed) return false;
        super.use(player);
        return true;
    }
}

class ConsumableRPG extends Consumable {
    constructor(pos, animation, cType=C_RPG_TYPE, addition, name="RPG") {
        super(pos, animation, cType, addition, false, name);
    }
    use(player) {
        if (player.alreadyHasRPG()) {
            const bConsumed = player.addRockets(1);
            if (!bConsumed) return false;
            super.use(player);
            return true;
        }
        player.addRPG();
        super.use(player);
        return true;
    }
}
