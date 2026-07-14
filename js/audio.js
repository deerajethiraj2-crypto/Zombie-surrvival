class AudioManager {
  constructor() {
    this.masterVolume = 0.8;
    this.musicVolume = 0.6;
    this.sfxVolume = 0.8;
    this.currentMusic = null;
    this.soundEffects = new Map();
    this.ambientSounds = new Map();
    this.enabled = true;
  }

  setMasterVolume(volume) {
    this.masterVolume = Utils.clamp(volume, 0, 1);
    this.updateAllVolumes();
  }

  setMusicVolume(volume) {
    this.musicVolume = Utils.clamp(volume, 0, 1);
    this.updateMusicVolume();
  }

  setSFXVolume(volume) {
    this.sfxVolume = Utils.clamp(volume, 0, 1);
    this.updateSFXVolumes();
  }

  updateAllVolumes() {
    this.updateMusicVolume();
    this.updateSFXVolumes();
  }

  updateMusicVolume() {
    if (this.currentMusic) {
      this.currentMusic.volume = this.masterVolume * this.musicVolume;
    }
  }

  updateSFXVolumes() {
    this.soundEffects.forEach(sfx => {
      sfx.volume = this.masterVolume * this.sfxVolume;
    });
  }

  playSound(name, volume = 1) {
    if (!this.enabled) return;
    
    try {
      const audio = new Audio();
      audio.volume = this.masterVolume * this.sfxVolume * volume;
      audio.play().catch(() => {});
      this.soundEffects.set(name, audio);
    } catch (e) {
      console.log('Audio playback failed:', e);
    }
  }

  playGunshot(weaponType = 'pistol') {
    this.playSound('gunshot', 0.8);
  }

  playReload() {
    this.playSound('reload', 0.6);
  }

  playZombieGrowl() {
    this.playSound('zombie_growl', 0.5);
  }

  playZombieDeath() {
    this.playSound('zombie_death', 0.7);
  }

  playExplosion() {
    this.playSound('explosion', 0.9);
  }

  playFootstep() {
    this.playSound('footstep', 0.3);
  }

  playHurt() {
    this.playSound('hurt', 0.8);
  }

  playHealing() {
    this.playSound('healing', 0.6);
  }

  playUIClick() {
    this.playSound('ui_click', 0.5);
  }

  toggleAudio() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}
