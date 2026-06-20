// =========================================================
// THE AI KITCHEN — ClassroomMode.js (Mejora M8)
// Panel de maestro con dashboard de clase y Class Challenge
// 100% local — sin backend, sincronización via URL params
// =========================================================

export class ClassroomMode {
  constructor(engine) {
    this.engine    = engine;
    this.isTeacher = false;
    this.classPin  = null;
    this.students  = JSON.parse(localStorage.getItem('aik_class_students') || '[]');
  }

  // ── Render del panel de maestro ───────────────────────────
  renderTeacherPanel(container) {
    if (!container) return;

    // Leer datos de todos los estudiantes registrados
    const stats = this._aggregateStats();

    container.innerHTML = `
      <div style="max-width:800px;width:100%;margin:0 auto">
        <div style="text-align:center;margin-bottom:2rem">
          <h2 style="font-family:var(--font-display)">🏫 Classroom Dashboard</h2>
          <p style="color:var(--text-muted)">Panel exclusivo para el maestro/facilitador</p>
        </div>

        <!-- Stats globales de la clase -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem">
          ${[
            { label: 'Estudiantes', value: stats.total, color: 'var(--neon-cyan)' },
            { label: 'Niveles completados', value: stats.totalLevels, color: 'var(--neon-green)' },
            { label: 'Precisión promedio', value: stats.avgAccuracy + '%', color: 'var(--neon-yellow)' },
            { label: 'Error más común', value: stats.topError, color: 'var(--neon-pink)' },
          ].map(s => `
            <div class="card" style="text-align:center;border-color:${s.color}">
              <div style="font-family:var(--font-display);font-size:1.4rem;font-weight:900;color:${s.color}">${s.value}</div>
              <div style="font-size:0.65rem;color:var(--text-muted);letter-spacing:0.08em;text-transform:uppercase;margin-top:0.25rem">${s.label}</div>
            </div>`).join('')}
        </div>

        <!-- Tabla de estudiantes -->
        <div class="card" style="margin-bottom:1.5rem">
          <h4 style="font-family:var(--font-display);font-size:0.75rem;color:var(--text-secondary);margin-bottom:1rem">
            👥 Progreso Individual
          </h4>
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse;font-size:0.8rem">
              <thead>
                <tr style="border-bottom:1px solid var(--border-subtle)">
                  ${['Estudiante','Nv.1','Nv.2','Nv.3','Nv.4','Nv.5','Score Total'].map(h =>
                    `<th style="padding:0.5rem;text-align:left;color:var(--text-muted);font-family:var(--font-display);font-size:0.6rem;letter-spacing:0.08em">${h}</th>`
                  ).join('')}
                </tr>
              </thead>
              <tbody id="students-tbody">
                ${this._renderStudentRows()}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Configuración de niveles disponibles -->
        <div class="card" style="margin-bottom:1.5rem">
          <h4 style="font-family:var(--font-display);font-size:0.75rem;color:var(--text-secondary);margin-bottom:1rem">
            ⚙️ Niveles Disponibles para la Clase
          </h4>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
            ${[1,2,3,4,5].map(n => `
              <label style="display:flex;align-items:center;gap:0.4rem;cursor:pointer;font-size:0.8rem">
                <input type="checkbox" checked
                  style="accent-color:var(--neon-cyan)"
                  onchange="window.AIKitchen.classroom.toggleLevel(${n}, this.checked)"
                  ${this._isLevelEnabled(n) ? '' : 'unchecked'}
                > Nivel ${n}
              </label>`).join('')}
          </div>
        </div>

        <!-- Class Challenge -->
        <div class="card" style="border-color:var(--neon-purple);margin-bottom:1.5rem">
          <h4 style="font-family:var(--font-display);font-size:0.75rem;color:var(--neon-purple);margin-bottom:0.75rem">
            ⚡ Class Challenge
          </h4>
          <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:1rem">
            Todos los estudiantes juegan el mismo nivel simultáneamente. Al terminar, comparan resultados.
          </p>
          <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap">
            <select id="challenge-level-select" style="
              background:var(--bg-surface);border:1px solid var(--border-subtle);
              color:var(--text-primary);border-radius:var(--radius-sm);
              padding:0.4rem 0.6rem;font-family:var(--font-body)">
              ${[1,2,3,4,5].map(n => `<option value="${n}">Nivel ${n}</option>`).join('')}
            </select>
            <button class="btn btn-primary btn-sm" onclick="window.AIKitchen.classroom.launchChallenge()">
              🚀 Lanzar Challenge
            </button>
            <button class="btn btn-ghost btn-sm" onclick="window.AIKitchen.classroom.showChallengeResults()">
              📊 Ver Resultados
            </button>
          </div>
        </div>

        <!-- Acciones -->
        <div style="display:flex;gap:1rem;flex-wrap:wrap">
          <button class="btn btn-ghost" onclick="window.AIKitchen.classroom.exportCSV()">📥 Exportar CSV</button>
          <button class="btn btn-ghost" onclick="window.AIKitchen.classroom.resetClass()">🗑️ Resetear Clase</button>
        </div>
      </div>`;

    window.AIKitchen.classroom = this;
  }

  // ── Registro de estudiante ────────────────────────────────
  registerStudent(name) {
    if (!name || this.students.find(s => s.name === name)) return;
    const student = {
      name,
      id: Date.now().toString(),
      progress: {},
      joinedAt: new Date().toISOString(),
    };
    this.students.push(student);
    localStorage.setItem('aik_class_students', JSON.stringify(this.students));
  }

  syncStudentProgress(studentName) {
    const student = this.students.find(s => s.name === studentName);
    if (!student) return;
    student.progress = { ...this.engine.progress };
    localStorage.setItem('aik_class_students', JSON.stringify(this.students));
  }

  launchChallenge() {
    const levelId = parseInt(document.getElementById('challenge-level-select')?.value || '1');
    const challengeData = {
      levelId,
      startedAt: Date.now(),
      active: true,
    };
    localStorage.setItem('aik_class_challenge', JSON.stringify(challengeData));

    // Notificar y lanzar
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed;top:2rem;left:50%;transform:translateX(-50%);
      background:var(--neon-purple-dim);border:2px solid var(--neon-purple);
      border-radius:var(--radius-full);padding:0.75rem 2rem;
      font-family:var(--font-display);font-size:0.85rem;color:var(--neon-purple);
      z-index:9999;animation:fade-in 0.3s ease;
    `;
    toast.textContent = `⚡ Class Challenge lanzado — Nivel ${levelId}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  toggleLevel(levelId, enabled) {
    const config = JSON.parse(localStorage.getItem('aik_class_config') || '{}');
    config[`level_${levelId}_enabled`] = enabled;
    localStorage.setItem('aik_class_config', JSON.stringify(config));
  }

  _isLevelEnabled(levelId) {
    const config = JSON.parse(localStorage.getItem('aik_class_config') || '{}');
    return config[`level_${levelId}_enabled`] !== false;
  }

  exportCSV() {
    const headers = ['Estudiante','Nivel 1 (%)','Nivel 2 (%)','Nivel 3 (%)','Nivel 4 (%)','Nivel 5 (%)'];
    const rows = this.students.map(s =>
      [s.name, ...[1,2,3,4,5].map(n => s.progress[n]?.accuracy ?? 'N/A')].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'aik_class_report.csv';
    a.click(); URL.revokeObjectURL(url);
  }

  resetClass() {
    if (!confirm('¿Resetear todos los datos de la clase?')) return;
    this.students = [];
    localStorage.removeItem('aik_class_students');
    localStorage.removeItem('aik_class_challenge');
    this.renderTeacherPanel(document.getElementById('classroom-container'));
  }

  showChallengeResults() {
    const results = this.students
      .map(s => ({ name: s.name, score: Object.values(s.progress).reduce((a, p) => a + (p.score || 0), 0) }))
      .sort((a, b) => b.score - a.score);

    const podium = results.slice(0, 3).map((r, i) =>
      `<div style="text-align:center">
        <div style="font-size:${i===0?'2rem':'1.5rem'}">${['🥇','🥈','🥉'][i]}</div>
        <div style="font-family:var(--font-display);font-size:0.75rem;color:var(--text-primary)">${r.name}</div>
        <div style="font-size:0.65rem;color:var(--neon-cyan)">${r.score.toLocaleString()} pts</div>
      </div>`).join('');

    alert('Resultados del Challenge:\n' + results.map((r, i) => `${i+1}. ${r.name}: ${r.score} pts`).join('\n'));
  }

  _aggregateStats() {
    if (this.students.length === 0) {
      return { total: 0, totalLevels: 0, avgAccuracy: 0, topError: 'N/A' };
    }
    let totalLevels = 0, totalAccuracy = 0, count = 0;
    const errorCounts = { outdated: 0, biased: 0, noise: 0, clean: 0, ambiguous: 0 };

    this.students.forEach(s => {
      Object.values(s.progress).forEach(p => {
        totalLevels++;
        totalAccuracy += p.accuracy || 0;
        count++;
      });
    });

    const errorLabels = { outdated: 'Datos obsoletos', biased: 'Sesgo', noise: 'Desinformación', clean: 'Relevancia' };
    const topErrorKey = Object.entries(errorCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || 'noise';

    return {
      total: this.students.length,
      totalLevels,
      avgAccuracy: count > 0 ? Math.round(totalAccuracy / count) : 0,
      topError: errorLabels[topErrorKey] || 'N/A',
    };
  }

  _renderStudentRows() {
    if (this.students.length === 0) {
      return '<tr><td colspan="7" style="color:var(--text-muted);padding:1rem;text-align:center">Ningún estudiante registrado aún</td></tr>';
    }
    return this.students.map(s => {
      const levels = [1,2,3,4,5].map(n => {
        const p = s.progress[n];
        if (!p) return '<td style="padding:0.5rem;color:var(--text-muted)">—</td>';
        const color = p.accuracy >= 80 ? 'var(--neon-green)' : p.accuracy >= 50 ? 'var(--neon-yellow)' : 'var(--neon-pink)';
        return `<td style="padding:0.5rem;color:${color};font-weight:600">${p.accuracy}%</td>`;
      }).join('');
      const totalScore = Object.values(s.progress).reduce((a, p) => a + (p.score || 0), 0);
      return `<tr style="border-bottom:1px solid var(--border-subtle)">
        <td style="padding:0.5rem;color:var(--text-primary)">${s.name}</td>
        ${levels}
        <td style="padding:0.5rem;color:var(--neon-cyan);font-family:var(--font-display)">${totalScore.toLocaleString()}</td>
      </tr>`;
    }).join('');
  }
}
