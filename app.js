const STORE_KEY = 'brewbook.v1';
const methods = ['Espresso', 'Turbo shot', 'Americano', 'V60', 'Aeropress', 'French press', 'Cold brew', 'Moka'];
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
    {id: uid(), name:'Americano — base James Hoffmann', method:'Americano', source:'James Hoffmann', video:'', guide:'1. Préparer un espresso propre, par exemple 18 g in → 36 g out.\n2. Chauffer l’eau séparément.\n3. Verser l’eau dans la tasse, puis l’espresso par-dessus.\n4. Ajuster entre 90 et 140 g d’eau selon intensité voulue.'},
    {id: uid(), name:'Turbo shot', method:'Turbo shot', source:'Lance Hedrick / turbo moderne', video:'', guide:'Base de départ : mouture plus grossière, ratio long. Exemple 17–18 g in → 50–60 g out en 15–22 s. Chercher clarté et moins de lourdeur.'},
    {id: uid(), name:'V60 simple 20 g', method:'V60', source:'Brewbook', video:'', guide:'20 g café, 320–340 g eau. Départ K2 75–84 clics selon café. Ajuster si écoulement trop rapide ou goût plat.'}
  ],
  brews: []
};

defaults.brews.push({id:uid(), date:today(), coffeeId:defaults.coffees[0].id, method:'V60', grinderId:defaults.grinders[0].id, machineId:defaults.machines[2].id, dose:'20', yield:'340', time:'150', grind:'75 clics', water:'Eau chaude, ratio 1:17', rating:'3', notes:'Démo : un peu rapide, ouvrir/fermer selon résultat.', photo:''});

defaults.brews.push({id:uid(), date:today(), coffeeId:defaults.coffees[1].id, method:'Turbo shot', grinderId:defaults.grinders[1].id, machineId:defaults.machines[0].id, dose:'18', yield:'60', time:'16', grind:'à noter', water:'', rating:'3', notes:'Démo : très rapide, possible channeling au bottomless.', photo:''});

let db = load();

function load(){
  const raw = localStorage.getItem(STORE_KEY);
  if(!raw){ localStorage.setItem(STORE_KEY, JSON.stringify(defaults)); return structuredClone(defaults); }
  try { return JSON.parse(raw); } catch { return structuredClone(defaults); }
}
function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(db)); render(); }
function byId(collection,id){ return (db[collection]||[]).find(x=>x.id===id); }
function stars(n){ return n ? '★★★★★'.slice(0, Number(n)) : '—'; }
function esc(s=''){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function photoToDataUrl(file){
  return new Promise(resolve => {
    if(!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function render(){
  renderSelects(); renderBrews(); renderCoffees(); renderRecipes(); renderGear(); renderLast();
}
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
      <button class="ghost" onclick="removeItem('brews','${b.id}')">Supprimer</button>
    </article>`;
  }).join('') || '<p class="muted">Aucun shot pour l’instant.</p>';
}
function renderCoffees(){
  document.getElementById('coffeeList').innerHTML = db.coffees.map(c => `<article class="item">
    ${c.photo ? `<img class="photo" src="${c.photo}" alt="${esc(c.name)}">` : ''}
    <div class="item-top"><strong>${esc(c.name)}</strong><span class="pill">${esc(c.roast||'')}</span></div>
    <p class="muted">${esc(c.roaster||'')} · ${esc(c.origin||'')} · ${esc(c.process||'')}</p>
    ${c.notes ? `<p>${esc(c.notes)}</p>` : ''}
    <button class="ghost" onclick="removeItem('coffees','${c.id}')">Supprimer</button>
  </article>`).join('') || '<p class="muted">Aucun café.</p>';
}
function renderRecipes(){
  document.getElementById('recipeList').innerHTML = db.recipes.map(r => `<article class="item">
    <div class="item-top"><strong>${esc(r.name)}</strong><span class="pill">${esc(r.method)}</span></div>
    <p class="muted">${esc(r.source||'')}</p>
    <p>${esc(r.guide||'').replaceAll('\n','<br>')}</p>
    ${r.video ? `<a href="${esc(r.video)}" target="_blank" rel="noreferrer">Voir la vidéo</a>` : ''}
    <button class="ghost" onclick="removeItem('recipes','${r.id}')">Supprimer</button>
  </article>`).join('');
}
function renderGear(){
  document.getElementById('grinderList').innerHTML = db.grinders.map(g => `<article class="item"><div class="item-top"><strong>${esc(g.name)}</strong><span class="pill">${esc(g.unit||'')}</span></div><p class="muted">${esc(g.notes||'')}</p><button class="ghost" onclick="removeItem('grinders','${g.id}')">Supprimer</button></article>`).join('');
  document.getElementById('machineList').innerHTML = db.machines.map(m => `<article class="item"><div class="item-top"><strong>${esc(m.name)}</strong><span class="pill">${esc(m.type||'')}</span></div><p class="muted">${esc(m.notes||'')}</p><button class="ghost" onclick="removeItem('machines','${m.id}')">Supprimer</button></article>`).join('');
}
function renderSelects(){
  document.querySelector('#brewEditor [name="coffeeId"]').innerHTML = db.coffees.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');
  document.querySelector('#brewEditor [name="grinderId"]').innerHTML = '<option value="">Moulin</option>'+db.grinders.map(g=>`<option value="${g.id}">${esc(g.name)}</option>`).join('');
  document.querySelector('#brewEditor [name="machineId"]').innerHTML = '<option value="">Machine</option>'+db.machines.map(m=>`<option value="${m.id}">${esc(m.name)}</option>`).join('');
  document.querySelector('#brewEditor [name="method"]').innerHTML = methods.map(m=>`<option>${m}</option>`).join('');
  document.querySelector('#recipeEditor [name="method"]').innerHTML = methods.map(m=>`<option>${m}</option>`).join('');
}

window.removeItem = function(collection, id){
  if(confirm('Supprimer cet élément ?')){ db[collection] = db[collection].filter(x=>x.id!==id); save(); }
}

document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tab,.panel').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active'); document.getElementById(btn.dataset.tab).classList.add('active');
}));
document.querySelectorAll('[data-open]').forEach(btn=>btn.addEventListener('click',()=>document.getElementById(btn.dataset.open).showModal()));
document.getElementById('quickAddBtn').addEventListener('click',()=>document.getElementById('brewForm').showModal());

async function handleForm(formId, collection, mapper){
  const form = document.getElementById(formId);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const item = await mapper(fd);
    db[collection].push(item); form.reset(); form.closest('dialog').close(); save();
  });
}
handleForm('brewEditor','brews', async fd => ({id:uid(), date:today(), coffeeId:fd.get('coffeeId'), method:fd.get('method'), grinderId:fd.get('grinderId'), machineId:fd.get('machineId'), dose:fd.get('dose'), yield:fd.get('yield'), time:fd.get('time'), grind:fd.get('grind'), water:fd.get('water'), rating:fd.get('rating'), notes:fd.get('notes'), photo:await photoToDataUrl(fd.get('photo'))}));
handleForm('coffeeEditor','coffees', async fd => ({id:uid(), name:fd.get('name'), roaster:fd.get('roaster'), origin:fd.get('origin'), process:fd.get('process'), roast:fd.get('roast'), notes:fd.get('notes'), photo:await photoToDataUrl(fd.get('photo'))}));
handleForm('recipeEditor','recipes', async fd => ({id:uid(), name:fd.get('name'), method:fd.get('method'), source:fd.get('source'), video:fd.get('video'), guide:fd.get('guide')}));
handleForm('grinderEditor','grinders', async fd => ({id:uid(), name:fd.get('name'), unit:fd.get('unit'), notes:fd.get('notes')}));
handleForm('machineEditor','machines', async fd => ({id:uid(), name:fd.get('name'), type:fd.get('type'), notes:fd.get('notes')}));

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

if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js').catch(()=>{}); }
render();
