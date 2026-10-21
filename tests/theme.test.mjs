import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const script=fs.readFileSync(new URL('../dist/theme.js',import.meta.url),'utf8');
function browser({saved=null,dark=false,blocked=false}={}) {
  const events={},changes={},stored=new Map(),meta={},icon={};let ready=false;
  const picker={value:'',addEventListener:(name,fn)=>changes[name]=fn};
  const system={matches:dark,addEventListener:(name,fn)=>events.system=fn};
  const document={documentElement:{dataset:{}},getElementById:()=>ready?picker:null,querySelector:selector=>selector.startsWith('meta')?{setAttribute:(k,v)=>meta[k]=v}:ready?{setAttribute:(k,v)=>icon[k]=v}:null,addEventListener:(name,fn)=>events[name]=fn};
  vm.runInNewContext(script,{document,matchMedia:()=>system,localStorage:{getItem:()=>{if(blocked)throw Error('Unavailable');return saved;},setItem:(k,v)=>{if(blocked)throw Error('Unavailable');stored.set(k,v);}}});
  return {document,meta,icon,stored,ready(){ready=true;events.DOMContentLoaded();},select(value){picker.value=value;changes.change();},systemChange(dark){system.matches=dark;events.system();},get choice(){return picker.value;}};
}
test('system appearance is applied before the page is ready and tracks system changes',()=>{
  const page=browser({dark:true});assert.equal(page.document.documentElement.dataset.theme,'dark');
  assert.equal(page.meta.content,'#151a17');page.ready();assert.equal(page.choice,'system');
  page.systemChange(false);assert.equal(page.document.documentElement.dataset.theme,'light');
});
test('an explicit saved preference overrides the system and picker changes are persisted',()=>{
  const page=browser({saved:'dark',dark:false});page.ready();assert.equal(page.choice,'dark');
  assert.equal(page.document.documentElement.dataset.theme,'dark');page.systemChange(false);
  assert.equal(page.document.documentElement.dataset.theme,'dark');page.select('light');
  assert.equal(page.stored.get('gathering-appearance-v1'),'light');assert.equal(page.meta.content,'#faf9f6');
  assert.equal(page.icon.href,'icons.svg#sun');page.select('system');page.systemChange(true);
  assert.equal(page.document.documentElement.dataset.theme,'dark');assert.equal(page.icon.href,'icons.svg#device');
});
test('invalid preferences and unavailable storage do not prevent theme switching',()=>{
  const invalid=browser({saved:'unexpected',dark:true});invalid.ready();assert.equal(invalid.choice,'system');
  const blocked=browser({blocked:true});blocked.ready();assert.equal(blocked.document.documentElement.dataset.theme,'light');
  assert.doesNotThrow(()=>blocked.select('dark'));assert.equal(blocked.document.documentElement.dataset.theme,'dark');
  blocked.systemChange(false);assert.equal(blocked.document.documentElement.dataset.theme,'dark');
});
