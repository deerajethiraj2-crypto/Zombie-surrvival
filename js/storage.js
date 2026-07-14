class StorageManager {
  constructor() {
    this.prefix = 'ZombieSurvival_';
  }

  save(key, data) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('Storage save failed:', e);
      return false;
    }
  }

  load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Storage load failed:', e);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (e) {
      console.warn('Storage remove failed:', e);
      return false;
    }
  }

  clear() {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
      return true;
    } catch (e) {
      console.warn('Storage clear failed:', e);
      return false;
    }
  }

  saveGameState(state) {
    return this.save('gameState', state);
  }

  loadGameState() {
    return this.load('gameState', null);
  }

  saveSettings(settings) {
    return this.save('settings', settings);
  }

  loadSettings() {
    return this.load('settings', {
      masterVolume: 0.8,
      musicVolume: 0.6,
      sfxVolume: 0.8,
      mouseSensitivity: 1,
      graphicsQuality: 'medium',
      difficulty: 'normal'
    });
  }

  saveHighScore(score) {
    const current = this.load('highScore', 0);
    if (score > current) {
      this.save('highScore', score);
      return true;
    }
    return false;
  }

  getHighScore() {
    return this.load('highScore', 0);
  }

  saveAchievements(achievements) {
    return this.save('achievements', achievements);
  }

  loadAchievements() {
    return this.load('achievements', []);
  }

  saveStatistics(stats) {
    return this.save('statistics', stats);
  }

  loadStatistics() {
    return this.load('statistics', {
      totalKills: 0,
      totalZombiesKilled: 0,
      totalPlayTime: 0,
      totalMoney: 0,
      gamesPlayed: 0,
      campaignLevelsCompleted: 0
    });
  }
}
