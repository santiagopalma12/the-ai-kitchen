// =========================================================
// THE AI KITCHEN — DataDetective.js
// Modo inverso: el jugador diagnostica un desastre ya ocurrido
// =========================================================

export class DataDetective {
  constructor(engine) {
    this.engine   = engine;
    this.cases    = this._buildCases();
    this.current  = null;
    this.solved   = JSON.parse(localStorage.getItem('aik_detective') || '[]');
  }

  _buildCases() {
    return [
      {
        id: 'case_01',
        title: 'Caso #01: El Médico Medieval',
        disasterEmoji: '⚔️',
        disasterOutput: '"Para la infección: aplicar sanguijuelas y equilibrar los humores. Evitar antibióticos (invención de la industria). Fuente: Tratado Médico 1850."',
        pipeline: [
          { id: 'p1', icon: '📄', text: 'Peer-reviewed paper 2024', source: 'Lancet 2024', type: 'clean',    isContaminated: false },
          { id: 'p2', icon: '⏳', text: 'Tratado médico 1850',      source: 'Archive 1850', type: 'outdated', isContaminated: true },
          { id: 'p3', icon: '📊', text: 'WHO Report 2025',          source: 'WHO 2025',    type: 'clean',    isContaminated: false },
          { id: 'p4', icon: '💀', text: 'Antibióticos = Veneno',    source: 'NaturalCures.net', type: 'noise', isContaminated: true },
          { id: 'p5', icon: '🔬', text: 'Clinical trial 2024',      source: 'NEJM 2024',   type: 'clean',    isContaminated: false },
          { id: 'p6', icon: '⏳', text: 'Surgery manual 1920',      source: 'Archive 1920', type: 'outdated', isContaminated: true },
        ],
        answer: ['p2', 'p4', 'p6'],
        conceptExplained: 'Datos obsoletos (1850, 1920) mezclados con desinformación activa produjeron una IA médica del siglo pasado.',
        concept: 'Temporal Relevance + Noise',
      },
      {
        id: 'case_02',
        title: 'Caso #02: El CEO de Tres Brazos',
        disasterEmoji: '👔',
        disasterOutput: 'Imagen generada: CEO blanco, 55 años, traje gris, tres brazos. "Social Media Outrage Meter: 🔴 VIRAL"',
        pipeline: [
          { id: 'p1', icon: '👩‍💼', text: 'Female CEO portrait',    source: 'Fortune500 2025', type: 'clean',  isContaminated: false },
          { id: 'p2', icon: '📊', text: 'M/F CEO ratio 9:1',        source: 'Corp Archive 1985', type: 'biased', isContaminated: true },
          { id: 'p3', icon: '👨‍💼', text: 'Diverse CEO dataset',    source: 'McKinsey 2025', type: 'clean',    isContaminated: false },
          { id: 'p4', icon: '⚠️', text: 'US-only executives',        source: 'AmericanCorp 1980', type: 'biased', isContaminated: true },
          { id: 'p5', icon: '👩🏿‍💼', text: 'CEO of color photo',  source: 'Linkedin DB 2024', type: 'clean',  isContaminated: false },
          { id: 'p6', icon: '⚠️', text: 'White male stock only',    source: 'StockDB 1990', type: 'biased',    isContaminated: true },
        ],
        answer: ['p2', 'p4', 'p6'],
        conceptExplained: 'Tres fuentes con sesgo de representación severo — casi 0% diversidad — entrenaron a la IA con un patrón distorsionado.',
        concept: 'Representation Bias',
      },
      {
        id: 'case_03',
        title: 'Caso #03: Hotel Rubble',
        disasterEmoji: '🏚️',
        disasterOutput: '"Les recomendamos el Hotel Gran Lima (1962). Precio por noche: 3 Soles. Reserve por carta postal con 2 meses de anticipación."',
        pipeline: [
          { id: 'p1', icon: '📰', text: 'Lima guide 2025',    source: 'PromPeru 2025',    type: 'clean',    isContaminated: false },
          { id: 'p2', icon: '📚', text: 'Lima hotels 1962',   source: 'Travel Digest 1962', type: 'outdated', isContaminated: true },
          { id: 'p3', icon: '🗺️', text: 'Cusco map 2026',    source: 'Google Maps 2026', type: 'clean',    isContaminated: false },
          { id: 'p4', icon: '📚', text: 'Peru guide 1975',    source: 'PanAm 1975',       type: 'outdated', isContaminated: true },
          { id: 'p5', icon: '✈️', text: 'Flight data 2026',  source: 'IATA 2026',        type: 'clean',    isContaminated: false },
          { id: 'p6', icon: '📜', text: 'Prices 1985',        source: 'TravelDigest 1985',type: 'outdated', isContaminated: true },
        ],
        answer: ['p2', 'p4', 'p6'],
        conceptExplained: 'Tres guías de viaje de entre 1962 y 1985. Los hoteles recomendados llevan décadas demolidos. Relevancia temporal ignorada.',
        concept: 'Temporal Relevance',
      },
    ];
  }

  renderScreen() {
    const container = document.getElementById('detective-container');
    if (!container) return;

    const available = this.cases.filter(c => !this.solved.includes(c.id));
    if (available.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem">
          <div style="font-size:4rem;margin-bottom:1rem">🕵️</div>
          <h3>¡Todos los casos resueltos!</h3>
          <p>Eres un verdadero Data Detective. 🏆</p>
        </div>`;
      return;
    }

    const c = available[0];
    this.current = c;

    container.innerHTML = `
      <div style="max-width:700px;width:100%;margin:0 auto">
        <div style="text-align:center;margin-bottom:1.5rem">
          <span style="font-size:3rem">${c.disasterEmoji}</span>
          <h2 style="font-family:var(--font-display);margin:0.5rem 0">${c.title}</h2>
          <p style="color:var(--text-muted);font-size:0.8rem">Encuentra los bloques de datos que causaron este desastre</p>
        </div>

        <div class="card" style="margin-bottom:1.5rem;border-color:var(--neon-pink)">
          <div style="font-family:var(--font-display);font-size:0.6rem;color:var(--neon-pink);letter-spacing:0.12em;margin-bottom:0.5rem">🔴 OUTPUT DEL DESASTRE</div>
          <div style="font-size:0.85rem;color:var(--text-secondary);font-style:italic">${c.disasterOutput}</div>
        </div>

        <h4 style="font-family:var(--font-display);font-size:0.7rem;color:var(--text-muted);letter-spacing:0.1em;margin-bottom:0.75rem">📋 PIPELINE DE DATOS — Selecciona los bloques contaminados:</h4>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-bottom:1.5rem" id="detective-pipeline">
          ${c.pipeline.map(p => `
            <div class="card detective-block" data-id="${p.id}" style="cursor:pointer;text-align:center;transition:all 0.2s"
              onclick="this.classList.toggle('selected');this.style.borderColor=this.classList.contains('selected')?'var(--neon-pink)':'var(--border-subtle)'">
              <div style="font-size:1.5rem">${p.icon}</div>
              <div style="font-size:0.7rem;font-weight:600;color:var(--text-primary);margin:0.25rem 0">${p.text}</div>
              <div style="font-size:0.6rem;color:var(--text-muted)">${p.source}</div>
            </div>`).join('')}
        </div>

        <div style="display:flex;gap:1rem;justify-content:center">
          <button class="btn btn-primary" onclick="window.AIKitchen.detective.checkAnswer()">🔍 Verificar Diagnóstico</button>
          <button class="btn btn-ghost" onclick="window.AIKitchen.detective.skipCase()">⏭ Siguiente Caso</button>
        </div>

        <div id="detective-feedback" style="display:none;margin-top:1.5rem"></div>
      </div>`;

    // Exponer referencia global para los onclick inline
    window.AIKitchen.detective = this;
  }

  checkAnswer() {
    if (!this.current) return;
    const selected = [...document.querySelectorAll('.detective-block.selected')].map(el => el.dataset.id);
    const correct  = this.current.answer;

    const isCorrect = correct.length === selected.length
      && correct.every(id => selected.includes(id));

    const fb = document.getElementById('detective-feedback');
    if (!fb) return;
    fb.style.display = 'block';

    if (isCorrect) {
      fb.innerHTML = `
        <div class="card" style="border-color:var(--neon-green);text-align:center">
          <div style="font-size:2rem;margin-bottom:0.5rem">🎯</div>
          <h3 style="color:var(--neon-green);font-family:var(--font-display)">¡Diagnóstico Correcto!</h3>
          <p style="font-size:0.85rem;color:var(--text-secondary);margin:0.5rem 0">${this.current.conceptExplained}</p>
          <span class="concept-tag">${this.current.concept}</span>
          <br><br>
          <button class="btn btn-success" onclick="window.AIKitchen.detective.solveCase()">✅ Caso Cerrado →</button>
        </div>`;
    } else {
      // Mostrar cuántos acertó
      const correctGuesses = selected.filter(id => correct.includes(id)).length;
      fb.innerHTML = `
        <div class="card" style="border-color:var(--neon-yellow);text-align:center">
          <div style="font-size:2rem;margin-bottom:0.5rem">🤔</div>
          <h3 style="color:var(--neon-yellow);font-family:var(--font-display)">No exactamente…</h3>
          <p style="font-size:0.85rem;color:var(--text-secondary)">${correctGuesses} de ${correct.length} fuentes contaminadas identificadas. ¡Revisa el pipeline!</p>
        </div>`;
    }
  }

  solveCase() {
    if (!this.current) return;
    this.solved.push(this.current.id);
    localStorage.setItem('aik_detective', JSON.stringify(this.solved));
    this.engine.score.total += 500; // bonus de detective
    this.renderScreen();
  }

  skipCase() {
    const available = this.cases.filter(c => !this.solved.includes(c.id));
    if (available.length <= 1) return;
    const idx = available.findIndex(c => c.id === this.current?.id);
    this.current = available[(idx + 1) % available.length];
    this.renderScreen();
  }
}
