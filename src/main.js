import './styles/main.css';
import { initIsland } from './island/island.js';
import { initTimer } from './timer/timer.js';
import { initStopwatch } from './stopwatch/stopwatch.js';

const $ = (id) => document.getElementById(id);
function updateClock() {
  const now = new Date();
  $('clock').textContent = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  $('date').textContent = now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
}
updateClock();
setInterval(updateClock, 1000);

const island = initIsland();
const timer = initTimer({ onChange: (state) => island.setActivity(state.active ? { kind: 'timer', label: state.label } : null) });
const stopwatch = initStopwatch({ onChange: (state) => island.setActivity(state.running ? { kind: 'stopwatch', label: state.label } : null) });

$('timer-start').addEventListener('click', async () => {
  const minutes = Math.max(0, Math.min(599, Number($('timer-min').value) || 0));
  const seconds = Math.max(0, Math.min(59, Number($('timer-sec').value) || 0));
  await timer.start(minutes * 60 + seconds);
});
$('timer-pause').addEventListener('click', () => timer.togglePause());
$('timer-reset').addEventListener('click', () => timer.reset());
$('sw-start').addEventListener('click', () => stopwatch.toggle());
$('sw-lap').addEventListener('click', () => stopwatch.lap());
$('sw-reset').addEventListener('click', () => stopwatch.reset());

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { timer.refresh(); stopwatch.refresh(); }
});
window.addEventListener('pageshow', () => { timer.refresh(); stopwatch.refresh(); });
