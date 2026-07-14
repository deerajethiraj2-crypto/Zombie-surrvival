class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = 0;
    this.vy = 0;
    this.active = true;
  }

  update(deltaTime) {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
  }

  draw(ctx) {}

  getCollisionBox() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  getDistance(entity) {
    return Utils.distance(this.x, this.y, entity.x, entity.y);
  }

  getAngle(entity) {
    return Utils.angle(this.x, this.y, entity.x, entity.y);
  }
}

class Bullet extends Entity {
  constructor(x, y, angle, speed, damage, range = 1000) {
    super(x, y, 4, 4);
    this.angle = angle;
    this.speed = speed;
    this.damage = damage;
    this.maxRange = range;
    this.travelDistance = 0;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.travelDistance += this.speed * deltaTime;
    if (this.travelDistance > this.maxRange) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x - this.vx * 0.2, this.y - this.vy * 0.2);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  }
}

class Projectile extends Entity {
  constructor(x, y, vx, vy, damage, radius = 15, life = 5) {
    super(x, y, radius * 2, radius * 2);
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.radius = radius;
    this.life = life;
    this.gravity = 200;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.vy += this.gravity * deltaTime;
    this.life -= deltaTime;
    if (this.life <= 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  explode() {
    this.active = false;
    return true;
  }
}
