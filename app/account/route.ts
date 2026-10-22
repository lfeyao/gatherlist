import { env } from 'cloudflare:workers';
import { requireChatGPTUser } from '../chatgpt-auth';
import { accountResponse, escapeHTML } from '../../lib/accounts.mjs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const user=await requireChatGPTUser('/account');
  const result=await accountResponse(request,env.DB,user);
  const {member,error}=await result.json() as {member?:{displayName?:string|null;createdAt:string};error?:string};
  const name=escapeHTML(member?.displayName||user.displayName);
  const since=member?new Intl.DateTimeFormat('en-US',{dateStyle:'long',timeZone:'UTC'}).format(new Date(member.createdAt)):'';
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your account — Supperlune</title><link rel="stylesheet" href="/style.css?v=guest-presets-20261021"><script src="/theme.js?v=header-20261021"></script><style>body{min-height:100dvh;display:grid;place-items:center;padding:24px}.account-card{width:min(100%,460px);padding:40px;border:1px solid var(--line);border-radius:22px;background:var(--surface)}.account-card h1{font:400 40px var(--serif);margin:30px 0 24px}.account-card dl{display:grid;gap:10px}.account-card dt{font-size:11px;color:var(--muted);margin-top:14px}.account-card dd{font-size:15px;overflow-wrap:anywhere}.account-links{display:flex;justify-content:space-between;gap:20px;border-top:1px solid var(--line);margin-top:32px;padding-top:24px;font-size:12px}</style></head><body><main class="account-card"><a class="place-name" href="/">supperlune</a><h1>Your account</h1><dl><dt>Name</dt><dd>${name}</dd><dt>Email</dt><dd>${escapeHTML(user.email)}</dd>${member?`<dt>Member since</dt><dd>${escapeHTML(since)}</dd>`:''}</dl>${error?'<p role="alert">Account details are temporarily unavailable.</p>':!member?'<p>Open your workspace to finish setting up your account.</p>':''}<div class="account-links"><a href="/workspace.html">Your workspace ↗</a><a href="/signout-with-chatgpt?return_to=%2F" target="_top">Log out</a></div></main></body></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store'}});
}
