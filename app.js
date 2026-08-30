const plans={
frueh:[
{t:"06:00",meal:"🥚 Frühstück",food:"3 Eier (180g) + Skyr 250g + Apfel 150g",k:450,p:38},
{t:"10:00",meal:"🍗 Mittag",food:"Hähnchen 200g + Reis 180g + Brokkoli 150g",k:650,p:58},
{t:"14:30",meal:"🥤 Snack",food:"Whey 30g + Banane 120g",k:300,p:27},
{t:"18:00",meal:"🐟 Abendessen",food:"Lachs 180g + Kartoffeln 250g",k:600,p:44}
],
spaet:[
{t:"09:00",meal:"🥣 Frühstück",food:"Skyr 250g + Beeren 80g + Haferflocken 50g",k:450,p:36},
{t:"13:30",meal:"🍗 Mittag",food:"Hähnchen 200g + Reis 180g",k:650,p:58},
{t:"17:00",meal:"🥤 Pre Workout",food:"Whey 30g + Banane 120g",k:300,p:27},
{t:"22:00",meal:"🐟 Abendessen",food:"Lachs 180g + Gemüse 150g",k:600,p:44}
],
nacht:[
{t:"15:30",meal:"🥣 Erste Mahlzeit",food:"Skyr 250g + Haferflocken 50g",k:450,p:36},
{t:"18:00",meal:"🍗 Hauptmahlzeit",food:"Hähnchen 200g + Reis 180g",k:650,p:58},
{t:"22:00",meal:"🥤 Snack",food:"Whey 30g + Banane",k:300,p:27},
{t:"02:00",meal:"🐟 Nachtessen",food:"Thunfisch 200g + Kartoffeln 250g",k:500,p:48},
{t:"07:30",meal:"🥣 Vor dem Schlafen",food:"Skyr 250g",k:300,p:30}
],
weekend:[
{t:"09:00",meal:"🥚 Frühstück",food:"3 Eier + Skyr 250g + Obst",k:500,p:40},
{t:"13:30",meal:"🍗 Mittag",food:"Hähnchen 200g + Reis 180g",k:650,p:58},
{t:"17:00",meal:"🥤 Snack",food:"Whey 30g",k:250,p:27},
{t:"20:00",meal:"🐟 Abendessen",food:"Lachs 180g + Kartoffeln 250g",k:600,p:44}
]
};

let state=JSON.parse(localStorage.getItem("aydin-pro")||"{}");

if(!state.goal) state.goal=2200;
if(!state.shift) state.shift="nacht";
if(!state.meals) state.meals=[];

function save(){
localStorage.setItem("aydin-pro",JSON.stringify(state));
}

function weekend(){
const d=new Date().getDay();
return d===0||d===6;
}

function currentPlan(){
return weekend() ? plans.weekend : plans[state.shift];
}

function mins(t){
const a=t.split(":");
return (+a[0])*60+(+a[1]);
}

function now(){
const d=new Date();
return d.getHours()*60+d.getMinutes();
}

function renderPlan(){
const wrap=document.getElementById("plan");
if(!wrap) return;

wrap.innerHTML="";

currentPlan().forEach(m=>{
wrap.innerHTML+=`
<div class="meal">
<div class="icon">${m.meal.slice(0,2)}</div>
<div>
<div class="mealTime">${m.t}</div>
<div class="mealName">${m.meal}</div>
<div class="mealDetail">${m.food}</div>
<div class="mealDetail">${m.k} kcal · ${m.p}g Protein</div>
</div>
</div>`;
});
}

function renderNow(){
const plan=currentPlan();
const current=now();

let active=null;
let next=plan[0];

for(const m of plan){
if(current>=mins(m.t)) active=m;
if(current<mins(m.t)){ next=m; break;}
}

if(!active){
document.getElementById("status").innerText="NÄCHSTE MAHLZEIT";
document.getElementById("statusBig").innerText=next.t;
document.getElementById("food").innerText=next.food;
return;
}

const diff=current-mins(active.t);

if(diff<=90){
document.getElementById("status").innerText="🟢 JETZT ESSEN";
document.getElementById("statusBig").innerText=active.meal;
document.getElementById("food").innerText=active.food;
}else{
document.getElementById("status").innerText="NÄCHSTE MAHLZEIT";
document.getElementById("statusBig").innerText=next.t;
document.getElementById("food").innerText=next.food;
}
}

function totals(){
let kcal=0,pro=0;

const today=new Date().toDateString();

state.meals.filter(x=>x.date===today).forEach(m=>{
kcal+=m.kcal;
pro+=m.protein;
});

document.getElementById("kcal").innerText=kcal;
document.getElementById("protein").innerText=pro;
document.getElementById("goal").innerText=state.goal;
document.getElementById("remaining").innerText=state.goal-kcal;
document.getElementById("progress").style.width=Math.min(100,kcal/state.goal*100)+"%";
}

function addQuick(){
const meal=currentPlan()[0];

state.meals.push({
date:new Date().toDateString(),
kcal:meal.k,
protein:meal.p
});

save();
totals();
alert("Mahlzeit gespeichert");
}

function setShift(s){
if(weekend()) return;
state.shift=s;
save();
render();
}

function render(){
const d=new Date();

document.getElementById("date").innerText=d.toLocaleDateString("de-DE",{weekday:"long",day:"numeric",month:"long"});

renderPlan();
renderNow();
totals();

if(weekend()){
document.getElementById("mode").innerText="🏖️ Wochenendmodus";
}else{
document.getElementById("mode").innerText="Schicht: "+state.shift;
}
}

setInterval(render,30000);

render();
