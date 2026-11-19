import './style.css';
import { Preferences } from '@capacitor/preferences';

const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, '0');
const format = (ms) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
};

function updateClock() {
  const now = new Date();
  $('clock').textContent = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  $('date').textContent = now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
}
updateClock();
setInterval(updateClock, 1000);

$('themeButton').addEventListener('click', () => {
  document.body.classList.toggle('light');
  $('themeButton').textContent = document.body.classList.contains('light') ? '☾' : '☼';
});
$('island').addEventListener('click', () => {
  const open = $('island').getAttribute('aria-expanded') !== 'true';
  $('island').setAttribute('aria-expanded', String(open));
  $('islandDetail').classList.toggle('hidden', !open);
});

let timerEnd = 0, timerRemaining = 300000, timerRunning = false;
let timerInterval;
async function saveTimer() {
  await Preferences.set({ key: 'timerState', value: JSON.stringify({ timerEnd, timerRemaining, timerRunning }) });
}
function renderTimer() {
  const remaining = timerRunning ? Math.max(0, timerEnd - Date.now()) : timerRemaining;
  $('timerDisplay').textContent = format(remaining);
  if (timerRunning && remaining <= 0) {
    timerRunning = false; timerRemaining = 0; clearInterval(timerInterval);
    $('timerStart').textContent = 'Iniciar';
    $('islandLabel').textContent = 'Temporizador finalizado';
    $('islandDetailText').textContent = 'Tu temporizador llegó a cero.';
    if ('Notification' in window && Notification.permission === 'granted') new Notification('Temporizador finalizado');
    saveTimer();
  }
}
async function restoreTimer() {
  const { value } = await Preferences.get({ key: 'timerState' });
  if (!value) return;
  try {
    const state = JSON.parse(value);
    timerEnd = state.timerEnd || 0; timerRemaining = state.timerRemaining ?? 300000;
    timerRunning = Boolean(state.timerRunning && timerEnd > Date.now());
    if (state.timerRunning && timerEnd <= Date.now()) { timerRemaining = 0; timerRunning = false; }
    if (timerRunning) { $('timerStart').textContent = 'Pausar'; timerInterval = setInterval(renderTimer, 200); }
    renderTimer();
  } catch { /* ignore invalid saved state */ }
}
$('timerStart').addEventListener('click', async () => {
  if (timerRunning) {
    timerRemaining = Math.max(0, timerEnd - Date.now()); timerRunning = false;
    clearInterval(timerInterval); $('timerStart').textContent = 'Continuar';
  } else {
    if (timerRemaining <= 0) timerRemaining = (Number($('minutes').value || 0) * 60 + Number($('seconds').value || 0)) * 1000;
    if (timerRemaining <= 0) return;
    timerEnd = Date.now() + timerRemaining; timerRunning = true;
    $('timerStart').textContent = 'Pausar'; $('islandLabel').textContent = 'Temporizador en curso';
    timerInterval = setInterval(renderTimer, 200);
  }
  renderTimer(); await saveTimer();
});
$('timerReset').addEventListener('click', async () => {
  timerRunning = false; clearInterval(timerInterval);
  timerRemaining = (Number($('minutes').value || 0) * 60 + Number($('seconds').value || 0)) * 1000;
  $('timerStart').textContent = 'Iniciar'; renderTimer(); await saveTimer();
});
$('minutes').addEventListener('change', () => { if (!timerRunning) timerRemaining = (Number($('minutes').value || 0) * 60 + Number($('seconds').value || 0)) * 1000; renderTimer(); });
$('seconds').addEventListener('change', () => { if (!timerRunning) timerRemaining = (Number($('minutes').value || 0) * 60 + Number($('seconds').value || 0)) * 1000; renderTimer(); });
restoreTimer();

let swStart = 0, swElapsed = 0, swRunning = false, swInterval;
function renderStopwatch() {
  const ms = swElapsed + (swRunning ? Date.now() - swStart : 0);
  const minutes = Math.floor(ms / 60000), seconds = Math.floor(ms / 1000) % 60, tenths = Math.floor(ms / 100) % 10;
  $('stopwatchDisplay').textContent = `${pad(minutes)}:${pad(seconds)}.${tenths}`;
}
$('stopwatchToggle').addEventListener('click', () => {
  swRunning = !swRunning;
  if (swRunning) { swStart = Date.now(); swInterval = setInterval(renderStopwatch, 100); $('stopwatchToggle').textContent = 'Pausar'; }
  else { swElapsed += Date.now() - swStart; clearInterval(swInterval); $('stopwatchToggle').textContent = 'Continuar'; }
  renderStopwatch();
});
$('lapButton').addEventListener('click', () => {
  if (!swRunning) return;
  const li = document.createElement('li'); li.textContent = $('stopwatchDisplay').textContent;
  $('laps').prepend(li);
});
$('stopwatchReset').addEventListener('click', () => {
  swRunning = false; swElapsed = 0; clearInterval(swInterval);
  $('stopwatchToggle').textContent = 'Iniciar'; $('laps').replaceChildren(); renderStopwatch();
});
renderStopwatch();
