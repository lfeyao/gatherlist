// Apply before the stylesheet paints; keep appearance separate from research data.
(() => {
  const key = 'gathering-appearance-v1';
  const choices = ['system', 'light', 'dark'];
  const system = matchMedia('(prefers-color-scheme: dark)');
  let choice = 'system';
  try {const saved = localStorage.getItem(key); if (choices.includes(saved)) choice = saved;} catch {}
  function apply() {
    const theme = choice === 'system' ? (system.matches ? 'dark' : 'light') : choice;
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#151a17' : '#faf9f6');
    const picker = document.getElementById('appearance');
    if (picker) picker.value = choice;
    document.querySelector('#appearance-icon use')?.setAttribute('href', `icons.svg#${choice === 'system' ? 'device' : theme === 'dark' ? 'moon' : 'sun'}`);
  }
  apply();
  system.addEventListener('change', () => {if (choice === 'system') apply();});
  document.addEventListener('DOMContentLoaded', () => {
    const picker = document.getElementById('appearance');
    if (!picker) return;
    picker.addEventListener('change', () => {
      choice = choices.includes(picker.value) ? picker.value : 'system';
      try {localStorage.setItem(key, choice);} catch {}
      apply();
    });
    apply();
  }, {once:true});
})();
