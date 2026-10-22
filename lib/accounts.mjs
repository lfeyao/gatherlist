const memberQuery = 'SELECT user_id AS userId, email, display_name AS displayName, created_at AS createdAt, last_seen_at AS lastSeenAt FROM members WHERE user_id = ?';
const json = (body,status=200) => Response.json(body,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
export async function accountResponse(request, db, user) {
  if (!user) return json({error:'Sign in to continue.'},401);
  if (!['GET','POST'].includes(request.method)) return json({error:'Method not allowed.'},405);
  if (request.method==='POST' && (request.headers.get('origin')!==new URL(request.url).origin || request.headers.get('sec-fetch-site')==='cross-site')) return json({error:'Please use this site to create your account.'},403);
  if (!db) return json({error:'Account storage is temporarily unavailable. Please try again.'},503);
  try {
    if (request.method==='POST') {
      const now=new Date().toISOString();
      await db.prepare('INSERT INTO members (user_id, email, display_name, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET email=excluded.email, display_name=excluded.display_name, last_seen_at=excluded.last_seen_at').bind(user.userId,user.email,user.fullName||null,now,now).run();
    }
    const member=await db.prepare(memberQuery).bind(user.userId).first();
    return json({signedIn:true,member:member||null});
  } catch {
    return json({error:'Your account could not be saved. Please try again.'},503);
  }
}
export function escapeHTML(value) {return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
