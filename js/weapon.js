class Weapon {
  constructor(weaponData) {
    this.name = weaponData.name;
    this.damage = weaponData.damage;
    this.fireRate = weaponData.fireRate;
    this.magazineSize = weaponData.magazineSize;
    this.reloadTime = weaponData.reloadTime;
    this.accuracy = weaponData.accuracy;
    this.bulletSpread = weaponData.bulletSpread;
    this.recoil = weaponData.recoil;
    this.muzzleFlashSize = weaponData.muzzleFlashSize;
    this.type = weaponData.type;
    this.rarity = weaponData.rarity;
    this.icon = weaponData.icon;
    
    this.currentAmmo = this.magazineSize;
    this.totalAmmo = this.magazineSize * 3;
    this.fireTimer = 0;
    this.reloadTimer = 0;
    this.isReloading = false;
  }

  canFire() {
    return this.fireTimer <= 0 && this.currentAmmo > 0 && !this.isReloading;
  }

  fire() {
    if (!this.canFire()) return false;
    
    this.currentAmmo--;
    this.fireTimer = this.fireRate;
    return true;
  }

  reload() {
    if (this.currentAmmo === this.magazineSize || this.totalAmmo === 0) return;
    this.isReloading = true;
    this.reloadTimer = this.reloadTime;
  }

  update(deltaTime) {
    this.fireTimer -= deltaTime;
    
    if (this.isReloading) {
      this.reloadTimer -= deltaTime;
      if (this.reloadTimer <= 0) {
        const ammoNeeded = this.magazineSize - this.currentAmmo;
        const ammoAvailable = Math.min(ammoNeeded, this.totalAmmo);
        this.currentAmmo += ammoAvailable;
        this.totalAmmo -= ammoAvailable;
        this.isReloading = false;
      }
    }
  }

  addAmmo(amount) {
    this.totalAmmo += amount;
  }

  getBulletSpread() {
    return (Math.random() - 0.5) * this.bulletSpread;
  }

  getRecoil() {
    return (Math.random() - 0.5) * this.recoil;
  }

  clone() {
    return new Weapon({
      name: this.name,
      damage: this.damage,
      fireRate: this.fireRate,
      magazineSize: this.magazineSize,
      reloadTime: this.reloadTime,
      accuracy: this.accuracy,
      bulletSpread: this.bulletSpread,
      recoil: this.recoil,
      muzzleFlashSize: this.muzzleFlashSize,
      type: this.type,
      rarity: this.rarity,
      icon: this.icon
    });
  }
}

class Ammo {
  constructor(x, y, amount, type = 'standard') {
    this.x = x;
    this.y = y;
    this.amount = amount;
    this.type = type;
    this.pickupRadius = 30;
  }

  draw(ctx) {
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.amount, this.x, this.y + 3);
  }
}
