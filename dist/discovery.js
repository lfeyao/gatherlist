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
Object.assign(photos, {
  "red": {
    "url": "https://thereddoorsd.com/wp-content/uploads/2019/08/Dining-Room.jpg",
    "alt": "Dining room and bar seating at The Red Door",
    "credit": "The Red Door \u00b7 General venue photo",
    "source": "https://thereddoorsd.com/"
  },
  "garden": {
    "url": "https://images.squarespace-cdn.com/content/v1/56f43a27906340eeb78d12ed/1613860761242-VLB68HT8726MLH1H9J6L/Tangerine+Tree+Photography+-+Corey+%26+Jack+Wedding+-+Permission+Through+Photographer+%2827%29.jpg",
    "alt": "An event in the Japanese Friendship Garden",
    "credit": "Japanese Friendship Garden \u00b7 Tangerine Tree Photography",
    "source": "https://www.niwa.org/mainpackages"
  },
  "quartyard": {
    "url": "https://quartyardsd.com/wp-content/uploads/2022/11/184A5673-scaled.jpg",
    "alt": "Outdoor event space at Quartyard",
    "credit": "Quartyard \u00b7 General venue photo",
    "source": "https://quartyardsd.com/host-an-event/"
  },
  "bread": {
    "url": "https://images.squarespace-cdn.com/content/v1/58125dc19de4bb662e323d03/1792027861341-UNWHW12XK7EA5BUU32MX/IMG_7313.JPG",
    "alt": "The Brick Room at Bread & Salt",
    "credit": "Bread & Salt \u00b7 General venue photo",
    "source": "https://www.breadandsaltsandiego.com/event-rental"
  },
  "scripps": {
    "url": "https://scripps.ucsd.edu/sites/default/files/styles/800px/public/2020-06/scrippsforum_2016.jpg?itok=seHH2TdV",
    "alt": "Exterior views of Scripps Seaside Forum",
    "credit": "Scripps Institution of Oceanography",
    "source": "https://scripps.ucsd.edu/about/venues/seaside-forum"
  },
  "horton": {
    "url": "https://image-tc.galaxy.tf/wijpeg-8wymnum5thkylridnmq7mqzh1/rsz-hortongrand-saltandwhiskey-eventspace-5_standard.jpg?crop=111%2C0%2C1779%2C1334",
    "alt": "Salt & Whiskey private dining at Horton Grand Hotel",
    "credit": "Horton Grand Hotel \u00b7 Salt & Whiskey",
    "source": "https://www.hortongrand.com/meetings"
  },
  "juniper": {
    "url": "https://www.juniperandivy.com/wp-content/uploads/2021/07/JuniperIvy_10_PhotobyZackBenson-scaled.jpg",
    "alt": "Private dining room at Juniper & Ivy",
    "credit": "Juniper & Ivy \u00b7 Zack Benson",
    "source": "https://www.juniperandivy.com/events/"
  },
  "stone": {
    "url": "https://www.stonebrewing.com/sites/default/files/styles/extra_large/public/2026-10/DSC02563%20%281%29.jpg?itok=2CikZAi5",
    "alt": "Garden patio and koi pond at Stone Brewing Liberty Station",
    "credit": "Stone Brewing \u00b7 Liberty Station",
    "source": "https://www.stonebrewing.com/catering-private-events"
  },
  "loma": {
    "url": "https://static.wixstatic.com/media/70cc3a_997a03619b0340e89ccd91b86ccf50a8~mv2.jpg/v1/fill/w_960,h_960,fp_0.63_0.51,q_90,enc_avif,quality_auto/70cc3a_997a03619b0340e89ccd91b86ccf50a8~mv2.jpg",
    "alt": "Outdoor patio seating at The Loma Club",
    "credit": "The Loma Club \u00b7 General venue photo",
    "source": "https://www.thelomaclub.com/private-events"
  },
  "nolen": {
    "url": "https://thenolenrooftop.com/wp-content/uploads/2024/07/cy_sd_nolan_dusk_aerial_2-scaled.jpg",
    "alt": "The Nolen rooftop at dusk",
    "credit": "The Nolen \u00b7 General venue photo",
    "source": "https://thenolenrooftop.com/"
  },
  "altitude": {
    "url": "https://altitudeskylounge.com/sandiego/wp-content/uploads/2021/07/a1-1.jpg",
    "alt": "ALTITUDE Sky Lounge in San Diego",
    "credit": "ALTITUDE Sky Lounge \u00b7 San Diego",
    "source": "https://altitudeskylounge.com/sandiego/"
  },
  "realm": {
    "url": "https://images.squarespace-cdn.com/content/v1/608b4cd455f6d26840c8ae48/01941046-7f5b-4e20-8745-90f0dc64286b/DSCF5780.jpg",
    "alt": "Interior of Realm of the 52 Remedies",
    "credit": "Realm of the 52 Remedies \u00b7 General venue photo",
    "source": "https://www.52remedies.com/"
  },
  "grass": {
    "url": "https://www.thegrassskirt.com/wp-content/uploads/GrassSkirtInterior6.jpg",
    "alt": "Interior of The Grass Skirt tiki lounge",
    "credit": "The Grass Skirt \u00b7 General venue photo",
    "source": "https://www.thegrassskirt.com/private-events/"
  }
});
export const moods = [
  {id:'cozy',title:'Candlelit dinners',line:'Warm rooms. Unhurried conversation.',photo:photos.loft},
  {id:'outdoor',title:'Courtyards & gardens',line:'Open skies. Space to linger.',photo:photos.garden},
  {id:'social',title:'Art & design',line:'Gather inside a creative space.',photo:photos.bread},
  {id:'coastal',title:'Ocean views',line:'The coast is the backdrop.',photo:photos.sahm},
  {id:'classic',title:'Old-world charm',line:'Historic rooms with a story.',photo:photos.prado},
  {id:'food',title:'Chef-led dining',line:'The meal is the main event.',photo:photos.juniper},
  {id:'casual',title:'Beer & lawn games',line:'A relaxed, playful get-together.',photo:photos.stone},
  {id:'celebrate',title:'Rooftop nights',line:'City lights. An open-air toast.',photo:photos.nolen},
  {id:'private',title:'Hidden lounges',line:'A tucked-away cocktail escape.',photo:photos.realm},
];
// One primary mood per venue. Separate rooms share the same place key.
export const starterPresentation = {
  'sd-herb-loft':{moods:['cozy'],placeKey:'herb-wood',photo:photos.loft},
  'sd-red-door':{moods:['cozy'],placeKey:'red-door',photo:photos.red},
  'sd-japanese-garden':{moods:['outdoor'],placeKey:'japanese-garden',photo:photos.garden},
  'sd-quartyard':{moods:['outdoor'],placeKey:'quartyard',photo:photos.quartyard},
  'sd-mingei-commons':{moods:['social'],placeKey:'mingei',photo:photos.mingei},
  'sd-bread-salt':{moods:['social'],placeKey:'bread-salt',photo:photos.bread},
  'sd-sahm':{moods:['coastal'],placeKey:'mcasd',photo:photos.sahm},
  'sd-scripps-forum':{moods:['coastal'],placeKey:'scripps-forum',photo:photos.scripps},
  'sd-prado':{moods:['classic'],placeKey:'prado',photo:photos.prado},
  'sd-horton':{moods:['classic'],placeKey:'horton-grand',photo:photos.horton},
  'sd-cucina-wine':{moods:['food'],placeKey:'cucina-urbana',photo:photos.cucina},
  'sd-juniper-ivy':{moods:['food'],placeKey:'juniper-ivy',photo:photos.juniper},
  'sd-stone-liberty':{moods:['casual'],placeKey:'stone-liberty',photo:photos.stone},
  'sd-loma-club':{moods:['casual'],placeKey:'loma-club',photo:photos.loma},
  'sd-nolen':{moods:['celebrate'],placeKey:'nolen',photo:photos.nolen},
  'sd-altitude':{moods:['celebrate'],placeKey:'altitude-sd',photo:photos.altitude},
  'sd-realm':{moods:['private'],placeKey:'realm-52',photo:photos.realm},
  'sd-grass-skirt':{moods:['private'],placeKey:'grass-skirt',photo:photos.grass},
  // Preserve old room records and saved IDs for source review and export.
  'sd-herb-patio':{archived:true,placeKey:'herb-wood',moods:['cozy'],photo:photos.patio},
  'sd-herb-gallery':{archived:true,placeKey:'herb-wood',moods:['cozy'],photo:photos.gallery},
  'sd-herb-lavender':{archived:true,placeKey:'herb-wood',moods:['cozy'],photo:photos.lavender},
  'sd-holly':{archived:true,placeKey:'mcasd',moods:['coastal'],photo:photos.holly},
  'sd-mingei-courtyard':{archived:true,placeKey:'mingei',moods:['social'],photo:photos.courtyard},
};
const normalizedName = name => String(name || '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().split('·')[0].replace(/[^a-z0-9]/g,'');
export const venueIdentity = supplier => starterPresentation[supplier.id]?.placeKey || normalizedName(supplier.name) || supplier.id;
export const primaryMood = supplier => (supplier.moods || []).find(id=>MOODS.includes(id)) || '';
export function distinctVenues(results) {
  const seen = new Set();
  return results.filter(({supplier})=>{
    if(starterPresentation[supplier.id]?.archived)return false;
    const key=venueIdentity(supplier);
    if(seen.has(key))return false;
    seen.add(key);return true;
  });
}
export function groupByMood(results, selected='') {
  // Assign before filtering a selected mood, so opening a mood cannot move a venue.
  const distinct=distinctVenues(results);
  const groups=moods.filter(m=>!selected || m.id===selected).map(m=>({...m,results:distinct.filter(r=>primaryMood(r.supplier)===m.id)}));
  if(!selected){const other=distinct.filter(r=>!primaryMood(r.supplier));if(other.length)groups.push({id:'other',title:'More possibilities',line:'Your other venues & vendors',results:other});}
  return groups;
}

// Upgrade the old overlapping starter once, preserving edited fields and saved IDs.
export function migrateDistinctCatalog(state, starter) {
  if(state.distinctMoodCatalogVersion===1)return;
  const priorIds=new Set(['sd-herb-loft','sd-cucina-wine','sd-prado','sd-ukc','sd-herb-patio','sd-herb-gallery','sd-herb-lavender','sd-sahm','sd-holly','sd-mingei-commons','sd-mingei-courtyard']);
  for(const supplier of state.personal){const presentation=starterPresentation[supplier.id];if(presentation)supplier.moods=[...presentation.moods];}
  for(const supplier of starter){if(!priorIds.has(supplier.id)&&!state.personal.some(s=>s.id===supplier.id))state.personal.push(structuredClone(supplier));}
  state.distinctMoodCatalogVersion=1;
}
