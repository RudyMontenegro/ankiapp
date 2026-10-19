const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const context={window:{}};context.window=context;vm.createContext(context);
for(const file of ['cards.js','engine.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
const R=context.Recall,G=context.GRAMMAR;
test('Contenido: 66 situaciones únicas, 11 estructuras y 143 tarjetas',()=>{
  assert.equal(G.situations.length,66);assert.equal(new Set(G.situations.map(c=>c.id)).size,66);assert.equal(R.cards.length,143);
  for(const s of G.structures){const cards=G.situations.filter(c=>c.structure===s.id);assert.equal(cards.length,6);for(const p of s.id==='tag'?['positive','negative']:['positive','negative','question'])assert.ok(cards.some(c=>c.polarity===p));}
});
test('Intervalos con reloj controlado y conteos de evaluaciones',()=>{
  const now=1000000,a=R.review(null,'again',now),h=R.review(null,'hard',now),e=R.review(null,'easy',now);
  assert.equal(a.dueAt,now+600000);assert.equal(a.lapses,1);assert.equal(h.intervalDays,1);assert.equal(e.intervalDays,3);
  assert.equal(R.review(e,'easy',now).intervalDays,8);assert.equal(R.review(e,'hard',now).intervalDays,4);assert.equal(R.review(e,'again',now).intervalDays,0);
});
test('Vencidas antes de nuevas; futuras excluidas; filtros y falladas',()=>{
  const keys=R.cards.filter(c=>c.mode==='build').slice(0,3).map(c=>c.key),now=1000;
  const progress={[keys[0]]:R.review(null,'again',0),[keys[1]]:R.review(null,'easy',0)};
  progress[keys[0]].dueAt=0;
  const selected=R.select(progress,{mode:'build',structures:['present_be'],size:10},now,()=>.4);
  assert.equal(selected[0].key,keys[0]);assert.ok(!selected.some(c=>c.key===keys[1]));assert.equal(selected.length,5);
  assert.equal(R.select(progress,{mode:'build',structures:['present_be'],failed:true},now).length,1);
  assert.equal(R.select({}, {structures:[],size:20},now).length,0);
});
test('El barajado varía y evita estructuras consecutivas si hay alternativas',()=>{
  const options={mode:'usage',size:10};const a=R.select({},options,0,()=>.1),b=R.select({},options,0,()=>.8);
  assert.notEqual(a.map(c=>c.key).join(),b.map(c=>c.key).join());
  const mixed=R.select({}, {mode:'mixed',size:20},0,()=>.5);for(let i=1;i<mixed.length;i++)assert.notEqual(mixed[i].structure,mixed[i-1].structure);
});
test('Otra vez reaparece tras dos tarjetas y solo una vez adicional',()=>{
  const state=R.fresh(),keys=R.cards.slice(0,4).map(c=>c.key);
  state.session={queue:[...keys],index:0,repeated:[],results:[],revealed:true,input:'',buildStyle:'mental'};
  R.grade(state,'again',0);assert.equal(state.session.queue[3],keys[0]);
  R.grade(state,'easy',0);R.grade(state,'hard',0);R.grade(state,'again',0);
  assert.equal(state.session.queue.length,5);assert.equal(state.progress[keys[0]].lapses,2);
  assert.ok(R.validState(state));assert.equal(R.grade(state,'easy',0),true);
});
test('Comparación tolerante y ambigüedad de contracciones',()=>{
  assert.ok(R.matches('  SHE ISN’T tired! ',['She is not tired.']));
  assert.ok(R.matches("She's finished her work.",['She has finished her work.']));
  assert.ok(R.matches('He cannot drive, can he?',["He can't drive, can he?"]));
  assert.ok(!R.matches('She tired',['She is tired.']));
});
test('Carga: progreso válido, corrupción, bloqueo y versiones desconocidas',()=>{
  const s=R.fresh();assert.ok(!R.load({getItem:()=>JSON.stringify(s)}).blocked);
  for(const raw of ['{broken','null','{"version":9,"progress":{}}','{"version":1,"progress":{},"session":{}}'])assert.ok(R.load({getItem:()=>raw}).blocked);
  assert.ok(R.load({getItem:()=>{throw Error('blocked')}}).blocked);
});
