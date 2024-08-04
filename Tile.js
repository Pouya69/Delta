class Tile {
  constructor(pos, img, collision_enabled=false) {
    this.pos = pos;
    this.img = img;
    this.collision_enabled = collision_enabled;
  }
  
  update() {
    if (!isGameOngoing() || keyHelp || keyMiniMap) return;
  }
  
  handleCollision(c) {
    if (!this.collision_enabled) return false;
    let diff = p5.Vector.sub(c.pos, this.pos);
    if (this.isOverlapping(c, diff)) {
      c.pos.x += diff.x*0.08;
      c.pos.y += diff.y*0.08;
      c.vel.mult(0.0);
      return true;
    }
    return false;
  }

  handleProjectileCollision(p) {
    if (!this.collision_enabled) return false;
    let diff = p5.Vector.sub(p.pos, this.pos);
    if (this.isOverlapping(p, diff, true)) {
      this.tileDamaged();
      return true;
    }
    return false;
  }
  
  isOverlapping(c, diff=null, isBullet=false) {
    if (diff == null) {
      diff = p5.Vector.sub(c.pos, this.pos);
    }
    if (isBullet) {
      return (abs(diff.x) < (c.currentImgRef.width/2 + this.img.width/2) && abs(diff.y) < (c.currentImgRef.height/2+this.img.height/2));
    }
    else {
      return (abs(diff.x) < (c.w/2 + this.img.width/2) && abs(diff.y) < (c.h/2+this.img.height/2));
    }
  }
  
  drawMe(player) {
    if (!this.shouldDraw(player)) return;
    push();
    translate(getDrawLocationTranslate(player, this.pos));
    // translate( -player.pos.x + PLAYER_FIXED_POSITION.x + this.pos.x, -player.pos.y + PLAYER_FIXED_POSITION.y + this.pos.y);
    // scale(1.04, 1.04);
    noTint();
    //rect(-FINAL_TILE_SIZE/2, -FINAL_TILE_SIZE/2, FINAL_TILE_SIZE, FINAL_TILE_SIZE);
    image(this.img, -this.img.width/2, -this.img.height/2);
    pop();
  }
  
  shouldDraw(player) {
    return this.pos.dist(player.pos) <= width+100;
  }

  tileDamaged() {}
}