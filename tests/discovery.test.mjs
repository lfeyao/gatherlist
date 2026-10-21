import test from 'node:test';
import assert from 'node:assert/strict';
import {moods,MOODS,groupByMood,starterPresentation} from '../dist/discovery.js';
import {researchSuppliers} from '../dist/research.js';
import {demoBrief} from '../dist/sample.js';
import {rank} from '../dist/core.js';
test('nine editorial mood groups each contain real venue leads for the default brief',()=>{
  const results=rank(researchSuppliers,demoBrief).filter(r=>r.status!=='outside');
  const groups=groupByMood(results);
  assert.equal(moods.length,9);assert.equal(new Set(MOODS).size,9);
  assert.equal(groups.length,9);
  for(const group of groups){assert.ok(group.results.length>=2,group.id);assert.ok(group.photo.url.startsWith('https://'));assert.ok(group.photo.source);}
});
test('mood browsing narrows results without duplicating a venue within one mood',()=>{
  const ranked=rank(researchSuppliers,demoBrief);
  const [group]=groupByMood(ranked,'coastal');
  assert.equal(group.id,'coastal');assert.equal(group.results.length,2);
  assert.equal(new Set(group.results.map(r=>r.supplier.id)).size,2);
  assert.ok(group.results.every(r=>r.supplier.moods.includes('coastal')));
  assert.equal(starterPresentation['sd-sahm'].photo.credit,'MCASD · Daniel Lang');
});
test('unassigned user listings remain discoverable instead of receiving invented moods',()=>{
  const unassigned={supplier:{id:'my-place',name:'My place',moods:[]}};
  const groups=groupByMood([unassigned]);
  assert.equal(groups.at(-1).id,'other');assert.deepEqual(groups.at(-1).results,[unassigned]);
  assert.equal(groupByMood([unassigned],'cozy')[0].results.length,0);
});
