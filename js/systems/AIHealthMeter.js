// =========================================================
// THE AI KITCHEN — AIHealthMeter.js
// Barra de salud visual de la IA + estados de mascota
// =========================================================

export class AIHealthMeter {
  constructor(engine) {
    this.engine  = engine;
    this.health  = 100;
    this.state   = 'healthy'; // healthy | moderate | critical | biased | outdated | glitch

    this.barFill    = document.getElementById('health-bar-fill');
    this.mascotBody = document.querySelector('.mascot-body');
    this.mascotFace = document.querySelector('.mascot-face');
    this.speechEl   = document.querySelector('.mascot-speech');
    this.mascotImg  = document.getElementById('mascot-img');

    this.FACES = {
      healthy:  '🛡️',
      moderate: '🏃',
      critical: '🛡️',
      biased:   '🛡️',
      outdated: '🏃',
      glitch:   '💀',
    };

    this.mascotActionActive = false;
    this.mascotActionTimeout = null;
    this.deathAnimationTriggered = false;
    this.deathFreezeTimeout = null;
  }

  reset() {
    this.health = 100;
    this.state  = 'healthy';
    this.mascotActionActive = false;
    this.deathAnimationTriggered = false;
    if (this.mascotActionTimeout) {
      clearTimeout(this.mascotActionTimeout);
    }
    if (this.deathFreezeTimeout) {
      clearTimeout(this.deathFreezeTimeout);
      this.deathFreezeTimeout = null;
    }
    this._render();
  }

  onCorrect(block) {
    this.health = Math.min(100, this.health + 3);
    this._updateState();
    this._render();
    this.triggerMascotAction('attack');
  }

  onWrong(block) {
    const dmg = { clean:5, outdated:8, biased:12, noise:10, ambiguous:3, poison:20 };
    this.health = Math.max(0, this.health - (dmg[block.type] || 5));
    this._updateState(block.type);
    this._render();
    this._flashDamage();
    this.triggerMascotAction('hit');

    // Speech del mascot según el tipo de error
    const level = this.engine.currentLevel;
    if (level) {
      const errorLines = {
        outdated: '¡Eso está desactualizado! ⏳ Mis datos son del pasado…',
        biased:   '¡Sesgo detectado! ⚠️ Mi perspectiva se está distorsionando…',
        noise:    '¡Desinformación! 💀 No puedo distinguir verdad de mentira…',
        poison:   '🚨 ATAQUE DE DATOS DETECTADO. Integridad comprometida.',
      };
      
      let speech = errorLines[block.type] || level.mascotLines.bad;

      if (level.id === 1 && block.ingredient) {
        if (block.ingredient.type === 'clean') {
          speech = '¡Necesitaba ese dato! 🏔️';
        } else {
          const txt = block.ingredient.text.toLowerCase();
          let label = 'dato malo';
          if (txt.includes('robo')) label = 'reporte de robos 🚨';
          else if (txt.includes('tráfico')) label = 'reporte de tráfico 🚗';
          else if (txt.includes('meme')) label = 'meme de internet 🤪';
          else if (txt.includes('hater')) label = 'comentario de hater 🤮';
          else if (txt.includes('peligrosas')) label = 'alerta de peligro ⚠️';
          else if (txt.includes('cusco')) label = 'dato de Cusco 🗺️';
          else if (txt.includes('postal')) label = 'dato obsoleto 📸';
          
          speech = `¿Aceptaste un ${label}? 🚫 ¡No sirve!`;
        }
      }

      this.setMascotSpeech(speech);
    }
  }

  onMissed(ingredient) {
    this.health = Math.max(0, this.health - 6);
    this._updateState();
    this._render();
    this.triggerMascotAction('hit');
  }

  triggerMascotAction(actionType) {
    if (!this.mascotImg) return;

    if (this.mascotActionTimeout) {
      clearTimeout(this.mascotActionTimeout);
    }

    this.mascotActionActive = true;

    const isHealthy = (this.state === 'healthy');
    const folder = isHealthy
      ? 'assets/mascot/knight/Colour2/Outline/120x80_gifs/'
      : 'assets/mascot/knight/Colour1/Outline/120x80_gifs/';

    let gifName = '__Idle.gif';
    let duration = 600; // ms

    if (actionType === 'attack') {
      if (this.state === 'critical' || this.state === 'biased') {
        gifName = '__CrouchAttack.gif';
        duration = 500;
      } else {
        gifName = '__AttackNoMovement.gif';
        duration = 600;
      }

      this.mascotImg.classList.add('knight-attack');
      setTimeout(() => {
        if (this.mascotImg) this.mascotImg.classList.remove('knight-attack');
      }, duration);

    } else if (actionType === 'hit') {
      gifName = '__Hit.gif';
      duration = 400;

      this.mascotImg.classList.add('knight-hit');
      setTimeout(() => {
        if (this.mascotImg) this.mascotImg.classList.remove('knight-hit');
      }, duration);
    }

    // Force animation restart by appending timestamp
    this.mascotImg.src = `${folder}${gifName}?t=${Date.now()}`;

    this.mascotActionTimeout = setTimeout(() => {
      this.mascotActionActive = false;
      this._render();
    }, duration);
  }

  setMascotSpeech(text) {
    if (!this.speechEl) return;
    this.speechEl.textContent = text;
    this.speechEl.style.animation = 'none';
    requestAnimationFrame(() => { this.speechEl.style.animation = 'fade-in 0.3s ease'; });
  }

  _updateState(errorType) {
    if (errorType === 'biased')   { this.state = 'biased'; return; }
    if (errorType === 'outdated') { this.state = 'outdated'; return; }
    if (errorType === 'noise' || errorType === 'poison') { this.state = 'glitch'; return; }

    if      (this.health >= 70) this.state = 'healthy';
    else if (this.health >= 35) this.state = 'moderate';
    else                        this.state = 'critical';
  }

  _render() {
    if (this.barFill) {
      this.barFill.style.width = this.health + '%';
      this.barFill.className = 'health-bar-fill ' +
        (this.health >= 70 ? 'healthy' : this.health >= 35 ? 'moderate' : 'critical');
    }
    
    // Set --mascot-color on knight-belt-container to unify styling of knight, HP bar, speech bubble
    const knightContainer = document.getElementById('knight-belt-container');
    const stateColors = {
      healthy: 'var(--neon-green)',
      moderate: 'var(--neon-yellow)',
      critical: 'var(--neon-pink)',
      biased: 'var(--neon-pink)',
      outdated: 'var(--neon-yellow)',
      glitch: 'var(--neon-purple)'
    };
    const currentColor = stateColors[this.state] || 'var(--neon-cyan)';
    if (knightContainer) {
      knightContainer.style.setProperty('--mascot-color', currentColor);
    }

    // Render horizontal HP bar on belt
    const hpFill = document.getElementById('knight-hp-fill');
    const hpText = document.getElementById('knight-hp-text');
    
    if (hpFill) {
      hpFill.style.width = this.health + '%';
    }
    if (hpText) {
      hpText.textContent = this.health + '%';
      hpText.style.color = this.health >= 70 ? 'var(--neon-green)' : this.health >= 35 ? 'var(--neon-yellow)' : 'var(--neon-pink)';
    }

    if (this.mascotBody) {
      this.mascotBody.className = 'mascot-body ' + this.state;
    }
    if (this.mascotFace) {
      this.mascotFace.textContent = this.FACES[this.state] || '🛡️';
    }

    if (this.mascotImg && !this.mascotActionActive) {
      if (this.state === 'glitch') {
        if (!this.deathAnimationTriggered) {
          this.deathAnimationTriggered = true;
          this.mascotImg.src = `assets/mascot/knight/Colour1/Outline/120x80_gifs/__DeathNoMovement.gif?t=${Date.now()}`;
          
          if (this.deathFreezeTimeout) clearTimeout(this.deathFreezeTimeout);
          this.deathFreezeTimeout = setTimeout(() => {
            if (this.state === 'glitch' && this.mascotImg) {
              try {
                const canvas = document.createElement('canvas');
                canvas.width = this.mascotImg.naturalWidth || 120;
                canvas.height = this.mascotImg.naturalHeight || 80;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(this.mascotImg, 0, 0);
                this.mascotImg.src = canvas.toDataURL('image/png');
              } catch (e) {
                console.error("Failed to freeze mascot death GIF:", e);
              }
            }
          }, 1000);
        }
      } else {
        // Clear death states
        this.deathAnimationTriggered = false;
        if (this.deathFreezeTimeout) {
          clearTimeout(this.deathFreezeTimeout);
          this.deathFreezeTimeout = null;
        }

        const folders = {
          healthy:  'assets/mascot/knight/Colour2/Outline/120x80_gifs/',
          moderate: 'assets/mascot/knight/Colour1/Outline/120x80_gifs/',
          critical: 'assets/mascot/knight/Colour1/Outline/120x80_gifs/',
          biased:   'assets/mascot/knight/Colour1/Outline/120x80_gifs/',
          outdated: 'assets/mascot/knight/Colour1/Outline/120x80_gifs/',
        };
        const animations = {
          healthy:  '__Run.gif',
          moderate: '__Run.gif',
          critical: '__CrouchWalk.gif',
          biased:   '__CrouchWalk.gif',
          outdated: '__Run.gif',
        };
        
        const folder = folders[this.state] || folders.healthy;
        const anim = animations[this.state] || animations.healthy;
        const targetSrc = folder + anim;
        
        if (!this.mascotImg.src.includes(targetSrc)) {
          this.mascotImg.src = targetSrc;
        }
      }
    }
  }

  _flashDamage() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    gameArea.style.filter = 'brightness(1.3) saturate(1.5)';
    setTimeout(() => { gameArea.style.filter = ''; }, 200);
  }
}
