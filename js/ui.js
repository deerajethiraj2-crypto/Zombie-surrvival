class UIManager {
  constructor() {
    this.menus = {};
    this.currentMenu = null;
    this.hudUpdateCallbacks = [];
    this.initializeMenus();
    this.initializeEventListeners();
  }

  initializeMenus() {
    this.menus = {
      mainMenu: document.getElementById('main-menu'),
      campaignMenu: document.getElementById('campaign-menu'),
      levelIntro: document.getElementById('level-intro'),
      levelComplete: document.getElementById('level-complete'),
      gameOver: document.getElementById('game-over'),
      pauseMenu: document.getElementById('pause-menu'),
      settingsMenu: document.getElementById('settings-menu'),
      achievementsMenu: document.getElementById('achievements-menu'),
      statsMenu: document.getElementById('stats-menu'),
      inventoryMenu: document.getElementById('inventory-menu')
    };
  }

  initializeEventListeners() {
    document.getElementById('btn-survival').addEventListener('click', () => this.onSurvivalClick());
    document.getElementById('btn-campaign').addEventListener('click', () => this.onCampaignClick());
    document.getElementById('btn-settings').addEventListener('click', () => this.showSettings());
    document.getElementById('btn-achievements').addEventListener('click', () => this.showAchievements());
    document.getElementById('btn-stats').addEventListener('click', () => this.showStatistics());
    
    document.getElementById('btn-resume').addEventListener('click', () => this.hideMenu('pauseMenu'));
    document.getElementById('btn-restart').addEventListener('click', () => this.onRestartClick());
    document.getElementById('btn-menu').addEventListener('click', () => this.showMainMenu());
    document.getElementById('btn-back-settings').addEventListener('click', () => this.hideMenu('settingsMenu'));
    
    document.getElementById('volume-master').addEventListener('input', (e) => this.onVolumeChange(e));
    document.getElementById('mouse-sensitivity').addEventListener('input', (e) => this.onSensitivityChange(e));
  }

  showMenu(menuName) {
    if (this.currentMenu) {
      this.menus[this.currentMenu].classList.add('hidden');
    }
    if (this.menus[menuName]) {
      this.menus[menuName].classList.remove('hidden');
      this.currentMenu = menuName;
    }
  }

  hideMenu(menuName) {
    if (this.menus[menuName]) {
      this.menus[menuName].classList.add('hidden');
      if (this.currentMenu === menuName) {
        this.currentMenu = null;
      }
    }
  }

  showMainMenu() {
    this.showMenu('mainMenu');
  }

  showSettings() {
    this.showMenu('settingsMenu');
  }

  showAchievements() {
    this.showMenu('achievementsMenu');
    this.populateAchievements();
  }

  showStatistics() {
    this.showMenu('statsMenu');
    this.populateStatistics();
  }

  showGameOver(stats) {
    const gameOverStats = document.getElementById('game-over-stats');
    gameOverStats.innerHTML = `
      <p>Wave: ${stats.wave}</p>
      <p>Kills: ${stats.kills}</p>
      <p>Survival Time: ${Utils.formatTime(stats.survivalTime)}</p>
      <p>Money Earned: $${stats.money}</p>
      <p>Final Score: ${stats.score}</p>
    `;
    this.showMenu('gameOver');
  }

  updateHUD(playerState, gameState) {
    document.getElementById('health-text').textContent = `${Math.ceil(playerState.health)}/${playerState.maxHealth}`;
    document.getElementById('health-fill').style.width = `${(playerState.health / playerState.maxHealth) * 100}%`;
    
    document.getElementById('armor-text').textContent = `${Math.ceil(playerState.armor)}/${playerState.maxArmor}`;
    document.getElementById('armor-fill').style.width = `${(playerState.armor / playerState.maxArmor) * 100}%`;
    
    document.getElementById('stamina-text').textContent = `${Math.ceil(playerState.stamina)}/${playerState.maxStamina}`;
    document.getElementById('stamina-fill').style.width = `${(playerState.stamina / playerState.maxStamina) * 100}%`;
    
    const weapon = playerState.currentWeapon;
    if (weapon) {
      document.getElementById('ammo-text').textContent = `${weapon.currentAmmo} / ${weapon.totalAmmo}`;
      document.getElementById('weapon-name').textContent = weapon.name;
    }
    
    document.getElementById('wave-number').textContent = gameState.wave || 1;
    document.getElementById('player-level').textContent = playerState.level || 1;
    document.getElementById('player-xp').textContent = Math.floor(playerState.xp) || 0;
    document.getElementById('player-xp-next').textContent = Math.floor(playerState.xpNeeded) || 100;
    document.getElementById('money-amount').textContent = playerState.money || 0;
  }

  populateAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';
  }

  populateStatistics() {
    const statDisplay = document.getElementById('stats-display');
    statDisplay.innerHTML = '';
  }

  onSurvivalClick() {
    this.hideMenu('mainMenu');
    if (window.gameInstance && window.gameInstance.startSurvivalMode) {
      window.gameInstance.startSurvivalMode();
    }
  }

  onCampaignClick() {
    this.showMenu('campaignMenu');
  }

  onRestartClick() {
    this.hideMenu('gameOver');
    if (window.gameInstance && window.gameInstance.restart) {
      window.gameInstance.restart();
    }
  }

  onVolumeChange(e) {
    const volume = e.target.value / 100;
    document.getElementById('volume-value').textContent = e.target.value + '%';
    if (window.audioManager) {
      window.audioManager.setMasterVolume(volume);
    }
  }

  onSensitivityChange(e) {
    const sensitivity = parseFloat(e.target.value);
    document.getElementById('sensitivity-value').textContent = sensitivity.toFixed(1) + 'x';
    if (window.gameInstance) {
      window.gameInstance.mouseSensitivity = sensitivity;
    }
  }
}
