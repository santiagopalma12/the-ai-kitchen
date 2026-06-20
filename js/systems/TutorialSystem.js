// =========================================================
// THE AI KITCHEN — TutorialSystem.js
// Just-In-Time Scaffolding & Educational Slides
// Fix: Fases B/C/D convertidas a tooltips no-intrusivos
// =========================================================

export class TutorialSystem {
  constructor(engine) {
    this.engine = engine;
    this.overlayEl = document.getElementById('tutorial-overlay');
    this.phaseTitleEl = document.getElementById('tutorial-phase-title');
    this.slideCountEl = document.getElementById('tutorial-slide-count');
    this.imageEl = document.getElementById('tutorial-image');
    this.titleEl = document.getElementById('tutorial-slide-title');
    this.textEl = document.getElementById('tutorial-slide-text');
    this.nextBtn = document.getElementById('btn-tutorial-next');

    this.currentSequence = [];
    this.currentIndex = 0;
    this.onCompleteCallback = null;
    this.triggeredTriggers = new Set();
    this.prevState = null;

    // Slides que SÍ pausan el juego (solo Fase A inicial y Fase E debrief)
    this.slides = {
      1: {
        phase: 'FASE A: DESPLIEGUE',
        title: 'BRIEFING DE MISIÓN: INGESTIÓN DE DATOS',
        text: '¡Bienvenido, Chef de Datos! Tu misión es entrenar a la IA del Recomendador Turístico de Arequipa. Los datos que le envíes formarán su cerebro y comportamiento. ¡Tú decides qué aprende!',
        image: 'assets/img/tutorial/slide1.png',
        color: 'var(--neon-cyan)'
      },
      2: {
        phase: 'FASE A: DESPLIEGUE',
        title: 'MECANISMO: REPLICACIÓN DE PATRONES',
        text: 'Los modelos de IA no piensan como humanos. ¡Actúan como loros robotizados! No tienen sentimientos ni criterio propio; simplemente replican patrones. Si entrenas al modelo con desinformación o datos malos, los repetirá con absoluta certeza.',
        image: 'assets/img/tutorial/slide2.png',
        color: 'var(--neon-cyan)'
      },
      3: {
        phase: 'FASE A: DESPLIEGUE',
        title: 'CONTROLES: APPROVE vs REJECT',
        text: 'Lee cada cartucho de datos y decide: presiona [A] o APPROVE para alimentar a la IA con datos útiles de turismo. Presiona [R] o REJECT para purgar datos irrelevantes, memes, noticias o desinformación. ¡Lee bien antes de decidir!',
        image: 'assets/img/tutorial/slide3.png',
        color: 'var(--neon-cyan)'
      },
      // Slides 4-8 eliminados como overlay — ahora son tooltips (ver showTooltip)
      9: {
        phase: 'FASE E: FASE DE AUDITORÍA',
        title: 'EVALUACIÓN COMPARATIVA: DIAGNÓSTICO',
        text: '¡Nivel completado! Veamos el diagnóstico. Compararemos tu IA entrenada con un modelo ideal. Cualquier error que hayas cometido habrá creado un recomendador sesgado o inútil frente al grupo de control.',
        image: 'assets/img/tutorial/slide9.png',
        color: 'var(--neon-green)'
      },
      10: {
        phase: 'FASE E: FASE DE AUDITORÍA',
        title: 'IMPACTO REAL: SESGO ALGORÍTMICO',
        text: 'La curación de datos es la ética humana protegiendo la tecnología. Si entrenamos una IA con currículums sesgados, aprenderá que el género es un requisito para contratar. ¡Tu curación mantiene a la IA justa y segura!',
        image: 'assets/img/tutorial/slide10.png',
        color: 'var(--neon-cyan)'
      }
    };

    // Tooltips no-intrusivos (NO pausan el juego)
    this.tooltips = {
      phase_b: {
        icon: '✨',
        title: '¡DATO LIMPIO DETECTADO!',
        text: 'Las guías oficiales y verificadas son oro puro. Lee el texto — si es turismo legítimo de Arequipa, ¡dale APPROVE!',
        color: 'var(--neon-green)',
        duration: 5000,
      },
      phase_c: {
        icon: '💀',
        title: '⚠️ ¡RUIDO EN LA FAJA!',
        text: 'Noticias de crímenes, memes y opiniones no sirven para entrenar un recomendador. ¡Lee el contenido y dale REJECT!',
        color: 'var(--neon-pink)',
        duration: 5500,
        glitch: true,
      },
      phase_d: {
        icon: '🏷️',
        title: '¡ETIQUETA ENGAÑOSA!',
        text: 'Este dato parece oficial, pero lee el texto: ¿es turismo o es burocracia? No confíes en la fuente — ¡audita el contenido!',
        color: 'var(--neon-yellow)',
        duration: 5500,
      },
    };

    this.activeTooltip = null;

    this.nextBtn?.addEventListener('click', () => this.next());
  }

  reset() {
    this.triggeredTriggers.clear();
    this._dismissTooltip();
  }

  // ── Trigger overlay (solo Fase A y E) ─────────────────────
  trigger(triggerId, slideIds, onComplete) {
    if (!this.engine.currentLevel || this.engine.currentLevel.id !== 1) {
      if (onComplete) onComplete();
      return;
    }
    if (this.triggeredTriggers.has(triggerId)) {
      if (onComplete) onComplete();
      return;
    }

    // Solo permitir fases A y E como overlays pausantes
    if (triggerId !== 'phase_a' && triggerId !== 'phase_e') {
      // Redirigir a tooltip no-intrusivo
      this.showTooltip(triggerId);
      if (onComplete) onComplete();
      return;
    }

    this.triggeredTriggers.add(triggerId);
    this.prevState = this.engine.state;
    this.engine.state = 'TUTORIAL';
    this.engine.conveyor.pause();
    this.engine._stopTimer();

    this.currentSequence = slideIds;
    this.currentIndex = 0;
    this.onCompleteCallback = onComplete;

    this.showSlide();
  }

  // ── Tooltips no-intrusivos (NO pausan la faja) ─────────────
  showTooltip(triggerId) {
    if (this.triggeredTriggers.has(triggerId)) return;
    this.triggeredTriggers.add(triggerId);

    const tooltip = this.tooltips[triggerId];
    if (!tooltip) return;

    // Dismiss anterior si existe
    this._dismissTooltip();

    const el = document.createElement('div');
    el.className = 'tutorial-tooltip';
    el.style.cssText = `
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 35;
      background: rgba(15, 23, 42, 0.95);
      border: 2px solid ${tooltip.color};
      border-radius: 10px;
      padding: 0.6rem 1rem;
      max-width: 480px;
      width: 90%;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      box-shadow: 0 0 20px ${tooltip.color}40, 0 4px 20px rgba(0,0,0,0.6);
      backdrop-filter: blur(8px);
      animation: tooltip-slide-in 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      cursor: pointer;
      pointer-events: auto;
    `;

    el.innerHTML = `
      <span style="font-size: 1.5rem; flex-shrink: 0; filter: drop-shadow(0 0 6px ${tooltip.color});">${tooltip.icon}</span>
      <div style="flex: 1; min-width: 0;">
        <div style="font-family: var(--font-display); font-size: 0.7rem; color: ${tooltip.color}; letter-spacing: 0.08em; text-shadow: 0 0 5px ${tooltip.color}; margin-bottom: 2px; font-weight: bold;">${tooltip.title}</div>
        <div style="font-family: var(--font-body); font-size: 0.8rem; color: rgba(255,255,255,0.9); line-height: 1.3;">${tooltip.text}</div>
      </div>
      <span style="font-size: 0.65rem; color: var(--text-muted); flex-shrink: 0; opacity: 0.6;">✕</span>
    `;

    if (tooltip.glitch) {
      el.style.animation += ', glitch-border 0.3s ease';
    }

    // Click to dismiss
    el.addEventListener('click', () => this._dismissTooltip());

    const gameArea = document.getElementById('conveyor-area');
    if (gameArea) {
      gameArea.appendChild(el);
    } else {
      document.body.appendChild(el);
    }

    this.activeTooltip = el;

    // Auto-dismiss after duration
    this._tooltipTimer = setTimeout(() => {
      this._dismissTooltip();
    }, tooltip.duration);
  }

  _dismissTooltip() {
    if (this._tooltipTimer) {
      clearTimeout(this._tooltipTimer);
      this._tooltipTimer = null;
    }
    if (this.activeTooltip) {
      this.activeTooltip.style.animation = 'tooltip-slide-out 0.3s ease forwards';
      const el = this.activeTooltip;
      setTimeout(() => el.remove(), 300);
      this.activeTooltip = null;
    }
  }

  // ── Overlay slides (Fase A y E solamente) ──────────────────
  showSlide() {
    const slideId = this.currentSequence[this.currentIndex];
    const slide = this.slides[slideId];
    if (!slide) return;

    if (this.overlayEl) {
      this.overlayEl.style.display = 'flex';
      // Apply neon color dynamically
      this.overlayEl.style.borderColor = slide.color || 'var(--neon-cyan)';
      this.overlayEl.style.boxShadow = `0 0 30px ${slide.color || 'var(--neon-cyan)'}`;
    }

    if (this.phaseTitleEl) {
      this.phaseTitleEl.textContent = slide.phase;
      this.phaseTitleEl.style.color = slide.color;
      this.phaseTitleEl.style.textShadow = `0 0 5px ${slide.color}`;
      
      // Glitch effect handling
      if (slide.glitch) {
        this.phaseTitleEl.classList.add('glitch-blink');
      } else {
        this.phaseTitleEl.classList.remove('glitch-blink');
      }
    }

    if (this.slideCountEl) {
      this.slideCountEl.textContent = `SLIDE ${this.currentIndex + 1}/${this.currentSequence.length}`;
      this.slideCountEl.style.color = slide.color;
      this.slideCountEl.style.textShadow = `0 0 5px ${slide.color}`;
    }

    if (this.imageEl) {
      this.imageEl.src = slide.image;
    }

    if (this.titleEl) {
      this.titleEl.textContent = slide.title;
    }

    if (this.textEl) {
      this.textEl.textContent = slide.text;
    }

    if (this.nextBtn) {
      this.nextBtn.textContent = (this.currentIndex === this.currentSequence.length - 1) ? 'INICIAR / REANUDAR' : 'SIGUIENTE >';
    }
  }

  next() {
    if (this.currentIndex < this.currentSequence.length - 1) {
      this.currentIndex++;
      this.showSlide();
    } else {
      this.close();
    }
  }

  close() {
    if (this.overlayEl) {
      this.overlayEl.style.display = 'none';
    }

    this.engine.state = this.prevState;
    this.engine.conveyor.resume();
    this.engine._startTimer();

    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }
}
