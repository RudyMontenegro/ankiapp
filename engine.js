/* Lógica pura, compartida por la interfaz y las pruebas. */
(() => {
  const DAY=86400000, KEY='grammar-recall-v1';
  const modes={usage:'¿Para qué sirve?',identify:'Identifica la estructura',build:'Construye la oración'};
  const cards = GRAMMAR.structures.flatMap(s=>[
    {key:`usage:${s.id}`,mode:'usage',structure:s.id},
    ...GRAMMAR.situations.filter(c=>c.structure===s.id).flatMap(c=>['identify','build'].map(mode=>({...c,key:`${mode}:${c.id}`,mode})))
  ]);
  const byKey=Object.fromEntries(cards.map(c=>[c.key,c]));
  const fresh=()=>({version:1,progress:{},session:null});
  function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function spaced(items,previous,random=Math.random){const pool=shuffle(items,random),out=[];while(pool.length){let i=pool.findIndex(c=>c.structure!==previous);if(i<0)i=0;const [c]=pool.splice(i,1);out.push(c);previous=c.structure;}return out;}
  function select(progress,{mode='mixed',structures=GRAMMAR.structures.map(s=>s.id),size=10,failed=false},now=Date.now(),random=Math.random){
    const eligible=cards.filter(c=>(mode==='mixed'||c.mode===mode)&&structures.includes(c.structure));
    if(failed)return spaced(eligible.filter(c=>progress[c.key]?.lastRating==='again'),null,random).slice(0,size);
    const due=spaced(eligible.filter(c=>progress[c.key]&&progress[c.key].dueAt<=now),null,random).slice(0,size);
    const newcomers=spaced(eligible.filter(c=>!progress[c.key]),due.at(-1)?.structure,random).slice(0,size-due.length);
    return [...due,...newcomers];
  }
  function review(old,rating,now=Date.now()){
    const p=old||{intervalDays:0,repetitions:0,lapses:0};
    const intervalDays=rating==='again'?0:rating==='hard'?Math.ceil(Math.max(1,p.intervalDays*1.2)):Math.ceil(Math.max(3,p.intervalDays*2.5));
    return {dueAt:now+(rating==='again'?600000:intervalDays*DAY),intervalDays,repetitions:p.repetitions+1,lapses:p.lapses+(rating==='again'?1:0),lastReviewedAt:now,lastRating:rating};
  }
  function grade(state,rating,now=Date.now()){
    const s=state.session,key=s.queue[s.index];state.progress[key]=review(state.progress[key],rating,now);
    s.results.push({key,rating});
    if(rating==='again'&&!s.repeated.includes(key)){s.queue.splice(Math.min(s.index+3,s.queue.length),0,key);s.repeated.push(key);}
    s.index++;s.revealed=false;s.input='';return s.index>=s.queue.length;
  }
  function normalize(text){
    const contractions={"can't":'can not',"cannot":'can not',"won't":'will not',"shan't":'shall not',"isn't":'is not',"aren't":'are not',"wasn't":'was not',"weren't":'were not',"don't":'do not',"doesn't":'does not',"didn't":'did not',"haven't":'have not',"hasn't":'has not',"hadn't":'had not',"couldn't":'could not',"shouldn't":'should not',"wouldn't":'would not',"mightn't":'might not',"mustn't":'must not',"i'm":'i am',"you're":'you are',"we're":'we are',"they're":'they are',"i've":'i have',"you've":'you have',"we've":'we have',"they've":'they have',"i'll":'i will',"you'll":'you will',"he'll":'he will',"she'll":'she will',"we'll":'we will',"they'll":'they will'};
    return text.toLowerCase().replace(/[’‘]/g,"'").replace(/\b[a-z]+(?:'[a-z]+)?\b/g,w=>contractions[w]||w).replace(/[.,!?;:"()]/g,' ').replace(/\s+/g,' ').trim();
  }
  // 's / 'd son ambiguos: comparar ambas expansiones, sin juzgar el significado.
  function variants(text){let list=[normalize(text)];for(const [suffix,options] of [["'s",[' is',' has']],["'d",[' had',' would']]]){list=list.flatMap(t=>options.map(o=>t.replace(new RegExp(suffix+'\\b','g'),o)));}return list.map(t=>t.replace(/\s+/g,' ').trim());}
  function matches(input,models){const a=variants(input);return models.some(m=>variants(m).some(v=>a.includes(v)));}
  const nonnegative=n=>Number.isFinite(n)&&n>=0;
  function validState(d){
    if(!d||d.version!==1||!d.progress||typeof d.progress!=='object'||Array.isArray(d.progress))return false;
    for(const [key,p] of Object.entries(d.progress)){if(!byKey[key]||!p||!['dueAt','intervalDays','repetitions','lapses','lastReviewedAt'].every(k=>nonnegative(p[k]))||!['again','hard','easy'].includes(p.lastRating))return false;}
    const s=d.session;if(s===null)return true;
    return !!s&&Array.isArray(s.queue)&&s.queue.length>0&&s.queue.every(k=>byKey[k])&&Number.isInteger(s.index)&&s.index>=0&&s.index<=s.queue.length&&Array.isArray(s.repeated)&&s.repeated.every(k=>byKey[k])&&Array.isArray(s.results)&&s.results.length===s.index&&s.results.every(r=>byKey[r.key]&&['again','hard','easy'].includes(r.rating))&&typeof s.revealed==='boolean'&&typeof s.input==='string'&&['mental','written'].includes(s.buildStyle);
  }
  function load(storage){try{const raw=storage.getItem(KEY);if(!raw)return {state:fresh(),blocked:false,notice:''};const d=JSON.parse(raw);if(d.version!==1)return {state:fresh(),blocked:true,notice:'El progreso guardado tiene una versión desconocida. Puedes estudiar en memoria; no lo sobrescribiremos. Para reemplazarlo, usa Reiniciar progreso en Ajustes.'};if(!validState(d))throw Error('invalid');return {state:d,blocked:false,notice:''};}catch{return {state:fresh(),blocked:true,notice:'No se pudo leer el progreso: el almacenamiento está bloqueado o contiene datos dañados. Puedes estudiar en memoria. Para intentar guardarlo de nuevo, usa Reiniciar progreso en Ajustes.'};}}
  window.Recall={DAY,KEY,modes,cards,byKey,fresh,select,review,grade,normalize,matches,validState,load};
})();
