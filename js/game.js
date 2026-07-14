class ZombieSurvivalGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = GAME_CONSTANTS.CANVAS_WIDTH;
    this.canvas.height = GAME_CONSTANTS.CANVAS_HEIGHT;
    
    this.storage = new StorageManager();
    this.audioManager = new AudioManager();
    this.ui = new UIManager();
    this.achievementManager = new AchievementManager();
    this.particleSystem = new ParticleSystem();
    
    this.gameState = 'MENU';
    this.gameMode = 'SURVIVAL';
    this.isPaused = false;
    this.isRunning = false;
    
    this.player = null;
    this.zombies = [];
    this.bullets = [];
    this.projectiles = [];
    this.loot = [];
    this.map = null;
    
    this.wave = 1;
    this.waveTimer = 0;
    this.zombieSpawnTimer = 0;
    this.difficultyMultiplier = 1;
    this.score = 0;
    this.totalPlayTime = 0;
    this.survivalTime = 0;
    
    this.camera = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.keys = {};
    
    this.lastFrameTime = Date.now();
    this.fps = 60;
    this.fpsCounter = 0;
    this.fpsTimer = 0;
    
    this.mouseSensitivity = 1;
    this.screenShake = 0;
    this.currentLevelIndex = 0;
    
    this.initializeEventListeners();
    this.loadSettings();
    this.showMainMenu();
  }

  initializeEventListeners() {
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
    window.addEventListener('resize', () => this.onWindowResize());
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  onMouseDown(e) {
    this.keys['mousedown'] = true;
  }

  onMouseUp(e) {
    this.keys['mousedown'] = false;
  }

  onKeyDown(e) {
    this.keys[e.key.toLowerCase()] = true;
    
    if (e.key === 'Escape') {
      if (this.gameState === 'PLAYING') {
        this.togglePause();
      }
    } else if (e.key === 'i' || e.key === 'I') {
      if (this.gameState === 'PLAYING') {
        this.ui.showMenu('inventoryMenu');
      }
    } else if (e.key === 'p' || e.key === 'P') {
      this.togglePause();
    } else if (e.key === 'r' || e.key === 'R') {
      if (this.gameState === 'PLAYING' && this.player) {
        const weapon = this.player.getCurrentWeapon();
        if (weapon) {
          weapon.reload();
          this.audioManager.playReload();
        }
      }
    } else if (e.key >= '1' && e.key <= '9') {
      const weaponIndex = parseInt(e.key) - 1;
      if (this.player && weaponIndex < this.player.weapons.length) {
        this.player.switchWeapon(weaponIndex);
      }
    }
  }

  onKeyUp(e) {
    this.keys[e.key.toLowerCase()] = false;
  }

  onWindowResize() {}

  loadSettings() {
    const settings = this.storage.loadSettings();
    this.audioManager.setMasterVolume(settings.masterVolume);
    this.audioManager.setMusicVolume(settings.musicVolume);
    this.audioManager.setSFXVolume(settings.sfxVolume);
    this.mouseSensitivity = settings.mouseSensitivity;
  }

  showMainMenu() {
    this.gameState = 'MENU';
    this.ui.showMainMenu();
    const highScore = this.storage.getHighScore();
    document.getElementById('high-score').textContent = highScore;
  }

  startSurvivalMode() {
    this.gameMode = 'SURVIVAL';
    this.gameState = 'PLAYING';
    this.wave = 1;
    this.score = 0;
    this.survivalTime = 0;
    this.isRunning = true;
    this.initializeGame();
    this.ui.hideMenu('mainMenu');
  }

  startCampaignMode(levelIndex) {
    this.gameMode = 'CAMPAIGN';
    this.currentLevelIndex = levelIndex;
    this.gameState = 'PLAYING';
    this.isRunning = true;
    this.initializeGame();
    this.ui.hideMenu('campaignMenu');
  }

  initializeGame() {
    const mapData = GAME_CONSTANTS.MAPS[Math.floor(Math.random() * GAME_CONSTANTS.MAPS.length)];
    this.map = new GameMap(mapData);
    
    const playerSpawn = { x: this.map.width / 2, y: this.map.height / 2 };
    this.player = new Player(playerSpawn.x, playerSpawn.y);
    
    this.player.addWeapon(GAME_CONSTANTS.WEAPONS.GLOCK);
    this.player.addWeapon(GAME_CONSTANTS.WEAPONS.MP5);
    this.player.addWeapon(GAME_CONSTANTS.WEAPONS.PUMP_SHOTGUN);
    
    const weapon = this.player.getCurrentWeapon();
    if (weapon) {
      weapon.currentAmmo = weapon.magazineSize;
    }
    
    this.zombies = [];
    this.bullets = [];
    this.projectiles = [];
    this.loot = [];
    this.spawnZombies(5);
  }

  spawnZombies(count) {
    for (let i = 0; i < count; i++) {
      const spawn = this.map.getRandomSpawnPoint();
      const zombieTypes = Object.keys(GAME_CONSTANTS.ZOMBIES).filter(z => z !== 'BOSS');
      const type = Utils.getRandomElement(zombieTypes);
      this.zombies.push(new Zombie(spawn.x, spawn.y, type));
    }
  }

  togglePause() {
    if (this.gameState === 'PLAYING') {
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.ui.showMenu('pauseMenu');
      } else {
        this.ui.hideMenu('pauseMenu');
      }
    }
  }

  update(deltaTime) {
    if (this.gameState !== 'PLAYING' || this.isPaused) return;
    
    this.map.update(deltaTime);
    this.survivalTime += deltaTime;
    this.totalPlayTime += deltaTime;
    
    this.handlePlayerMovement(deltaTime);
    this.handlePlayerShooting(deltaTime);
    
    this.player.update(deltaTime);
    
    this.zombies.forEach((zombie, index) => {
      zombie.update(deltaTime, this.player);
      
      this.bullets.forEach((bullet, bIndex) => {
        if (Utils.circleCollision(bullet.x, bullet.y, 5, zombie.x, zombie.y, zombie.width / 2)) {
          const isCrit = Math.random() < this.player.stats.critChance;
          if (zombie.takeDamage(bullet.damage, isCrit)) {
            this.zombies.splice(index, 1);
            this.score += zombie.xpReward * 10;
            this.player.addXP(zombie.xpReward);
            this.player.addMoney(zombie.moneyReward);
            this.player.addKill();
            this.particleSystem.emitBlood(zombie.x, zombie.y);
            this.audioManager.playZombieDeath();
          }
          this.bullets.splice(bIndex, 1);
        }
      });
    });
    
    this.bullets = this.bullets.filter(b => b.active);
    this.projectiles = this.projectiles.filter(p => p.active);
    
    this.projectiles.forEach((proj, index) => {
      this.zombies.forEach((zombie, zIndex) => {
        if (Utils.circleCollision(proj.x, proj.y, proj.radius, zombie.x, zombie.y, zombie.width / 2)) {
          if (zombie.takeDamage(proj.damage)) {
            this.zombies.splice(zIndex, 1);
            this.score += zombie.xpReward * 15;
            this.player.addXP(zombie.xpReward);
            this.player.addMoney(zombie.moneyReward);
          }
          proj.explode();
          this.particleSystem.emitExplosion(proj.x, proj.y);
          this.audioManager.playExplosion();
          this.screenShake = 0.2;
        }
      });
      proj.update(deltaTime);
    });
    
    this.loot = this.loot.filter(l => l.pickupRadius > 0);
    this.loot.forEach((loot, index) => {
      if (Utils.circleCollision(this.player.x, this.player.y, 30, loot.x, loot.y, loot.pickupRadius)) {
        this.player.addAmmo(loot.amount);
        this.loot.splice(index, 1);
      }
    });
    
    this.bullets.forEach(b => b.update(deltaTime));
    this.particleSystem.update(deltaTime);
    
    if (this.screenShake > 0) {
      this.screenShake -= deltaTime;
    }
    
    this.updateWaveSystem(deltaTime);
    this.updateCamera();
    this.updateHUD();
    
    if (this.player.health <= 0) {
      this.endGame();
    }
  }

  handlePlayerMovement(deltaTime) {
    let dx = 0;
    let dy = 0;
    
    if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;
    
    this.player.isRunning = this.keys['shift'];
    this.player.isCrouching = this.keys['control'];
    
    this.player.move(dx, dy, deltaTime);
    
    const angle = Utils.angle(this.canvas.width / 2, this.canvas.height / 2, this.mouse.x, this.mouse.y);
    this.player.setDirection(angle);
  }

  handlePlayerShooting(deltaTime) {
    if (this.keys['mousedown']) {
      const weapon = this.player.getCurrentWeapon();
      if (weapon && weapon.canFire()) {
        weapon.fire();
        this.audioManager.playGunshot();
        
        const bulletCount = weapon.type === 'shotgun' ? 8 : 1;
        for (let i = 0; i < bulletCount; i++) {
          const spread = weapon.getBulletSpread();
          const recoil = weapon.getRecoil();
          const bulletAngle = this.player.direction + spread + recoil;
          const bullet = new Bullet(
            this.player.x + Math.cos(this.player.direction) * 25,
            this.player.y + Math.sin(this.player.direction) * 25,
            bulletAngle,
            400,
            weapon.damage
          );
          this.bullets.push(bullet);
        }
        
        this.particleSystem.emitMuzzleFlash(
          this.player.x + Math.cos(this.player.direction) * 25,
          this.player.y + Math.sin(this.player.direction) * 25,
          5
        );
      }
    }
  }

  updateWaveSystem(deltaTime) {
    this.waveTimer += deltaTime;
    
    if (this.zombies.length === 0 && this.waveTimer > 3) {
      this.wave++;
      this.difficultyMultiplier = 1 + (this.wave * 0.1);
      const zombieCount = Math.floor(5 + this.wave * 1.5);
      this.spawnZombies(zombieCount);
      this.waveTimer = 0;
      
      this.player.heal(20);
      this.score += 500 * this.wave;
    }
  }

  updateCamera() {
    this.camera.x = this.player.x - this.canvas.width / 2;
    this.camera.y = this.player.y - this.canvas.height / 2;
    
    this.camera.x = Math.max(0, Math.min(this.camera.x, this.map.width - this.canvas.width));
    this.camera.y = Math.max(0, Math.min(this.camera.y, this.map.height - this.canvas.height));
  }

  updateHUD() {
    if (this.player.getCurrentWeapon()) {
      this.ui.updateHUD(
        {
          health: this.player.health,
          maxHealth: this.player.maxHealth,
          armor: this.player.armor,
          maxArmor: this.player.maxArmor,
          stamina: this.player.stamina,
          maxStamina: this.player.maxStamina,
          currentWeapon: this.player.getCurrentWeapon(),
          level: this.player.level,
          xp: this.player.xp,
          xpNeeded: this.player.xpNeeded,
          money: this.player.money
        },
        { wave: this.wave }
      );
    }
  }

  draw() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.save();
    
    if (this.screenShake > 0) {
      const shake = Math.sin(this.screenShake * 30) * 5;
      this.ctx.translate(shake, shake);
    }
    
    this.map.draw(this.ctx, this.camera.x, this.camera.y, this.canvas.width, this.canvas.height);
    
    const drawEntity = (entity) => {
      const screenX = entity.x - this.camera.x;
      const screenY = entity.y - this.camera.y;
      if (screenX > -50 && screenX < this.canvas.width + 50 && screenY > -50 && screenY < this.canvas.height + 50) {
        this.ctx.save();
        this.ctx.translate(screenX, screenY);
        entity.draw(this.ctx);
        this.ctx.restore();
      }
    };
    
    this.zombies.forEach(z => drawEntity(z));
    this.bullets.forEach(b => drawEntity(b));
    this.projectiles.forEach(p => drawEntity(p));
    this.loot.forEach(l => drawEntity(l));
    
    if (this.player) {
      drawEntity(this.player);
    }
    
    this.particleSystem.draw(this.ctx);
    
    this.ctx.restore();
    
    this.drawUI();
    this.drawFPS();
  }

  drawUI() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawFPS() {
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = '12px Arial';
    this.ctx.fillText(`FPS: ${this.fps}`, this.canvas.width - 100, 20);
  }

  endGame() {
    this.gameState = 'GAME_OVER';
    this.isRunning = false;
    
    const stats = {
      wave: this.wave,
      kills: this.player.kills,
      survivalTime: this.survivalTime,
      money: this.player.money,
      score: this.score
    };
    
    this.storage.saveHighScore(this.score);
    this.ui.showGameOver(stats);
  }

  restart() {
    this.gameState = 'MENU';
    this.isPaused = false;
    this.isRunning = false;
    this.showMainMenu();
  }

  gameLoop() {
    const now = Date.now();
    let deltaTime = (now - this.lastFrameTime) / 1000;
    deltaTime = Math.min(deltaTime, 0.016);
    this.lastFrameTime = now;
    
    this.fpsCounter++;
    this.fpsTimer += deltaTime;
    if (this.fpsTimer >= 1) {
      this.fps = this.fpsCounter;
      this.fpsCounter = 0;
      this.fpsTimer = 0;
    }
    
    this.update(deltaTime);
    this.draw();
    
    requestAnimationFrame(() => this.gameLoop());
  }
}

window.audioManager = new AudioManager();
window.gameInstance = new ZombieSurvivalGame();
window.gameInstance.gameLoop();
