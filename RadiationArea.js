class RadiationArea {
  constructor(pos, rad, maxRadiationAtCenter) {
    this.pos = pos;
    this.rad = rad;
    this.maxRadiationAtCenter = maxRadiationAtCenter;
  }
  
  getRadiationAppliedToCharacter(c) {
    return map(this.pos.dist(c.pos)+1, 0, this.rad, this.maxRadiationAtCenter, 0);
  }
  
  handleApplyRadiation(c) {
    const radiation = this.getRadiationAppliedToCharacter(c);
    if (radiation < 0.01) return 0;
    c.applyRadiation(radiation);
    return radiation;  // For HUD
  }

  inRange(c) {
    return abs(c.pos.x - this.pos.x) < (c.w/2+this.rad) && abs(c.pos.y - this.pos.y) < (c.h/2+this.rad);
  }

  drawDebug(player) {
    push();
    if (!this.shouldDraw(player)) return;
    translate(getDrawLocationTranslate(player, this.pos, true, this.rad, this.rad));
    fill(255, 100, 0, 50);
    circle(0, 0, this.rad*2);
    pop();
  }

  shouldDraw(player) {
    return this.pos.dist(player.pos) <= width;
  }
}
