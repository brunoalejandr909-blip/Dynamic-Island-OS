const $ = (id) => document.getElementById(id);
export function initIsland() {
  const button = $('island');
  const label = $('island-label');
  let activity = null;
  let expanded = false;
  const render = () => {
    button.classList.toggle('expanded', expanded);
    button.classList.toggle('has-activity', Boolean(activity));
    label.textContent = activity?.label || 'DYNAMIC ISLAND';
  };
  button.addEventListener('click', () => { expanded = !expanded; render(); });
  button.addEventListener('contextmenu', (event) => { event.preventDefault(); expanded = !expanded; render(); });
  return {
    setActivity(next) { activity = next; if (!next) expanded = false; render(); },
    clear() { activity = null; expanded = false; render(); }
  };
}
