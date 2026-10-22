import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {settings,returnPath,hash,cookie,sqlAdapter,shell} from './runtime.mjs';
test('private preview fails closed without allowlist or HTTPS',()=>{
 assert.throws(()=>settings({APP_ORIGIN:'https://venue.test'}));
 assert.throws(()=>settings({APP_ORIGIN:'http://venue.test',PRIVATE_EMAIL_ALLOWLIST:'owner@example.test'}));
 assert.equal(settings({APP_ORIGIN:'https://venue.test',PRIVATE_EMAIL_ALLOWLIST:'OWNER@example.test'}).allowlist[0],'owner@example.test');
});
test('return destinations cannot redirect outside the app or back into auth',()=>{
 for(const value of ['https://evil.test','//evil.test','/\\evil.test','/auth/callback'])assert.equal(returnPath(value),'/workspace.html');
 assert.equal(returnPath('/account?tab=profile'),'/account?tab=profile');
});
test('session tokens are hashed and cookies are secured',()=>{
 assert.equal(hash('secret').length,64);assert.notEqual(hash('secret'),'secret');
 for(const flag of ['HttpOnly','Secure','SameSite=Lax'])assert.ok(cookie('session','value').includes(flag));
});
test('Oracle SQLite supports bound signup queries and unique user IDs',async()=>{
 const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync(new URL('./migrations/0000_members.sql',import.meta.url),'utf8'));
 const db=sqlAdapter(sqlite);await db.prepare('INSERT INTO members VALUES(?,?,?,?,?)').bind('user',"test'@example.test",null,'date','date').run();
 assert.equal((await db.prepare('SELECT email FROM members WHERE user_id=?').bind('user').first()).email,"test'@example.test");
 assert.equal(await db.prepare('SELECT email FROM members WHERE user_id=?').bind('other').first(),null);
});
test('Oracle shell uses portable login without altering the Sites source',()=>{
 const input='/signin-with-chatgpt?return_to=%2Fworkspace.html /signout-with-chatgpt';
 assert.equal(shell(input),'/auth/login?return_to=%2Fworkspace.html /auth/logout');
});
