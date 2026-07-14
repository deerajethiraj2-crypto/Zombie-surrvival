class Player extends Entity {
  constructor(x, y) {
    super(x, y, GAME_CONSTANTS.PLAYER.SIZE * 2, GAME_CONSTANTS.PLAYER.SIZE * 2);
    this.health = GAME_CONSTANTS.PLAYER.MAX_HEALTH;
    this.maxHealth = GAME_CONSTANTS.PLAYER.MAX_HEALTH;
    this.armor = 0;
    this.maxArmor = GAME_CONSTANTS.PLAYER.MAX_ARMOR;
    this.stamina = GAME_CONSTANTS.PLAYER.MAX_STAMINA;
    this.maxStamina = GAME_CONSTANTS.PLAYER.MAX_STAMINA;
    this.level = 1;
    this.xp = 0;
    this.xpNeeded = 100;
    this.money = 0;
    this.kills = 0;
    this.accuracy = 1;
    this.isRunning = false;
    this.isCrouching = false;
    this.isBleeding = false;
    this.bleedingTime = 0;
    this.bleeding = false;
    this.bleedDuration = 0;
    this.direction = 0;
    this.weapons = [];
    this.currentWeaponIndex = 0;
    this.inventory = [];
    this.stats = {
      health: 0,
      stamina: 0,
      accuracy: 1,
      reloadSpeed: 1,
      critChance: 0.05,
      moveSpeed: 1,
      craftingSpeed: 1,
      lootLuck: 1
    };
  }

  addWeapon(weaponData) {
    const weapon = new Weapon(weaponData);
    this.weapons.push(weapon);
    return weapon;
  }

  getCurrentWeapon() {
    return this.weapons[this.currentWeaponIndex] || null;
  }

  switchWeapon(index) {
    if (index >= 0 && index < this.weapons.length) {
      this.currentWeaponIndex = index;
    }
  }

  nextWeapon() {
    this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weapons.length;
  }

  prevWeapon() {
    this.currentWeaponIndex = (this.currentWeaponIndex - 1 + this.weapons.length) % this.weapons.length;
  }

  takeDamage(damage) {
    let finalDamage = damage;
    if (this.armor > 0) {
      const armorMitigation = Math.min(this.armor / this.maxArmor, 0.8);
      finalDamage = damage * (1 - armorMitigation * 0.5);
      this.armor -= damage * 0.5;
    }
    this.health -= finalDamage;
    if (Math.random() < 0.3) {
      this.isBleeding = true;
      this.bleedingTime = GAME_CONSTANTS.PLAYER.BLEED_DURATION;
    }
    return finalDamage;
  }

  heal(amount) {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  addArmor(amount) {
    this.armor = Math.min(this.armor + amount, this.maxArmor);
  }

  addXP(amount) {
    this.xp += amount;
    if (this.xp >= this.xpNeeded) {
      this.xp -= this.xpNeeded;
      this.level++;
      this.xpNeeded = Math.floor(this.xpNeeded * 1.1);
      this.maxHealth += 10;
      this.health = this.maxHealth;
    }
  }

  addMoney(amount) {
    this.money += amount;
  }

  spendMoney(amount) {
    if (this.money >= amount) {
      this.money -= amount;
      return true;
    }
    return false;
  }

  addKill() {
    this.kills++;
  }

  setDirection(angle) {
    this.direction = angle;
  }

  move(dx, dy, deltaTime) {
    let speed = GAME_CONSTANTS.PLAYER.SPEED;
    if (this.isRunning) {
      speed = GAME_CONSTANTS.PLAYER.RUN_SPEED;
      this.stamina -= GAME_CONSTANTS.PLAYER.STAMINA_DRAIN_RUN * deltaTime;
    } else {
      this.stamina = Math.min(this.stamina + GAME_CONSTANTS.PLAYER.STAMINA_REGEN * deltaTime, this.maxStamina);
    }
    if (this.isCrouching) {
      speed = GAME_CONSTANTS.PLAYER.CROUCH_SPEED;
    }
    speed *= this.stats.moveSpeed;
    this.stamina = Math.max(0, this.stamina);
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    if (magnitude > 0) {
      this.vx = (dx / magnitude) * speed;
      this.vy = (dy / magnitude) * speed;
    } else {
      this.vx = 0;
      this.vy = 0;
    }
  }

  update(deltaTime) {
    super.update(deltaTime);
    
    if (this.isBleeding) {
      this.bleedingTime -= deltaTime;
      if (this.bleedingTime <= 0) {
        this.isBleeding = false;
      } else {
        this.health -= GAME_CONSTANTS.PLAYER.BLEEDING_DAMAGE_RATE * deltaTime;
      }
    }
    
    const weapon = this.getCurrentWeapon();
    if (weapon) {
      weapon.update(deltaTime);
    }
    
    if (this.health <= 0) {
      this.active = false;
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, GAME_CONSTANTS.PLAYER.SIZE, 0, Math.PI * 2);
    ctx.fill();
    
    if (this.isBleeding) {
      ctx.strokeStyle = '#8b0000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + Math.cos(this.direction) * 20, this.y + Math.sin(this.direction) * 20);
    ctx.stroke();
  }
}
