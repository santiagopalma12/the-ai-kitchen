// =========================================================
// THE AI KITCHEN — ConveyorBelt.js
// Motor de la faja transportadora + spawning de data blocks
// =========================================================

import { getIngredientsForLevel, TYPE_ICONS, TYPE_COLORS, CORRECT_ACTION } from '../data/ingredients.js';

export class ConveyorBelt {
  constructor(engine) {
    this.engine = engine;
    this.level = null;
    this.blocks = [];
    this.spawnTimer = null;
    this.animFrame = null;
    this.paused = false;
    this.speed = 1.0;
    this.selectedIdx = 0;
    this.blockCount = 0;
    this.ingredientPool = [];

    this.beltEl = document.getElementById('conveyor-belt');
    this.areaEl = document.getElementById('conveyor-area');
  }

  start(level) {
    this.level = level;
    this.speed = level.belt.speed * (this.engine.settings.speed || 1);
    this.paused = false;
    this.blocks = [];
    this.blockCount = 0;

    // Construir pool de ingredientes pesado por distribución
    this.ingredientPool = this._buildPool(level);

    this._scheduleSpawn();
    this._loop();
  }

  stop() {
    clearTimeout(this.spawnTimer);
    cancelAnimationFrame(this.animFrame);
    if (this.beltEl) this.beltEl.innerHTML = '<div class="belt-texture"></div>';
    this.blocks = [];
  }

  pause() { this.paused = true; clearTimeout(this.spawnTimer); }
  resume() { this.paused = false; this._scheduleSpawn(); this._loop(); }

  // ── Construir pool pesado por distribución ────────────────
  _buildPool(level) {
    const ingredients = getIngredientsForLevel(level.id);
    const dist = level.distribution;
    const pool = [];
    const total = 100;

    for (const [type, prob] of Object.entries(dist)) {
      const count = Math.round(prob * total);
      const available = ingredients.filter(i => i.type === type);
      for (let i = 0; i < count; i++) {
        pool.push(available[i % available.length]);
      }
    }

    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
  }

  _spawnBlock() {
    if (this.paused) return;
    if (this.blockCount >= this.level.belt.totalBlocks) return;
    if (this.blocks.length >= this.level.belt.maxBlocks) {
      this._scheduleSpawn(500);
      return;
    }

    const beltW = this.beltEl ? this.beltEl.offsetWidth : 800;
    const lastBlock = this.blocks[this.blocks.length - 1];
    if (lastBlock && lastBlock.x > (beltW - 370)) {
      this._scheduleSpawn(200); // Re-programar en un intervalo corto
      return;
    }

    let poolIndex = this.blockCount % this.ingredientPool.length;
    let ingredient = this.ingredientPool[poolIndex];

    // Evitar duplicidad simultánea en la faja
    const activeIds = this.blocks.map(b => b.ingredient.id);
    if (activeIds.includes(ingredient.id)) {
      let swapIndex = -1;
      for (let i = 1; i < this.ingredientPool.length; i++) {
        const idx = (poolIndex + i) % this.ingredientPool.length;
        if (!activeIds.includes(this.ingredientPool[idx].id)) {
          swapIndex = idx;
          break;
        }
      }
      if (swapIndex !== -1) {
        const temp = this.ingredientPool[poolIndex];
        this.ingredientPool[poolIndex] = this.ingredientPool[swapIndex];
        this.ingredientPool[swapIndex] = temp;
        ingredient = this.ingredientPool[poolIndex];
      }
    }
    this.blockCount++;

    const el = document.createElement('div');
    el.className = 'data-block';
    el.dataset.type = ingredient.type;
    el.dataset.id = ingredient.id;

    const displayText = ingredient.text_scaffold || ingredient.text;

    // Lógica de asignación de iconos de canal para el renderizado del block-bottom-row
    let channelIcon = '📁 ';
    const srcLower = ingredient.source.toLowerCase();
    if (srcLower.includes('twitter') || srcLower.includes('🐦 x') || srcLower.includes(' x ')) {
      channelIcon = '🐦 ';
    } else if (srcLower.includes('instagram') || srcLower.includes('📸')) {
      channelIcon = '📸 ';
    } else if (srcLower.includes('diario') || srcLower.includes('📰') || srcLower.includes('prensa')) {
      channelIcon = '📰 ';
    } else if (srcLower.includes('mincetur') || srcLower.includes('promperú') || srcLower.includes('promperu') || srcLower.includes('oficial')) {
      channelIcon = '🏛️ ';
    }
    const displaySource = channelIcon + ingredient.source;

    // Generar badges visuales según nivel e ingrediente
    let badgesHTML = '';
    if (this.level.id === 1) {
      // Fix: En Nivel 1, NO mostrar badge de categoría (evita predictibilidad)
      // Solo mostrar año si está presente, para que el jugador analice el contenido
    } else if (this.level.id === 6) {
      if (ingredient.metadata) {
        if (ingredient.metadata.Env) {
          badgesHTML += `<span class="block-badge env-badge">📍 ${ingredient.metadata.Env.replace(/_/g, ' ')}</span>`;
        }
        if (ingredient.metadata.Source) {
          badgesHTML += `<span class="block-badge src-badge">📁 ${ingredient.metadata.Source}</span>`;
        }
      }
    } else {
      if (ingredient.metadata && ingredient.metadata["Categoría"]) {
        badgesHTML += `<span class="block-badge location-badge">${ingredient.metadata["Categoría"]}</span>`;
      }
    }

    const yearMatch = (ingredient.source + ' ' + (ingredient.text || '')).match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1], 10);
      const isOutdated = year < 2024;
      badgesHTML += `<span class="block-badge year-badge ${isOutdated ? 'outdated' : ''}">📅 ${year}</span>`;
    }

    // Fila superior: badges + emoji icon
    const topHTML = `
      <div class="block-top-row">
        <div class="block-badges-container">${badgesHTML}</div>
        <span class="block-top-icon">${ingredient.icon || ''}</span>
      </div>
    `;

    // Fila central: imagen o texto descriptivo completo
    let middleHTML = '';
    if (ingredient.image) {
      middleHTML = `
        <div class="block-middle-row image-type">
          <img class="block-thumbnail" src="${ingredient.image}" alt="thumbnail" />
          <span class="block-text">${displayText}</span>
        </div>
      `;
    } else {
      middleHTML = `
        <div class="block-middle-row text-type">
          <span class="block-text">${displayText}</span>
        </div>
      `;
    }

    // Fila inferior: origen de la fuente
    const bottomHTML = `
      <div class="block-bottom-row">
        <span class="block-source">${displaySource}</span>
      </div>
    `;

    el.innerHTML = `
      ${topHTML}
      ${middleHTML}
      ${bottomHTML}
    `;

    // Posición inicial: fuera del lado derecho
    const startX = beltW + 10;
    el.style.left = startX + 'px';

    // Fix: En Nivel 1, usar color neutro para TODOS los bloques (anti-predictibilidad)
    // El jugador no puede clasificar por color — debe leer el contenido
    if (this.level.id === 1) {
      el.style.setProperty('--block-color', 'rgba(100, 150, 200, 0.5)');
    } else {
      el.style.setProperty('--block-color', TYPE_COLORS[ingredient.type]);
    }

    // Click para seleccionar
    el.addEventListener('click', () => this._selectBlock(block));

    this.beltEl.appendChild(el);

    const block = {
      ingredient,
      type: ingredient.type,
      domElement: el,
      x: startX,
      speed: this.speed,
      id: ingredient.id + '_' + Date.now(),
    };

    // Seleccionar automáticamente el primero
    if (this.blocks.length === 0) this._selectBlock(block);

    this.blocks.push(block);

    if (this.level && this.level.id === 1) {
      // Tooltips no-intrusivos para guiar sin pausar
      if (ingredient.type === 'noise') {
        this.engine.tutorial.showTooltip('phase_c');
      } else if (ingredient.id === 'l1_n8') {
        this.engine.tutorial.showTooltip('phase_d');
      }
    }

    // Notificar a WaveSystem
    this.engine.waves.onBlockSpawned(this.blockCount);

    // Programar siguiente spawn
    this._scheduleSpawn();
  }

  // ── Loop de animación ────────────────────────────────────
  _loop() {
    if (this.paused) return;

    const toRemove = [];

    for (const block of this.blocks) {
      block.x -= block.speed;
      block.domElement.style.left = block.x + 'px';

      // Trigger Phase B tooltip when a clean block reaches the selection area
      if (this.level && this.level.id === 1 && block.ingredient.type === 'clean' && block.x <= 240) {
        this.engine.tutorial.showTooltip('phase_b');
      }

      // ¿Llegó al final sin ser clasificado? → penalizar
      if (block.x < -330) {
        toRemove.push(block);
        this.engine.score.addMissed();
        this.engine.health.onMissed(block.ingredient);
        this.engine.conveyor.engine.contamCounts[block.ingredient.type]++;
        this.engine.conveyor.engine.totalCount++;
        this._showMissedIndicator(block);
      }
    }

    toRemove.forEach(b => this.removeBlock(b));

    this.animFrame = requestAnimationFrame(() => this._loop());
  }

  // ── Acelerar faja ────────────────────────────────────────
  accelerate(delta = 0.15) {
    this.speed = Math.min(this.speed + delta, 6.0);
    this.blocks.forEach(b => { b.speed = this.speed; });
  }

  // ── Selección de bloque ──────────────────────────────────
  _selectBlock(block) {
    // Deseleccionar previo
    this.blocks.forEach(b => b.domElement.classList.remove('selected'));
    block.domElement.classList.add('selected');
    this.selectedBlock = block;

    // Actualizar metadata panel
    const panel = document.getElementById('block-metadata-panel');
    const content = document.getElementById('block-metadata-content');
    if (panel && content) {
      if (block.ingredient) {
        panel.style.display = 'block';

        // Render text section (always present, allows player to read full text if cut off)
        const textHTML = `
          <div style="font-family: var(--font-body); font-size: 1.15rem; color: var(--text-primary); margin-bottom: 0.35rem; padding-bottom: 0.25rem; border-bottom: 1px dashed rgba(255, 255, 255, 0.12); line-height: 1.15; word-break: break-word; white-space: normal; text-align: left; width: 100%;">
            <strong style="color: var(--neon-cyan); font-family: var(--font-display); font-size: 0.5rem; letter-spacing: 0.05em; display: inline-block; margin-right: 0.4rem;">TEXTO COMPLETO:</strong>
            ${block.ingredient.text}
          </div>
        `;

        const meta = block.ingredient.metadata || {};
        // Fix: En Nivel 1, filtrar campos que revelan la respuesta
        const hiddenKeysL1 = ['trust-score', 'clasificación', 'sim-resnet', 'polaridad', 'checksum'];
        const filteredEntries = Object.entries(meta).filter(([key]) => {
          if (this.level && this.level.id === 1) {
            return !hiddenKeysL1.some(hk => key.toLowerCase().includes(hk));
          }
          return true;
        });
        const badgesHTML = filteredEntries.map(([key, value]) => {
          let badgeColor = 'rgba(255, 255, 255, 0.08)';
          let textColor = 'var(--text-primary)';
          let borderColor = 'rgba(255, 255, 255, 0.2)';

          if (key.toLowerCase().includes('resnet')) {
            badgeColor = 'rgba(0, 242, 254, 0.08)';
            textColor = 'var(--neon-cyan)';
            borderColor = 'rgba(0, 242, 254, 0.3)';
          } else if (key.toLowerCase().includes('poison') || key.toLowerCase().includes('checksum') || key.toLowerCase().includes('trigger')) {
            badgeColor = 'rgba(255, 107, 53, 0.08)';
            textColor = 'var(--neon-orange)';
            borderColor = 'rgba(255, 107, 53, 0.3)';
          } else if (key.toLowerCase().includes('env') || key.toLowerCase().includes('noise') || key.toLowerCase().includes('date') || key.toLowerCase().includes('similarity')) {
            badgeColor = 'rgba(255, 45, 120, 0.08)';
            textColor = 'var(--neon-pink)';
            borderColor = 'rgba(255, 45, 120, 0.3)';
          } else if (key.toLowerCase().includes('source') || key.toLowerCase().includes('categor')) {
            badgeColor = 'rgba(255, 230, 0, 0.08)';
            textColor = 'var(--neon-yellow)';
            borderColor = 'rgba(255, 230, 0, 0.3)';
          }

          return `
            <div style="background:${badgeColor}; border:1px solid ${borderColor}; padding:2px 6px; border-radius:4px; font-family:monospace; font-size:0.62rem; display:flex; align-items:center; gap:0.2rem;">
              <strong style="color:${textColor}; text-transform:uppercase;">${key}:</strong>
              <span style="color:var(--text-primary); font-weight:500;">${value}</span>
            </div>
          `;
        }).join('');

        content.innerHTML = `
          <div style="display:flex; flex-direction:column; width:100%;">
            ${textHTML}
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center; width:100%;">
              ${badgesHTML}
            </div>
          </div>
        `;
      } else {
        panel.style.display = 'none';
        content.innerHTML = '';
      }
    }
  }

  selectNext() {
    if (this.blocks.length === 0) return;
    const visibleBlocks = [...this.blocks].sort((a, b) => b.x - a.x);
    const currentIdx = visibleBlocks.findIndex(b => b === this.selectedBlock);
    const nextIdx = (currentIdx + 1) % visibleBlocks.length;
    this._selectBlock(visibleBlocks[nextIdx]);
  }

  getSelectedBlock() { return this.selectedBlock || this.blocks[0] || null; }

  // ── Eliminar bloque ──────────────────────────────────────
  removeBlock(block) {
    const idx = this.blocks.indexOf(block);
    if (idx === -1) return;

    // Animación de salida
    block.domElement.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
    block.domElement.style.transform = 'translateY(-20px) scale(0.8)';
    block.domElement.style.opacity = '0';

    setTimeout(() => block.domElement.remove(), 220);

    this.blocks.splice(idx, 1);

    // Seleccionar siguiente si era el seleccionado
    if (block === this.selectedBlock) {
      const nextSel = this.blocks[0] || null;
      if (nextSel) {
        this._selectBlock(nextSel);
      } else {
        this.selectedBlock = null;
        const panel = document.getElementById('block-metadata-panel');
        if (panel) panel.style.display = 'none';
      }
    }
  }

  // ── Oleada de envenenamiento (M6) ────────────────────────
  spawnWave(waveConfig) {
    let spawnCount = 0;
    const waveInterval = setInterval(() => {
      if (spawnCount >= waveConfig.count || this.paused) {
        clearInterval(waveInterval);
        return;
      }
      this._spawnWaveBlock(waveConfig.type);
      spawnCount++;
    }, 400);
  }

  _spawnWaveBlock(type) {
    const ingredients = this.ingredientPool.filter(i => i.type === type);
    if (ingredients.length === 0) return;

    const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
    const el = document.createElement('div');
    el.className = 'data-block';
    el.dataset.type = ingredient.type;
    el.style.setProperty('--block-color', TYPE_COLORS[ingredient.type]);
    el.style.left = (this.beltEl.offsetWidth + 10) + 'px';
    el.style.borderStyle = 'dashed';

    const displayText = ingredient.text;
    el.innerHTML = `
      <span class="block-icon">☢️</span>
      <span class="block-text">${displayText}</span>
      <span class="block-source">WAVE ATTACK</span>
    `;

    this.beltEl.appendChild(el);

    const block = { ingredient, domElement: el, x: this.beltEl.offsetWidth + 10, speed: this.speed * 1.3, id: 'wave_' + Date.now() };
    el.addEventListener('click', () => this._selectBlock(block));
    this.blocks.push(block);
  }

  _scheduleSpawn(delay) {
    clearTimeout(this.spawnTimer);
    const d = delay ?? this.level.belt.spawnRate;
    this.spawnTimer = setTimeout(() => this._spawnBlock(), d);
  }

  _showMissedIndicator(block) {
    const fb = document.createElement('div');
    fb.className = 'feedback-text missed';
    fb.textContent = '-50 MISSED';
    fb.style.left = '40px';
    fb.style.top = (this.beltEl.offsetTop + 20) + 'px';
    fb.style.zIndex = '40';
    document.body.appendChild(fb);
    fb.addEventListener('animationend', () => fb.remove());
  }
}
