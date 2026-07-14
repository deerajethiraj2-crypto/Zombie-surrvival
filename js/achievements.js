class Achievement {
  constructor(id, name, description, icon, condition) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.condition = condition;
    this.unlocked = false;
    this.unlockedDate = null;
  }
}

class AchievementManager {
  constructor() {
    this.achievements = this.initializeAchievements();
    this.progress = {};
  }

  initializeAchievements() {
    return [
      new Achievement('first_kill', 'First Blood', 'Kill your first zombie', '🧟', () => this.progress.kills >= 1),
      new Achievement('zombie_slayer', 'Zombie Slayer', 'Kill 100 zombies', '⚔️', () => this.progress.kills >= 100),
      new Achievement('tank_buster', 'Tank Buster', 'Defeat a Tank zombie', '💪', () => this.progress.tankKills >= 1),
      new Achievement('bullet_storm', 'Bullet Storm', 'Fire 1000 shots', '🔫', () => this.progress.shotsFired >= 1000),
      new Achievement('sharp_shooter', 'Sharp Shooter', 'Get 50 headshots', '🎯', () => this.progress.headshots >= 50),
      new Achievement('survival_expert', 'Survival Expert', 'Survive for 30 minutes', '⏱️', () => this.progress.survivalTime >= 1800),
      new Achievement('wealthy', 'Wealthy', 'Accumulate 10000 dollars', '💰', () => this.progress.money >= 10000),
      new Achievement('weapons_collector', 'Weapons Collector', 'Unlock all weapons', '🎖️', () => this.progress.weaponsUnlocked >= 15),
      new Achievement('medic', 'Medic', 'Heal 500 health', '🏥', () => this.progress.healed >= 500),
      new Achievement('survivor', 'Survivor', 'Complete campaign mode', '🏆', () => this.progress.campaignComplete),
      new Achievement('marathon', 'Marathon', 'Survive 100 waves', '🏃', () => this.progress.waves >= 100),
      new Achievement('speedrunner', 'Speedrunner', 'Complete a level in under 5 minutes', '⚡', () => this.progress.speedRun),
      new Achievement('chain_reaction', 'Chain Reaction', 'Kill 10 zombies with one explosion', '💥', () => this.progress.chainKill >= 10),
      new Achievement('lone_wolf', 'Lone Wolf', 'Complete a campaign level without taking damage', '🐺', () => this.progress.noDamage),
      new Achievement('zombie_master', 'Zombie Master', 'Reach level 10', '👑', () => this.progress.level >= 10)
    ];
  }

  checkAchievements(gameState) {
    this.progress = {
      kills: gameState.kills || 0,
      tankKills: gameState.tankKills || 0,
      shotsFired: gameState.shotsFired || 0,
      headshots: gameState.headshots || 0,
      survivalTime: gameState.survivalTime || 0,
      money: gameState.money || 0,
      weaponsUnlocked: gameState.weaponsUnlocked || 0,
      healed: gameState.healed || 0,
      campaignComplete: gameState.campaignComplete || false,
      waves: gameState.waves || 0,
      speedRun: gameState.speedRun || false,
      chainKill: gameState.chainKill || 0,
      noDamage: gameState.noDamage || false,
      level: gameState.level || 1
    };
    
    this.achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true;
        achievement.unlockedDate = new Date();
      }
    });
  }

  getUnlockedCount() {
    return this.achievements.filter(a => a.unlocked).length;
  }

  getAll() {
    return this.achievements;
  }
}
