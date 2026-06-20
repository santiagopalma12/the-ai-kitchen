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
      healthy:  '🤖',
      moderate: '😅',
      critical: '😵',
      biased:   '🤨',
      outdated: '🕰️',
      glitch:   '💀',
    };
  }

  reset() {
    this.health = 100;
    this.state  = 'healthy';
    this._render();
  }

  onCorrect(block) {
    this.health = Math.min(100, this.health + 3);
    this._updateState();
    this._render();
  }

  onWrong(block) {
    const dmg = { clean:5, outdated:8, biased:12, noise:10, ambiguous:3, poison:20 };
    this.health = Math.max(0, this.health - (dmg[block.type] || 5));
    this._updateState(block.type);
    this._render();
    this._flashDamage();

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
          speech = `¡Rechazaste una recomendación válida: "${block.ingredient.text}"! 🏔️ Lo necesitaba para entrenar el recomendador…`;
        } else {
          const txt = block.ingredient.text.toLowerCase();
          let label = 'contenido irrelevante';
          if (txt.includes('robo')) label = 'noticia de robos 🚨';
          else if (txt.includes('tráfico')) label = 'reporte de tráfico 🚗';
          else if (txt.includes('meme')) label = 'meme de internet 🤪';
          else if (txt.includes('hater')) label = 'comentario malicioso/hater 🤮';
          else if (txt.includes('peligrosas')) label = 'alerta de seguridad ⚠️';
          else if (txt.includes('cusco')) label = 'guía de otra ciudad (Cusco) 🗺️';
          else if (txt.includes('postal')) label = 'postal antigua desactualizada 📸';
          
          speech = `¿Aceptaste un ${label}? ¡Eso no sirve para entrenar un recomendador de turismo sobre Arequipa!`;
        }
      }

      this.setMascotSpeech(speech);
    }
  }

  onMissed(ingredient) {
    this.health = Math.max(0, this.health - 6);
    this._updateState();
    this._render();
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
    
    // Render vertical elements
    const verticalFill = document.getElementById('health-bar-fill-vertical');
    const indicatorFace = document.getElementById('health-indicator-face');
    const percentText = document.getElementById('health-percent-text');
    
    if (verticalFill) {
      verticalFill.style.height = this.health + '%';
    }
    if (indicatorFace) {
      // Bottom slider calculation: offset half indicator height to center it
      indicatorFace.style.bottom = `calc(${this.health}% - 16px)`;
      indicatorFace.textContent = this.FACES[this.state] || '🤖';
      
      const stateColors = {
        healthy: 'var(--neon-green)',
        moderate: 'var(--neon-yellow)',
        critical: 'var(--neon-pink)',
        biased: 'var(--neon-pink)',
        outdated: 'var(--neon-yellow)',
        glitch: 'var(--neon-purple)'
      };
      const currentColor = stateColors[this.state] || 'var(--neon-cyan)';
      indicatorFace.style.borderColor = currentColor;
      indicatorFace.style.boxShadow = `0 0 10px ${currentColor}`;
    }
    if (percentText) {
      percentText.textContent = this.health + '%';
      percentText.style.color = this.health >= 70 ? 'var(--neon-green)' : this.health >= 35 ? 'var(--neon-yellow)' : 'var(--neon-pink)';
    }

    if (this.mascotBody) {
      this.mascotBody.className = 'mascot-body ' + this.state;
    }
    if (this.mascotFace) {
      this.mascotFace.textContent = this.FACES[this.state] || '🤖';
    }
    if (this.mascotImg) {
      const emoteMap = {
        healthy:  'assets/img/robot-emotes/robot_happy.png',
        moderate: 'assets/img/robot-emotes/robot_idle.png',
        critical: 'assets/img/robot-emotes/robot_fail.png',
        biased:   'assets/img/robot-emotes/robot_fail.png',
        outdated: 'assets/img/robot-emotes/robot_fail.png',
        glitch:   'assets/img/robot-emotes/robot_electrocution.png',
      };
      this.mascotImg.src = emoteMap[this.state] || 'assets/img/robot-emotes/robot_idle.png';
    }
  }

  _flashDamage() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    gameArea.style.filter = 'brightness(1.3) saturate(1.5)';
    setTimeout(() => { gameArea.style.filter = ''; }, 200);
  }
}
