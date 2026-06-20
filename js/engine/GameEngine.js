// =========================================================
// THE AI KITCHEN — GameEngine.js
// State machine principal del juego
// Estados: MENU → LEVEL_SELECT → GAME → RESULTS → GALLERY
// =========================================================

import { LEVELS, getLevelById, getNextLevel } from '../data/levels.js';
import { ConveyorBelt } from './ConveyorBelt.js';
import { ScoreSystem } from '../systems/ScoreSystem.js';
import { AIHealthMeter } from '../systems/AIHealthMeter.js';
import { WorldviewPanel } from '../systems/WorldviewPanel.js';
import { WaveSystem } from '../systems/WaveSystem.js';
import { ProvenanceTracker } from '../systems/ProvenanceTracker.js';
import { selectDisaster, SUCCESS_RESULT } from '../data/disasters.js';
import { CORRECT_ACTION } from '../data/ingredients.js';
import { DataDetective } from '../modes/DataDetective.js';
import { ClassroomMode } from '../modes/ClassroomMode.js';
import { SpeedrunMode } from '../modes/SpeedrunMode.js';
import { TutorialSystem } from '../systems/TutorialSystem.js';

export const GameState = {
  MENU:         'MENU',
  LEVEL_SELECT: 'LEVEL_SELECT',
  GAME:         'GAME',
  PAUSED:       'PAUSED',
  RESULTS:      'RESULTS',
  GALLERY:      'GALLERY',
  REPORT:       'REPORT',
  SETTINGS:     'SETTINGS',
  DETECTIVE:    'DETECTIVE',
  CLASSROOM:    'CLASSROOM',
  SPEEDRUN:     'SPEEDRUN',
};

export class GameEngine {
  constructor() {
    this.state          = GameState.MENU;
    this.currentLevel   = null;
    this.blocksProcessed= 0;
    this.contamCounts   = { clean:0, outdated:0, biased:0, noise:0, ambiguous:0, poison:0 };
    this.correctCount   = 0;
    this.totalCount     = 0;
    this.levelTimer     = 0;
    this._timerInterval = null;
    this._animFrame     = null;

    // Sub-sistemas core
    this.conveyor   = new ConveyorBelt(this);
    this.score      = new ScoreSystem(this);
    this.health     = new AIHealthMeter(this);
    this.worldview  = new WorldviewPanel(this);
    this.waves      = new WaveSystem(this);
    this.provenance = new ProvenanceTracker(this);
    this.tutorial   = new TutorialSystem(this);

    // Modos especiales
    this.detective  = new DataDetective(this);
    this.classroom  = new ClassroomMode(this);
    this.speedrun   = new SpeedrunMode(this);

    // Persistencia
    this.gallery    = JSON.parse(localStorage.getItem('aik_gallery') || '[]');
    this.settings   = JSON.parse(localStorage.getItem('aik_settings') || '{"lowSpec":false,"sound":true,"speed":1}');
    this.progress   = JSON.parse(localStorage.getItem('aik_progress') || '{}');

    // WorldView acumulado cross-level (M7)
    this.cumulativeWorldview = JSON.parse(localStorage.getItem('aik_worldview') || 'null');

    // Aplicar low-spec al inicio
    if (this.settings.lowSpec) document.body.classList.add('low-spec');

    this._bindKeys();
    this._initUI();
  }

  // ── Transiciones de pantalla ─────────────────────────────
  setState(newState) {
    const prev = this.state;
    this.state = newState;
    this._onStateChange(prev, newState);
  }

  _onStateChange(from, to) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
      s.classList.add('hidden');
    });

    const screenMap = {
      [GameState.MENU]:         'screen-title',
      [GameState.LEVEL_SELECT]: 'screen-level-select',
      [GameState.GAME]:         'screen-game',
      [GameState.PAUSED]:       'screen-game',
      [GameState.RESULTS]:      'screen-results',
      [GameState.GALLERY]:      'screen-gallery',
      [GameState.REPORT]:       'screen-report',
      [GameState.SETTINGS]:     'screen-settings',
      [GameState.DETECTIVE]:    'screen-detective',
      [GameState.CLASSROOM]:    'screen-classroom',
      [GameState.SPEEDRUN]:     'screen-speedrun',
    };

    const targetId = screenMap[to];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.classList.remove('hidden');
        el.classList.add('active');
      }
    }

    const pauseOverlay = document.getElementById('pause-overlay');
    if (to === GameState.PAUSED) {
      if (pauseOverlay) pauseOverlay.style.display = 'flex';
    } else {
      if (pauseOverlay) pauseOverlay.style.display = 'none';
    }

    if (to === GameState.LEVEL_SELECT) this._renderLevelSelect();
    if (to === GameState.GALLERY)      this._renderGallery();
    if (to === GameState.REPORT)       this._renderReport();
    if (to === GameState.DETECTIVE)    this.detective.renderScreen();
    if (to === GameState.CLASSROOM)    this.classroom.renderTeacherPanel(document.getElementById('classroom-container'));
  }

  // ── Inicio de nivel ──────────────────────────────────────
  startLevel(levelId) {
    const level = getLevelById(levelId);
    if (!level || level.locked) return;

    this.currentLevel     = level;
    this.blocksProcessed  = 0;
    this.contamCounts     = { clean:0, outdated:0, biased:0, noise:0, ambiguous:0, poison:0 };
    this.acceptedCounts   = { clean:0, spurious:0, noise:0, poison:0, total:0 };
    this.correctCount     = 0;
    this.totalCount       = 0;
    this.levelTimer       = 0;

    // Actualizar UI del nivel y prompt del cliente
    const levelInfoEl = document.getElementById('hud-level-info');
    if (levelInfoEl) {
      levelInfoEl.innerHTML = `NIVEL <span>${level.id}</span> — ${level.name}`;
    }
    const promptTextEl = document.getElementById('client-prompt-text');
    if (promptTextEl) {
      promptTextEl.textContent = level.clientPrompt || '';
    }

    this.score.reset();
    this.health.reset();
    this.worldview.init(level);
    this.waves.init(level);
    this.provenance.reset();

    // Reset progress bar
    const progressFill = document.getElementById('level-progress-fill');
    if (progressFill) progressFill.style.width = '0%';
    const pctText = document.getElementById('level-progress-text');
    if (pctText) pctText.textContent = '0%';

    this.setState(GameState.GAME);
    this._updateActionButtonsVisibility(level.id);

    // Pequeño delay para que la transición termine
    setTimeout(() => {
      this.conveyor.start(level);
      this._startTimer();
      this.health.setMascotSpeech(level.mascotLines.start);

      if (level.id === 1) {
        this.tutorial.reset();
        this.tutorial.trigger('phase_a', [1, 2, 3]);
      } else if (level.hints && level.hints.length > 0) {
        this._showHint(level.hints[0]);
      }
    }, 500);
  }

  // ── Clasificación de un bloque ───────────────────────────
  classifyBlock(block, action) {
    if (this.state !== GameState.GAME) return;

    const correct = this.getCorrectActionForBlock(block);
    const isCorrect = correct === null
      ? true  // ambiguous: no penaliza
      : action === correct;

    this.totalCount++;

    // Fix: contamCounts solo se incrementa cuando el jugador ACEPTA datos malos
    // o RECHAZA datos buenos (contaminación real del dataset)
    if (!isCorrect) {
      this.contamCounts[block.type] = (this.contamCounts[block.type] || 0) + 1;
    }

    if (action === 'accept') {
      this.acceptedCounts[block.type] = (this.acceptedCounts[block.type] || 0) + 1;
      this.acceptedCounts.total++;
    }

    if (isCorrect) {
      this.correctCount++;
      this.score.addCorrect(block);
      this.health.onCorrect(block);
      this.provenance.record(block, action, isCorrect);
      this._showFeedback('✓ +' + this.score.lastPoints, block.domElement, 'correct');
    } else {
      this.score.addWrong(block);
      this.health.onWrong(block);
      this.provenance.record(block, action, isCorrect);
      this._showFeedback('✗', block.domElement, 'wrong');
    }

    this.worldview.update(block, isCorrect);
    this.conveyor.removeBlock(block);
    this.blocksProcessed++;

    // Fix: AI Memory solo avanza con clasificaciones correctas
    const progressFill = document.getElementById('level-progress-fill');
    if (progressFill && this.currentLevel) {
      const pct = Math.round((this.correctCount / this.currentLevel.belt.totalBlocks) * 100);
      progressFill.style.width = Math.min(pct, 100) + '%';
      const pctText = document.getElementById('level-progress-text');
      if (pctText) pctText.textContent = Math.min(pct, 100) + '%';
    }

    // Verificar fin del nivel
    if (this.blocksProcessed >= this.currentLevel.belt.totalBlocks) {
      this._endLevel();
    }
  }

  getCorrectActionForBlock(block) {
    if (!this.currentLevel) return null;
    const levelId = this.currentLevel.id;
    if (block.type === 'ambiguous') return null;

    if (block.ingredient && block.ingredient.correctAction) {
      return block.ingredient.correctAction;
    }

    if (levelId === 1) {
      // En nivel 1, todo lo que no sea limpio es rechazable con REJECT
      return block.type === 'clean' ? 'accept' : 'reject';
    }
    if (levelId === 2) {
      // En nivel 2, limpio es accept, outdated es reject
      return block.type === 'clean' ? 'accept' : 'reject';
    }
    return CORRECT_ACTION[block.type];
  }

  _updateActionButtonsVisibility(levelId) {
    const btnAccept = document.getElementById('btn-accept');
    const btnReject = document.getElementById('btn-reject');
    const btnFlag   = document.getElementById('btn-flag');
    const btnBurn   = document.getElementById('btn-burn');

    if (!btnAccept || !btnReject || !btnFlag || !btnBurn) return;

    // Reset styles
    btnAccept.style.display = 'flex';
    btnReject.style.display = 'flex';
    btnFlag.style.display   = 'flex';
    btnBurn.style.display   = 'flex';

    if (levelId === 1 || levelId === 2) {
      btnFlag.style.display = 'none';
      btnBurn.style.display = 'none';
    } else if (levelId === 3 || levelId === 6) {
      btnBurn.style.display = 'none';
    }
  }

  // ── Fin del nivel ────────────────────────────────────────
  _endLevel() {
    this._stopTimer();
    this.conveyor.stop();

    // Guardar worldview acumulado (M7)
    this.cumulativeWorldview = this.worldview.getCumulative();
    localStorage.setItem('aik_worldview', JSON.stringify(this.cumulativeWorldview));

    // Calcular resultado
    let accuracy = 0;
    let disaster = null;

    if (this.currentLevel.id === 6) {
      const cleanAccepted = this.acceptedCounts.clean || 0;
      const noiseAccepted = this.acceptedCounts.noise || 0;
      const spuriousAccepted = this.acceptedCounts.spurious || 0;
      const poisonAccepted = this.acceptedCounts.poison || 0;
      const totalAccepted = this.acceptedCounts.total || 0;

      const clamp = (val) => Math.max(0, Math.min(1, val));
      const Pc = clamp((cleanAccepted + noiseAccepted) > 0 ? (cleanAccepted / (cleanAccepted + noiseAccepted)) : 0);
      const Ib = clamp(totalAccepted > 0 ? (spuriousAccepted / totalAccepted) : 0);
      const Rp = clamp(totalAccepted > 0 ? (poisonAccepted / totalAccepted) : 0);

      // Compound ML Accuracy formula: Pc * (1 - Ib) * (1 - Rp) (0 if no data is accepted)
      const mlAccVal = totalAccepted > 0 ? Pc * (1 - Ib) * (1 - Rp) : 0;
      accuracy = clamp(mlAccVal) * 100;
      accuracy = Math.round(accuracy);

      // Select disaster based on acceptedCounts
      disaster = accuracy < this.currentLevel.thresholds.pass
        ? selectDisaster(this.currentLevel.id, this.acceptedCounts)
        : null;
    } else {
      accuracy = this.totalCount > 0
        ? Math.round((this.correctCount / this.totalCount) * 100)
        : 0;

      disaster = accuracy < this.currentLevel.thresholds.pass
        ? selectDisaster(this.currentLevel.id, this.contamCounts)
        : null;
    }

    const result = disaster || SUCCESS_RESULT;

    // Guardar progreso
    this._saveProgress(this.currentLevel.id, accuracy, result);

    // Ir a resultados
    setTimeout(() => {
      if (this.currentLevel?.id === 1) {
        this.tutorial.trigger('phase_e', [9, 10], () => {
          this._renderResults(result, accuracy);
          this.setState(GameState.RESULTS);
        });
      } else {
        this._renderResults(result, accuracy);
        this.setState(GameState.RESULTS);
      }
    }, 800);
  }

  // ── Pausa ────────────────────────────────────────────────
  pause() {
    if (this.state !== GameState.GAME) return;
    this.setState(GameState.PAUSED);
    this.conveyor.pause();
    this._stopTimer();
  }

  resume() {
    if (this.state !== GameState.PAUSED) return;
    this.setState(GameState.GAME);
    this.conveyor.resume();
    this._startTimer();
  }

  // ── Timer ────────────────────────────────────────────────
  _startTimer() {
    this._timerInterval = setInterval(() => {
      this.levelTimer++;
      this._updateTimerUI();
    }, 1000);
  }

  _stopTimer() {
    clearInterval(this._timerInterval);
    this._timerInterval = null;
  }

  _updateTimerUI() {
    const el = document.getElementById('hud-timer');
    if (!el) return;
    const m = Math.floor(this.levelTimer / 60).toString().padStart(2, '0');
    const s = (this.levelTimer % 60).toString().padStart(2, '0');
    el.textContent = `${m}:${s}`;
  }

  // ── Rendering de pantallas ───────────────────────────────
  _renderLevelSelect() {
    const grid = document.getElementById('levels-grid');
    if (!grid) return;
    grid.innerHTML = '';
    LEVELS.forEach(level => {
      const done      = !!this.progress[level.id];
      const isLocked  = level.id > 1 && !this.progress[level.id - 1];

      const card = document.createElement('div');
      card.className = `level-card ${done ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
      card.style.setProperty('--card-color', level.color);
      card.dataset.levelId = level.id;

      const dots = Array.from({length: 5}, (_, i) =>
        `<div class="diff-dot ${i < level.difficulty ? 'filled' : ''}"></div>`
      ).join('');

      card.innerHTML = `
        <div class="level-number">NIVEL ${level.id} ${isLocked ? '🔒' : ''}</div>
        <div class="level-icon">${level.emoji}</div>
        <div class="level-name">${level.name}</div>
        <div class="level-concept">${level.conceptFull}</div>
        <div class="level-difficulty">${dots}</div>
      `;

      if (!isLocked) {
        card.addEventListener('click', () => this.startLevel(level.id));
      }
      grid.appendChild(card);
    });
  }

  _renderResults(result, accuracy) {
    const container = document.getElementById('results-container');
    if (!container) return;

    const isSuccess = result.id === 'SUCCESS';
    const level     = this.currentLevel;

    let statsHtml = '';

    if (level.id === 6) {
      const cleanAccepted = this.acceptedCounts.clean || 0;
      const noiseAccepted = this.acceptedCounts.noise || 0;
      const spuriousAccepted = this.acceptedCounts.spurious || 0;
      const poisonAccepted = this.acceptedCounts.poison || 0;
      const totalAccepted = this.acceptedCounts.total || 0;

      const clampPct = (val) => Math.max(0, Math.min(100, Math.round(val)));
      const Pc = (cleanAccepted + noiseAccepted) > 0 
        ? clampPct((cleanAccepted / (cleanAccepted + noiseAccepted)) * 100) 
        : 0;
      const Ib = totalAccepted > 0 
        ? clampPct((spuriousAccepted / totalAccepted) * 100) 
        : 0;
      const Rp = totalAccepted > 0 
        ? clampPct((poisonAccepted / totalAccepted) * 100) 
        : 0;

      statsHtml = `
        <div class="level-stats" style="grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));">
          <div class="stat-item" title="Precisión de Clase = Aceptados_Limpio / (Aceptados_Limpio + Aceptados_Ruido)">
            <span class="stat-value text-neon-cyan">${Pc}%</span>
            <span class="stat-label" style="font-size:0.7rem">Precisión Clase (Pc)</span>
            <span class="stat-formula" style="font-size:0.5rem;color:var(--text-muted)">Limpio_A / (Limpio_A + Ruido_A)</span>
          </div>
          <div class="stat-item" title="Sesgo de Correlación Espuria = Aceptados_Espurio / Aceptados_Total">
            <span class="stat-value text-neon-pink">${Ib}%</span>
            <span class="stat-label" style="font-size:0.7rem">Sesgo Espurio (Ib)</span>
            <span class="stat-formula" style="font-size:0.5rem;color:var(--text-muted)">Espurio_A / Total_A</span>
          </div>
          <div class="stat-item" title="Contaminación de Datos = Aceptados_Veneno / Aceptados_Total">
            <span class="stat-value text-neon-orange">${Rp}%</span>
            <span class="stat-label" style="font-size:0.7rem">Contaminación (Rp)</span>
            <span class="stat-formula" style="font-size:0.5rem;color:var(--text-muted)">Veneno_A / Total_A</span>
          </div>
        </div>
        <div class="ml-composite-score" style="
          margin: 1rem auto; max-width: 400px;
          background: rgba(0, 245, 255, 0.05);
          border: 1px solid var(--neon-cyan);
          border-radius: var(--radius-md);
          padding: 0.75rem; text-align: center;
          box-shadow: 0 0 15px rgba(0, 245, 255, 0.1);
        ">
          <div style="font-size: 0.55rem; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase;">
            Métrica de Rendimiento Compuesto (ML Accuracy)
          </div>
          <div style="font-size: 2rem; font-weight: 900; color: var(--neon-green); text-shadow: 0 0 8px var(--neon-green); margin: 0.2rem 0;">
            ${accuracy}%
          </div>
          <div style="font-size: 0.55rem; color: var(--text-muted); font-family: monospace;">
            Acc_ML = Pc * (1 - Ib) * (1 - Rp)
          </div>
        </div>
      `;
    } else {
      statsHtml = `
        <div class="level-stats">
          <div class="stat-item">
            <span class="stat-value text-neon-cyan">${accuracy}%</span>
            <span class="stat-label">Precisión</span>
          </div>
          <div class="stat-item">
            <span class="stat-value text-neon-green">${this.correctCount}</span>
            <span class="stat-label">Correctos</span>
          </div>
          <div class="stat-item">
            <span class="stat-value text-neon-pink">${this.totalCount - this.correctCount}</span>
            <span class="stat-label">Errores</span>
          </div>
          <div class="stat-item">
            <span class="stat-value text-neon-yellow">${this.score.total}</span>
            <span class="stat-label">Score</span>
          </div>
        </div>`;
    }

    // Fix: SIEMPRE mostrar comparación — incluso en éxito, mostrar qué habría pasado
    let compHtml = '';
    if (!isSuccess) {
      compHtml = `
        <div class="comparison-grid">
          <div class="comparison-card yours">
            <div class="comparison-label">🔴 Lo que tú produjiste</div>
            <div class="comparison-output">${result.yourOutput}</div>
          </div>
          <div class="comparison-card ideal">
            <div class="comparison-label">🟢 Con datos perfectos</div>
            <div class="comparison-output">${result.idealOutput}</div>
          </div>
        </div>`;
    } else {
      // En éxito: mostrar qué HABRÍA pasado con datos malos
      const potentialDisaster = selectDisaster(level.id, { noise: 5, outdated: 5, biased: 5, poison: 3 });
      if (potentialDisaster) {
        compHtml = `
          <div class="comparison-grid">
            <div class="comparison-card ideal" style="border-color: var(--neon-green);">
              <div class="comparison-label">🟢 Tu resultado (¡Bien hecho!)</div>
              <div class="comparison-output">La IA recibió datos limpios y relevantes. Sus recomendaciones son precisas, actualizadas y confiables. ¡Este es el estándar profesional!</div>
            </div>
            <div class="comparison-card yours" style="opacity: 0.85;">
              <div class="comparison-label">⚠️ Lo que HABRÍA pasado con datos malos</div>
              <div class="comparison-output">${potentialDisaster.yourOutput}</div>
            </div>
          </div>
          <div style="text-align:center; margin-top:0.75rem; font-size:0.8rem; color:var(--text-muted)">
            <em>${potentialDisaster.emoji} "${potentialDisaster.title}" — lo que evitaste con tu buena curación de datos</em>
          </div>`;
      }
    }

    const provenanceHtml = this.provenance.renderHTML();

    container.innerHTML = `
      <div class="results-disaster">
        <span class="disaster-image">${result.emoji}</span>
        <div class="disaster-title">${result.title}</div>
        <div class="disaster-explanation">${result.explanation}</div>
        <span class="concept-tag">📚 ${result.concept}</span>
      </div>
      ${statsHtml}
      ${compHtml}
      ${provenanceHtml}
      <div class="flex gap-md" style="justify-content:center;flex-wrap:wrap;margin-top:1.5rem">
        <button class="btn btn-primary btn-lg" id="btn-next-level">
          ${level.id === 1 ? '¡Ver Galería! 🏆' : (getNextLevel(level.id) ? '¡Siguiente Nivel! →' : '¡Ver Galería! 🏆')}
        </button>
        <button class="btn btn-ghost" id="btn-retry">↩ Reintentar</button>
        <button class="btn btn-ghost" id="btn-level-select">🗺️ Mapa</button>
      </div>`;

    document.getElementById('btn-next-level')?.addEventListener('click', () => {
      const next = getNextLevel(level.id);
      if (next && level.id !== 1) this.startLevel(next.id);
      else this.setState(GameState.GALLERY);
    });
    document.getElementById('btn-retry')?.addEventListener('click', () => this.startLevel(level.id));
    document.getElementById('btn-level-select')?.addEventListener('click', () => this.setState(GameState.LEVEL_SELECT));
  }

  _renderGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (this.gallery.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1">Aún no tienes desastres. ¡Juega y comete errores épicos! 🎮</p>';
      return;
    }

    this.gallery.forEach(item => {
      const card = document.createElement('div');
      card.className = 'gallery-item animate-scale-in';
      card.innerHTML = `
        <span class="gallery-emoji">${item.emoji}</span>
        <div class="gallery-name">${item.title}</div>
        <div class="gallery-concept">${item.concept}</div>
      `;
      grid.appendChild(card);
    });
  }

  _renderReport() {
    // Implementado en ReportExporter.js
    import('../ui/ReportExporter.js').then(m => m.renderReport(this));
  }

  // ── Feedback flotante ─────────────────────────────────────
  _showFeedback(text, blockEl, type) {
    if (!blockEl) return;
    const rect = blockEl.getBoundingClientRect();
    const fb = document.createElement('div');
    fb.className = `feedback-text ${type}`;
    fb.textContent = text;
    fb.style.left = rect.left + rect.width / 2 + 'px';
    fb.style.top  = rect.top + 'px';
    document.body.appendChild(fb);
    fb.addEventListener('animationend', () => fb.remove());
  }

  _showHint(hint) {
    // Mini toast de hint
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed;bottom:110px;left:50%;transform:translateX(-50%);
      background:var(--bg-card);border:1px solid var(--neon-cyan);
      border-radius:8px;padding:0.6rem 1.2rem;font-size:0.8rem;
      color:var(--text-primary);z-index:100;animation:fade-in 0.3s ease;
      max-width:400px;text-align:center;box-shadow:var(--shadow-cyan);
    `;
    toast.textContent = '💡 ' + hint.text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // ── Persistencia ─────────────────────────────────────────
  _saveProgress(levelId, accuracy, result) {
    this.progress[levelId] = { accuracy, score: this.score.total, time: this.levelTimer };
    localStorage.setItem('aik_progress', JSON.stringify(this.progress));

    if (result.galleryUnlock && !this.gallery.find(g => g.id === result.id)) {
      this.gallery.push({ id: result.id, emoji: result.emoji, title: result.title, concept: result.concept });
      localStorage.setItem('aik_gallery', JSON.stringify(this.gallery));
    }
  }

  _isUnlocked(levelId) {
    return levelId === 1;
  }

  // ── Configuración ─────────────────────────────────────────
  toggleLowSpec() {
    this.settings.lowSpec = !this.settings.lowSpec;
    document.body.classList.toggle('low-spec', this.settings.lowSpec);
    localStorage.setItem('aik_settings', JSON.stringify(this.settings));
    return this.settings.lowSpec;
  }

  // ── Teclado ──────────────────────────────────────────────
  _bindKeys() {
    document.addEventListener('keydown', (e) => {
      if (this.state === GameState.PAUSED && e.key === 'Escape') {
        e.preventDefault();
        this.resume();
        return;
      }
      if (this.state !== GameState.GAME) return;
      const selectedBlock = this.conveyor.getSelectedBlock();
      if (!selectedBlock) return;

      const keyMap = { a: 'accept', A: 'accept', r: 'reject', R: 'reject',
                       f: 'flag',   F: 'flag',   b: 'burn',   B: 'burn' };
      const action = keyMap[e.key];
      if (action) {
        // Ignorar si la acción está oculta en este nivel
        const isHidden = (this.currentLevel && (
          ((action === 'flag' || action === 'burn') && (this.currentLevel.id === 1 || this.currentLevel.id === 2)) ||
          (action === 'burn' && this.currentLevel.id === 3)
        ));
        if (!isHidden) {
          e.preventDefault();
          this.classifyBlock(selectedBlock, action);
        }
      }

      if (e.key === 'Escape') this.pause();
      if (e.key === ' ') { e.preventDefault(); this.conveyor.selectNext(); }
    });
  }

  // ── Inicializar UI event listeners ───────────────────────
  _initUI() {
    // Title screen buttons
    document.getElementById('btn-play')        ?.addEventListener('click', () => this.setState(GameState.LEVEL_SELECT));
    document.getElementById('btn-gallery')     ?.addEventListener('click', () => this.setState(GameState.GALLERY));
    document.getElementById('btn-report')      ?.addEventListener('click', () => this.setState(GameState.REPORT));
    document.getElementById('btn-settings')    ?.addEventListener('click', () => this.setState(GameState.SETTINGS));
    document.getElementById('btn-detective')   ?.addEventListener('click', () => this.setState(GameState.DETECTIVE));
    document.getElementById('btn-classroom')   ?.addEventListener('click', () => this.setState(GameState.CLASSROOM));

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setState(GameState.MENU));
    });

    // Action buttons del juego
    ['accept','reject','flag','burn'].forEach(action => {
      document.getElementById(`btn-${action}`)?.addEventListener('click', () => {
        const block = this.conveyor.getSelectedBlock();
        if (block) this.classifyBlock(block, action);
      });
    });

    // Low-spec toggle
    const toggle = document.getElementById('low-spec-toggle-switch');
    toggle?.addEventListener('click', () => {
      const isOn = this.toggleLowSpec();
      toggle.classList.toggle('on', isOn);
    });

    // Pause button
    document.getElementById('btn-pause')?.addEventListener('click', () => {
      if (this.state === GameState.GAME) this.pause();
      else if (this.state === GameState.PAUSED) this.resume();
    });

    // Speedrun toggle en level select
    document.getElementById('btn-speedrun-toggle')?.addEventListener('click', () => {
      this.speedrunActive = !this.speedrunActive;
      const btn = document.getElementById('btn-speedrun-toggle');
      if (btn) btn.textContent = this.speedrunActive ? '⚡ Speedrun ON' : '⚡ Speedrun OFF';
    });
  }
}
