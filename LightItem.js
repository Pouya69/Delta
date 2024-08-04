class LightItem extends Item {
    constructor(pos, name, animation, is_on=true) {
        super(pos, name, animation);
        this.is_on = is_on;
    }

    destroyMe(player) {}

    handleAnimation() {
        if (!this.is_on) {
            this.currentIndex = this.animation.length-1;
            return;
        }
        super.handleAnimation();
    }

    use(player) {
        lightSwitchSound.stop();
        lightSwitchSound.play();
        this.is_on = !this.is_on;
        return super.use(player);
    }
    
}
