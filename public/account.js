const workspace=document.body.dataset.workspace==='true';
const accountLink=document.querySelector('.account-link');
async function connectAccount(){
  try {
    const response=await fetch('/api/account',workspace?{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin'}:{credentials:'same-origin'});
    if(response.status===401)return;
    const result=await response.json();
    if(!response.ok)throw new Error(result.error||'Account unavailable.');
    if(accountLink){
      accountLink.href=workspace?'/account':'/workspace.html';
      const label=workspace?'Your account':'Your workspace';
      accountLink.setAttribute('aria-label',label);accountLink.title=label;
      const text=accountLink.querySelector('span');if(text)text.textContent=label;
    }
  } catch {
    if(workspace){
      const notice=document.createElement('p');notice.className='notice';notice.setAttribute('role','alert');
      notice.append('Your signup could not be saved. ');
      const retry=document.createElement('button');retry.type='button';retry.textContent='Try again';retry.onclick=()=>{notice.remove();connectAccount();};notice.append(retry);
      document.querySelector('#main').prepend(notice);
    }
  }
}
connectAccount();
