import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,symlink,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
import {hash} from './runtime.mjs';
const root=fileURLToPath(new URL('../../../',import.meta.url));
async function run(script,cwd,env){
 const proc=spawn(process.execPath,[script],{cwd,env:{...process.env,...env},stdio:['ignore','pipe','pipe']});
 let output='';proc.stdout.on('data',s=>output+=s);proc.stderr.on('data',s=>output+=s);
 const code=await new Promise(resolve=>proc.on('exit',resolve));assert.equal(code,0,output);
}
test('Oracle server rejects forged headers, isolates member data, and preserves sessions across restart',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'saveurel-oracle-'));let proc;
 try{
  for(const name of ['server.mjs','runtime.mjs','migrate.mjs','migrations'])await cp(new URL('./'+name,import.meta.url),join(dir,name),{recursive:true});
  await cp(join(root,'lib/accounts.mjs'),join(dir,'accounts.mjs'));
  await cp(join(root,'ui'),join(dir,'ui'),{recursive:true});await cp(join(root,'public'),join(dir,'public'),{recursive:true});
  await symlink(fileURLToPath(new URL('./node_modules',import.meta.url)),join(dir,'node_modules'),'dir');
  const env={APP_ORIGIN:'http://127.0.0.1',PRIVATE_EMAIL_ALLOWLIST:'owner@example.test',DB_PATH:join(dir,'data.sqlite'),PORT:'0'};
  await run('migrate.mjs',dir,env);
  const db=new DatabaseSync(env.DB_PATH);
  db.prepare('INSERT INTO sessions VALUES(?,?,?,?,?)').run(hash('test-token'),'oracle|owner','owner@example.test','Owner',Date.now()+60000);
  const start=()=>new Promise((resolve,reject)=>{
   proc=spawn(process.execPath,['server.mjs'],{cwd:dir,env:{...process.env,...env},stdio:['ignore','pipe','pipe']});
   proc.on('error',reject);proc.stdout.on('data',data=>{const match=String(data).match(/listening on 127.0.0.1:(\d+)/);if(match)resolve('http://127.0.0.1:'+match[1]);});
  });
  let url=await start();
  let response=await fetch(url+'/api/account',{headers:{'oai-authenticated-user-id':'fake','oai-authenticated-user-email':'owner@example.test'}});assert.equal(response.status,401);
  response=await fetch(url+'/',{redirect:'manual'});assert.equal(response.status,303);assert.ok(response.headers.get('location').startsWith('/auth/login'));
  response=await fetch(url+'/api/account',{method:'POST',headers:{cookie:'saveurel_session=test-token',origin:'http://evil.test'}});assert.equal(response.status,403);
  response=await fetch(url+'/api/account',{method:'POST',headers:{cookie:'saveurel_session=test-token',origin:env.APP_ORIGIN}});assert.equal(response.status,200);const first=(await response.json()).member;
  response=await fetch(url+'/',{headers:{cookie:'saveurel_session=test-token'}});assert.ok((await response.text()).includes('Saveurel'));
  response=await fetch(url+'/account',{headers:{cookie:'saveurel_session=test-token'}});assert.ok((await response.text()).includes('owner@example.test'));
  proc.kill();await new Promise(resolve=>proc.on('exit',resolve));url=await start();
  response=await fetch(url+'/api/account',{headers:{cookie:'saveurel_session=test-token'}});assert.equal((await response.json()).member.createdAt,first.createdAt);
  assert.equal(db.prepare('SELECT count(*) n FROM members').get().n,1);db.close();
 }finally{if(proc){proc.kill();await new Promise(resolve=>proc.exitCode!==null?resolve():proc.on('exit',resolve));}await rm(dir,{recursive:true,force:true});}
});
