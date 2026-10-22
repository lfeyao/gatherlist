import { createHash, randomBytes } from 'node:crypto';
export const hash = value => createHash('sha256').update(value).digest('hex');
export const token = () => randomBytes(32).toString('base64url');
export function returnPath(value='/workspace.html') {
  if(!value.startsWith('/')||value.startsWith('//'))return '/workspace.html';
  const url=new URL(value,'https://saveurel.invalid');
  return url.origin==='https://saveurel.invalid'&&!url.pathname.startsWith('/auth/')?url.pathname+url.search:'/workspace.html';
}
export function settings(source=process.env) {
  if(!source.APP_ORIGIN)throw new Error('APP_ORIGIN is required.');
  const url=new URL(source.APP_ORIGIN);
  const local=['127.0.0.1','localhost','[::1]'].includes(url.hostname);
  if(url.protocol!=='https:'&&!(local&&url.protocol==='http:'))throw new Error('APP_ORIGIN must use HTTPS.');
  if(url.pathname!=='/'||url.search||url.hash)throw new Error('APP_ORIGIN must be an origin.');
  const allowlist=(source.PRIVATE_EMAIL_ALLOWLIST||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  if(!allowlist.length)throw new Error('A private preview email allowlist is required.');
  return {origin:url.origin,secure:!local,allowlist,issuer:source.OIDC_ISSUER,discoveryUrl:source.OIDC_DISCOVERY_URL,clientId:source.OIDC_CLIENT_ID,clientSecret:source.OIDC_CLIENT_SECRET,dbPath:source.DB_PATH||'./data/saveurel.sqlite',host:source.HOST||'127.0.0.1',port:Number(source.PORT||3000)};
}
export function cookies(header=''){return Object.fromEntries(header.split(';').map(s=>s.trim().split(/=(.*)/s)).filter(p=>p.length>=2).map(([k,v])=>[k,v]));}
export function cookie(name,value,{secure=true,maxAge=86400}={}){return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure?'; Secure':''}`;}
export function sqlAdapter(sqlite){return {prepare(sql){return {bind(...values){return {async first(){return sqlite.prepare(sql).get(...values)||null;},async run(){return sqlite.prepare(sql).run(...values);}};}};}};}
export function shell(html){return html.replaceAll('/signin-with-chatgpt','/auth/login').replaceAll('/signout-with-chatgpt','/auth/logout');}
