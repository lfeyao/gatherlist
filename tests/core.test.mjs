import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSupplier,estimate,evaluate,rank,extractListing,parseCSV,toCSV,proposal} from '../public/core.js';
import {sampleSuppliers,demoBrief} from '../public/sample.js';
import {researchSuppliers} from '../public/research.js';
const supplier=overrides=>validateSupplier({name:'A space',category:'venue',city:'San Diego',capacity:30,priceLow:1000,priceHigh:1500,pricing:'flat',tags:['Private room'],...overrides});
test('per-person and hourly estimates use guest count and event duration',()=>{
  assert.deepEqual(estimate(supplier({pricing:'person',priceLow:50,priceHigh:70}),demoBrief),{low:1200,high:1680});
  assert.deepEqual(estimate(supplier({pricing:'hour',priceLow:400,priceHigh:500}),demoBrief),{low:1200,high:1500});
});
test('unknown price and capacity stay unknown rather than becoming zero or a fit',()=>{
  const result=evaluate(supplier({capacity:'',priceLow:'',priceHigh:''}),demoBrief);
  assert.equal(result.status,'check');assert.equal(result.cost.low,null);assert.equal(result.unknown,2);
});
test('minimum spend that fits does not establish that the final quote fits',()=>{
  assert.equal(evaluate(supplier({priceLow:1500,priceHigh:2200}),demoBrief).status,'check');
  assert.equal(evaluate(supplier({priceLow:1500,priceHigh:null}),demoBrief).status,'check');
  assert.equal(evaluate(supplier({priceLow:2000,priceHigh:2500}),demoBrief).status,'outside');
});
test('capacity, minimum guests, city and category can disqualify a supplier',()=>{
  for(const change of [{capacity:12},{minGuests:28},{city:'Carlsbad'},{category:'catering'}]) assert.equal(evaluate(supplier(change),demoBrief).status,'outside');
  assert.equal(evaluate(supplier({city:' san diego '}),demoBrief).status,'fit');
});
test('an unstated required feature needs clarification; no availability is invented',()=>{
  assert.equal(evaluate(supplier({tags:[]}),demoBrief).status,'check');
  assert.equal(evaluate(supplier({}),{...demoBrief,date:'2026-12-01'}).available,false);
  assert.equal(evaluate(supplier({availableDates:'2026-12-01'}),{...demoBrief,date:'2026-12-01'}).available,true);
});
test('ranking prioritizes stated fit, then clarification, then exclusions',()=>{
  const list=[supplier({name:'too small',capacity:10}),supplier({name:'unknown',priceHigh:null}),supplier({name:'fit'})];
  assert.deepEqual(rank(list,demoBrief).map(r=>r.supplier.name),['fit','unknown','too small']);
});
test('listing extraction extracts explicit fields and keeps missing values blank',()=>{
  const result=extractListing('Name: My Venue\nCity: San Diego\nSeats 30. $1,200–$1,600 flat. Private room.\nhttps://example.com/venue');
  assert.equal(result.name,'My Venue');assert.equal(result.city,'San Diego');assert.equal(result.capacity,'30');assert.equal(result.priceLow,1200);assert.equal(result.priceHigh,1600);assert.deepEqual(result.tags,['Private room']);
  const sparse=extractListing('A place with no numbers');assert.equal(sparse.city,'');assert.equal(sparse.priceLow,'');assert.equal(sparse.capacity,'');
});
test('extraction does not promote common negatives or semi-private rooms to positive features',()=>{
  assert.deepEqual(extractListing('A space\nNo private room. Without AV equipment.').tags,[]);
  assert.deepEqual(extractListing('A space\nSemi-private room.').tags,[]);
});
test('availability dates must be real calendar dates',()=>{
  assert.throws(()=>supplier({availableDates:'2026-02-31'}),/valid comma-separated/);
  assert.doesNotThrow(()=>supplier({availableDates:'2028-02-29, 2028-03-01'}));
});
test('CSV handles quoted commas, quotes, multiline notes and UTF-8 BOM',()=>{
  const original=supplier({name:'A, "nice" place',notes:'First line\nSecond line',sourceUrl:'https://example.com',tags:['Private room']});
  const [parsed]=parseCSV('\uFEFF'+toCSV([original]));
  assert.equal(parsed.name,original.name);assert.equal(parsed.notes,original.notes);assert.deepEqual(parsed.tags,original.tags);
});
test('CSV validation is all-or-nothing and rejects malformed values and links',()=>{
  assert.throws(()=>parseCSV('name,capacity\nGood,30\nBad,nope'),/positive numbers/);
  assert.throws(()=>parseCSV('name,city\n"Unclosed,San Diego'),/unclosed/);
  assert.throws(()=>parseCSV('name,city\nA,B,C'),/columns/);
  assert.throws(()=>validateSupplier({name:'A',sourceUrl:'javascript:alert(1)'}),/http or https/);
  assert.throws(()=>supplier({priceLow:1000,priceHigh:100}),/Maximum price/);
});
test('CSV cells that could be formulas are escaped',()=>assert.match(toCSV([supplier({name:'=SUM(1+1)'})]),/"'=SUM\(1\+1\)"/));
test('CSV exports preserve fictional labels so demo rows cannot silently become real',()=>{
  assert.equal(parseCSV(toCSV([sampleSuppliers[0]]))[0].fictional,true);
  assert.equal(parseCSV(toCSV([researchSuppliers[0]]))[0].fictional,false);
});
test('proposal preserves uncertainty, provenance and fictional labels',()=>{
  const text=proposal([sampleSuppliers[0],researchSuppliers[0]],demoBrief);
  assert.match(text,/FICTIONAL DEMO/);assert.match(text,/Quote needed/);assert.match(text,/Unconfirmed/);assert.match(text,/https:\/\/www.herbandwood.com\/privateevents/);assert.match(text,/Budget per vendor/);
});
test('all supplied fixtures validate and real research makes no price or date claim',()=>{
  for(const s of [...sampleSuppliers,...researchSuppliers])assert.doesNotThrow(()=>validateSupplier(s));
  for(const s of researchSuppliers){assert.equal(s.priceLow,null);assert.equal(s.priceHigh,null);assert.equal(s.availableDates,'');assert.equal(s.reviewedAt,'');assert.equal(s.fictional,false);}
});

test('editorial moods survive CSV round trips without becoming verified features',()=>{
  const original=supplier({moods:['cozy','cozy','private','invented'],tags:[]});
  assert.deepEqual(original.moods,['cozy']);
  assert.deepEqual(parseCSV(toCSV([original]))[0].moods,original.moods);
  assert.equal(evaluate(original,demoBrief).status,'check');
});
