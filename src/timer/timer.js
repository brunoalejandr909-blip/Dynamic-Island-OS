import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

const KEY = 'dynamic-island-timer-v1';
const NOTICE_ID = 7101;
const $ = (id) => document.getElementById(id);
const format = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
};

export function initTimer({ onChange = () => {} } = {}) {
  let deadline = 0;
  let remaining = 0;
  let running = false;
  let paused = false;
  let frame = null;

  const emit = () => {
    const ms = running ? Math.max(0, deadline - Date.now()) : remaining;
    $('timer-readout').textContent = format(ms);
    $('timer-status').textContent = running ? 'Temporizador activo' : paused ? 'En pausa' : ms === 0 ? 'Listo para comenzar' : 'Temporizador detenido';
    $('timer-start').textContent = paused ? 'Reanudar' : 'Iniciar';
    $('timer-pause').disabled = !running;
    onChange({ active: running || paused, label: 'Temporizador ' + format(ms) });
  };

  const persist = async () => Preferences.set({ key: KEY, value: JSON.stringify({ deadline, remaining, running, paused }) });
  const cancelNotice = async () => { try { await LocalNotifications.cancel({ notifications: [{ id: NOTICE_ID }] }); } catch {} };
  const scheduleNotice = async (at) => {
    try {
      const permission = await LocalNotifications.checkPermissions();
      if (permission.display !== 'granted') {
        const asked = await LocalNotifications.requestPermissions();
        if (asked.display !== 'granted') return;
      }
      await cancelNotice();
      await LocalNotifications.schedule({ notifications: [{ id: NOTICE_ID, title: 'Temporizador finalizado', body: 'Tu cuenta regresiva ha terminado.', schedule: { at: new Date(at) }, smallIcon: 'ic_launcher' }] });
    } catch (error) {
      $('timer-status').textContent = 'Aviso en segundo plano no disponible: revisa permisos';
    }
  };
  const finish = async () => {
    running = false; paused = false; remaining = 0; deadline = 0;
    await persist(); emit();
    $('timer-status').textContent = '¡Tiempo terminado!';
  };
  const tick = async () => {
    if (!running) return;
    const left = deadline - Date.now();
    if (left <= 0) { await finish(); return; }
    emit();
    frame = setTimeout(tick, Math.min(250, left));
  };

  const refresh = async () => {
    if (frame) clearTimeout(frame);
    if (running && deadline <= Date.now()) await finish();
    else if (running) tick();
    else emit();
  };

  (async () => {
    try {
      const saved = await Preferences.get({ key: KEY });
      if (saved.value) {
        const state = JSON.parse(saved.value);
        deadline = Number(state.deadline) || 0;
        remaining = Number(state.remaining) || 0;
        running = Boolean(state.running) && deadline > Date.now();
        paused = Boolean(state.paused);
        if (running) tick(); else emit();
      } else emit();
    } catch { emit(); }
  })();

  return {
    async start(totalSeconds) {
      if (paused) {
        deadline = Date.now() + remaining; running = true; paused = false;
      } else {
        if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
          $('timer-status').textContent = 'Ingresa una duración mayor que cero'; return;
        }
        remaining = totalSeconds * 1000; deadline = Date.now() + remaining; running = true;
      }
      await persist(); await scheduleNotice(deadline); if (frame) clearTimeout(frame); tick();
    },
    async togglePause() {
      if (!running) return;
      remaining = Math.max(0, deadline - Date.now()); running = false; paused = true;
      if (frame) clearTimeout(frame); await cancelNotice(); await persist(); emit();
    },
    async reset() {
      if (frame) clearTimeout(frame);
      running = false; paused = false; remaining = 0; deadline = 0;
      await cancelNotice(); await persist(); emit();
    },
    refresh
  };
}
