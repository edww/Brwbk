const STORE_KEY = 'brewbook.v2';
const APP_VERSION = 'v4';
const BUILD_LABEL = '2026-06-21 17:45';
const OLD_STORE_KEY = 'brewbook.v1';
const methods = ['Espresso', 'Turbo shot', 'Americano', 'Aerocano / iced americano vapeur', 'V60', 'Aeropress', 'French press', 'Cold brew', 'Moka'];
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const today = () => new Date().toISOString().slice(0,10);

const defaults = {
  coffees: [
    {id: uid(), name:'Kenya AA', roaster:'Démo', origin:'Kenya', process:'Lavé', roast:'Claire', notes:'Agrumes, floral, jasmin', photo:''},
    {id: uid(), name:'Brésil chocolat', roaster:'Démo', origin:'Brésil', process:'Nature', roast:'Moyenne +', notes:'Noisette, cacao, corps lourd', photo:''}
  ],
  grinders: [
    {id: uid(), name:'Kingrinder K2', unit:'clics', notes:'V60 autour de 75–84 clics, cold brew autour de 124 clics'},
    {id: uid(), name:'Mazzer Super Jolly', unit:'repère', notes:'Espresso / turbo shot. À noter selon repère réel.'},
    {id: uid(), name:'Eureka Mignon Specialita', unit:'molette', notes:'Alternative espresso.'}
  ],
  machines: [
    {id: uid(), name:'Rocket Appartamento', type:'Espresso', notes:'OPV visée 9 bars. Bottomless possible.'},
    {id: uid(), name:'Gaggia Classic', type:'Espresso', notes:'Projet PID.'},
    {id: uid(), name:'V60', type:'Filtre', notes:'Dripper manuel.'}
  ],
  recipes: [
    {id: uid(), name:'Aerocano / iced americano vapeur', method:'Aerocano / iced americano vapeur', source:'James Hoffmann', video:'', guide:'1. Préparer un espresso propre, par exemple 18 g in → 36–40 g out.\n2. Enlever la crema si elle est très amère.\n3. Dans un pichet : 65 g eau froide + 85 g glaçons.\n4. Ajouter l’espresso.\n5. Envoyer 8 à 12 s de vapeur pour aérer sans trop chauffer.\n6. Verser dans un verre froid ou sur glace.'},
    {id: uid(), name:'Americano — base James Hoffmann', method:'Americano', source:'James Hoffmann', video:'', guide:'1. Préparer un espresso propre, par exemple 18 g in → 36 g out.\n2. Chauffer l’eau séparément.\n3. Verser l’eau dans la tasse, puis l’espresso par-dessus.\n4. Ajuster entre 90 et 140 g d’eau selon intensité voulue.'},
    {id: uid(), name:'Turbo shot', method:'Turbo shot', source:'Lance Hedrick / turbo moderne', video:'', guide:'Base de départ : mouture plus grossière, ratio long. Exemple 17–18 g in → 50–60 g out en 15–22 s. Chercher clarté et moins de lourdeur.'},
    {id: uid(), name:'V60 simple 20 g', method:'V60', source:'Brewbook', video:'', guide:'20 g café, 320–340 g eau. Départ K2 75–84 clics selon café. Ajuster si écoulement trop rapide ou goût plat.'}
  ],
  brews: []
};

defaults.brews.push({id:uid(), date:today(), coffeeId:defaults.coffees[0].id, method:'V60', grinderId:defaults.grinders[0].id, machineId:defaults.machines[2].id, dose:'20', yield:'340', time:'150', grind:'75 clics', water:'Eau chaude, ratio 1:17', rating:'3', notes:'Démo : un peu rapide, ouvrir/fermer selon résultat.', photo:''});
defaults.brews.push({id:uid(), date:today(), coffeeId:defaults.coffees[1].id, method:'Turbo shot', grinderId:defaults.grinders[1].id, machineId:defaults.machines[0].id, dose:'18', yield:'60', time:'16', grind:'à noter', water:'', rating:'3', notes:'Démo : très rapide, possible channeling au bottomless.', photo:''});

let db = load();
let editing = null;
let currentAdvice = '';

const formConfig = {
  brews: {dialog:'brewForm', form:'brewEditor', titleAdd:'Ajouter un shot', titleEdit:'Modifier le shot'},
  coffees: {dialog:'coffeeForm', form:'coffeeEditor', titleAdd:'Ajouter un café', titleEdit:'Modifier le café'},
  recipes: {dialog:'recipeForm', form:'recipeEditor', titleAdd:'Ajouter une recette', titleEdit:'Modifier la recette'},
  grinders: {dialog:'grinderForm', form:'grinderEditor', titleAdd:'Ajouter un moulin', titleEdit:'Modifier le moulin'},
  machines: {dialog:'machineForm', form:'machineEditor', titleAdd:'Ajouter une machine', titleEdit:'Modifier la machine'}
};

function load(){
  const raw = localStorage.getItem(STORE_KEY) || localStorage.getItem(OLD_STORE_KEY);
  if(!raw){ localStorage.setItem(STORE_KEY, JSON.stringify(defaults)); return structuredClone(defaults); }
  try {
    const data = JSON.parse(raw);
    if(!data.recipes) data.recipes = [];
    if(!data.brews) data.brews = [];
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    return data;
  } catch { return structuredClone(defaults); }
}
function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(db)); render(); }
function byId(collection,id){ return (db[collection]||[]).find(x=>x.id===id); }
function stars(n){ return n ? '★★★★★'.slice(0, Number(n)) : '—'; }
function esc(s=''){ return String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }

function photoToDataUrl(file){
  return new Promise(resolve => {
    if(!file || !file.name) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function render(){ renderSelects(); renderBrews(); renderCoffees(); renderRecipes(); renderGear(); renderLast(); }
function renderLast(){
  const last = db.brews[db.brews.length-1];
  const title = document.getElementById('lastBrewTitle');
  const meta = document.getElementById('lastBrewMeta');
  const score = document.getElementById('lastBrewScore');
  if(!last){ title.textContent='Aucune extraction'; meta.textContent='Ajoute ton premier shot.'; score.textContent='—'; return; }
  const coffee = byId('coffees', last.coffeeId)?.name || 'Café';
  const grinder = byId('grinders', last.grinderId)?.name || 'Moulin';
  title.textContent = `${last.method} — ${coffee}`;
  meta.textContent = `${last.dose||'?'}g → ${last.yield||'?'}g · ${last.time||'?'}s · ${grinder} · ${last.grind||'réglage ?'}`;
  score.textContent = stars(last.rating);
}
function itemActions(collection, id, extra=''){
  return `<div class="item-actions">${extra}<button class="ghost" onclick="editItem('${collection}','${id}')">Modifier</button><button class="ghost" onclick="removeItem('${collection}','${id}')">Supprimer</button></div>`;
}
function renderBrews(){
  const el = document.getElementById('brewList');
  const items = [...db.brews].reverse();
  el.innerHTML = items.map(b => {
    const coffee = byId('coffees', b.coffeeId)?.name || 'Café supprimé';
    const grinder = byId('grinders', b.grinderId)?.name || '—';
    const machine = byId('machines', b.machineId)?.name || '—';
    return `<article class="item">
      ${b.photo ? `<img class="photo" src="${b.photo}" alt="Photo extraction">` : ''}
      <div class="item-top"><strong>${esc(b.method)} — ${esc(coffee)}</strong><span class="pill">${esc(b.date||'')}</span></div>
      <p>${esc(b.dose||'?')}g → ${esc(b.yield||'?')}g · ${esc(b.time||'?')}s · ${esc(b.grind||'réglage ?')}</p>
      <p class="muted">${esc(grinder)} · ${esc(machine)} · ${stars(b.rating)}</p>
      ${b.notes ? `<p>${esc(b.notes)}</p>` : ''}
      ${itemActions('brews', b.id, `<button class="ghost" onclick="openTaste('${b.id}')">Triangle</button>`)}
    </article>`;
  }).join('') || '<p class="muted">Aucun shot pour l’instant.</p>';
}
function renderCoffees(){
  document.getElementById('coffeeList').innerHTML = db.coffees.map(c => `<article class="item">
    ${c.photo ? `<img class="photo" src="${c.photo}" alt="${esc(c.name)}">` : ''}
    <div class="item-top"><strong>${esc(c.name)}</strong><span class="pill">${esc(c.roast||'')}</span></div>
    <p class="muted">${esc(c.roaster||'')} · ${esc(c.origin||'')} · ${esc(c.process||'')}</p>
    ${c.notes ? `<p>${esc(c.notes)}</p>` : ''}
    ${itemActions('coffees', c.id)}
  </article>`).join('') || '<p class="muted">Aucun café.</p>';
}
function renderRecipes(){
  document.getElementById('recipeList').innerHTML = db.recipes.map(r => `<article class="item">
    <div class="item-top"><strong>${esc(r.name)}</strong><span class="pill">${esc(r.method)}</span></div>
    <p class="muted">${esc(r.source||'')}</p>
    <p>${esc(r.guide||'').replaceAll('\n','<br>')}</p>
    ${r.video ? `<a href="${esc(r.video)}" target="_blank" rel="noreferrer">Voir la vidéo</a>` : ''}
    ${itemActions('recipes', r.id)}
  </article>`).join('');
}
function renderGear(){
  document.getElementById('grinderList').innerHTML = db.grinders.map(g => `<article class="item"><div class="item-top"><strong>${esc(g.name)}</strong><span class="pill">${esc(g.unit||'')}</span></div><p class="muted">${esc(g.notes||'')}</p>${itemActions('grinders', g.id)}</article>`).join('');
  document.getElementById('machineList').innerHTML = db.machines.map(m => `<article class="item"><div class="item-top"><strong>${esc(m.name)}</strong><span class="pill">${esc(m.type||'')}</span></div><p class="muted">${esc(m.notes||'')}</p>${itemActions('machines', m.id)}</article>`).join('');
}
function renderSelects(){
  const coffeeSelect = document.querySelector('#brewEditor [name="coffeeId"]');
  if(coffeeSelect) coffeeSelect.innerHTML = db.coffees.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
  document.querySelector('#brewEditor [name="grinderId"]').innerHTML = '<option value="">Moulin</option>'+db.grinders.map(g=>`<option value="${g.id}">${esc(g.name)}</option>`).join('');
  document.querySelector('#brewEditor [name="machineId"]').innerHTML = '<option value="">Machine</option>'+db.machines.map(m=>`<option value="${m.id}">${esc(m.name)}</option>`).join('');
  document.querySelector('#brewEditor [name="method"]').innerHTML = methods.map(m=>`<option>${m}</option>`).join('');
  document.querySelector('#recipeEditor [name="method"]').innerHTML = methods.map(m=>`<option>${m}</option>`).join('');
}

window.removeItem = function(collection, id){
  if(confirm('Supprimer cet élément ?')){ db[collection] = db[collection].filter(x=>x.id!==id); save(); }
};

window.editItem = function(collection, id){
  const config = formConfig[collection];
  const item = byId(collection, id);
  if(!config || !item) return;
  editing = {collection, id};
  renderSelects();
  const dialog = document.getElementById(config.dialog);
  const form = document.getElementById(config.form);
  const title = form.querySelector('[data-title]');
  if(title) title.textContent = config.titleEdit;
  form.reset();
  [...form.elements].forEach(el => {
    if(!el.name || el.type === 'file') return;
    if(item[el.name] !== undefined) el.value = item[el.name];
  });
  dialog.showModal();
};

function openAdd(dialogId){
  const dialog = document.getElementById(dialogId);
  const config = Object.values(formConfig).find(c=>c.dialog === dialogId);
  if(config){
    const form = document.getElementById(config.form);
    const title = form.querySelector('[data-title]');
    editing = null;
    form.reset();
    if(title) title.textContent = config.titleAdd;
  }
  renderSelects();
  dialog.showModal();
}

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active'); document.getElementById(btn.dataset.tab).classList.add('active');
}));
document.querySelectorAll('[data-open]').forEach(btn=>btn.addEventListener('click',()=>openAdd(btn.dataset.open)));
document.getElementById('quickAddBtn').addEventListener('click',()=>openAdd('brewForm'));

document.querySelectorAll('dialog form').forEach(form=>{
  form.addEventListener('reset', () => { editing = null; });
});

async function handleForm(formId, collection, mapper){
  const form = document.getElementById(formId);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const fresh = await mapper(fd);
    if(editing && editing.collection === collection){
      db[collection] = db[collection].map(item => item.id === editing.id ? {...item, ...fresh, id: editing.id} : item);
    } else {
      db[collection].push({id:uid(), ...fresh});
    }
    editing = null; form.reset(); form.closest('dialog').close(); save();
  });
}
handleForm('brewEditor','brews', async fd => ({date:today(), coffeeId:fd.get('coffeeId'), method:fd.get('method'), grinderId:fd.get('grinderId'), machineId:fd.get('machineId'), dose:fd.get('dose'), yield:fd.get('yield'), time:fd.get('time'), grind:fd.get('grind'), water:fd.get('water'), rating:fd.get('rating'), notes:fd.get('notes'), photo:(await photoToDataUrl(fd.get('photo'))) || (editing ? byId('brews', editing.id)?.photo || '' : '')}));
handleForm('coffeeEditor','coffees', async fd => ({name:fd.get('name'), roaster:fd.get('roaster'), origin:fd.get('origin'), process:fd.get('process'), roast:fd.get('roast'), notes:fd.get('notes'), photo:(await photoToDataUrl(fd.get('photo'))) || (editing ? byId('coffees', editing.id)?.photo || '' : '')}));
handleForm('recipeEditor','recipes', async fd => ({name:fd.get('name'), method:fd.get('method'), source:fd.get('source'), video:fd.get('video'), guide:fd.get('guide')}));
handleForm('grinderEditor','grinders', async fd => ({name:fd.get('name'), unit:fd.get('unit'), notes:fd.get('notes')}));
handleForm('machineEditor','machines', async fd => ({name:fd.get('name'), type:fd.get('type'), notes:fd.get('notes')}));

const advice = {
  sour: {
    title:'Acide / piquant / citron vert',
    text:'Probable sous-extraction.',
    tips:['Moudre plus fin','Augmenter légèrement le rendement','Augmenter le temps de contact','Monter un peu la température','Si le shot coule très vite : commencer par plus fin']
  },
  bitter: {
    title:'Amer / brûlé / médicament',
    text:'Probable sur-extraction ou café trop poussé.',
    tips:['Moudre plus gros','Réduire le rendement','Baisser un peu la température','Raccourcir le shot','Pour Americano/Aerocano : enlever la crema peut aider']
  },
  dry: {
    title:'Sec / terreux / astringent',
    text:'Souvent extraction inégale, channeling ou torréfaction poussée.',
    tips:['Améliorer la répartition / WDT','Tasser plus régulièrement','Moudre un poil plus gros','Réduire un peu le rendement','Vérifier le panier et le bottomless']
  },
  weak: {
    title:'Plat / aqueux / manque de corps',
    text:'Souvent trop dilué ou pas assez concentré.',
    tips:['Réduire le rendement','Augmenter un peu la dose','Moudre un peu plus fin','Viser un ratio plus court','Si le goût est clair mais mince : baisser surtout la sortie']
  }
};
function setAdvice(key){
  const a = advice[key];
  if(!a) return;
  currentAdvice = `${a.title} — ${a.text} ${a.tips.map(t=>'• '+t).join(' ')}`;
  document.getElementById('tasteAdvice').innerHTML = `<strong>${esc(a.title)}</strong><br>${esc(a.text)}<ul>${a.tips.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;
}
window.openTaste = function(brewId=''){
  if(brewId) editing = {collection:'brews', id:brewId};
  currentAdvice = '';
  document.getElementById('tasteAdvice').textContent = 'Choisis une zone du triangle.';
  document.getElementById('tasteModal').showModal();
};
document.querySelectorAll('[data-taste-open]').forEach(btn=>btn.addEventListener('click',()=>openTaste(editing?.id || '')));
document.querySelectorAll('[data-problem]').forEach(btn=>btn.addEventListener('click',()=>setAdvice(btn.dataset.problem)));
document.getElementById('appendAdviceBtn').addEventListener('click',()=>{
  if(!currentAdvice) return;
  const textarea = document.querySelector('#brewEditor [name="notes"]');
  if(document.getElementById('brewForm').open && textarea){
    textarea.value = [textarea.value, currentAdvice].filter(Boolean).join('\n');
  } else if(editing?.collection === 'brews'){
    const b = byId('brews', editing.id);
    if(b){ b.notes = [b.notes, currentAdvice].filter(Boolean).join('\n'); save(); }
  }
  document.getElementById('tasteModal').close();
});

document.getElementById('exportBtn').addEventListener('click',()=>{
  const blob = new Blob([JSON.stringify(db,null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `brewbook-export-${today()}.json`;
  a.click(); URL.revokeObjectURL(a.href);
});
document.getElementById('importInput').addEventListener('change', e => {
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = () => { try { const imported = JSON.parse(reader.result); if(!imported.coffees || !imported.brews) throw new Error(); db = imported; save(); alert('Import terminé.'); } catch { alert('Fichier JSON invalide.'); } };
  reader.readAsText(file);
});
document.getElementById('resetBtn').addEventListener('click',()=>{ if(confirm('Remettre les données de démo ?')){ db = structuredClone(defaults); save(); } });

const refreshBtn = document.getElementById('forceRefreshBtn');
if(refreshBtn){
  refreshBtn.addEventListener('click', async () => {
    try {
      if('serviceWorker' in navigator){
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      if('caches' in window){
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch(e) {}
    const base = location.href.split('?')[0];
    location.href = `${base}?${APP_VERSION}-${Date.now()}`;
  });
}


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => registration.unregister());
  }).catch(() => {});
}

render();
