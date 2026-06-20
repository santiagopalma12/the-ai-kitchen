// =========================================================
// THE AI KITCHEN — WorldviewPanel.js (Mejora M7)
// Panel lateral de perspectiva acumulada de la IA, cross-level
// =========================================================

export class WorldviewPanel {
  constructor(engine) {
    this.engine     = engine;
    this.dimensions = [];
    this.values     = {};
    this.panelEl    = document.getElementById('worldview-panel');
  }

  init(level) {
    if (!level.worldview) { this._hidePanel(); return; }

    this.dimensions = level.worldview.dimensions;
    // Partir de worldview acumulado si existe
    const cumulative = this.engine.cumulativeWorldview;
    this.dimensions.forEach((dim, i) => {
      this.values[dim] = cumulative?.[dim] ?? level.worldview.initialValues[i];
    });

    this._render();
    this._showPanel();
  }

  update(block, isCorrect) {
    if (this.dimensions.length === 0) return;

    // Lógica de impacto por tipo de bloque
    const impacts = {
      biased:   { 'Gender Balance': -8, 'Ethnic Diversity': -8 },
      clean:    { 'Gender Balance': +3, 'Ethnic Diversity': +3, 'Age Range': +2, 'Geographic Scope': +2 },
      outdated: { 'Age Range': -5 },
      noise:    { 'Geographic Scope': -4, 'Gender Balance': -4 },
    };

    const impact = impacts[block.ingredient?.type || block.type];
    if (!impact) return;

    for (const [dim, delta] of Object.entries(impact)) {
      if (this.values[dim] !== undefined) {
        this.values[dim] = Math.max(5, Math.min(95, this.values[dim] + delta));
      }
    }

    this._render();
  }

  getCumulative() { return { ...this.values }; }

  _render() {
    const barsEl = this.panelEl?.querySelector('.worldview-bars');
    if (!barsEl) return;

    barsEl.innerHTML = this.dimensions.map(dim => {
      const val   = Math.round(this.values[dim] || 50);
      const color = val >= 70 ? 'var(--neon-green)' : val >= 40 ? 'var(--neon-yellow)' : 'var(--neon-pink)';
      return `
        <div class="worldview-bar-row">
          <span class="worldview-bar-label">${dim.split(' ')[0]}</span>
          <div class="worldview-bar-track">
            <div class="worldview-bar-fill" style="width:${val}%;background:${color}"></div>
          </div>
        </div>`;
    }).join('');
  }

  _showPanel() { if (this.panelEl) this.panelEl.style.display = 'block'; }
  _hidePanel() { if (this.panelEl) this.panelEl.style.display = 'none'; }
}
