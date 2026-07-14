class Zombie extends Entity {
  constructor(x, y, type = 'WALKER') {
    const data = GAME_CONSTANTS.ZOMBIES[type];
    super(x, y, data.size * 2, data.size * 2);
    this.type = type;
    this.name = data.name;
    this.health = data.health;
    this.maxHealth = data.health;
    this.speed = data.speed;
    this.damage = data.damage;
    this.attackCooldown = data.attackCooldown;
    this.attackRange = data.range;
    this.xpReward = data.xpReward;
    this.moneyReward = data.moneyReward;
    this.icon = data.icon;
    this.lastAttackTime = 0;
    this.targetPlayer = null;
    this.state = 'idle';
    this.patrolPoint = { x, y };
    this.lastKnownPlayerPos = null;
  }

  takeDamage(damage, isCrit = false) {
    const actualDamage = isCrit ? damage * 1.5 : damage;
    this.health -= actualDamage;
    return this.health <= 0;
  }

  update(deltaTime, player, obstacles = []) {
    if (!player) return;
    
    const distToPlayer = Utils.distance(this.x, this.y, player.x, player.y);
    const angleToPlayer = Utils.angle(this.x, this.y, player.x, player.y);
    
    if (distToPlayer < this.attackRange) {
      this.state = 'attacking';
      this.lastAttackTime -= deltaTime;
      if (this.lastAttackTime <= 0) {
        this.lastAttackTime = this.attackCooldown;
        player.takeDamage(this.damage);
      }
      this.vx = 0;
      this.vy = 0;
    } else if (distToPlayer < 300) {
      this.state = 'chasing';
      this.vx = Math.cos(angleToPlayer) * this.speed;
      this.vy = Math.sin(angleToPlayer) * this.speed;
    } else {
      this.state = 'idle';
      if (Math.random() < 0.02) {
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * this.speed * 0.3;
        this.vy = Math.sin(angle) * this.speed * 0.3;
      }
    }
    
    super.update(deltaTime);
  }

  draw(ctx) {
    const colors = {
      'WALKER': '#00aa00',
      'RUNNER': '#ff6600',
      'TANK': '#660000',
      'SPITTER': '#00ff00',
      'SCREAMER': '#ffff00',
      'EXPLODER': '#ff0000'
    };
    
    ctx.fillStyle = colors[this.type] || '#666';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillRect(this.x - 15, this.y - 20, 30 * healthPercent, 3);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x - 15, this.y - 20, 30, 3);
  }
}
