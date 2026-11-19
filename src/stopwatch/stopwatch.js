import { Preferences } from '@capacitor/preferences';
const KEY = 'dynamic-island-stopwatch-v1';
const $ = (id) => document.getElementById(id);
const fmt = (ms) => {
  const centis = Math.floor(ms / 10);
  const mins = Math.floor(centis / 6000);
  const secs = Math.floor((centis % 6000) / 100);
  return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0') + '.' + String(centis % 100).padStart(2, '0');
};
export function initStopwatch({ onChange = () => {} } = {}) {
  let elapsed = 0, startedAt = 0, running = false, frame = null, laps = [];
  const value = () => elapsed + (running ? Date.now() - startedAt : 0);
  const render = () => {
    const ms = value();
    $('stopwatch-readout').textContent = fmt(ms);
    $('sw-start').textContent = running ? 'Pausar' : elapsed ? 'Reanudar' : 'Iniciar';
    $('sw-lap').disabled = !running;
    onChange({ running, label: 'Cronómetro ' + fmt(ms) });
  };
  const persist = () => Preferences.set({ key: KEY, value: JSON.stringify({ elapsed: value(), startedAt: running ? Date.now() : 0, running, laps }) });
  const tick = () => { render(); if (running) frame = setTimeout(tick, 50); };
  const refresh = async () => { if (frame) clearTimeout(frame); tick(); };
  (async () => {
    try {
      const saved = await Preferences.get({ key: KEY });
      if (saved.value) {
        const s = JSON.parse(saved.value);
        elapsed = Math.max(0, Number(s.elapsed) || 0);
        running = Boolean(s.running);
        startedAt = running ? (Number(s.startedAt) || Date.now()) : 0;
        if (running) elapsed += Math.max(0, Date.now() - startedAt);
        startedAt = running ? Date.now() : 0;
        laps = Array.isArray(s.laps) ? s.laps.filter(Number.isFinite) : [];
        $('laps').innerHTML = laps.map((lap, i) => '<li><span>Vuelta ' + (laps.length - i) + '</span><b>' + fmt(lap) + '</b></li>').join('');
        await persist();
      }
    } catch {}
    tick();
  })();
  return {
    async toggle() {
      if (running) { elapsed = value(); running = false; startedAt = 0; if (frame) clearTimeout(frame); }
      else { running = true; startedAt = Date.now(); }
      await persist(); tick();
    },
    async lap() {
      if (!running) return;
      laps.unshift(value()); laps = laps.slice(0, 20);
      $('laps').innerHTML = laps.map((lap, i) => '<li><span>Vuelta ' + (laps.length - i) + '</span><b>' + fmt(lap) + '</b></li>').join('');
      await persist();
    },
    async reset() {
      if (frame) clearTimeout(frame);
      elapsed = 0; startedAt = 0; running = false; laps = [];
      $('laps').innerHTML = ''; await persist(); render();
    },
    refresh
  };
}
