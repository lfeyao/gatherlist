import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const script=fs.readFileSync(new URL('../public/theme.js',import.meta.url),'utf8');
function browser({saved=null,dark=false,blocked=false}={}){
  const events={},changes={},stored=new Map(),meta={},icon={},attributes={};let ready=false;
  const button={setAttribute:(k,v)=>attributes[k]=v,addEventListener:(name,fn)=>changes[name]=fn};
  const system={matches:dark,addEventListener:(name,fn)=>events.system=fn};
  const document={documentElement:{dataset:{}},getElementById:()=>ready?button:null,querySelector:selector=>selector.startsWith('meta')?{setAttribute:(k,v)=>meta[k]=v}:ready?{setAttribute:(k,v)=>icon[k]=v}:null,addEventListener:(name,fn)=>events[name]=fn};
  vm.runInNewContext(script,{document,matchMedia:()=>system,localStorage:{getItem:()=>{if(blocked)throw Error('Unavailable');return saved;},setItem:(k,v)=>{if(blocked)throw Error('Unavailable');stored.set(k,v);}}});
  return {document,meta,icon,attributes,stored,ready(){ready=true;events.DOMContentLoaded();},click(){changes.click();},systemChange(dark){system.matches=dark;events.system();}};
}
test('system appearance applies before painting and updates the icon until explicitly toggled',()=>{
  const page=browser({dark:true});assert.equal(page.document.documentElement.dataset.theme,'dark');assert.equal(page.meta.content,'#171310');
  page.ready();assert.equal(page.attributes['aria-label'],'Turn on light mode');assert.equal(page.icon.href,'icons.svg#sun');
  page.systemChange(false);assert.equal(page.document.documentElement.dataset.theme,'light');assert.equal(page.icon.href,'icons.svg#moon');
});
test('one click toggles, persists, updates accessible state, and overrides later system changes',()=>{
  const page=browser({saved:'dark'});page.ready();page.click();
  assert.equal(page.document.documentElement.dataset.theme,'light');assert.equal(page.stored.get('gathering-appearance-v1'),'light');
  assert.equal(page.attributes['aria-pressed'],'false');assert.equal(page.meta.content,'#f3eee5');
  page.systemChange(true);assert.equal(page.document.documentElement.dataset.theme,'light');
  page.click();assert.equal(page.document.documentElement.dataset.theme,'dark');assert.equal(page.attributes['aria-pressed'],'true');assert.equal(page.attributes['aria-label'],'Turn on light mode');
});
test('legacy invalid preferences and unavailable storage do not prevent icon toggling',()=>{
  const invalid=browser({saved:'unexpected',dark:true});invalid.ready();assert.equal(invalid.document.documentElement.dataset.theme,'dark');
  const blocked=browser({blocked:true});blocked.ready();assert.doesNotThrow(()=>blocked.click());assert.equal(blocked.document.documentElement.dataset.theme,'dark');
});
