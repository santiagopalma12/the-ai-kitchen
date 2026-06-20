// =========================================================
// THE AI KITCHEN — WaveSystem.js (Mejora M6)
// Contamination Wave Events — oleadas de datos envenenados
// =========================================================

export class WaveSystem {
  constructor(engine) {
    this.engine       = engine;
    this.waves        = [];
    this.firedWaves   = new Set();
    this.shieldUsed   = false;
    this.shieldBtnEl  = document.getElementById('filter-shield-btn');
    this.waveAlertEl  = document.getElementById('wave-alert');
  }

  init(level) {
    this.waves      = level.waves || [];
    this.firedWaves = new Set();
    this.shieldUsed = false;

    if (this.shieldBtnEl) {
      this.shieldBtnEl.classList.remove('active', 'used');
      this.shieldBtnEl.onclick = () => this._activateShield();
    }
  }

  onBlockSpawned(blockCount) {
    for (const wave of this.waves) {
      if (wave.at_block === blockCount && !this.firedWaves.has(wave.at_block)) {
        this.firedWaves.add(wave.at_block);
        this._triggerWave(wave);
      }
    }
  }

  _triggerWave(wave) {
    // Mostrar alerta
    if (this.waveAlertEl) {
      this.waveAlertEl.textContent = wave.message;
      this.waveAlertEl.classList.add('active');
    }

    // Mostrar botón de escudo
    if (this.shieldBtnEl && !this.shieldUsed) {
      this.shieldBtnEl.classList.add('active');
    }

    // Acelerar faja durante la oleada
    const origSpeed = this.engine.conveyor.speed;
    this.engine.conveyor.speed = origSpeed * wave.speed_multiplier;

    // Lanzar bloques de la oleada
    this.engine.conveyor.spawnWave(wave);

    // Restaurar después de 8 segundos
    setTimeout(() => {
      if (!this.shieldUsed) {
        this.engine.conveyor.speed = origSpeed;
      }
      if (this.waveAlertEl) this.waveAlertEl.classList.remove('active');
      if (this.shieldBtnEl) this.shieldBtnEl.classList.remove('active');
    }, 8000);
  }

  _activateShield() {
    if (this.shieldUsed) return;
    this.shieldUsed = true;

    // Eliminar todos los bloques de tipo poison/noise de la faja
    const toRemove = this.engine.conveyor.blocks.filter(
      b => b.ingredient.type === 'poison' || b.id?.startsWith('wave_')
    );
    toRemove.forEach(b => this.engine.conveyor.removeBlock(b));

    // Visual feedback
    if (this.shieldBtnEl) this.shieldBtnEl.classList.add('used');

    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed;inset:0;background:rgba(0,245,255,0.15);
      pointer-events:none;z-index:50;animation:fade-in 0.1s ease;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 400);

    // Restaurar velocidad
    this.engine.conveyor.speed = this.engine.currentLevel.belt.speed;
  }
}
