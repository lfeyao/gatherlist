import { DatabaseSync } from 'node:sqlite';
import { mkdir, readdir,readFile } from 'node:fs/promises';
import { dirname,resolve } from 'node:path';
const path=resolve(process.env.DB_PATH||'./data/saveurel.sqlite');
await mkdir(dirname(path),{recursive:true,mode:0o700});
const db=new DatabaseSync(path);
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY NOT NULL)');
for(const name of (await readdir(new URL('./migrations/',import.meta.url))).filter(n=>n.endsWith('.sql')).sort()){
 if(db.prepare('SELECT name FROM schema_migrations WHERE name=?').get(name))continue;
 const sql=await readFile(new URL('./migrations/'+name,import.meta.url),'utf8');
 db.exec('BEGIN');try{db.exec(sql);db.prepare('INSERT INTO schema_migrations(name) VALUES (?)').run(name);db.exec('COMMIT');console.log('Applied '+name);}catch(error){db.exec('ROLLBACK');throw error;}
}
db.close();
