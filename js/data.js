export const STORE_KEY = 'brewbook.v2';
export const APP_VERSION = 'v0.7';
export const methods = ['Espresso','Turbo shot','Americano','Aerocano / iced americano vapeur','V60','Aeropress','French press','Cold brew','Moka'];
export const processes = ['Lavé','Nature','Honey','Anaérobie','Carbonic maceration','Co-fermenté','Wet hulled','Semi-lavé','Experimental','Décaféiné','Autre'];
export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
export const today = () => new Date().toISOString().slice(0,10);
export const defaults = {
  coffees:[
    {id:uid(),name:'Kenya AA',roaster:'Démo',origin:'Kenya',process:'Lavé',roast:'Claire',notes:'Agrumes, floral, jasmin',photo:'',repurchaseRating:''},
    {id:uid(),name:'Brésil chocolat',roaster:'Démo',origin:'Brésil',process:'Nature',roast:'Moyenne +',notes:'Noisette, cacao, corps lourd',photo:'',repurchaseRating:''}
  ],
  grinders:[{id:uid(),name:'Kingrinder K2',unit:'clics',notes:'V60 autour de 75–84 clics, cold brew autour de 124 clics'},{id:uid(),name:'Mazzer Super Jolly',unit:'repère',notes:'Espresso / turbo shot.'},{id:uid(),name:'Eureka Mignon Specialita',unit:'molette',notes:'Alternative espresso.'}],
  machines:[{id:uid(),name:'Rocket Appartamento',type:'Espresso',notes:'OPV visée 9 bars.'},{id:uid(),name:'Gaggia Classic',type:'Espresso',notes:'Projet PID.'},{id:uid(),name:'V60',type:'Filtre',notes:'Dripper manuel.'}],
  recipes:[{id:uid(),name:'V60 simple 20 g',method:'V60',source:'Brewbook',video:'',guide:'20 g café, 320–340 g eau. Ajuster selon goût.'},{id:uid(),name:'Turbo shot',method:'Turbo shot',source:'Lance Hedrick / turbo moderne',video:'',guide:'17–18 g in → 50–60 g out en 15–22 s. Chercher clarté et moins de lourdeur.'}],
  brews:[]
};
defaults.brews.push({id:uid(),date:today(),coffeeId:defaults.coffees[0].id,method:'V60',grinderId:defaults.grinders[0].id,machineId:defaults.machines[2].id,dose:'20',yield:'340',time:'150',grind:'75 clics',water:'Ratio 1:17',rating:'3',criteria:{clarity:'4',balance:'3',sweetness:'3'},notes:'Démo v0.7 : les critères non notés ne s’affichent pas.',photo:''});
export function load(){
  const raw = localStorage.getItem(STORE_KEY) || localStorage.getItem('brewbook.v1');
  if(!raw){ localStorage.setItem(STORE_KEY, JSON.stringify(defaults)); return structuredClone(defaults); }
  try{ const data = JSON.parse(raw); return migrate(data); }catch{ return structuredClone(defaults); }
}
export function migrate(data){
  data.coffees ||= []; data.grinders ||= []; data.machines ||= []; data.recipes ||= []; data.brews ||= [];
  data.coffees.forEach(c=>{ if(c.repurchaseRating === undefined) c.repurchaseRating=''; });
  data.brews.forEach(b=>{ if(!b.criteria) b.criteria={}; });
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
  return data;
}
export function persist(db){ localStorage.setItem(STORE_KEY, JSON.stringify(db)); }
