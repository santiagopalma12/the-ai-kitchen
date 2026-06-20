// =========================================================
// THE AI KITCHEN — SpeedrunMode.js (Mejora M10)
// Timer competitivo + leaderboard local en localStorage
// =========================================================

export class SpeedrunMode {
  constructor(engine) {
    this.engine    = engine;
    this.active    = false;
    this.startTime = null;
    this.elapsed   = 0;
    this.timerEl   = null;
    this.leaderboard = JSON.parse(localStorage.getItem('aik_speedrun_lb') || '{}');
  }

  start(levelId) {
    this.active    = true;
    this.startTime = Date.now();
    this.elapsed   = 0;
    this.currentLevel = levelId;

    // Indicador visual en el HUD
    const hud = document.getElementById('hud');
    if (hud) {
      let sr = document.getElementById('speedrun-badge');
      if (!sr) {
        sr = document.createElement('div');
        sr.id = 'speedrun-badge';
        sr.style.cssText = `
          display:flex;align-items:center;gap:0.4rem;
          background:var(--neon-yellow-dim);border:1px solid var(--neon-yellow);
          border-radius:var(--radius-full);padding:0.25rem 0.75rem;
          font-family:var(--font-display);font-size:0.7rem;color:var(--neon-yellow);
          animation:pulse-neon 1s ease infinite;
        `;
        hud.querySelector('.hud-section.center')?.prepend(sr);
      }
      sr.innerHTML = '⚡ SPEEDRUN';
    }

    this._tick();
  }

  _tick() {
    if (!this.active) return;
    this.elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const badge = document.getElementById('speedrun-badge');
    if (badge) {
      const m = Math.floor(this.elapsed / 60).toString().padStart(2,'0');
      const s = (this.elapsed % 60).toString().padStart(2,'0');
      badge.textContent = `⚡ ${m}:${s}`;
    }
    requestAnimationFrame(() => this._tick());
  }

  stop(accuracy) {
    if (!this.active) return;
    this.active = false;

    const record = {
      time:     this.elapsed,
      accuracy,
      score:    this.engine.score.total,
      date:     new Date().toISOString().split('T')[0],
      player:   localStorage.getItem('aik_player_name') || 'Anon',
    };

    // Guardar en leaderboard
    const levelKey = `level_${this.currentLevel}`;
    if (!this.leaderboard[levelKey]) this.leaderboard[levelKey] = [];
    this.leaderboard[levelKey].push(record);
    this.leaderboard[levelKey].sort((a, b) => {
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return a.time - b.time; // mismo accuracy → menor tiempo primero
    });
    this.leaderboard[levelKey] = this.leaderboard[levelKey].slice(0, 10); // top 10

    localStorage.setItem('aik_speedrun_lb', JSON.stringify(this.leaderboard));

    // Limpiar badge
    document.getElementById('speedrun-badge')?.remove();

    return record;
  }

  renderLeaderboard(levelId) {
    const levelKey = `level_${levelId}`;
    const entries  = this.leaderboard[levelKey] || [];

    if (entries.length === 0) {
      return `<div style="color:var(--text-muted);text-align:center;padding:1rem">
        Aún no hay records en este nivel. ¡Sé el primero! ⚡
      </div>`;
    }

    const rows = entries.map((e, i) => {
      const medal = ['🥇','🥈','🥉'][i] || `#${i+1}`;
      const m = Math.floor(e.time/60).toString().padStart(2,'0');
      const s = (e.time%60).toString().padStart(2,'0');
      return `
        <div style="display:flex;align-items:center;gap:1rem;padding:0.6rem;
          border-bottom:1px solid var(--border-subtle);font-size:0.8rem;
          ${i===0?'background:rgba(255,230,0,0.06);border-radius:var(--radius-sm)':''}">
          <span style="font-size:${i<3?'1.2rem':'0.9rem'};min-width:28px">${medal}</span>
          <span style="flex:1;color:var(--text-primary);font-weight:600">${e.player}</span>
          <span style="color:var(--neon-cyan);font-family:var(--font-display)">${e.accuracy}%</span>
          <span style="color:var(--neon-yellow);font-family:var(--font-display)">${m}:${s}</span>
          <span style="color:var(--text-muted);font-size:0.65rem">${e.date}</span>
        </div>`;
    }).join('');

    return `
      <div style="border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden">
        <div style="background:var(--bg-surface);padding:0.6rem 1rem;
          font-family:var(--font-display);font-size:0.6rem;color:var(--text-muted);
          letter-spacing:0.12em;display:flex;gap:1rem">
          <span style="min-width:28px">POS</span>
          <span style="flex:1">JUGADOR</span>
          <span>PRECISIÓN</span>
          <span>TIEMPO</span>
          <span>FECHA</span>
        </div>
        ${rows}
      </div>`;
  }

  setPlayerName(name) {
    localStorage.setItem('aik_player_name', name);
  }
}
