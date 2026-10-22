import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { accountResponse,escapeHTML } from '../lib/accounts.mjs';
function database(){const sqlite=new DatabaseSync(':memory:');sqlite.exec(readFileSync(new URL('../drizzle/0000_serious_strong_guy.sql',import.meta.url),'utf8'));return {sqlite,prepare(sql){return {bind(...values){return {async first(){return sqlite.prepare(sql).get(...values)||null;},async run(){return sqlite.prepare(sql).run(...values);}};}};}};}
const alice={userId:'site-alice',email:'alice@example.test',fullName:'Alice'};
const bob={userId:'site-bob',email:'bob@example.test',fullName:null};
const req=(method='GET',origin='https://venue.test')=>new Request('https://venue.test/api/account',{method,headers:{origin}});
test('anonymous requests cannot read or create accounts',async()=>{const db=database();for(const method of ['GET','POST'])assert.equal((await accountResponse(req(method),db,null)).status,401);assert.equal(db.sqlite.prepare('SELECT count(*) AS n FROM members').get().n,0);});
test('signup is idempotent, updates identity, and retains its original signup date',async()=>{const db=database();let first=await (await accountResponse(req('POST'),db,alice)).json();assert.equal(first.member.email,alice.email);db.sqlite.exec("UPDATE members SET created_at='2026-01-01T00:00:00.000Z'");const repeat=await (await accountResponse(req('POST'),db,{...alice,email:'changed@example.test'})).json();assert.equal(repeat.member.createdAt,'2026-01-01T00:00:00.000Z');assert.equal(repeat.member.email,'changed@example.test');assert.equal(db.sqlite.prepare('SELECT count(*) AS n FROM members').get().n,1);});
test('a user only receives their own account and GET never signs them up',async()=>{const db=database();await accountResponse(req('POST'),db,alice);assert.equal((await (await accountResponse(req(),db,bob)).json()).member,null);await accountResponse(req('POST'),db,bob);assert.equal((await (await accountResponse(req(),db,alice)).json()).member.userId,alice.userId);assert.equal((await (await accountResponse(req(),db,bob)).json()).member.userId,bob.userId);});
test('cross-origin writes are denied and database failure is explicit',async()=>{const db=database();assert.equal((await accountResponse(req('POST','https://evil.test'),db,alice)).status,403);assert.equal((await accountResponse(req(),null,alice)).status,503);assert.equal(db.sqlite.prepare('SELECT count(*) AS n FROM members').get().n,0);});
test('display names are escaped in account markup',()=>{assert.equal(escapeHTML('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');});
