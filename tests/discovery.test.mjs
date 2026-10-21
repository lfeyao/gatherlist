import test from 'node:test';
import assert from 'node:assert/strict';
import {moods,MOODS,groupByMood,starterPresentation,venueIdentity,migrateDistinctCatalog} from '../dist/discovery.js';
import {researchSuppliers} from '../dist/research.js';
import {demoBrief} from '../dist/sample.js';
import {rank} from '../dist/core.js';
test('nine editorial mood groups each contain real venue leads for the default brief',()=>{
  const results=rank(researchSuppliers,demoBrief).filter(r=>r.status!=='outside');
  const groups=groupByMood(results);
  assert.equal(moods.length,9);assert.equal(new Set(MOODS).size,9);
  assert.equal(groups.length,9);
  for(const group of groups){assert.equal(group.results.length,2,group.id);assert.ok(group.photo.url.startsWith('https://'));assert.ok(group.photo.source);}
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

test('all 18 featured places are unique across the entire nine-mood grid',()=>{
  const results=rank(researchSuppliers,demoBrief).filter(r=>r.status!=='outside');
  const featured=groupByMood(results).flatMap(group=>group.results.slice(0,2));
  assert.equal(featured.length,18);
  assert.equal(new Set(featured.map(r=>r.supplier.id)).size,18);
  assert.equal(new Set(featured.map(r=>venueIdentity(r.supplier))).size,18);
  assert.ok(featured.every(r=>r.supplier.moods.length===1));
});
test('legacy multi-mood data and room aliases cannot repeat a place in another category',()=>{
  const rows=[
    {supplier:{id:'one',name:'Same Venue · Main room',moods:['cozy','outdoor']}},
    {supplier:{id:'two',name:'Same Venue · Upstairs',moods:['outdoor']}},
  ];
  const grouped=groupByMood(rows);
  assert.deepEqual(grouped.find(g=>g.id==='cozy').results,[rows[0]]);
  assert.equal(grouped.find(g=>g.id==='outdoor').results.length,0);
  assert.equal(groupByMood(rows,'outdoor')[0].results.length,0);
});
test('catalog migration preserves edits and saved room IDs and runs only once',()=>{
  const state={personal:[{...researchSuppliers.find(s=>s.id==='sd-herb-loft'),notes:'My edited notes',priceLow:1234,moods:['food','private']},{...researchSuppliers.find(s=>s.id==='sd-holly')}],saved:['sd-holly']};
  migrateDistinctCatalog(state,researchSuppliers);
  assert.equal(state.personal[0].notes,'My edited notes');assert.equal(state.personal[0].priceLow,1234);
  assert.deepEqual(state.personal[0].moods,['cozy']);assert.deepEqual(state.saved,['sd-holly']);
  assert.ok(state.personal.some(s=>s.id==='sd-red-door'));
  assert.ok(!state.personal.some(s=>s.id==='sd-prado'),'Previously removed starter is not restored');
  state.personal=state.personal.filter(s=>s.id!=='sd-red-door');
  migrateDistinctCatalog(state,researchSuppliers);
  assert.ok(!state.personal.some(s=>s.id==='sd-red-door'),'Deleted new lead is not restored on reload');
});
