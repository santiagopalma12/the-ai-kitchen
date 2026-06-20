// =========================================================
// THE AI KITCHEN — ScoreSystem.js  (Mejora M2)
// Multiplicador de racha, Noise Overload anti-spam
// =========================================================

export class ScoreSystem {
  constructor(engine) {
    this.engine         = engine;
    this.total          = 0;
    this.streak         = 0;
    this.multiplier     = 1;
    this.lastPoints     = 0;
    this.consecutiveErrors = 0;
    this.noiseOverloadActive = false;
    this.OVERLOAD_THRESHOLD  = 4; // errores consecutivos → Noise Overload

    this.scoreEl    = document.getElementById('hud-score');
    this.streakEl   = document.getElementById('streak-counter');
    this.overloadEl = document.getElementById('noise-overload-overlay');
  }

  reset() {
    this.total = 0; this.streak = 0; this.multiplier = 1;
    this.consecutiveErrors = 0; this.noiseOverloadActive = false;
    this._update();
    this._updateStreak();
  }

  addCorrect(block) {
    this.consecutiveErrors = 0;

    const base = this._basePoints(block.ingredient.type);
    this.multiplier = Math.min(1 + (this.streak * 0.25), 4.0);
    this.lastPoints = Math.round(base * this.multiplier);
    this.total     += this.lastPoints;
    this.streak++;

    // Acelerar faja cada N correctos (nivel define el umbral)
    const accel = this.engine.currentLevel?.belt?.accelerateEvery;
    if (accel && this.streak % accel === 0) {
      this.engine.conveyor.accelerate(0.15);
    }

    this._update();
    this._updateStreak();
    this._deactivateOverload();
  }

  addWrong(block) {
    this.streak = 0;
    this.multiplier = 1;
    this.consecutiveErrors++;
    this.lastPoints = 0;

    if (this.consecutiveErrors >= this.OVERLOAD_THRESHOLD) {
      this._activateOverload();
    }

    this._update();
    this._updateStreak();
  }

  addMissed() {
    this.streak = 0;
    this.multiplier = 1;
    this.consecutiveErrors++;
    this.lastPoints = -50;  // Penalización visible por dejar pasar un bloque
    this.total = Math.max(0, this.total - 50);

    if (this.consecutiveErrors >= this.OVERLOAD_THRESHOLD) {
      this._activateOverload();
    }

    this._update();
    this._updateStreak();
  }

  _basePoints(type) {
    const points = { clean: 100, outdated: 120, biased: 150, noise: 120, ambiguous: 80, poison: 200 };
    return points[type] || 100;
  }

  _update() {
    if (!this.scoreEl) return;
    this.scoreEl.textContent = this.total.toLocaleString();
    this.scoreEl.classList.add('bump');
    setTimeout(() => this.scoreEl?.classList.remove('bump'), 300);
  }

  _updateStreak() {
    if (!this.streakEl) return;
    if (this.streak >= 3) {
      this.streakEl.classList.add('visible');
      this.streakEl.innerHTML = `<span class="streak-icon">🔥</span> x${this.streak} RACHA (×${this.multiplier.toFixed(1)})`;
    } else {
      this.streakEl.classList.remove('visible');
    }
  }

  // ── Noise Overload (M2) ──────────────────────────────────
  _activateOverload() {
    if (this.noiseOverloadActive) return;
    this.noiseOverloadActive = true;
    this.consecutiveErrors   = 0;

    if (this.overloadEl) this.overloadEl.classList.add('active');

    // Ralentizar faja 3 segundos
    const oldSpeed = this.engine.conveyor.speed;
    this.engine.conveyor.speed = oldSpeed * 0.4;
    this.engine.conveyor.blocks.forEach(b => { b.speed = this.engine.conveyor.speed; });

    setTimeout(() => {
      this._deactivateOverload();
      this.engine.conveyor.speed = oldSpeed;
      this.engine.conveyor.blocks.forEach(b => { b.speed = this.engine.conveyor.speed; });
    }, 3000);
  }

  _deactivateOverload() {
    this.noiseOverloadActive = false;
    if (this.overloadEl) this.overloadEl.classList.remove('active');
  }
}
