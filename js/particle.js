class Particle {
  constructor(x, y, vx, vy, life, color = '#ff0000', size = 5) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.size = size;
    this.alpha = 1;
  }

  update(deltaTime) {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.vy += 200 * deltaTime;
    this.life -= deltaTime;
    this.alpha = this.life / this.maxLife;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.life <= 0;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count, color = '#ff0000', vxRange = [-100, 100], vyRange = [-200, -50]) {
    for (let i = 0; i < count; i++) {
      const vx = Utils.randomRange(vxRange[0], vxRange[1]);
      const vy = Utils.randomRange(vyRange[0], vyRange[1]);
      const size = Utils.randomRange(2, 5);
      const life = Utils.randomRange(0.5, 1.5);
      this.particles.push(new Particle(x, y, vx, vy, life, color, size));
    }
  }

  emitBlood(x, y, count = 10) {
    this.emit(x, y, count, '#8b0000', [-150, 150], [-300, -50]);
  }

  emitSmoke(x, y, count = 8) {
    this.emit(x, y, count, '#666666', [-50, 50], [-100, -30]);
  }

  emitExplosion(x, y, count = 20) {
    this.emit(x, y, count, '#ff6600', [-200, 200], [-400, -100]);
    this.emit(x, y, count / 2, '#ffcc00', [-150, 150], [-300, -80]);
  }

  emitMuzzleFlash(x, y, count = 5) {
    this.emit(x, y, count, '#ffff00', [-100, 100], [-50, 50]);
  }

  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(deltaTime);
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }

  clear() {
    this.particles = [];
  }
}
