import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import {resolve,sep,extname} from 'node:path';
import * as oidc from 'openid-client';
import {accountResponse,escapeHTML} from './accounts.mjs';
import {settings,hash,token,cookies,cookie,returnPath,sqlAdapter,shell} from './runtime.mjs';
const cfg=settings();
const db=new DatabaseSync(cfg.dbPath);db.exec('PRAGMA journal_mode=WAL');
const adapter=sqlAdapter(db),publicRoot=resolve('public');
let oidcConfig;
async function identityProvider(){
 if(!cfg.issuer||!cfg.clientId)throw new Error('Sign-in is not configured.');
 if(!oidcConfig){
  if(cfg.discoveryUrl){
   const discovery=new URL(cfg.discoveryUrl);if(discovery.protocol!=='https:')throw new Error('Invalid discovery URL.');
   const response=await fetch(discovery,{signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error('Discovery unavailable.');
   const metadata=await response.json();if(metadata.issuer!==cfg.issuer)throw new Error('Unexpected issuer.');
   for(const key of ['authorization_endpoint','token_endpoint','userinfo_endpoint','jwks_uri']){const endpoint=new URL(metadata[key]);if(endpoint.protocol!=='https:'||endpoint.origin!==discovery.origin)throw new Error('Unexpected identity endpoint.');}
   oidcConfig=new oidc.Configuration(metadata,cfg.clientId,cfg.clientSecret,oidc.ClientSecretBasic(cfg.clientSecret));
  }else oidcConfig=await oidc.discovery(new URL(cfg.issuer),cfg.clientId,cfg.clientSecret);
 }
 return oidcConfig;
}
const types={'.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.png':'image/png','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
const headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'DENY'};
function send(res,status,body,extra={}){res.writeHead(status,{...headers,'Content-Type':'text/html; charset=utf-8',...extra});res.end(body);}
function redirect(res,path,setCookie){send(res,303,'',{Location:path,...(setCookie?{'Set-Cookie':setCookie}:{})});}
function profile(user,member){return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your account — Saveurel</title><link rel="stylesheet" href="/style.css"><script src="/theme.js"></script><style>body{min-height:100dvh;display:grid;place-items:center;padding:24px}.profile{width:min(100%,460px);padding:40px;border:1px solid var(--line);border-radius:22px;background:var(--surface)}h1{font:400 40px var(--serif);margin:32px 0}dt{font-size:11px;color:var(--muted);margin-top:20px}dd{font-size:15px;margin:8px 0;overflow-wrap:anywhere}nav{display:flex;justify-content:space-between;gap:24px;margin-top:36px;font-size:12px}</style></head><body><main class="profile"><a class="place-name" href="/">saveurel</a><h1>Your account</h1><dl><dt>Name</dt><dd>${escapeHTML(user.fullName||user.email)}</dd><dt>Email</dt><dd>${escapeHTML(user.email)}</dd>${member?`<dt>Member since</dt><dd>${escapeHTML(new Date(member.createdAt).toLocaleDateString('en-US',{dateStyle:'long',timeZone:'UTC'}))}</dd>`:''}</dl><nav><a href="/workspace.html">Your workspace ↗</a><a href="/auth/logout">Log out</a></nav></main></body></html>`;}
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,cfg.origin),jar=cookies(req.headers.cookie),now=Date.now();
  if(url.pathname==='/healthz')return send(res,200,'ok',{'Content-Type':'text/plain'});
  if(url.pathname==='/auth/login'){
   const config=await identityProvider(),flowToken=token(),state=oidc.randomState(),nonce=oidc.randomNonce(),verifier=oidc.randomPKCECodeVerifier();
   db.prepare('DELETE FROM login_flows WHERE expires_at < ?').run(now);
   db.prepare('INSERT INTO login_flows VALUES(?,?,?,?,?,?)').run(hash(flowToken),state,nonce,verifier,returnPath(url.searchParams.get('return_to')||undefined),now+600000);
   const target=oidc.buildAuthorizationUrl(config,{redirect_uri:cfg.origin+'/auth/callback',scope:'openid email profile',state,nonce,code_challenge:await oidc.calculatePKCECodeChallenge(verifier),code_challenge_method:'S256'});
   return redirect(res,target.href,cookie('saveurel_flow',flowToken,{secure:cfg.secure,maxAge:600}));
  }
  if(url.pathname==='/auth/callback'){
   const flow=jar.saveurel_flow&&db.prepare('SELECT * FROM login_flows WHERE token_hash=?').get(hash(jar.saveurel_flow));
   if(!flow||flow.expires_at<now)return send(res,400,'Sign-in expired. <a href="/auth/login">Try again</a>');
   db.prepare('DELETE FROM login_flows WHERE token_hash=?').run(hash(jar.saveurel_flow));
   const config=await identityProvider();
   const tokens=await oidc.authorizationCodeGrant(config,url,{pkceCodeVerifier:flow.verifier,expectedState:flow.state,expectedNonce:flow.nonce,idTokenExpected:true});
   let claims=tokens.claims();
   if(claims?.sub&&(typeof claims.email!=='string'||claims.email_verified===undefined)){
    const info=await oidc.fetchUserInfo(config,tokens.access_token,claims.sub);claims={...claims,...info};
   }
   if(!claims?.sub||typeof claims.email!=='string'||claims.email_verified!==true||!cfg.allowlist.includes(claims.email.toLowerCase()))return send(res,403,'This preview is private. Your account does not have access.');
   const session=token();db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(now);
   db.prepare('INSERT INTO sessions VALUES(?,?,?,?,?)').run(hash(session),`${claims.iss}|${claims.sub}`,claims.email,typeof claims.name==='string'?claims.name:null,now+86400000);
   return redirect(res,flow.return_to,[cookie('saveurel_session',session,{secure:cfg.secure}),cookie('saveurel_flow','',{secure:cfg.secure,maxAge:0})]);
  }
  if(url.pathname==='/auth/logout'){
   if(jar.saveurel_session)db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hash(jar.saveurel_session));
   return redirect(res,'/',cookie('saveurel_session','',{secure:cfg.secure,maxAge:0}));
  }
  const session=jar.saveurel_session&&db.prepare('SELECT * FROM sessions WHERE token_hash=? AND expires_at>?').get(hash(jar.saveurel_session),now);
  const user=session&&cfg.allowlist.includes(session.email.toLowerCase())?{userId:session.user_id,email:session.email,fullName:session.full_name}:null;
  if(url.pathname==='/api/account'){
   const webRequest=new Request(url,{method:req.method,headers:Object.fromEntries(Object.entries(req.headers).filter(([,v])=>typeof v==='string'))});
   const response=await accountResponse(webRequest,adapter,user);
   return send(res,response.status,await response.text(),Object.fromEntries(response.headers));
  }
  if(!['GET','HEAD'].includes(req.method))return send(res,405,'Method not allowed.');
  if(['/','/index.html','/workspace.html','/account'].includes(url.pathname)){
   if(!user)return redirect(res,'/auth/login?return_to='+encodeURIComponent(url.pathname));
   if(url.pathname==='/account'){
    const result=await accountResponse(new Request(cfg.origin+'/api/account'),adapter,user),data=await result.json();
    if(!result.ok)return send(res,503,'Account unavailable. Please try again.');
    return send(res,200,profile(user,data.member));
   }
   return send(res,200,shell(await readFile(url.pathname==='/workspace.html'?'ui/workspace.html':'ui/index.html','utf8')));
  }
  const path=resolve(publicRoot,'.'+decodeURIComponent(url.pathname));
  if(!path.startsWith(publicRoot+sep)||!types[extname(path)]||url.pathname.split('/').some(p=>p.startsWith('.')))return send(res,404,'Not found.');
  try{return send(res,200,req.method==='HEAD'?'':await readFile(path),{'Content-Type':types[extname(path)]});}catch{return send(res,404,'Not found.');}
 }catch{send(res,503,'Saveurel is being prepared. Please try again shortly.');}
});
server.requestTimeout=15000;server.headersTimeout=10000;
server.listen(cfg.port,cfg.host,()=>console.log(`Saveurel listening on ${cfg.host}:${server.address().port}`));
