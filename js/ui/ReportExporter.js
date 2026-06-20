// =========================================================
// THE AI KITCHEN — ReportExporter.js (Mejora M9)
// Exporta reporte de AI Literacy Score en HTML/PDF
// =========================================================

export function renderReport(engine) {
  const container = document.getElementById('report-container');
  if (!container) return;

  const progress  = engine.progress;
  const gallery   = engine.gallery;
  const levels    = [1, 2, 3, 4, 5];

  // Calcular AI Literacy Score (0-100)
  const scores = levels.map(id => progress[id]?.accuracy || 0);
  const avgAccuracy = scores.reduce((a, b) => a + b, 0) / levels.length;
  const galleryBonus = Math.min(gallery.length * 5, 20);
  const literacyScore = Math.min(100, Math.round(avgAccuracy * 0.8 + galleryBonus));

  // Competencias del radar chart (simplificado como barras)
  const competencies = [
    { name: 'Dataset Relevance',   score: progress[1]?.accuracy || 0, color: 'var(--neon-cyan)' },
    { name: 'Source Verification', score: progress[2]?.accuracy || 0, color: 'var(--neon-yellow)' },
    { name: 'Bias Detection',      score: progress[3]?.accuracy || 0, color: 'var(--neon-pink)' },
    { name: 'Hallucination Guard', score: progress[4]?.accuracy || 0, color: 'var(--neon-purple)' },
    { name: 'Critical Data QA',    score: progress[5]?.accuracy || 0, color: 'var(--neon-orange)' },
  ];

  const scoreLabel = literacyScore >= 85 ? 'AI Expert 🏆'
    : literacyScore >= 70 ? 'Data-Aware Thinker 🌟'
    : literacyScore >= 50 ? 'Critical Learner 📚'
    : 'Apprentice Chef 🍳';

  const competencyBars = competencies.map(c => `
    <div style="margin-bottom:0.75rem">
      <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
        <span style="font-size:0.8rem;color:var(--text-secondary)">${c.name}</span>
        <span style="font-family:var(--font-display);font-size:0.8rem;color:${c.color}">${c.score}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-bar__fill" style="width:${c.score}%;background:${c.color};box-shadow:0 0 8px ${c.color}"></div>
      </div>
    </div>`).join('');

  const galleryItems = gallery.length > 0
    ? gallery.map(g => `<span title="${g.concept}">${g.emoji}</span>`).join(' ')
    : '<span style="color:var(--text-muted)">Ningún desastre desbloqueado aún</span>';

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:2rem">
      <div class="literacy-score-value">${literacyScore}</div>
      <div class="literacy-score-label">AI Literacy Score</div>
      <div style="font-family:var(--font-display);color:var(--neon-cyan);font-size:0.85rem;margin-top:0.5rem">${scoreLabel}</div>
    </div>

    <div class="card" style="margin-bottom:1.5rem">
      <h3 style="margin-bottom:1rem;font-size:0.9rem;color:var(--text-primary)">📊 Competencias por Área</h3>
      ${competencyBars}
    </div>

    <div class="card" style="margin-bottom:1.5rem">
      <h3 style="margin-bottom:0.75rem;font-size:0.9rem;color:var(--text-primary)">🏆 Disaster Gallery (${gallery.length} desbloqueados)</h3>
      <div style="font-size:1.8rem;letter-spacing:0.2rem">${galleryItems}</div>
    </div>

    <div class="card" style="margin-bottom:2rem">
      <h3 style="margin-bottom:0.75rem;font-size:0.9rem;color:var(--text-primary)">🧠 Qué puedes hacer ahora</h3>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:0.5rem">
        ${literacyScore >= 50 ? '<li style="font-size:0.8rem;color:var(--text-secondary)">✅ Identificar cuándo los datos de una IA pueden estar desactualizados</li>' : ''}
        ${literacyScore >= 60 ? '<li style="font-size:0.8rem;color:var(--text-secondary)">✅ Detectar sesgos de representación en herramientas de IA</li>' : ''}
        ${literacyScore >= 70 ? '<li style="font-size:0.8rem;color:var(--text-secondary)">✅ Entender por qué la IA "alucina" información falsa</li>' : ''}
        ${literacyScore >= 85 ? '<li style="font-size:0.8rem;color:var(--text-secondary)">✅ Evaluar la calidad de datos en sistemas de IA críticos</li>' : ''}
        <li style="font-size:0.8rem;color:var(--text-secondary)">🎯 Eres un consumidor más crítico de contenido generado por IA</li>
      </ul>
    </div>

    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="window.print()">📄 Exportar PDF</button>
      <button class="btn btn-ghost" id="btn-share-score">🔗 Compartir Score</button>
    </div>
  `;

  document.getElementById('btn-share-score')?.addEventListener('click', () => {
    const text = `Obtuve ${literacyScore}/100 en AI Literacy Score en The AI Kitchen! 🤖🍳 #AIKitchen #IEEEChallenge`;
    if (navigator.share) {
      navigator.share({ title: 'The AI Kitchen', text });
    } else {
      navigator.clipboard.writeText(text).then(() => alert('¡Score copiado al portapapeles!'));
    }
  });
}
