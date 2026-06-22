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

  // Agregar métricas agregadas de la faja para la "Data Nutrition Label"
  let totalClean = 0;
  let totalNoise = 0;
  let totalSpurious = 0;
  let totalPoison = 0;
  let totalAccepted = 0;

  levels.forEach(id => {
    const lvlCounts = progress[id]?.acceptedCounts;
    if (lvlCounts) {
      totalClean += lvlCounts.clean || 0;
      totalNoise += lvlCounts.noise || 0;
      totalSpurious += lvlCounts.spurious || 0;
      totalPoison += lvlCounts.poison || 0;
      totalAccepted += lvlCounts.total || 0;
    }
  });

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

  // Renderizar la etiqueta de nutrición estilo FDA
  const nutritionLabelHtml = totalAccepted > 0 ? `
    <div class="nutrition-label" style="
      background: #ffffff;
      color: #000000;
      border: 4px solid #000000;
      padding: 1.25rem;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      max-width: 320px;
      margin: 1rem auto 2rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      text-align: left;
    ">
      <div style="font-size: 2.2rem; font-weight: 900; line-height: 0.95; border-bottom: 8px solid #000000; padding-bottom: 4px; font-family: 'Arial Black', sans-serif; letter-spacing: -1px;">Data Nutrition</div>
      <div style="font-size: 0.75rem; margin: 4px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Trained Dataset Profile (AI Kitchen)</div>
      <div style="border-bottom: 4px solid #000000; font-size: 0.75rem; padding-bottom: 4px; display: flex; justify-content: space-between;">
        <span><strong>Volume Size</strong></span>
        <span><strong>${totalAccepted} Blocks</strong></span>
      </div>
      
      <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 900; padding: 6px 0; border-bottom: 6px solid #000000;">
        <span>Curation Quality</span>
        <span>${literacyScore}/100</span>
      </div>
      
      <div style="font-size: 0.65rem; font-weight: bold; padding: 4px 0; border-bottom: 1px solid #888888; text-align: right;">% Daily Value *</div>
      
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 6px 0; border-bottom: 1px solid #cccccc;">
        <span><strong>Clean Information</strong> (Nutrients)</span>
        <span><strong>${Math.round((totalClean / totalAccepted) * 100)}%</strong></span>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding: 4px 0; border-bottom: 1px solid #cccccc; padding-left: 12px; color: #555555;">
        <span>Relevance Accuracy</span>
        <span>${Math.round(((totalClean) / (totalAccepted - totalSpurious - totalPoison)) * 100 || 0)}%</span>
      </div>
      
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 6px 0; border-bottom: 1px solid #cccccc;">
        <span><strong>Redundant Noise</strong> (Saturated)</span>
        <span><strong>${Math.round((totalNoise / totalAccepted) * 100)}%</strong></span>
      </div>
      
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 6px 0; border-bottom: 1px solid #cccccc;">
        <span><strong>Spurious Bias</strong> (Trans-Data)</span>
        <span><strong>${Math.round((totalSpurious / totalAccepted) * 100)}%</strong></span>
      </div>
      
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 6px 0; border-bottom: 4px solid #000000;">
        <span><strong>Toxic Poisoning</strong> (Sodium)</span>
        <span style="color: ${totalPoison > 0 ? '#d9534f' : '#000000'}; font-weight: bold;">
          ${Math.round((totalPoison / totalAccepted) * 100)}%
        </span>
      </div>
      
      <div style="font-size: 0.6rem; line-height: 1.25; padding-top: 6px; color: #555555; font-style: italic;">
        * Percent Daily Values are based on standard AI curation guidelines. High levels of Noise, Bias, or Poison will corrupt downstream models (GIGO).
      </div>
    </div>
  ` : `
    <div class="card" style="text-align: center; margin: 1.5rem 0; padding: 1.5rem; border: 2px dashed var(--border-subtle)">
      <span style="font-size: 2rem;">🍳</span>
      <h4 style="margin-top: 0.5rem; color: var(--text-muted)">Data Nutrition Label Pending</h4>
      <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Completa al menos un nivel para generar la etiqueta de nutrición de tus datos.</p>
    </div>
  `;

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:2rem">
      <div class="literacy-score-value">${literacyScore}</div>
      <div class="literacy-score-label">AI Literacy Score</div>
      <div style="font-family:var(--font-display);color:var(--neon-cyan);font-size:0.85rem;margin-top:0.5rem">${scoreLabel}</div>
    </div>

    ${nutritionLabelHtml}

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
