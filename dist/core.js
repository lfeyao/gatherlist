import {MOODS} from './discovery.js';
export const TAGS = ['Private room', 'Outdoor space', 'AV equipment', 'Dietary options', 'Step-free access'];
export const normalize = value => String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');
export const money = value => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(value);
const number = value => value === '' || value == null ? null : Number(value);
export function validateSupplier(input) {
  const supplier = {
    id: String(input.id || crypto.randomUUID()), name: String(input.name || '').trim(),
    category: String(input.category || 'venue'), city: String(input.city || '').trim(),
    capacity: number(input.capacity), minGuests: number(input.minGuests),
    priceLow: number(input.priceLow), priceHigh: number(input.priceHigh),
    pricing: String(input.pricing || 'flat'), tags: Array.isArray(input.tags) ? input.tags.filter(x => TAGS.includes(x)) : [],
    sourceUrl: String(input.sourceUrl || '').trim(), notes: String(input.notes || '').trim(),
    reviewedAt: String(input.reviewedAt || ''), availableDates: String(input.availableDates || '').trim(),
    fictional: input.fictional === true,
    moods: Array.isArray(input.moods) ? [...new Set(input.moods.filter(x => MOODS.includes(x)))] : [],
  };
  if (!supplier.name || supplier.name.length > 120) throw new Error('Enter a supplier name (up to 120 characters).');
  if (!['venue', 'catering', 'photography', 'other'].includes(supplier.category)) throw new Error('Choose a supported category.');
  if (!['flat', 'person', 'hour'].includes(supplier.pricing)) throw new Error('Choose flat, per-person, or hourly pricing.');
  for (const key of ['capacity', 'minGuests', 'priceLow', 'priceHigh']) {
    if (supplier[key] !== null && (!Number.isFinite(supplier[key]) || supplier[key] < 0)) throw new Error('Prices and guest counts must be positive numbers or blank.');
  }
  for (const key of ['capacity', 'minGuests']) if (supplier[key] !== null && !Number.isInteger(supplier[key])) throw new Error('Guest counts must be whole numbers.');
  if (supplier.priceHigh !== null && supplier.priceLow !== null && supplier.priceHigh < supplier.priceLow) throw new Error('Maximum price must be at least the minimum price.');
  if (supplier.capacity !== null && supplier.minGuests !== null && supplier.minGuests > supplier.capacity) throw new Error('Minimum guests cannot exceed capacity.');
  if (supplier.sourceUrl) {
    let url;
    try { url = new URL(supplier.sourceUrl); } catch { throw new Error('Use a full source URL, starting with https:// or http://.'); }
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Use an http or https source URL.');
  }
  if (supplier.availableDates && !supplier.availableDates.split(',').every(date => /^\d{4}-\d{2}-\d{2}$/.test(date.trim()) && !Number.isNaN(Date.parse(date.trim())) && new Date(date.trim()).toISOString().slice(0,10) === date.trim())) throw new Error('Use valid comma-separated availability dates in YYYY-MM-DD format.');
  return supplier;
}
export function estimate(supplier, brief) {
  const multiplier = supplier.pricing === 'person' ? Number(brief.guests) : supplier.pricing === 'hour' ? Number(brief.hours) : 1;
  if (!Number.isFinite(multiplier) || multiplier <= 0) return {low: null, high: null};
  return {low: supplier.priceLow === null ? null : supplier.priceLow * multiplier, high: supplier.priceHigh === null ? null : supplier.priceHigh * multiplier};
}
export function evaluate(supplier, brief) {
  const reasons = [];
  const add = (kind, text) => reasons.push({kind, text});
  if (brief.category !== 'all') add(supplier.category === brief.category ? 'yes' : 'no', supplier.category === brief.category ? 'Right category' : 'Different category');
  if (brief.city.trim()) add(!supplier.city ? 'unknown' : normalize(supplier.city) === normalize(brief.city) ? 'yes' : 'no', !supplier.city ? 'City not supplied' : normalize(supplier.city) === normalize(brief.city) ? 'City matches' : `Listed in ${supplier.city}`);
  if (supplier.capacity === null) add('unknown', 'Capacity not supplied');
  else add(supplier.capacity >= brief.guests ? 'yes' : 'no', supplier.capacity >= brief.guests ? `Room for ${brief.guests} guests` : `Capacity is ${supplier.capacity}`);
  if (supplier.minGuests !== null && supplier.minGuests > brief.guests) add('no', `Minimum ${supplier.minGuests} guests`);
  const cost = estimate(supplier, brief);
  if (cost.low === null) add('unknown', 'Price not supplied');
  else if (cost.low > brief.budget) add('no', `Starts above ${money(brief.budget)} budget`);
  else if (cost.high === null || cost.high > brief.budget) add('unknown', 'Confirm final price within budget');
  else add('yes', 'Estimate within vendor budget');
  for (const tag of brief.tags || []) add(supplier.tags.includes(tag) ? 'yes' : 'unknown', supplier.tags.includes(tag) ? tag : `Confirm ${tag.toLowerCase()}`);
  const blocked = reasons.filter(r => r.kind === 'no').length;
  const unknown = reasons.filter(r => r.kind === 'unknown').length;
  const status = blocked ? 'outside' : unknown ? 'check' : 'fit';
  const available = brief.date && supplier.availableDates.split(',').map(x => x.trim()).includes(brief.date);
  return {supplier, cost, reasons, status, blocked, unknown, available, matched: reasons.filter(r => r.kind === 'yes').length};
}
export function rank(suppliers, brief) {
  return suppliers.map(s => evaluate(s, brief)).sort((a, b) => a.blocked - b.blocked || a.unknown - b.unknown || b.matched - a.matched || (a.cost.low ?? Infinity) - (b.cost.low ?? Infinity) || a.supplier.name.localeCompare(b.supplier.name));
}
export function extractListing(text) {
  const lines = text.trim().split('\n').map(x => x.trim()).filter(Boolean);
  if (!lines.length) throw new Error('Paste a listing first.');
  const amount = '[0-9][0-9,]*(?:\\.[0-9]{1,2})?';
  const price = text.match(new RegExp('\\$(' + amount + ')(?:\\s*[-–]\\s*\\$?(' + amount + '))?'));
  const field = label => text.match(new RegExp('^' + label + ':\\s*(.+)$', 'im'))?.[1]?.trim() || '';
  const capacity = text.match(/(?:seats|capacity[:\s]*|up to)\s*(\d+)/i)?.[1] || '';
  const lower = text.toLowerCase();
  const category = /cater|chef|dining menu/.test(lower) ? 'catering' : /photograph/.test(lower) ? 'photography' : 'venue';
  return {
    name: (field('Name') || lines[0].replace(/^name:\s*/i, '').split(/[—|]/)[0]).slice(0, 120),
    city: field('City'), category, capacity, minGuests: '',
    priceLow: price ? Number(price[1].replaceAll(',', '')) : '',
    priceHigh: price?.[2] ? Number(price[2].replaceAll(',', '')) : '',
    pricing: /per\s*(?:person|guest|head)|\/\s*(?:person|guest|head)/i.test(text) ? 'person' : /per\s*hour|\/\s*(?:hour|hr)/i.test(text) ? 'hour' : 'flat',
    tags: TAGS.filter(tag => {
      const phrase = tag.toLowerCase();
      if (!lower.includes(phrase)) return false;
      // Avoid promoting common explicit negatives or semi-private rooms to facts.
      const negative = new RegExp('(?:no|without|not(?: a)?)\\s+' + phrase);
      return !negative.test(lower) && !(tag === 'Private room' && /semi[- ]private room/.test(lower));
    }), sourceUrl: text.match(/https?:\/\/[^\s<>]+/)?.[0]?.replace(/[),.;]+$/, '') || '',
    notes: text, availableDates: '', reviewedAt: '', fictional: false,
  };
}
export function parseCSV(text) {
  const rows = []; let row = [], field = '', quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') {field += '"'; i++;} else quoted = !quoted;
    } else if (ch === ',' && !quoted) {row.push(field); field = '';}
    else if ((ch === '\n' || ch === '\r') && !quoted) {if (ch === '\r' && text[i + 1] === '\n') i++; row.push(field); if (row.some(x => x.trim())) rows.push(row); row = []; field = '';}
    else field += ch;
  }
  if (quoted) throw new Error('CSV contains an unclosed quote.');
  row.push(field); if (row.some(x => x.trim())) rows.push(row);
  if (rows.length < 2) throw new Error('CSV needs a header and at least one listing.');
  const headers = rows.shift().map(x => x.trim());
  if (!headers.includes('name')) throw new Error('CSV must include a name column.');
  return rows.map((values, i) => {
    if (values.length !== headers.length) throw new Error(`CSV row ${i + 2} has the wrong number of columns.`);
    const data = Object.fromEntries(headers.map((key, j) => [key, values[j]]));
    return validateSupplier({...data, tags: (data.tags || '').split('|'), moods: (data.moods || '').split('|'), fictional: data.fictional === 'true', reviewedAt: ''});
  });
}
export const CSV_HEADERS = ['name', 'category', 'city', 'capacity', 'minGuests', 'priceLow', 'priceHigh', 'pricing', 'tags', 'sourceUrl', 'notes', 'availableDates', 'fictional', 'moods'];
export function toCSV(suppliers) {
  const cell = input => {let s = String(input ?? ''); if (/^[\s]*[=+\-@]/.test(s)) s = "'" + s; return '"' + s.replaceAll('"', '""') + '"';};
  return [CSV_HEADERS.join(','), ...suppliers.map(s => CSV_HEADERS.map(k => cell(['tags','moods'].includes(k) ? (s[k] || []).join('|') : s[k])).join(','))].join('\r\n');
}
export function proposal(suppliers, brief) {
  const date = brief.date || 'To be decided';
  const rows = rank(suppliers, brief).map(({supplier: s, cost, status, reasons, available}) => {
    const price = cost.low === null ? 'Quote needed' : `${money(cost.low)}${cost.high === null ? '+' : cost.high !== cost.low ? '–' + money(cost.high) : ''}`;
    return `## ${s.name}${s.fictional ? ' [FICTIONAL DEMO]' : ''}\n\n- Category: ${s.category}\n- City: ${s.city || 'Not supplied'}\n- Estimated vendor cost (USD): ${price}\n- Fit: ${{fit: 'Fits stated brief', check: 'Needs clarification', outside: 'Outside brief'}[status]}\n- Details: ${reasons.map(r => r.text).join('; ')}\n- Availability: ${available ? 'Date entered as available by user; reconfirm before booking' : 'Unconfirmed; contact supplier'}\n- Source: ${s.sourceUrl || 'No source URL supplied'}\n- Reviewed by user: ${s.reviewedAt || 'Not yet'}\n- Notes: ${s.notes || 'None'}\n`;
  });
  return `# Gathering shortlist\n\nCity: ${brief.city || 'Any'}\nGuests: ${brief.guests}\nDate: ${date}\nDuration: ${brief.hours} hours\nBudget per vendor: ${money(brief.budget)} USD\n\nEstimates use supplied listing data, not confirmed quotes. Availability, credentials and quality require direct confirmation.\n\n${rows.join('\n')}`;
}
