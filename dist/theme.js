// Apply before painting; an icon toggles the resolved appearance in one click.
(() => {
  const key='gathering-appearance-v1', choices=['system','light','dark'];
  const system=matchMedia('(prefers-color-scheme: dark)');
  let choice='system';
  try {const saved=localStorage.getItem(key);if(choices.includes(saved))choice=saved;} catch {}
  function apply(){
    const theme=choice==='system'?(system.matches?'dark':'light'):choice;
    document.documentElement.dataset.theme=theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#171310':'#f3eee5');
    const button=document.getElementById('appearance');
    if(button){const label=theme==='dark'?'Turn on light mode':'Turn on dark mode';button.setAttribute('aria-label',label);button.setAttribute('title',label);button.setAttribute('aria-pressed',String(theme==='dark'));}
    document.querySelector('#appearance-icon use')?.setAttribute('href',`icons.svg#${theme==='dark'?'sun':'moon'}`);
  }
  apply();
  system.addEventListener('change',()=>{if(choice==='system')apply();});
  document.addEventListener('DOMContentLoaded',()=>{
    const button=document.getElementById('appearance');if(!button)return;
    button.addEventListener('click',()=>{
      choice=document.documentElement.dataset.theme==='dark'?'light':'dark';
      try {localStorage.setItem(key,choice);} catch {}
      apply();
    });
    apply();
  },{once:true});
})();
