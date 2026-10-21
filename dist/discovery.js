// Editorial mood groupings, distinct from verified capacity, price and availability.
export const MOODS = ['cozy','outdoor','social','coastal','classic','food','casual','celebrate','private'];
const hw = 'https://images.squarespace-cdn.com/content/v1/5e82c1733ddff337f1d4f916/';
export const photos = {
  loft:{url:hw+'972b1411-61ab-4283-9006-a6fb1faf0b7f/Print_08.jpg?format=1000w',alt:'The Loft dining space at Herb & Wood',credit:'Herb & Wood · The Loft',source:'https://www.herbandwood.com/privateevents'},
  patio:{url:hw+'38fbdbe9-b17f-4a80-9eb1-119a823c073c/Print_17.jpg?format=1000w',alt:'The Patio at Herb & Wood',credit:'Herb & Wood · The Patio',source:'https://www.herbandwood.com/privateevents'},
  gallery:{url:hw+'1586297008135-995251NZQ3YE9R5XE28B/Gallery%2B-%2BSeated%2BReception.jpg?format=1000w',alt:'A seated reception in The Gallery at Herb & Wood',credit:'Herb & Wood · The Gallery',source:'https://www.herbandwood.com/privateevents'},
  cucina:{url:'https://www.urbankitchengroup.com/cucina-urbana-bankers-hill/wp-content/uploads/sites/4/2019/01/group-dining-banner.jpg',alt:'Group dining at CUCINA urbana; general venue photo',credit:'CUCINA urbana · General venue photo',source:'https://www.urbankitchengroup.com/cucina-urbana-bankers-hill/group-events/'},
  prado:{url:'https://www.pradobalboa.com/wp-content/uploads/2023/06/Weddings-Events-square2.jpg',alt:'An event setting at The Prado; general venue photo',credit:'The Prado · General venue photo',source:'https://www.pradobalboa.com/'},
};
photos.lavender={url:hw+'d1f1bdeb-1da9-4a31-97d4-3965c28b8456/Print_12.jpg?format=1000w',alt:'Lavender Lounge at Herb & Wood',credit:'Herb & Wood · Lavender Lounge',source:'https://www.herbandwood.com/privateevents'};
photos.sahm={url:'https://mcasd.org/uploads/images/_mcasd_image_1200px_w/6776/SAHMS_003.webp',alt:'Sahm Seaview Room at MCASD',credit:'MCASD · Daniel Lang',source:'https://mcasd.org/about/rentals'};
photos.holly={url:'https://mcasd.org/uploads/images/_mcasd_image_1200px_w/6696/MCGRATH_001.webp',alt:'Holly McGrath Terrace overlooking the coast at MCASD',credit:'MCASD · Daniel Lang',source:'https://mcasd.org/about/rentals'};
photos.mingei={url:'https://cdn.mingeiorg.workers.dev/media/2025-Events/_1200x900_fit_center-center_none_ns/MMwedding-344.jpg?v=1785873233',alt:'A reception in the MAC Commons at Mingei',credit:'Mingei · The Shalom Imaginative',source:'https://mingei.org/visit/event-rentals'};
photos.courtyard={url:'https://cdn.mingeiorg.workers.dev/media/2025-Events/_1200x900_fit_center-center_none_ns/MMwedding-184.jpg?v=1785873230',alt:'An event in Neeley Courtyard at Mingei',credit:'Mingei · The Shalom Imaginative',source:'https://mingei.org/visit/event-rentals'};
export const moods = [
  {id:'cozy',title:'Candlelit & cozy',line:'Long dinners. Close friends.',photo:photos.loft},
  {id:'outdoor',title:'Open-air afternoons',line:'Fresh air. Room to linger.',photo:photos.patio},
  {id:'social',title:'Artful & social',line:'A little energy. A lot of character.',photo:photos.gallery},
  {id:'coastal',title:'Coastal & breezy',line:'Ocean views. Unhurried hours.',photo:photos.holly},
  {id:'classic',title:'Classic & elegant',line:'A setting with a little history.',photo:photos.prado},
  {id:'food',title:'Food comes first',line:'Meet around something delicious.',photo:photos.cucina},
  {id:'casual',title:'Easygoing evenings',line:'Come as you are. Stay a while.',photo:photos.lavender},
  {id:'celebrate',title:'Something to celebrate',line:'A toast to the occasion.',photo:photos.mingei},
  {id:'private',title:'Just your circle',line:'A little space for your people.',photo:photos.sahm},
];
export const starterPresentation = {
  'sd-herb-loft':{moods:['cozy','classic','food','private'],photo:photos.loft},
  'sd-cucina-wine':{moods:['cozy','food','casual'],photo:photos.cucina},
  'sd-prado':{moods:['outdoor','classic','celebrate'],photo:photos.prado},
  'sd-herb-patio':{moods:['outdoor','casual'],photo:photos.patio},
  'sd-herb-gallery':{moods:['social','celebrate'],photo:photos.gallery},
  'sd-herb-lavender':{moods:['cozy','casual','private'],photo:photos.lavender},
  'sd-sahm':{moods:['coastal','private'],photo:photos.sahm},
  'sd-holly':{moods:['coastal','outdoor'],photo:photos.holly},
  'sd-mingei-commons':{moods:['social','celebrate'],photo:photos.mingei},
  'sd-mingei-courtyard':{moods:['outdoor','classic'],photo:photos.courtyard},
};
export function groupByMood(results, selected='') {
  const groups = moods.filter(m=>!selected || m.id===selected).map(m=>({...m,results:results.filter(r=>(r.supplier.moods||[]).includes(m.id))}));
  if(!selected){const other=results.filter(r=>!(r.supplier.moods||[]).some(m=>MOODS.includes(m)));if(other.length)groups.push({id:'other',title:'More possibilities',line:'Your other venues & vendors',results:other});}
  return groups;
}
