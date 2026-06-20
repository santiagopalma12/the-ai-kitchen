// =========================================================
// THE AI KITCHEN — ProvenanceTracker.js (Mejora M5)
// Registro de trazabilidad de fuentes de datos
// =========================================================

export class ProvenanceTracker {
  constructor(engine) {
    this.engine  = engine;
    this.records = [];
    this.loadFromStorage();
  }

  reset() {
    this.records = [];
    localStorage.removeItem('aik_temp_provenance');
  }

  record(block, action, wasCorrect) {
    this.records.push({
      ingredientId: block.id,
      icon:         block.ingredient?.icon || '📄',
      text:         block.ingredient?.text || block.id,
      source:       block.ingredient?.source || 'Unknown',
      type:         block.ingredient?.type || block.type,
      action,
      wasCorrect,
      timestamp:    Date.now(),
    });
    this.saveToStorage();
  }

  saveToStorage() {
    try {
      localStorage.setItem('aik_temp_provenance', JSON.stringify(this.records));
    } catch (e) {
      console.error('Error saving temp provenance to storage:', e);
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('aik_temp_provenance');
      if (saved) {
        this.records = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading temp provenance from storage:', e);
    }
  }

  renderHTML() {
    if (this.records.length === 0) return '';

    const items = this.records.slice(-8).map(r => `
      <div class="provenance-item">
        <div class="provenance-status ${r.wasCorrect ? 'accepted' : 'rejected'}"></div>
        <span>${r.icon}</span>
        <span style="flex:1;color:var(--text-primary);font-size:0.75rem">${r.text}</span>
        <span style="color:var(--text-muted);font-size:0.65rem">${r.source.substring(0, 25)}</span>
      </div>`).join('');

    return `
      <div class="provenance-section">
        <div class="provenance-title">🔍 Data Provenance — Últimos ${Math.min(this.records.length, 8)} bloques</div>
        ${items}
      </div>`;
  }

  getReport() {
    const byType = {};
    this.records.forEach(r => {
      byType[r.type] = byType[r.type] || { total: 0, correct: 0, sources: new Set() };
      byType[r.type].total++;
      if (r.wasCorrect) byType[r.type].correct++;
      byType[r.type].sources.add(r.source);
    });
    return { records: this.records, byType };
  }
}
