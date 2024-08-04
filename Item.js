class Item {
    constructor(pos, name, animation) {
        this.pos = pos;
        this.animation = animation;
        this.currentIndex = 0;
        this.currentImg = animation[0];
        this.name = name;
        this.is_on = true;
    }

    update() {
        if (keyHelp || keyMiniMap) return;
        this.handleAnimation();
    }

    handleAnimation() {
        if (!this.isAnimated()) return;
        if (!canPlayAnimaion(3)) return;
        this.currentIndex++;
        if (this.currentIndex >= this.animation.length-1) this.currentIndex = 0;
    }

    drawMe(player) {
        if (!this.shouldDraw(player)) return;
        push();
        translate(getDrawLocationTranslate(player, this.pos));
        this.currentImg = this.isAnimated() ? this.animation[this.currentIndex] : this.animation[0];
        image(this.currentImg, this.currentImg.width/2, this.currentImg.height/2);
        pop();
    }

    isAnimated() {  // Non-animated items are just an array of length 1
        return this.animation.length > 1;
    }

    isOverlapping(c, diff=null) {
        if (diff == null) {
          diff = p5.Vector.sub(c.pos, this.pos);
        }
        return (abs(diff.x) < (c.w/2 + this.currentImg.width/2) && abs(diff.y) < (c.h/2+this.currentImg.height/2));
    }

    shouldDraw(player) {
        return this.pos.dist(player.pos) <= width;
    }

    use(player) {
        return false;
    }

    destroyMe(player) {
        const i2 = currentLevel.items.indexOf(this);
        if (i2 != -1) currentLevel.items.splice(i2, 1);
    }
}

class PickableItem extends Item {
    constructor(pos, name, animation) {
        super(pos, name, animation);
    }

    destroyMe(player) {
        const i = player.getItemIndexInInvetory(this.name);
        if (i != -1) {
            player.removeItemFromInventory(i, false);
        }
        else {
            super.destroyMe(player);
        }
    }

    use(player) {
        const bResult = player.addItemToInventory(itemRef);
        return bResult;
    }
}


class PickableItemOnce extends PickableItem {
    constructor(pos, name, animation) {
        super(pos, name, animation);
    }

    use(player) {
        const bResult = player.addItemToInventory(this, true);
        pickup_sound.stop();
        pickup_sound.play();
        return bResult;
    }
}