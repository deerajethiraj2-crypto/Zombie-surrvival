class GameMap {
  constructor(mapData) {
    this.name = mapData.name;
    this.width = mapData.width;
    this.height = mapData.height;
    this.difficulty = mapData.difficulty;
    this.tiles = [];
    this.obstacles = [];
    this.lootSpawns = [];
    this.zombieSpawns = [];
    this.weather = 'clear';
    this.timeOfDay = 0;
    this.isNight = false;
    this.generateMap();
  }

  generateMap() {
    const tileCount = Math.ceil(this.width / GAME_CONSTANTS.TILE_SIZE) * Math.ceil(this.height / GAME_CONSTANTS.TILE_SIZE);
    for (let i = 0; i < tileCount; i++) {
      this.tiles.push({
        type: Math.random() > 0.7 ? 'grass' : 'concrete',
        x: (i % Math.ceil(this.width / GAME_CONSTANTS.TILE_SIZE)) * GAME_CONSTANTS.TILE_SIZE,
        y: Math.floor(i / Math.ceil(this.width / GAME_CONSTANTS.TILE_SIZE)) * GAME_CONSTANTS.TILE_SIZE
      });
    }
    
    for (let i = 0; i < 20; i++) {
      this.obstacles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        width: 40,
        height: 40,
        type: 'wall'
      });
    }
    
    for (let i = 0; i < 15; i++) {
      this.lootSpawns.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height
      });
    }
    
    for (let i = 0; i < 10; i++) {
      this.zombieSpawns.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height
      });
    }
  }

  update(deltaTime) {
    this.timeOfDay += deltaTime / 300;
    if (this.timeOfDay >= 1) this.timeOfDay = 0;
    this.isNight = this.timeOfDay > 0.3 && this.timeOfDay < 0.7;
  }

  getRandomSpawnPoint() {
    const spawn = Utils.getRandomElement(this.zombieSpawns);
    return { x: spawn.x + Utils.randomRange(-30, 30), y: spawn.y + Utils.randomRange(-30, 30) };
  }

  getRandomLootLocation() {
    const loot = Utils.getRandomElement(this.lootSpawns);
    return { x: loot.x + Utils.randomRange(-50, 50), y: loot.y + Utils.randomRange(-50, 50) };
  }

  draw(ctx, cameraX, cameraY, viewWidth, viewHeight) {
    ctx.fillStyle = this.isNight ? '#1a1a2e' : '#87ceeb';
    ctx.fillRect(0, 0, viewWidth, viewHeight);
    
    this.tiles.forEach(tile => {
      const screenX = tile.x - cameraX;
      const screenY = tile.y - cameraY;
      if (screenX > -40 && screenX < viewWidth && screenY > -40 && screenY < viewHeight) {
        ctx.fillStyle = tile.type === 'grass' ? '#228b22' : '#808080';
        ctx.fillRect(screenX, screenY, GAME_CONSTANTS.TILE_SIZE, GAME_CONSTANTS.TILE_SIZE);
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX, screenY, GAME_CONSTANTS.TILE_SIZE, GAME_CONSTANTS.TILE_SIZE);
      }
    });
    
    this.obstacles.forEach(obs => {
      const screenX = obs.x - cameraX;
      const screenY = obs.y - cameraY;
      if (screenX > -50 && screenX < viewWidth && screenY > -50 && screenY < viewHeight) {
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(screenX, screenY, obs.width, obs.height);
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, screenY, obs.width, obs.height);
      }
    });
    
    if (this.isNight) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, viewWidth, viewHeight);
    }
  }
}
