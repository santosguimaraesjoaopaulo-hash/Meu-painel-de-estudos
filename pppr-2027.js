'use strict';
(()=>{
const KEY='pppr-2027-checklist-v1';
const SOURCE='./feed/trilhas-pppr-2027.json';
let syllabus=null;
let checked={};
try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');if(v&&typeof v==='object'&&!Array.isArray(v))checked=v;}catch(_){}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
 const el=document.getElementById('ppprContent');if(!el)return;
 if(!syllabus){el.innerHTML='<p>O checklist ainda não carregou. Verifique a conexão e atualize a página.</p>';return;}
 const topics=syllabus.groups.flatMap(g=>g.topics),done=topics.filter(t=>checked[t.id]).length;
 el.innerHTML='<p class="muted">Planejamento pré-edital baseado no vídeo fornecido. As projeções não são exigências oficiais de 2027.</p>'+
 '<div class="stat" style="margin:12px 0"><span class="muted">Assuntos marcados como estudados</span><b>'+done+' / '+topics.length+'</b><div class="progress"><div style="width:'+(100*done/topics.length)+'%"></div></div></div>'+
 '<p class="muted">Prioridade inicial: Lei de Execução Penal. Marcar um assunto não significa domínio comprovado.</p>'+
 syllabus.groups.map(g=>'<details style="margin:12px 0;border:1px solid #dce4ef;border-radius:10px;padding:12px" '+(g.id==='bloco-1'?'open':'')+'><summary style="font-weight:700;cursor:pointer">'+esc(g.name)+' ('+g.topics.filter(t=>checked[t.id]).length+'/'+g.topics.length+')</summary>'+
 g.topics.map(t=>'<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><label style="display:flex;gap:10px;align-items:flex-start;margin:13px 0;cursor:pointer"><input type="checkbox" data-topic="'+esc(t.id)+'" '+(checked[t.id]?'checked':'')+'><span>'+esc(t.title)+'</span></label><button class="secondary" data-study-topic="'+esc(t.id)+'" style="padding:7px 10px">Estudar</button></div>').join('')+'</details>').join('')+
 '<p class="muted">Clique em Estudar no assunto desejado. Os tópicos sem banco de questões mostrarão um aviso.</p><p class="muted">Seu checklist fica salvo neste navegador. Use o backup do navegador para não perder seu progresso.</p>';
 el.querySelectorAll('[data-study-topic]').forEach(b=>b.addEventListener('click',()=>{const t=topics.find(x=>x.id===b.dataset.studyTopic);startTrack('pppr',t.id,t.title)}));el.querySelectorAll('input[data-topic]').forEach(input=>input.addEventListener('change',()=>{checked[input.dataset.topic]=input.checked;try{localStorage.setItem(KEY,JSON.stringify(checked))}catch(_){}render()}));
}
const nav=document.querySelector('.tabs'),study=document.getElementById('study');
if(!nav||!study)return;
const btn=document.createElement('button');btn.textContent='PPPR 2027';btn.dataset.tab='pppr';nav.insertBefore(btn,nav.querySelector('[data-tab="study"]'));btn.addEventListener('click',()=>switchTab('pppr'));
const section=document.createElement('section');section.id='pppr';section.className='view hidden';section.innerHTML='<div class="panel"><h2>Polícia Penal do Paraná — 2027</h2><div class="actions"><button class="primary" id="startPPPRFixed">Estudar questões da PPPR 2027</button></div><div id="ppprContent" role="region" aria-label="Checklist de assuntos">Carregando trilha…</div></div>';study.parentNode.insertBefore(section,study);section.querySelector('#startPPPRFixed').addEventListener('click',()=>{const d=section.querySelector('details');if(d)d.open=true;section.querySelector('[data-study-topic]')?.focus()});
fetch(SOURCE,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{if(!Array.isArray(data.groups))throw Error('Formato inválido');syllabus=data;render()}).catch(()=>render());
})();
