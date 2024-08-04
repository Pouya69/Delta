class Explosion {
    constructor(pos, explosionSoundd=explosion_sound) {
        this.pos = pos;
        this.currentAnimationIndex = 0;
        this.currentImageRef = rpg_explosion_animation[0];
        this.explosionSound = explosionSoundd;
        this.explosionSound.stop();
        this.explosionSound.play();
    }

    update() {
        if (keyHelp || keyMiniMap) return;
        if (canPlayAnimaion()) {
            this.currentAnimationIndex++;
            if (this.currentAnimationIndex >= rpg_explosion_animation.length-1) {
                const index = currentLevel.explosions.indexOf(this);
                if (index < 0) return;
                currentLevel.explosions.splice(index, 1);
            }
            this.currentImageRef = rpg_explosion_animation[this.currentAnimationIndex];
        }
    }

    drawMe(player) {
        if (!this.shouldDraw(player)) return;
        push();
        translate(getDrawLocationTranslate(player, this.pos));
        image(this.currentImageRef, -this.currentImageRef.width/2, -this.currentImageRef.height/2);
        pop();
    }

    shouldDraw(player) {
        return this.pos.dist(player.pos) <= width;
    }
}
