// ═══════════════════════════════════════════════════
//  FITTRACK PRO v2.0
//  Weight load tracking · Rest timer · Export · 6-day plan
// ═══════════════════════════════════════════════════

const SPLITS = { LEGS:'LEGS',PUSH:'PUSH',PULL:'PULL',LOWER:'LOWER',UPPER:'UPPER',HIIT:'HIIT',REST:'REST' };
const DAY_ROTATION = ['LEGS','PUSH','PULL','LOWER','UPPER','HIIT','REST'];

const SPLIT_META = {
  LEGS:  { label:'Legs — Hamstring Focus', color:'#b57fd4', emoji:'🦵', sub:'Hamstrings · Glutes · Calves' },
  PUSH:  { label:'Push Day',               color:'#ff5e3a', emoji:'💪', sub:'Chest · Shoulders · Triceps' },
  PULL:  { label:'Pull Day',               color:'#00cfff', emoji:'🔙', sub:'Back · Biceps · Abs' },
  LOWER: { label:'Lower — Quad Focus',     color:'#2ecc71', emoji:'⬇️', sub:'Quads · Tibialis · Calves' },
  UPPER: { label:'Upper Superset Day',     color:'#ffb800', emoji:'🏋️', sub:'Full Upper — Superset Format' },
  HIIT:  { label:'Full Body HIIT',         color:'#ff3d6a', emoji:'🔥', sub:'Circuit · HIIT Treadmill' },
  REST:  { label:'Rest & Recovery',        color:'#556677', emoji:'😴', sub:'Stretch · Walk · Recover' }
};

const WORKOUTS = {
  LEGS: [
    {name:'Standalone Cycling',   sets:1, reps:'5 min',   note:'Warm-up — low resistance', isCardio:true},
    {name:'Sumo Squat',           sets:3, reps:'8–12',    note:'Wide stance, toes out 45°'},
    {name:'RDL',                  sets:3, reps:'12',      note:'Hinge at hips, feel hamstring stretch'},
    {name:'Leg Curl',             sets:3, reps:'12',      note:'Full range, control the eccentric'},
    {name:'Wide Leg Press',       sets:3, reps:'12',      note:'Feet high + wide = glute emphasis'},
    {name:'Calf Raises',          sets:4, reps:'15',      note:'Full stretch at bottom, pause at top'},
    {name:'Treadmill',            sets:1, reps:'15 min',  note:'Incline 10, speed 4.5–5', isCardio:true}
  ],
  PUSH: [
    {name:'Incline Bench Press',  sets:3, reps:'10–12',   note:'Tempo 3-1-1, shoulder-safe angle'},
    {name:'Dumbbell Bench Press', sets:3, reps:'12',      note:'Full stretch at bottom'},
    {name:'Pec Dec',              sets:3, reps:'12–15',   note:'Peak contraction squeeze'},
    {name:'Shoulder Press',       sets:3, reps:'8–10',    note:'Dumbbells preferred — shoulder safety'},
    {name:'Lateral Raise',        sets:3, reps:'12–15',   note:'Slow eccentric 3 sec down'},
    {name:'Triceps Pushdown',     sets:3, reps:'12–15',   note:'Elbows fixed, squeeze at bottom'},
    {name:'Overhead Extension',   sets:3, reps:'12',      note:'Elbows in, control eccentric'},
    {name:'Push-up',              sets:3, reps:'12',      note:'Full range, chest to floor'},
    {name:'Treadmill',            sets:1, reps:'20 min',  note:'Incline 10, speed 4.5–5', isCardio:true}
  ],
  PULL: [
    {name:'Lat Pulldown',         sets:3, reps:'10–12',   note:'Wide grip, full stretch at top'},
    {name:'T-Bar Row',            sets:3, reps:'10–12',   note:'Chest on pad, full range'},
    {name:'Chest Supported Row',  sets:3, reps:'10–12',   note:'Removes lower back stress'},
    {name:'Straight Arm Pulldown',sets:3, reps:'12',      note:'Arms straight — lat isolation'},
    {name:'Barbell Curl',         sets:3, reps:'10–12',   note:'No swinging, strict form'},
    {name:'Incline DB Curl',      sets:3, reps:'12',      note:'Full stretch for peak bicep'},
    {name:'Hammer Curl',          sets:3, reps:'12',      note:'Brachialis focus'},
    {name:'Arm Curl (Cable)',      sets:3, reps:'20',      note:'Light, high rep, squeeze hard'},
    {name:'Abs Circuit',          sets:1, reps:'10 min',  note:'Plank, leg raise, crunches, bicycle', isCardio:true},
    {name:'Treadmill',            sets:1, reps:'20 min',  note:'Incline 10, speed 4.5–5', isCardio:true}
  ],
  LOWER: [
    {name:'Squat',                sets:3, reps:'10',      note:'Barbell back squat, depth below parallel'},
    {name:'Leg Extension',        sets:3, reps:'12',      note:'Full extension, squeeze quads'},
    {name:'Leg Press',            sets:3, reps:'12',      note:'Standard width, 160–200 kg range'},
    {name:'Lunges',               sets:3, reps:'12',      note:'Walking lunges, dumbbells 15–20 kg'},
    {name:'Calf Raises',          sets:3, reps:'15',      note:'Standing, full range of motion'},
    {name:'Tibialis Raise',       sets:3, reps:'15',      note:'Shin strength — knee health'}
  ],
  UPPER: [
    {name:'Bench Press',          sets:3, reps:'10–12',   note:'⚡ SUPERSET with Row'},
    {name:'Barbell Row',          sets:3, reps:'10–12',   note:'⚡ SUPERSET with Bench Press'},
    {name:'Shoulder Press',       sets:3, reps:'10–12',   note:'⚡ SUPERSET with Pulldown'},
    {name:'Lat Pulldown',         sets:3, reps:'10–12',   note:'⚡ SUPERSET with Shoulder Press'},
    {name:'Lateral Raise',        sets:3, reps:'12–15',   note:'⚡ SUPERSET with Preacher Curl'},
    {name:'Preacher Curl',        sets:3, reps:'12',      note:'⚡ SUPERSET with Lateral Raise'},
    {name:'Triceps Rope Pulldown',sets:3, reps:'12–15',   note:'⚡ SUPERSET with Face Pull'},
    {name:'Face Pull',            sets:3, reps:'15',      note:'⚡ SUPERSET — shoulder health'},
    {name:'Abs Circuit',          sets:1, reps:'10 min',  note:'Russian twist, cable crunch, plank', isCardio:true},
    {name:'Treadmill',            sets:1, reps:'20 min',  note:'Incline 10, speed 4.5–5', isCardio:true}
  ],
  HIIT: [
    {name:'Burpees',              sets:3, reps:'10–15',   note:'3 rounds circuit — full extension at top'},
    {name:'Jump Squats',          sets:3, reps:'15',      note:'3 rounds circuit — land soft'},
    {name:'Push-ups',             sets:3, reps:'15–20',   note:'3 rounds circuit — chest to floor'},
    {name:'Kettlebell Swings',    sets:3, reps:'20',      note:'3 rounds circuit — hip drive power'},
    {name:'HIIT Treadmill',       sets:1, reps:'20 min',  note:'30s sprint / 30s walk × 10 rounds', isCardio:true}
  ],
  REST: [
    {name:'Light Walk',           sets:1, reps:'20–30 min', note:'Active recovery, easy pace'},
    {name:'Full Body Stretch',    sets:1, reps:'15 min',    note:'Focus on yesterday\'s muscles'},
    {name:'Foam Rolling',         sets:1, reps:'10 min',    note:'Quads, hamstrings, lats, upper back'}
  ]
};

const BASE_BURN = {LEGS:480,PUSH:400,PULL:380,LOWER:460,UPPER:420,HIIT:580,REST:120};

const FOOD_DB = [
  {name:'Chicken Breast (100g)',   cal:165,p:31,  c:0,  f:3.6},
  {name:'Brown Rice (100g cooked)',cal:112,p:2.6, c:24, f:0.9},
  {name:'White Rice (100g cooked)',cal:130,p:2.7, c:28, f:0.3},
  {name:'Eggs (1 whole)',          cal:78, p:6,   c:0.6,f:5},
  {name:'Egg White (1)',           cal:17, p:3.6, c:0.2,f:0.1},
  {name:'Paneer (100g)',           cal:265,p:18,  c:3,  f:20},
  {name:'Dal / Lentils (100g)',    cal:116,p:9,   c:20, f:0.4},
  {name:'Soya Chunks (100g dry)', cal:345,p:52,  c:26, f:0.5},
  {name:'Greek Yogurt (100g)',     cal:59, p:10,  c:3.6,f:0.4},
  {name:'Curd / Dahi (100g)',      cal:98, p:11,  c:3.4,f:4.3},
  {name:'Banana (1 medium)',       cal:89, p:1.1, c:23, f:0.3},
  {name:'Apple (1 medium)',        cal:95, p:0.5, c:25, f:0.3},
  {name:'Oats (100g dry)',         cal:389,p:17,  c:66, f:7},
  {name:'Whey Protein (1 scoop)', cal:120,p:24,  c:3,  f:1.5},
  {name:'Roti / Chapati (1)',      cal:104,p:3,   c:20, f:1.5},
  {name:'Milk (200ml)',            cal:122,p:6.4, c:9.6,f:4.8},
  {name:'Peanut Butter (1 tbsp)', cal:94, p:4,   c:3,  f:8},
  {name:'Almonds (10 nuts)',       cal:69, p:2.5, c:2.4,f:6},
  {name:'Sweet Potato (100g)',     cal:86, p:1.6, c:20, f:0.1},
  {name:'Fish Rohu (100g)',        cal:97, p:17,  c:0,  f:2.8},
  {name:'Broccoli (100g)',         cal:34, p:2.8, c:7,  f:0.4},
  {name:'Spinach (100g)',          cal:23, p:2.9, c:3.6,f:0.4},
  {name:'Chana / Chickpeas (100g)',cal:164,p:9,   c:27, f:2.6},
  {name:'Dosa (1 plain)',          cal:133,p:3,   c:26, f:2},
  {name:'Idli (1)',                cal:39, p:1.9, c:8,  f:0.2},
  {name:'Sambar (100ml)',          cal:55, p:3,   c:8,  f:1},
  {name:'Protein Bar (1)',         cal:200,p:20,  c:22, f:7}
];

// ─── STATE ────────────────────────────────────────
const STATE = {
  currentPage: 'home',
  startDate: null,
  today: new Date().toDateString(),
  logs: {},
  profile: { name:'Athlete', targetCals:2300, targetProtein:200, weightKg:100 },
  session: {
    active:false, split:null, startTime:null, elapsedSeconds:0,
    timerInterval:null, setLogs:{},
    restTimer:{active:false,seconds:0,interval:null,target:90},
    caloriesBurned:0
  }
};

function getStorage(){try{return JSON.parse(localStorage.getItem('fittrack2')||'{}');}catch{return {};}}
function setStorage(d){try{localStorage.setItem('fittrack2',JSON.stringify(d));}catch{}}
function loadState(){const s=getStorage();if(s.startDate)STATE.startDate=s.startDate;if(s.logs)STATE.logs=s.logs;if(s.profile)STATE.profile={...STATE.profile,...s.profile};}
function saveState(){setStorage({startDate:STATE.startDate,logs:STATE.logs,profile:STATE.profile});}
function getTodayLog(){if(!STATE.logs[STATE.today])STATE.logs[STATE.today]={done:[],calories:[],water:0,weight:null,sessions:[]};if(!STATE.logs[STATE.today].sessions)STATE.logs[STATE.today].sessions=[];return STATE.logs[STATE.today];}
function getDayNumber(){if(!STATE.startDate)return 1;const diff=Math.floor((new Date()-new Date(STATE.startDate))/86400000)+1;return Math.min(Math.max(diff,1),100);}
function getDaySplit(n){return DAY_ROTATION[(n-1)%7];}
function getTotalConsumed(){return getTodayLog().calories.reduce((s,f)=>s+f.cal,0);}
function getTotalProtein(){return getTodayLog().calories.reduce((s,f)=>s+(f.p||0),0);}

function getPrevLoad(exName){
  const dates=Object.keys(STATE.logs).filter(d=>d!==STATE.today).sort((a,b)=>new Date(b)-new Date(a));
  for(const d of dates){
    const sessions=STATE.logs[d].sessions||[];
    for(const sess of sessions){
      if(!sess.setLogs)continue;
      for(const sets of Object.values(sess.setLogs)){
        if(sets[0]&&sets[0].exName===exName){
          const done=sets.filter(s=>s.done&&(s.weight||s.weight===0));
          if(done.length>0){const maxW=Math.max(...done.map(s=>parseFloat(s.weight)||0));const lastRep=done[done.length-1].reps;return {weight:maxW,reps:lastRep,date:d};}
        }
      }
    }
  }
  return null;
}

function getStreak(){let s=0;const now=new Date();for(let i=0;i<30;i++){const d=new Date(now);d.setDate(d.getDate()-i);const log=STATE.logs[d.toDateString()];if(log&&(log.sessions?.length>0||log.calories?.length>0))s++;else if(i>0)break;}return s;}

// ─── SESSION ──────────────────────────────────────
function startWorkoutSession(){
  if(STATE.session.active){navigate('workout');return;}
  const split=getDaySplit(getDayNumber());
  const setLogs={};
  WORKOUTS[split].forEach((ex,i)=>{
    setLogs[i]=Array.from({length:ex.isCardio?1:ex.sets},(_,si)=>({exName:ex.name,setNum:si+1,weight:'',reps:'',done:false,ts:null}));
  });
  STATE.session={active:true,split,startTime:Date.now(),elapsedSeconds:0,timerInterval:setInterval(tickWorkout,1000),setLogs,restTimer:{active:false,seconds:0,interval:null,target:90},caloriesBurned:0};
  navigate('workout');
}

function tickWorkout(){
  STATE.session.elapsedSeconds++;
  const hrs=STATE.session.elapsedSeconds/3600;
  STATE.session.caloriesBurned=Math.round(5*(STATE.profile.weightKg||100)*hrs);
  const te=document.getElementById('wt-val');if(te)te.textContent=fmtDur(STATE.session.elapsedSeconds);
  const cb=document.getElementById('live-burn');if(cb)cb.textContent=STATE.session.caloriesBurned+' kcal';
}

function tickRest(){
  STATE.session.restTimer.seconds++;
  const rem=Math.max(0,STATE.session.restTimer.target-STATE.session.restTimer.seconds);
  const el=document.getElementById('rest-val');if(el)el.textContent=rem>0?fmtDur(rem):'GO! 🔥';
  const r=40,circ=2*Math.PI*r;
  const ring=document.getElementById('rest-ring');
  if(ring)ring.style.strokeDashoffset=circ*(rem/STATE.session.restTimer.target);
  if(rem<=0){clearInterval(STATE.session.restTimer.interval);STATE.session.restTimer.active=false;if(navigator.vibrate)navigator.vibrate([300,100,300]);showToast('Rest over — GO! 🔥');}
}

function startRestTimer(sec){
  clearInterval(STATE.session.restTimer.interval);
  STATE.session.restTimer={active:true,seconds:0,target:sec,interval:setInterval(tickRest,1000)};
  const panel=document.getElementById('rest-panel');
  if(panel)panel.style.display='block';
  // re-init the ring
  const r=40,circ=2*Math.PI*r;
  const ring=document.getElementById('rest-ring');
  if(ring)ring.style.strokeDashoffset=0;
  const el=document.getElementById('rest-val');
  if(el)el.textContent=fmtDur(sec);
}

function stopRestTimer(){
  clearInterval(STATE.session.restTimer.interval);
  STATE.session.restTimer.active=false;
  const panel=document.getElementById('rest-panel');
  if(panel)panel.style.display='none';
}

function finishWorkoutSession(){
  if(!STATE.session.active)return;
  clearInterval(STATE.session.timerInterval);
  clearInterval(STATE.session.restTimer.interval);
  const log=getTodayLog();
  log.sessions.push({split:STATE.session.split,date:STATE.today,duration:STATE.session.elapsedSeconds,caloriesBurned:STATE.session.caloriesBurned,setLogs:JSON.parse(JSON.stringify(STATE.session.setLogs))});
  const dur=STATE.session.elapsedSeconds;const burn=STATE.session.caloriesBurned;
  STATE.session={active:false,split:null,startTime:null,elapsedSeconds:0,timerInterval:null,setLogs:{},restTimer:{active:false,seconds:0,interval:null,target:90},caloriesBurned:0};
  saveState();showToast('Workout done! '+fmtDur(dur)+' · '+burn+' kcal 🔥');navigate('home');
}

function logSet(i,si,field,value){const s=STATE.session.setLogs[i]?.[si];if(s)s[field]=value;}

function completeSet(i,si){
  const set=STATE.session.setLogs[i]?.[si];if(!set)return;
  set.done=!set.done;set.ts=set.done?Date.now():null;
  const row=document.getElementById('set-row-'+i+'-'+si);
  if(row)row.classList.toggle('set-done',set.done);
  const btn=document.getElementById('set-btn-'+i+'-'+si);
  if(btn){btn.textContent=set.done?'✓':'○';btn.classList.toggle('set-done-active',set.done);}
  const allDone=STATE.session.setLogs[i].every(s=>s.done);
  const card=document.getElementById('excard-'+i);
  if(card)card.classList.toggle('ex-done',allDone);
  const badge=document.getElementById('ex-badge-'+i);
  if(badge)badge.style.display=allDone?'flex':'none';
  // update progress bar
  const totalSets=Object.values(STATE.session.setLogs).flat().length;
  const doneSets=Object.values(STATE.session.setLogs).flat().filter(s=>s.done).length;
  const pct=Math.round((doneSets/totalSets)*100);
  const pb=document.getElementById('sess-prog');if(pb)pb.style.width=pct+'%';
  const pl=document.getElementById('sess-prog-label');if(pl)pl.textContent=doneSets+'/'+totalSets+' sets · '+pct+'%';
  if(set.done)startRestTimer(allDone?90:60);
}

function fmtDur(sec){const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;return h>0?`${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}

// ─── RENDER ───────────────────────────────────────
function $(id){return document.getElementById(id);}

function navigate(page){
  STATE.currentPage=page;
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  const pc=$('page-content');if(!pc)return;
  const map={home:renderHome,workout:renderWorkout,calories:renderCalories,progress:renderProgress,export:renderExport};
  pc.innerHTML=(map[page]||renderHome)();
  if(page==='export')setTimeout(updateExportPreview,30);
}

function renderApp(){
  loadState();if(!STATE.startDate)STATE.startDate=new Date().toDateString();
  document.getElementById('app').innerHTML=`<div id="shell"><div id="page-content"></div>
  <nav id="bottom-nav">
    <button class="nav-btn" data-page="home" onclick="navigate('home')"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></button>
    <button class="nav-btn" data-page="workout" onclick="navigate('workout')"><span class="nav-icon">💪</span><span class="nav-label">Workout</span></button>
    <button class="nav-btn" data-page="calories" onclick="navigate('calories')"><span class="nav-icon">🍽️</span><span class="nav-label">Calories</span></button>
    <button class="nav-btn" data-page="progress" onclick="navigate('progress')"><span class="nav-icon">📈</span><span class="nav-label">Progress</span></button>
    <button class="nav-btn" data-page="export" onclick="navigate('export')"><span class="nav-icon">📤</span><span class="nav-label">Export</span></button>
  </nav></div>`;
  navigate('home');
}

// ─── HOME ─────────────────────────────────────────
function renderHome(){
  const dayNum=getDayNumber(),split=getDaySplit(dayNum),meta=SPLIT_META[split],log=getTodayLog();
  const consumed=getTotalConsumed(),protein=getTotalProtein();
  const burned=(log.sessions||[]).reduce((s,sess)=>s+(sess.caloriesBurned||0),0);
  const net=consumed-burned,progress=Math.round((dayNum/100)*100);
  const dateStr=new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'});
  return `<div class="page home-page">
  <div class="home-header"><div><div class="greeting-text">Day <span class="day-num">${dayNum}</span> of 100</div><div class="date-str">${dateStr}</div></div><div class="streak-badge">🔥 ${getStreak()} day streak</div></div>
  <div class="today-card" style="--split-color:${meta.color}">
    <div class="today-split-label">TODAY'S SPLIT</div>
    <div class="today-split-name">${meta.emoji} ${meta.label}</div>
    <div class="today-split-sub">${meta.sub}</div>
    <div style="display:flex;gap:10px;margin-top:14px">
      ${STATE.session.active?`<button class="btn-primary" style="flex:1" onclick="navigate('workout')">Resume Workout →</button><button class="btn-secondary" onclick="finishWorkoutSession()">Finish ✓</button>`:`<button class="btn-primary" style="flex:1" onclick="startWorkoutSession()">Start Workout →</button>`}
    </div>
    ${(log.sessions||[]).length>0?`<div class="session-done-badge">✓ ${log.sessions.length} session(s) today · ${burned} kcal burned</div>`:''}
  </div>
  <div class="stats-grid">
    <div class="stat-card"><div class="stat-icon">🍽️</div><div class="stat-val">${consumed}</div><div class="stat-label">kcal eaten</div><div class="stat-sub">target ${STATE.profile.targetCals}</div></div>
    <div class="stat-card"><div class="stat-icon">🔥</div><div class="stat-val">${burned}</div><div class="stat-label">kcal burned</div><div class="stat-sub">from workouts</div></div>
    <div class="stat-card ${net<=STATE.profile.targetCals?'good':'warn'}"><div class="stat-icon">⚖️</div><div class="stat-val">${net>0?'+':''}${net}</div><div class="stat-label">net calories</div><div class="stat-sub">${STATE.profile.targetCals-consumed>0?(STATE.profile.targetCals-consumed)+' left':Math.abs(STATE.profile.targetCals-consumed)+' over'}</div></div>
    <div class="stat-card"><div class="stat-icon">🥩</div><div class="stat-val">${Math.round(protein)}g</div><div class="stat-label">protein</div><div class="stat-sub">target ${STATE.profile.targetProtein}g</div></div>
  </div>
  <div class="section-title">100-Day Progress</div>
  <div class="overall-progress"><div class="overall-bar"><div class="overall-fill" style="width:${progress}%"></div><div class="overall-label">${progress}% complete</div></div></div>
  <div class="section-title">Water & Weight</div>
  <div class="water-weight-row">
    <div class="water-card"><div class="ww-label">💧 Water</div><div class="water-glasses">${[1,2,3,4,5,6,7,8].map(i=>`<button class="glass-btn ${(log.water||0)>=i?'filled':''}" onclick="logWater(${i})">${(log.water||0)>=i?'💧':'○'}</button>`).join('')}</div><div class="ww-sub">${log.water||0}/8 glasses</div></div>
    <div class="weight-card"><div class="ww-label">⚖️ Body Weight</div><input type="number" class="weight-input" placeholder="${log.weight||'kg'}" value="${log.weight||''}" onchange="logWeight(this.value)" step="0.1"><div class="ww-sub">log today's weight</div></div>
  </div>
  <div class="upcoming-section"><div class="section-title">Upcoming</div><div class="upcoming-list">${[1,2,3].map(i=>{const d=dayNum+i;if(d>100)return '';const s=getDaySplit(d),m=SPLIT_META[s];return `<div class="upcoming-item" style="border-left-color:${m.color}"><span class="upcoming-day">Day ${d}</span><span class="upcoming-split">${m.emoji} ${m.label}</span></div>`;}).join('')}</div></div>
  </div>`;
}
function logWater(g){getTodayLog().water=g;saveState();navigate('home');}
function logWeight(v){getTodayLog().weight=parseFloat(v);saveState();}

// ─── WORKOUT ──────────────────────────────────────
function renderWorkout(){
  if(!STATE.session.active){
    const split=getDaySplit(getDayNumber()),meta=SPLIT_META[split];
    return `<div class="page workout-page">
    <div class="page-header" style="--split-color:${meta.color}"><div class="ph-day">${meta.emoji} ${meta.label}</div><div class="ph-sub">${meta.sub}</div></div>
    <div style="padding:40px 20px;text-align:center">
      <div style="font-size:56px;margin-bottom:16px">${meta.emoji}</div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:30px;color:var(--text);margin-bottom:8px">Ready to Train?</div>
      <div style="color:var(--muted);font-size:13px;margin-bottom:8px">${WORKOUTS[split].length} exercises · ~${BASE_BURN[split]} kcal</div>
      <div style="color:var(--muted);font-size:12px;margin-bottom:28px">Session timer starts when you begin</div>
      <button class="btn-primary" onclick="startWorkoutSession()">⏱ Start Session</button>
    </div></div>`;
  }
  const split=STATE.session.split,meta=SPLIT_META[split],exercises=WORKOUTS[split];
  const totalSets=Object.values(STATE.session.setLogs).flat().length;
  const doneSets=Object.values(STATE.session.setLogs).flat().filter(s=>s.done).length;
  const pct=Math.round((doneSets/totalSets)*100);
  const rest=STATE.session.restTimer;
  const restDisp=rest.active?fmtDur(Math.max(0,rest.target-rest.seconds)):'—';
  const r=40,circ=2*Math.PI*r;

  return `<div class="page workout-page">
  <!-- Sticky header -->
  <div class="session-header">
    <div class="session-block"><div class="sess-label">TIME</div><div class="sess-val" id="wt-val">${fmtDur(STATE.session.elapsedSeconds)}</div></div>
    <div class="session-block sess-progress-block">
      <div class="sess-prog-bar"><div class="sess-prog-fill" id="sess-prog" style="width:${pct}%"></div></div>
      <div class="sess-prog-label" id="sess-prog-label">${doneSets}/${totalSets} sets · ${pct}%</div>
    </div>
    <div class="session-block"><div class="sess-label">BURNED</div><div class="sess-val sess-burn" id="live-burn">${STATE.session.caloriesBurned} kcal</div></div>
  </div>

  <!-- Rest Timer Panel -->
  <div id="rest-panel" class="rest-panel" style="display:${rest.active?'block':'none'}">
    <div class="rest-inner">
      <div class="rest-ring-wrap">
        <svg class="rest-svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="${r}" fill="none" stroke="#1a2030" stroke-width="8"/>
          <circle id="rest-ring" cx="50" cy="50" r="${r}" fill="none" stroke="#c8ff00" stroke-width="8"
            stroke-dasharray="${circ}" stroke-dashoffset="${circ*(Math.max(0,rest.target-rest.seconds)/rest.target)}"
            stroke-linecap="round" transform="rotate(-90 50 50)" style="transition:stroke-dashoffset 0.9s linear"/>
        </svg>
        <div class="rest-ring-center"><div class="rest-label-sm">REST</div><div class="rest-count" id="rest-val">${restDisp}</div></div>
      </div>
      <div class="rest-btns">
        <button class="rest-btn" onclick="startRestTimer(60)">60s</button>
        <button class="rest-btn" onclick="startRestTimer(90)">90s</button>
        <button class="rest-btn" onclick="startRestTimer(120)">2m</button>
        <button class="rest-skip" onclick="stopRestTimer()">Skip →</button>
      </div>
    </div>
  </div>

  <!-- Exercises -->
  <div class="exercises-list">
    ${exercises.map((ex,i)=>renderExCard(ex,i)).join('')}
  </div>
  <div class="workout-footer"><button class="btn-finish" onclick="confirmFinish()">🏁 Finish Workout</button></div>
  </div>`;
}

function renderExCard(ex,i){
  const sets=STATE.session.setLogs[i]||[];
  const allDone=sets.length>0&&sets.every(s=>s.done);
  const prev=getPrevLoad(ex.name);
  return `<div class="exercise-card ${allDone?'ex-done':''}" id="excard-${i}">
  <div class="ex-card-header">
    <div class="ex-card-left">
      <div class="ex-card-num">${i+1}</div>
      <div>
        <div class="ex-card-name">${ex.name}</div>
        <div class="ex-card-scheme">${ex.sets} × ${ex.reps}</div>
      </div>
    </div>
    <div class="ex-done-badge" id="ex-badge-${i}" style="display:${allDone?'flex':'none'}">✓ Done</div>
  </div>
  ${ex.note?`<div class="ex-card-note">${ex.note}</div>`:''}
  <div class="ex-prev-load ${prev?'':'no-prev'}">
    ${prev?`📊 Last: <strong>${prev.weight}kg × ${prev.reps}</strong> — ${new Date(prev.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}`:'📊 No previous data yet'}
  </div>
  ${ex.isCardio?`<div class="cardio-note-card">🏃 Cardio / Timed — mark as done when complete<button class="set-done-btn ${sets[0]?.done?'set-done-active':''}" style="margin-left:12px" onclick="completeSet(${i},0)">${sets[0]?.done?'✓ Done':'Mark Done'}</button></div>`:`
  <div class="set-table">
    <div class="set-table-head"><span>SET</span><span>KG</span><span>REPS</span><span>✓</span></div>
    ${sets.map((set,si)=>`<div class="set-row ${set.done?'set-done':''}" id="set-row-${i}-${si}">
      <span class="set-num">${si+1}</span>
      <input type="number" class="set-input" placeholder="${prev?prev.weight:'0'}" value="${set.weight}" step="0.5" onchange="logSet(${i},${si},'weight',this.value)" ${set.done?'readonly':''}>
      <input type="number" class="set-input" placeholder="${ex.reps.toString().split('–')[0]}" value="${set.reps}" onchange="logSet(${i},${si},'reps',this.value)" ${set.done?'readonly':''}>
      <button class="set-done-btn ${set.done?'set-done-active':''}" id="set-btn-${i}-${si}" onclick="completeSet(${i},${si})">${set.done?'✓':'○'}</button>
    </div>`).join('')}
  </div>`}
  </div>`;
}

function confirmFinish(){
  const doneSets=Object.values(STATE.session.setLogs).flat().filter(s=>s.done).length;
  const totalSets=Object.values(STATE.session.setLogs).flat().length;
  if(doneSets<totalSets*0.5){if(!confirm(`Only ${doneSets}/${totalSets} sets done. Finish anyway?`))return;}
  finishWorkoutSession();
}

// ─── CALORIES ─────────────────────────────────────
function renderCalories(){
  const log=getTodayLog(),consumed=getTotalConsumed(),protein=getTotalProtein();
  const carbs=log.calories.reduce((s,f)=>s+(f.c||0),0),fats=log.calories.reduce((s,f)=>s+(f.f||0),0);
  const remaining=STATE.profile.targetCals-consumed,pct=Math.min(Math.round((consumed/STATE.profile.targetCals)*100),100);
  const r=52,circ=2*Math.PI*r;
  return `<div class="page calories-page">
  <div class="page-header"><div class="ph-day">Calorie Tracker</div><div class="ph-sub">Target: ${STATE.profile.targetCals} kcal · ${STATE.profile.targetProtein}g protein</div></div>
  <div class="calorie-ring-section">
    <div class="calorie-ring"><svg viewBox="0 0 120 120" width="110" height="110"><circle cx="60" cy="60" r="${r}" fill="none" stroke="#1a2030" stroke-width="12"/><circle cx="60" cy="60" r="${r}" fill="none" stroke="#c8ff00" stroke-width="12" stroke-dasharray="${circ}" stroke-dashoffset="${circ*(1-pct/100)}" stroke-linecap="round" transform="rotate(-90 60 60)"/></svg><div class="ring-center"><div class="ring-val">${consumed}</div><div class="ring-label">eaten</div></div></div>
    <div class="macro-summary">
      <div class="macro-item"><span class="macro-dot" style="background:#00cfff"></span><span>${Math.round(protein)}g Protein</span></div>
      <div class="macro-item"><span class="macro-dot" style="background:#c8ff00"></span><span>${Math.round(carbs)}g Carbs</span></div>
      <div class="macro-item"><span class="macro-dot" style="background:#ff5e3a"></span><span>${Math.round(fats)}g Fats</span></div>
      <div class="macro-item ${remaining<0?'over':'remaining'}"><span>→</span><span>${remaining>=0?remaining+' kcal left':Math.abs(remaining)+' kcal over'}</span></div>
    </div>
  </div>
  <div class="food-search-section"><div class="section-title">Add Food</div>
    <input type="text" id="food-search" class="food-search-input" placeholder="Search food (chicken, rice, dal...)" oninput="renderFoodSearch()" autocomplete="off">
    <div id="food-results"></div>
  </div>
  <div class="custom-food-section"><div class="section-title">Add Custom</div>
    <div class="custom-food-form">
      <input type="text" id="cf-name" placeholder="Food name" class="cf-input">
      <input type="number" id="cf-cal" placeholder="Calories" class="cf-input small">
      <input type="number" id="cf-p" placeholder="Protein g" class="cf-input small">
      <input type="number" id="cf-c" placeholder="Carbs g" class="cf-input small">
      <input type="number" id="cf-f" placeholder="Fat g" class="cf-input small">
      <button class="btn-primary" onclick="addCustomFood()" style="width:100%;grid-column:1/-1">Add to Log</button>
    </div>
  </div>
  <div class="food-log-section"><div class="section-title">Today's Food Log</div>
    ${log.calories.length===0?'<div class="empty-log" style="padding:0 16px 16px">No food logged yet</div>':log.calories.map((f,i)=>`<div class="food-log-item"><div class="food-log-info"><div class="food-log-name">${f.name}</div><div class="food-log-macros">${f.p||0}g P · ${f.c||0}g C · ${f.f||0}g F</div></div><div class="food-log-cal">${f.cal} kcal</div><button class="food-remove-btn" onclick="removeFood(${i})">✕</button></div>`).join('')}
  </div></div>`;
}
function renderFoodSearch(){const q=$('food-search').value.toLowerCase().trim();const res=$('food-results');if(!q){res.innerHTML='';return;}const m=FOOD_DB.filter(f=>f.name.toLowerCase().includes(q)).slice(0,6);res.innerHTML=m.map(f=>`<div class="food-result-item" onclick="addFood('${f.name}',${f.cal},${f.p},${f.c},${f.f})"><span class="fr-name">${f.name}</span><span class="fr-cal">${f.cal} kcal</span></div>`).join('')||'<div class="no-results">No matches</div>';}
function addFood(name,cal,p,c,f){getTodayLog().calories.push({name,cal,p,c,f});saveState();$('food-search').value='';$('food-results').innerHTML='';navigate('calories');showToast(name+' added!');}
function addCustomFood(){const name=$('cf-name').value.trim();const cal=parseInt($('cf-cal').value)||0;const p=parseFloat($('cf-p').value)||0;const c=parseFloat($('cf-c').value)||0;const f=parseFloat($('cf-f').value)||0;if(!name||!cal){showToast('Enter name and calories',true);return;}getTodayLog().calories.push({name,cal,p,c,f});saveState();navigate('calories');showToast(name+' added!');}
function removeFood(idx){getTodayLog().calories.splice(idx,1);saveState();navigate('calories');}

// ─── PROGRESS ─────────────────────────────────────
function renderProgress(){
  const dayNum=getDayNumber();
  const allLogs=Object.entries(STATE.logs).sort(([a],[b])=>new Date(a)-new Date(b));
  const totalWorkouts=allLogs.filter(([,l])=>l.sessions?.length>0).length;
  const weights=allLogs.filter(([,l])=>l.weight).slice(-10);
  const weekData=[];const now=new Date();
  for(let i=6;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);const k=d.toDateString();const log=STATE.logs[k]||{};weekData.push({label:d.toLocaleDateString('en-IN',{weekday:'short'}),cal:(log.calories||[]).reduce((s,f)=>s+f.cal,0),burned:(log.sessions||[]).reduce((s,sess)=>s+(sess.caloriesBurned||0),0),workouts:(log.sessions||[]).length});}
  const maxCal=Math.max(...weekData.map(d=>d.cal),STATE.profile.targetCals,1);
  return `<div class="page progress-page">
  <div class="page-header"><div class="ph-day">Progress</div><div class="ph-sub">Day ${dayNum} of 100</div></div>
  <div class="progress-stats">
    <div class="prog-stat"><div class="ps-val">${dayNum}</div><div class="ps-label">Day</div></div>
    <div class="prog-stat"><div class="ps-val">${totalWorkouts}</div><div class="ps-label">Sessions</div></div>
    <div class="prog-stat"><div class="ps-val">${getStreak()}</div><div class="ps-label">Streak 🔥</div></div>
    <div class="prog-stat"><div class="ps-val">${allLogs.filter(([,l])=>l.calories?.length>0).length}</div><div class="ps-label">Days Logged</div></div>
  </div>
  <div class="section-title">Weekly Calories</div>
  <div class="chart-container">
    <div class="bar-chart">${weekData.map(d=>`<div class="bar-col"><div class="bar-wrap"><div class="bar-fill ${d.cal>STATE.profile.targetCals?'over':'under'}" style="height:${Math.round((d.cal/maxCal)*100)}%">${d.cal>0?`<span class="bar-val">${d.cal}</span>`:''}</div></div><div class="bar-label">${d.label}</div></div>`).join('')}</div>
    <div class="target-line" style="bottom:${Math.round((STATE.profile.targetCals/maxCal)*100)}%"><span class="target-label">Target</span></div>
  </div>
  <div class="section-title">Weight History</div>
  ${weights.length===0?'<div class="empty-log" style="padding:0 16px">No weight logged yet</div>':`<div class="weight-list">${weights.map(([date,log])=>`<div class="weight-entry"><span class="we-date">${new Date(date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span><span class="we-weight">${log.weight} kg</span></div>`).join('')}</div>`}
  <div class="section-title">Profile</div>
  <div class="profile-form">
    <label class="pf-label">Name</label><input class="pf-input" id="pf-name" value="${STATE.profile.name}">
    <label class="pf-label">Body Weight (kg)</label><input class="pf-input" id="pf-bw" type="number" value="${STATE.profile.weightKg||100}">
    <label class="pf-label">Daily Calorie Target (kcal)</label><input class="pf-input" id="pf-cals" type="number" value="${STATE.profile.targetCals}">
    <label class="pf-label">Daily Protein Target (g)</label><input class="pf-input" id="pf-prot" type="number" value="${STATE.profile.targetProtein}">
    <label class="pf-label">Program Start Date</label><input class="pf-input" id="pf-start" type="date" value="${STATE.startDate?new Date(STATE.startDate).toISOString().split('T')[0]:''}">
    <button class="btn-primary" onclick="saveProfile()" style="margin-top:8px">Save Profile</button>
  </div></div>`;
}
function saveProfile(){STATE.profile.name=$('pf-name').value||'Athlete';STATE.profile.weightKg=parseFloat($('pf-bw').value)||100;STATE.profile.targetCals=parseInt($('pf-cals').value)||2300;STATE.profile.targetProtein=parseInt($('pf-prot').value)||200;const sd=$('pf-start').value;if(sd)STATE.startDate=new Date(sd).toDateString();saveState();showToast('Profile saved!');navigate('progress');}

// ─── EXPORT ───────────────────────────────────────
let exportFilter='weekly';
function renderExport(){
  const now=new Date(),weekAgo=new Date(now);weekAgo.setDate(weekAgo.getDate()-6);
  return `<div class="page export-page">
  <div class="page-header"><div class="ph-day">Export Data</div><div class="ph-sub">Workouts · Calories · Calorie Burn</div></div>
  <div style="padding:0 16px">
    <div class="section-title">Filter Period</div>
    <div class="filter-btn-row">
      <button class="filter-btn" id="f-daily" onclick="setFilter('daily')">Daily</button>
      <button class="filter-btn active" id="f-weekly" onclick="setFilter('weekly')">Weekly</button>
      <button class="filter-btn" id="f-monthly" onclick="setFilter('monthly')">Monthly</button>
    </div>
    <div class="filter-date-row">
      <div><label class="pf-label">From</label><input type="date" class="pf-input" id="exp-from" value="${weekAgo.toISOString().split('T')[0]}" onchange="updateExportPreview()"></div>
      <div><label class="pf-label">To</label><input type="date" class="pf-input" id="exp-to" value="${now.toISOString().split('T')[0]}" onchange="updateExportPreview()"></div>
    </div>
  </div>
  <div id="export-preview" style="padding:0 16px"></div>
  <div style="padding:16px;display:grid;gap:10px">
    <button class="btn-primary" onclick="exportCSV()">📊 Export as CSV</button>
    <button class="btn-primary" style="background:var(--surface);color:var(--text);border:1px solid var(--border)" onclick="exportJSON()">📄 Export as JSON</button>
    <button class="btn-primary" style="background:var(--surface);color:var(--text);border:1px solid var(--border)" onclick="shareText()">📤 Share as Text</button>
  </div></div>`;
}

function setFilter(f){
  exportFilter=f;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  const btn=$('f-'+f);if(btn)btn.classList.add('active');
  const now=new Date(),from=$('exp-from');if(!from)return;
  if(f==='daily'){from.value=now.toISOString().split('T')[0];}
  else if(f==='weekly'){const d=new Date(now);d.setDate(d.getDate()-6);from.value=d.toISOString().split('T')[0];}
  else if(f==='monthly'){const d=new Date(now);d.setDate(1);from.value=d.toISOString().split('T')[0];}
  updateExportPreview();
}

function getFilteredLogs(){
  const fromEl=$('exp-from'),toEl=$('exp-to');
  const from=new Date(fromEl?.value||new Date()),to=new Date(toEl?.value||new Date());
  to.setHours(23,59,59);
  return Object.entries(STATE.logs).filter(([d])=>{const dt=new Date(d);return dt>=from&&dt<=to;}).sort(([a],[b])=>new Date(a)-new Date(b));
}

function updateExportPreview(){
  const preview=$('export-preview');if(!preview)return;
  const logs=getFilteredLogs();
  if(logs.length===0){preview.innerHTML='<div class="empty-log" style="padding:12px 0">No data in this date range</div>';return;}
  let totCal=0,totBurn=0,totSess=0;
  const rows=logs.map(([date,log])=>{
    const cal=(log.calories||[]).reduce((s,f)=>s+f.cal,0);
    const burn=(log.sessions||[]).reduce((s,sess)=>s+(sess.caloriesBurned||0),0);
    const sess=log.sessions?.length||0;
    totCal+=cal;totBurn+=burn;totSess+=sess;
    const splitStr=(log.sessions||[]).map(s=>s.split).join(', ')||'—';
    const dur=(log.sessions||[]).reduce((s,sess)=>s+Math.round((sess.duration||0)/60),0);
    return `<div class="export-row">
      <div class="export-date">${new Date(date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
      <div class="export-cells">
        <div class="ec"><span class="ec-l">Split</span><span class="ec-v">${splitStr}</span></div>
        <div class="ec"><span class="ec-l">Duration</span><span class="ec-v">${dur}min</span></div>
        <div class="ec"><span class="ec-l">Eaten</span><span class="ec-v">${cal} kcal</span></div>
        <div class="ec"><span class="ec-l">Burned</span><span class="ec-v" style="color:#c8ff00">${burn} kcal</span></div>
        <div class="ec"><span class="ec-l">Net</span><span class="ec-v ${cal-burn<=STATE.profile.targetCals?'ec-good':'ec-warn'}">${cal-burn}</span></div>
      </div>
    </div>`;
  }).join('');
  preview.innerHTML=`<div class="export-summary">
    <div class="exp-s"><div class="exp-sv">${logs.length}</div><div class="exp-sl">Days</div></div>
    <div class="exp-s"><div class="exp-sv">${totSess}</div><div class="exp-sl">Sessions</div></div>
    <div class="exp-s"><div class="exp-sv">${totBurn}</div><div class="exp-sl">kcal Burned</div></div>
    <div class="exp-s"><div class="exp-sv">${totCal}</div><div class="exp-sl">kcal Eaten</div></div>
  </div><div class="export-rows">${rows}</div>`;
}

function buildData(){return getFilteredLogs().map(([date,log])=>({date,split:(log.sessions||[]).map(s=>s.split).join(', ')||'',duration_min:(log.sessions||[]).reduce((s,sess)=>s+Math.round((sess.duration||0)/60),0),calories_eaten:(log.calories||[]).reduce((s,f)=>s+f.cal,0),protein_g:Math.round((log.calories||[]).reduce((s,f)=>s+(f.p||0),0)),calories_burned:(log.sessions||[]).reduce((s,sess)=>s+(sess.caloriesBurned||0),0),water_glasses:log.water||0,body_weight_kg:log.weight||'',exercises:(log.sessions||[]).flatMap(sess=>Object.values(sess.setLogs||{}).map(sets=>({exercise:sets[0]?.exName||'',sets:sets.filter(s=>s.done).map(s=>({weight:s.weight,reps:s.reps}))})))}));}

function exportCSV(){
  const data=buildData();if(!data.length){showToast('No data to export',true);return;}
  const headers=['Date','Split','Duration(min)','Calories Eaten','Protein(g)','Calories Burned','Water Glasses','Body Weight(kg)'];
  const csv=[headers.join(','),...data.map(d=>[d.date,d.split,d.duration_min,d.calories_eaten,d.protein_g,d.calories_burned,d.water_glasses,d.body_weight_kg].join(','))].join('\n');
  dlFile(csv,`fittrack_${exportFilter}_${new Date().toISOString().split('T')[0]}.csv`,'text/csv');showToast('CSV exported!');
}
function exportJSON(){const data=buildData();if(!data.length){showToast('No data',true);return;}dlFile(JSON.stringify(data,null,2),`fittrack_${exportFilter}_${new Date().toISOString().split('T')[0]}.json`,'application/json');showToast('JSON exported!');}
function shareText(){const data=buildData();if(!data.length){showToast('No data',true);return;}const text=data.map(d=>`📅 ${d.date}\n💪 ${d.split||'Rest'} · ${d.duration_min}min\n🍽️ ${d.calories_eaten} kcal eaten\n🔥 ${d.calories_burned} kcal burned\n🥩 Protein: ${d.protein_g}g\n`).join('\n');if(navigator.share)navigator.share({title:'FitTrack Export',text});else{navigator.clipboard?.writeText(text);showToast('Copied to clipboard!');}}
function dlFile(content,filename,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);}

// ─── TOAST & INIT ─────────────────────────────────
function showToast(msg,isError=false){let t=$('toast');if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}t.textContent=msg;t.className='toast '+(isError?'toast-error':'toast-ok');t.style.opacity='1';clearTimeout(t._to);t._to=setTimeout(()=>{t.style.opacity='0';},2500);}
window.onload=()=>{if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});renderApp();};
