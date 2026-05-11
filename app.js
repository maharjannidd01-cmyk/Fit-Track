/* ═══════════════════════════════════════════════
   FITTRACK PRO — app.js
   Clean rewrite: proper layout, past edit, manual day
═══════════════════════════════════════════════ */

// ── DATA ─────────────────────────────────────────
const ROTATION = ['LEGS','PUSH','PULL','LOWER','UPPER','HIIT','REST'];

const META = {
  LEGS:  {label:'Legs',        full:'Hamstring Focus',  emoji:'🦵', color:'#b57bff', cls:'legs'},
  PUSH:  {label:'Push',        full:'Chest · Shoulders · Triceps', emoji:'💪', color:'#ff6b3e', cls:'push'},
  PULL:  {label:'Pull',        full:'Back · Biceps · Abs',         emoji:'🔙', color:'#3ecfff', cls:'pull'},
  LOWER: {label:'Lower',       full:'Quad Focus',       emoji:'⬇️', color:'#3effa0', cls:'lower'},
  UPPER: {label:'Upper',       full:'Superset Day',     emoji:'🏋️', color:'#ffd93e', cls:'upper'},
  HIIT:  {label:'HIIT',        full:'Full Body Circuit', emoji:'🔥', color:'#ff4f4f', cls:'hiit'},
  REST:  {label:'Rest',        full:'Recovery Day',     emoji:'😴', color:'#888',    cls:'rest'},
};

const PLANS = {
  LEGS: [
    {name:'Standalone Cycling',   sets:1, reps:'5 min',   cardio:true,  note:'Warm-up — low resistance'},
    {name:'Sumo Squat',           sets:3, reps:'8–12',    note:'Wide stance, toes out 45°'},
    {name:'RDL',                  sets:3, reps:'12',      note:'Hinge at hips, feel hamstring stretch'},
    {name:'Leg Curl',             sets:3, reps:'12',      note:'Full range, slow eccentric'},
    {name:'Wide Leg Press',       sets:3, reps:'12',      note:'Feet high + wide = glute emphasis'},
    {name:'Calf Raises',          sets:4, reps:'15',      note:'Full stretch, pause at top'},
    {name:'Treadmill',            sets:1, reps:'15 min',  cardio:true,  note:'Incline 10, speed 4.5–5'},
  ],
  PUSH: [
    {name:'Incline Bench Press',  sets:3, reps:'10–12',   note:'Tempo 3-1-1 · ⚠️ shoulder-safe angle'},
    {name:'Dumbbell Bench Press', sets:3, reps:'12',      note:'Full stretch at bottom'},
    {name:'Pec Dec',              sets:3, reps:'12–15',   note:'Peak contraction squeeze'},
    {name:'Shoulder Press',       sets:3, reps:'8–10',    note:'Dumbbells preferred — shoulder history'},
    {name:'Lateral Raise',        sets:3, reps:'12–15',   note:'Slow eccentric 3 sec down'},
    {name:'Triceps Pushdown',     sets:3, reps:'12–15',   note:'Elbows fixed, squeeze at bottom'},
    {name:'Overhead Extension',   sets:3, reps:'12',      note:'Elbows in, control eccentric'},
    {name:'Push-up',              sets:3, reps:'12',      note:'Full range, chest to floor'},
    {name:'Treadmill',            sets:1, reps:'20 min',  cardio:true,  note:'Incline 10, speed 4.5–5'},
  ],
  PULL: [
    {name:'Lat Pulldown',         sets:3, reps:'10–12',   note:'Wide grip, full stretch at top'},
    {name:'T-Bar Row',            sets:3, reps:'10–12',   note:'Chest on pad, full range'},
    {name:'Chest Supported Row',  sets:3, reps:'10–12',   note:'Removes lower back stress'},
    {name:'Straight Arm Pulldown',sets:3, reps:'12',      note:'Arms straight — pure lat isolation'},
    {name:'Barbell Curl',         sets:3, reps:'10–12',   note:'No swinging, strict form'},
    {name:'Incline DB Curl',      sets:3, reps:'12',      note:'Full stretch for peak bicep'},
    {name:'Hammer Curl',          sets:3, reps:'12',      note:'Brachialis focus'},
    {name:'Arm Curl (Cable)',      sets:3, reps:'20',      note:'Light, high rep, squeeze'},
    {name:'Abs Circuit',          sets:1, reps:'10 min',  cardio:true,  note:'Plank · Leg raise · Crunch · Bicycle'},
    {name:'Treadmill',            sets:1, reps:'20 min',  cardio:true,  note:'Incline 10, speed 4.5–5'},
  ],
  LOWER: [
    {name:'Squat',                sets:3, reps:'10',      note:'Barbell back squat — depth below parallel'},
    {name:'Leg Extension',        sets:3, reps:'12',      note:'Full extension, squeeze quads at top'},
    {name:'Leg Press',            sets:3, reps:'12',      note:'Standard width, 160–200 kg range'},
    {name:'Lunges',               sets:3, reps:'12',      note:'Walking lunges, dumbbells 15–20 kg'},
    {name:'Calf Raises',          sets:3, reps:'15',      note:'Standing, full range of motion'},
    {name:'Tibialis Raise',       sets:3, reps:'15',      note:'Shin strength — knee health'},
  ],
  UPPER: [
    {name:'Bench Press',          sets:3, reps:'10–12',   note:'⚡ SUPERSET → Row'},
    {name:'Barbell Row',          sets:3, reps:'10–12',   note:'⚡ SUPERSET → Bench Press'},
    {name:'Shoulder Press',       sets:3, reps:'10–12',   note:'⚡ SUPERSET → Pulldown'},
    {name:'Lat Pulldown',         sets:3, reps:'10–12',   note:'⚡ SUPERSET → Shoulder Press'},
    {name:'Lateral Raise',        sets:3, reps:'12–15',   note:'⚡ SUPERSET → Preacher Curl'},
    {name:'Preacher Curl',        sets:3, reps:'12',      note:'⚡ SUPERSET → Lateral Raise'},
    {name:'Triceps Rope Pulldown',sets:3, reps:'12–15',   note:'⚡ SUPERSET → Face Pull'},
    {name:'Face Pull',            sets:3, reps:'15',      note:'⚡ SUPERSET → Triceps Rope Pulldown'},
    {name:'Abs Circuit',          sets:1, reps:'10 min',  cardio:true,  note:'Russian twist · Cable crunch · Plank'},
    {name:'Treadmill',            sets:1, reps:'20 min',  cardio:true,  note:'Incline 10, speed 4.5–5'},
  ],
  HIIT: [
    {name:'Burpees',              sets:3, reps:'10–15',   note:'Circuit round 1–3 — full extension'},
    {name:'Jump Squats',          sets:3, reps:'15',      note:'Circuit round 1–3 — land soft'},
    {name:'Push-ups',             sets:3, reps:'15–20',   note:'Circuit round 1–3 — chest to floor'},
    {name:'Kettlebell Swings',    sets:3, reps:'20',      note:'Circuit round 1–3 — drive from hips'},
    {name:'HIIT Treadmill',       sets:1, reps:'20 min',  cardio:true,  note:'30s sprint / 30s walk × 10 rounds'},
  ],
  REST: [
    {name:'Light Walk',           sets:1, reps:'20–30 min', cardio:true, note:'Active recovery — easy pace'},
    {name:'Full Body Stretch',    sets:1, reps:'15 min',    cardio:true, note:'Focus on previous day\'s muscles'},
    {name:'Foam Rolling',         sets:1, reps:'10 min',    cardio:true, note:'Quads · Hamstrings · Lats · Upper back'},
  ],
};

const EST_BURN = {LEGS:480,PUSH:400,PULL:380,LOWER:460,UPPER:420,HIIT:580,REST:90};

const FOODS = [
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
  {name:'Protein Bar (1)',         cal:200,p:20,  c:22, f:7},
  {name:'Pav Bhaji (1 serving)',   cal:400,p:10,  c:58, f:14},
  {name:'Rajma (100g cooked)',     cal:127,p:8.7, c:22, f:0.5},
  {name:'Chole (100g cooked)',     cal:164,p:9,   c:27, f:2.6},
];

// ── STATE ────────────────────────────────────────
const S = {
  page: 'home',
  today: new Date().toDateString(),
  logs: {},         // keyed by date string
  profile: {
    name: 'Athlete',
    weightKg: 100,
    targetCal: 2300,
    targetProtein: 200,
    startDate: new Date().toDateString(),
    manualDay: null,  // override day number
  },
  session: null,    // active workout session object
  exportFilter: 'weekly',
};

// session shape:
// { split, startTs, elapsed, burnInterval, setLogs:{exIdx:[{weight,reps,done}]}, burn, rest:{on,secs,target,iv} }

// ── STORAGE ──────────────────────────────────────
function load() {
  try {
    const d = JSON.parse(localStorage.getItem('ft3') || '{}');
    if (d.logs) S.logs = d.logs;
    if (d.profile) S.profile = {...S.profile, ...d.profile};
  } catch {}
}
function save() {
  try { localStorage.setItem('ft3', JSON.stringify({logs:S.logs, profile:S.profile})); } catch {}
}

// ── LOG HELPERS ───────────────────────────────────
function dayLog(dateStr) {
  if (!S.logs[dateStr]) S.logs[dateStr] = {foods:[], water:0, bodyWeight:null, sessions:[]};
  if (!S.logs[dateStr].sessions) S.logs[dateStr].sessions = [];
  return S.logs[dateStr];
}
function todayLog() { return dayLog(S.today); }
function consumed(dateStr) {
  return (dayLog(dateStr).foods||[]).reduce((s,f)=>s+f.cal,0);
}
function protein(dateStr) {
  return (dayLog(dateStr).foods||[]).reduce((s,f)=>s+(f.p||0),0);
}
function burned(dateStr) {
  return (dayLog(dateStr).sessions||[]).reduce((s,sess)=>s+(sess.burn||0),0);
}

// ── DAY NUMBER ────────────────────────────────────
function dayNum() {
  if (S.profile.manualDay) return S.profile.manualDay;
  const start = new Date(S.profile.startDate);
  const diff = Math.floor((new Date() - start) / 86400000) + 1;
  return Math.min(Math.max(diff, 1), 100);
}
function splitFor(n) { return ROTATION[(n-1) % 7]; }

// ── STREAK ────────────────────────────────────────
function streak() {
  let s = 0;
  const now = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(now); d.setDate(d.getDate()-i);
    const l = S.logs[d.toDateString()];
    if (l && ((l.sessions||[]).length>0 || (l.foods||[]).length>0)) s++;
    else if (i>0) break;
  }
  return s;
}

// ── FORMAT ────────────────────────────────────────
function fmt(s) {
  const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60;
  if(h>0) return `${h}:${z(m)}:${z(ss)}`;
  return `${z(m)}:${z(ss)}`;
}
function z(n) { return String(n).padStart(2,'0'); }
function fmtDate(ds) {
  return new Date(ds).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'2-digit'});
}

// ── PREV LOAD ─────────────────────────────────────
function prevLoad(exName) {
  const dates = Object.keys(S.logs)
    .filter(d => d !== S.today)
    .sort((a,b) => new Date(b)-new Date(a));
  for (const d of dates) {
    for (const sess of (S.logs[d].sessions||[])) {
      for (const [,sets] of Object.entries(sess.setLogs||{})) {
        if (!sets.length || sets[0].exName !== exName) continue;
        const done = sets.filter(s=>s.done && s.weight!=='');
        if (done.length) {
          const maxW = Math.max(...done.map(s=>parseFloat(s.weight)||0));
          const avgR = done[done.length-1].reps;
          return {weight:maxW, reps:avgR, date:d};
        }
      }
    }
  }
  return null;
}

// ── ROUTER ────────────────────────────────────────
function go(page) {
  S.page = page;
  document.querySelectorAll('.nb').forEach(b => b.classList.toggle('on', b.dataset.p===page));
  render();
}

function render() {
  const el = document.getElementById('scroll');
  if (!el) return;
  const pages = {home:pgHome, workout:pgWorkout, calories:pgCalories, history:pgHistory, export:pgExport};
  el.innerHTML = `<div class="page">${(pages[S.page]||pgHome)()}</div>`;
  bindPage();
}

// ── BIND EVENTS ───────────────────────────────────
function bindPage() {
  // food search
  const fs = document.getElementById('food-search');
  if (fs) fs.addEventListener('input', foodSearch);
  // weight log
  const bw = document.getElementById('bw-input');
  if (bw) bw.addEventListener('change', e => { todayLog().bodyWeight=parseFloat(e.target.value)||null; save(); });
}

// ── TOAST ─────────────────────────────────────────
function toast(msg, isErr=false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = isErr ? 'err' : 'ok';
  t.style.opacity = '1';
  clearTimeout(t._t);
  t._t = setTimeout(() => t.style.opacity='0', 2400);
}

// ═══════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════
function pgHome() {
  const dn = dayNum();
  const sp = splitFor(dn);
  const m = META[sp];
  const log = todayLog();
  const cal = consumed(S.today);
  const pro = Math.round(protein(S.today));
  const brn = burned(S.today);
  const net = cal - brn;
  const pct = Math.round((dn/100)*100);
  const doneEx = S.session ? Object.values(S.session.setLogs).flat().filter(x=>x.done).length : 0;
  const totalEx = PLANS[sp].reduce((s,e)=>s+(e.cardio?1:e.sets),0);

  return `
  <!-- Hero -->
  <div style="padding:16px 16px 0">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px">
      <div>
        <div style="font-size:12px;font-weight:700;letter-spacing:1px;color:var(--sub);text-transform:uppercase;margin-bottom:4px">Today · ${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'})}</div>
        <div style="font-size:32px;font-weight:800;line-height:1">Day <span style="color:var(--accent)">${dn}</span> <span style="font-size:16px;color:var(--sub);font-weight:600">/ 100</span></div>
      </div>
      <div style="text-align:right">
        <div style="font-size:20px;margin-bottom:2px">🔥</div>
        <div style="font-size:13px;font-weight:700;color:#ff8c3e">${streak()} day streak</div>
      </div>
    </div>

    <!-- Split card -->
    <div style="background:var(--card);border:1px solid var(--line);border-left:4px solid ${m.color};border-radius:12px;padding:16px;margin-bottom:12px">
      <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--sub);text-transform:uppercase;margin-bottom:6px">Today's Split</div>
      <div style="font-size:24px;font-weight:800;margin-bottom:3px">${m.emoji} ${m.label} <span style="font-size:14px;font-weight:500;color:var(--sub)">— ${m.full}</span></div>
      <div style="font-size:12px;color:var(--sub);margin-bottom:12px">~${EST_BURN[sp]} kcal estimated burn</div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--sub);margin-bottom:6px">
        <span>Session progress</span><span>${doneEx}/${totalEx} sets</span>
      </div>
      <div class="prog-wrap" style="margin-bottom:14px"><div class="prog-fill" style="width:${Math.round((doneEx/Math.max(totalEx,1))*100)}%"></div></div>
      <div style="display:flex;gap:8px">
        ${S.session
          ? `<button class="btn btn-a" style="flex:1" onclick="go('workout')">Resume →</button>
             <button class="btn btn-o btn-sm" onclick="finishSession()">Finish ✓</button>`
          : `<button class="btn btn-a" onclick="startSession()">⏱ Start Workout</button>`}
      </div>
      ${(log.sessions||[]).length>0 ? `<div style="margin-top:10px;font-size:12px;color:var(--accent)">✓ ${log.sessions.length} session(s) done today · ${brn} kcal burned</div>` : ''}
    </div>

    <!-- 100-day progress -->
    <div style="background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font-size:13px;font-weight:600">100-Day Progress</span>
        <span class="pill pill-a">${pct}%</span>
      </div>
      <div class="prog-wrap" style="height:10px"><div class="prog-fill" style="width:${pct}%;height:10px"></div></div>
    </div>
  </div>

  <!-- Macro cards -->
  <div class="sec">Today's Nutrition</div>
  <div class="macro-cards">
    <div class="macro-card"><div class="mv" style="color:var(--accent)">${cal}</div><div class="ml">Eaten</div><div style="font-size:9px;color:var(--sub);margin-top:2px">/ ${S.profile.targetCal}</div></div>
    <div class="macro-card"><div class="mv" style="color:#ff4f4f">${brn}</div><div class="ml">Burned</div></div>
    <div class="macro-card"><div class="mv" style="color:${net<=0?'var(--green)':'var(--red)'}">${net>0?'+':''}${net}</div><div class="ml">Net</div></div>
    <div class="macro-card"><div class="mv" style="color:#3ecfff">${pro}g</div><div class="ml">Protein</div><div style="font-size:9px;color:var(--sub);margin-top:2px">/ ${S.profile.targetProtein}g</div></div>
  </div>

  <!-- Water -->
  <div class="sec">Water</div>
  <div style="padding:0 16px;display:flex;align-items:center;gap:8px;flex-wrap:wrap">
    ${[1,2,3,4,5,6,7,8].map(i=>`<button class="glass ${(log.water||0)>=i?'on':''}" onclick="logWater(${i})">${(log.water||0)>=i?'💧':'○'}</button>`).join('')}
    <span class="water-count">${log.water||0}/8 glasses</span>
  </div>

  <!-- Body weight -->
  <div class="sec">Body Weight</div>
  <div style="padding:0 16px">
    <div style="display:flex;gap:10px;align-items:center">
      <input id="bw-input" type="number" class="inp" style="max-width:120px" step="0.1"
        placeholder="kg" value="${log.bodyWeight||''}">
      <span style="font-size:13px;color:var(--sub)">kg — log today's weight</span>
    </div>
  </div>

  <!-- Upcoming -->
  <div class="sec">Upcoming</div>
  <div class="card mx">
    ${[1,2,3,4].map(i=>{
      const d=dn+i; if(d>100) return '';
      const sp2=splitFor(d), m2=META[sp2];
      return `<div class="upcoming-item">
        <div class="up-day" style="color:${m2.color}">Day ${d}</div>
        <div class="up-info">
          <div class="up-split">${m2.emoji} ${m2.label}</div>
          <div class="up-sub">${m2.full}</div>
        </div>
      </div>`;
    }).join('')}
  </div>
  <div style="height:8px"></div>`;
}

function logWater(g) { todayLog().water=g; save(); render(); }

// ═══════════════════════════════════════════════
//  WORKOUT SESSION
// ═══════════════════════════════════════════════
function startSession() {
  const sp = splitFor(dayNum());
  const setLogs = {};
  PLANS[sp].forEach((ex,i) => {
    const count = ex.cardio ? 1 : ex.sets;
    setLogs[i] = Array.from({length:count}, (_,si) => ({
      exName: ex.name, setNum: si+1, weight:'', reps:'', done:false
    }));
  });
  S.session = {
    split: sp,
    startTs: Date.now(),
    elapsed: 0,
    burn: 0,
    setLogs,
    rest: {on:false, secs:0, target:90, iv:null},
    burnInterval: setInterval(() => {
      S.session.elapsed++;
      S.session.burn = Math.round(5 * (S.profile.weightKg||100) * S.session.elapsed / 3600);
      // patch DOM directly — no full re-render
      const tv = document.getElementById('sb-time');
      if (tv) tv.textContent = fmt(S.session.elapsed);
      const bv = document.getElementById('sb-burn');
      if (bv) bv.textContent = S.session.burn + ' kcal';
    }, 1000),
  };
  go('workout');
}

function finishSession() {
  if (!S.session) return;
  clearInterval(S.session.burnInterval);
  clearInterval(S.session.rest.iv);
  const log = todayLog();
  log.sessions.push({
    split: S.session.split,
    duration: S.session.elapsed,
    burn: S.session.burn,
    setLogs: JSON.parse(JSON.stringify(S.session.setLogs)),
    ts: Date.now(),
  });
  const dur = S.session.elapsed, brn = S.session.burn;
  S.session = null;
  save();
  toast(`Done! ${fmt(dur)} · ${brn} kcal 🔥`);
  go('home');
}

function startRest(secs) {
  if (!S.session) return;
  clearInterval(S.session.rest.iv);
  S.session.rest = {on:true, secs:0, target:secs, iv:setInterval(tickRest,1000)};
  const panel = document.getElementById('rest-panel');
  if (panel) {
    panel.style.display = 'block';
    updateRestUI();
  }
}
function tickRest() {
  if (!S.session) return;
  S.session.rest.secs++;
  const rem = Math.max(0, S.session.rest.target - S.session.rest.secs);
  updateRestUI(rem);
  if (rem === 0) {
    clearInterval(S.session.rest.iv);
    S.session.rest.on = false;
    if (navigator.vibrate) navigator.vibrate([300,100,300]);
    toast('Rest over — GO! 💪');
    const panel = document.getElementById('rest-panel');
    setTimeout(() => { if(panel) panel.style.display='none'; }, 1500);
  }
}
function updateRestUI(rem) {
  if (!S.session) return;
  rem = rem !== undefined ? rem : Math.max(0, S.session.rest.target - S.session.rest.secs);
  const rv = document.getElementById('rest-val');
  if (rv) rv.textContent = rem > 0 ? fmt(rem) : 'GO! 💪';
  const ring = document.getElementById('rest-ring');
  if (ring) {
    const R=32, C=2*Math.PI*R;
    ring.style.strokeDashoffset = C * (rem/S.session.rest.target);
  }
}
function skipRest() {
  if (!S.session) return;
  clearInterval(S.session.rest.iv);
  S.session.rest.on = false;
  const panel = document.getElementById('rest-panel');
  if (panel) panel.style.display = 'none';
}

function completeSet(exIdx, setIdx) {
  if (!S.session) return;
  const set = S.session.setLogs[exIdx]?.[setIdx];
  if (!set) return;
  set.done = !set.done;
  // update UI without re-render
  const row = document.getElementById(`sr-${exIdx}-${setIdx}`);
  if (row) row.classList.toggle('done-row', set.done);
  const btn = document.getElementById(`sb-${exIdx}-${setIdx}`);
  if (btn) { btn.textContent = set.done?'✓':'○'; btn.classList.toggle('on', set.done); }
  const wInp = document.getElementById(`sw-${exIdx}-${setIdx}`);
  const rInp = document.getElementById(`sr2-${exIdx}-${setIdx}`);
  if (wInp) wInp.readOnly = set.done;
  if (rInp) rInp.readOnly = set.done;
  // ex card done
  const allDone = S.session.setLogs[exIdx].every(s=>s.done);
  const card = document.getElementById(`ec-${exIdx}`);
  if (card) card.classList.toggle('done', allDone);
  const badge = document.getElementById(`eb-${exIdx}`);
  if (badge) badge.style.display = allDone ? 'inline-flex' : 'none';
  // progress bar
  const total = Object.values(S.session.setLogs).flat().length;
  const done = Object.values(S.session.setLogs).flat().filter(s=>s.done).length;
  const pct = Math.round((done/total)*100);
  const pb = document.getElementById('sb-prog');
  if (pb) pb.style.width = pct+'%';
  const pl = document.getElementById('sb-prog-label');
  if (pl) pl.textContent = `${done}/${total} sets · ${pct}%`;
  if (set.done) startRest(allDone ? 90 : 60);
}

function setVal(exIdx, setIdx, field, val) {
  if (!S.session) return;
  const set = S.session.setLogs[exIdx]?.[setIdx];
  if (set) set[field] = val;
}

// ═══════════════════════════════════════════════
//  WORKOUT PAGE
// ═══════════════════════════════════════════════
function pgWorkout() {
  if (!S.session) {
    const sp = splitFor(dayNum()), m = META[sp];
    return `
    <div style="padding:24px 16px 0">
      <div class="sec" style="padding:0 0 12px">Today's Workout</div>
      <div style="background:var(--card);border:1px solid ${m.color};border-radius:14px;padding:20px;text-align:center;margin-bottom:20px">
        <div style="font-size:56px;margin-bottom:12px">${m.emoji}</div>
        <div style="font-size:24px;font-weight:800;margin-bottom:4px">${m.label}</div>
        <div style="font-size:14px;color:var(--sub);margin-bottom:4px">${m.full}</div>
        <div style="font-size:13px;color:var(--sub);margin-bottom:20px">${PLANS[sp].length} exercises · ~${EST_BURN[sp]} kcal</div>
        <button class="btn btn-a" onclick="startSession()">⏱ Start Session</button>
      </div>
      <div class="sec" style="padding:0 0 10px">Exercise Preview</div>
      <div class="card mb">
        ${PLANS[sp].map((ex,i)=>`
        <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid var(--line)${i===PLANS[sp].length-1?';border-bottom:none':''}">
          <div style="font-size:18px;font-weight:800;color:var(--faint);min-width:24px">${i+1}</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:600">${ex.name}</div>
            <div style="font-size:12px;color:var(--accent);margin-top:1px">${ex.sets} × ${ex.reps}</div>
          </div>
          ${ex.cardio ? '<span class="pill pill-b">cardio</span>' : ''}
        </div>`).join('')}
      </div>
    </div>`;
  }

  const sp = S.session.split, m = META[sp];
  const total = Object.values(S.session.setLogs).flat().length;
  const done = Object.values(S.session.setLogs).flat().filter(s=>s.done).length;
  const pct = Math.round((done/total)*100);
  const rest = S.session.rest;

  return `
  <!-- Session bar -->
  <div class="session-bar">
    <div class="sb-block">
      <div class="sb-lbl">Time</div>
      <div class="sb-val" id="sb-time" style="color:var(--accent)">${fmt(S.session.elapsed)}</div>
    </div>
    <div class="sb-prog">
      <div class="sb-prog-bar"><div class="sb-prog-fill" id="sb-prog" style="width:${pct}%"></div></div>
      <div class="sb-prog-label" id="sb-prog-label">${done}/${total} sets · ${pct}%</div>
    </div>
    <div class="sb-block">
      <div class="sb-lbl">Burned</div>
      <div class="sb-val" id="sb-burn" style="color:#ff4f4f">${S.session.burn} kcal</div>
    </div>
  </div>

  <!-- Rest overlay -->
  <div id="rest-panel" style="display:${rest.on?'block':'none'}">
    <div class="rest-overlay">
      <div class="rest-ring-wrap">
        <svg viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" stroke="var(--card2)" stroke-width="7"/>
          <circle id="rest-ring" cx="40" cy="40" r="32" fill="none" stroke="var(--accent)" stroke-width="7"
            stroke-dasharray="${2*Math.PI*32}"
            stroke-dashoffset="${2*Math.PI*32*(Math.max(0,rest.target-rest.secs)/rest.target)}"
            stroke-linecap="round" transform="rotate(-90 40 40)"
            style="transition:stroke-dashoffset .9s linear"/>
        </svg>
        <div class="rest-center">
          <div class="rest-lbl">Rest</div>
          <div class="rest-count" id="rest-val">${fmt(Math.max(0,rest.target-rest.secs))}</div>
        </div>
      </div>
      <div class="rest-actions">
        <button class="rest-btn" onclick="startRest(60)">60s</button>
        <button class="rest-btn" onclick="startRest(90)">90s</button>
        <button class="rest-btn" onclick="startRest(120)">2 min</button>
        <button class="rest-skip" onclick="skipRest()">Skip Rest →</button>
      </div>
    </div>
  </div>

  <!-- Exercise cards -->
  ${PLANS[sp].map((ex,i) => exCard(ex,i)).join('')}

  <!-- Finish -->
  <div style="padding:16px">
    <button class="btn btn-r" onclick="confirmFinish()">🏁 Finish Workout</button>
  </div>`;
}

function exCard(ex, i) {
  const sets = S.session ? (S.session.setLogs[i]||[]) : [];
  const allDone = sets.length > 0 && sets.every(s=>s.done);
  const prev = prevLoad(ex.name);

  return `
  <div class="ex-card${allDone?' done':''}" id="ec-${i}" style="margin-top:${i===0?'10px':'0'}">
    <div class="ex-head">
      <div class="ex-left">
        <div class="ex-num">${i+1}</div>
        <div>
          <div class="ex-name">${ex.name}</div>
          <div class="ex-scheme">${ex.sets} × ${ex.reps}</div>
        </div>
      </div>
      <span class="pill pill-a" id="eb-${i}" style="display:${allDone?'inline-flex':'none'}">✓ Done</span>
    </div>
    ${ex.note ? `<div class="ex-note">${ex.note}</div>` : ''}
    <div class="ex-prev ${prev?'':'none'}">
      ${prev
        ? `📊 Last session: <strong>${prev.weight} kg × ${prev.reps} reps</strong> <span style="color:var(--sub);font-weight:400">· ${fmtDate(prev.date)}</span>`
        : '📊 No previous data — first time logging this exercise'}
    </div>
    ${ex.cardio
      ? `<div class="cardio-ex">
          <span class="cardio-info">🏃 Timed — mark complete when done</span>
          <button class="set-check ${sets[0]?.done?'on':''}" id="sb-${i}-0"
            onclick="completeSet(${i},0)" style="width:auto;padding:0 16px">
            ${sets[0]?.done ? '✓ Done' : 'Done?'}
          </button>
         </div>`
      : `<div class="set-tbl">
          <div class="set-head"><span>#</span><span>Weight (kg)</span><span>Reps</span><span>✓</span></div>
          ${sets.map((set,si) => `
          <div class="set-row${set.done?' done-row':''}" id="sr-${i}-${si}">
            <div class="set-num">${si+1}</div>
            <input id="sw-${i}-${si}" type="number" class="set-inp" step="0.5"
              placeholder="${prev?prev.weight:'—'}" value="${set.weight}"
              oninput="setVal(${i},${si},'weight',this.value)"
              ${set.done?'readonly':''}>
            <input id="sr2-${i}-${si}" type="number" class="set-inp"
              placeholder="${ex.reps.toString().split('–')[0]}" value="${set.reps}"
              oninput="setVal(${i},${si},'reps',this.value)"
              ${set.done?'readonly':''}>
            <button class="set-check${set.done?' on':''}" id="sb-${i}-${si}"
              onclick="completeSet(${i},${si})">
              ${set.done?'✓':'○'}
            </button>
          </div>`).join('')}
         </div>`}
  </div>`;
}

function confirmFinish() {
  const done = Object.values(S.session.setLogs).flat().filter(s=>s.done).length;
  const total = Object.values(S.session.setLogs).flat().length;
  if (done < total*0.4 && !confirm(`Only ${done}/${total} sets done. Finish anyway?`)) return;
  finishSession();
}

// ═══════════════════════════════════════════════
//  CALORIES PAGE
// ═══════════════════════════════════════════════
function pgCalories() {
  const log = todayLog();
  const cal = consumed(S.today);
  const pro = Math.round(protein(S.today));
  const carbs = Math.round((log.foods||[]).reduce((s,f)=>s+(f.c||0),0));
  const fats = Math.round((log.foods||[]).reduce((s,f)=>s+(f.f||0),0));
  const rem = S.profile.targetCal - cal;
  const pct = Math.min(Math.round((cal/S.profile.targetCal)*100),100);
  const R=42, C=2*Math.PI*R;

  return `
  <!-- Ring + macros -->
  <div class="ring-section">
    <div class="ring-wrap">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="${R}" fill="none" stroke="var(--card2)" stroke-width="10"/>
        <circle cx="50" cy="50" r="${R}" fill="none" stroke="var(--accent)" stroke-width="10"
          stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct/100)}"
          stroke-linecap="round" transform="rotate(-90 50 50)"/>
      </svg>
      <div class="ring-center">
        <div class="ring-val">${cal}</div>
        <div class="ring-lbl">/ ${S.profile.targetCal}</div>
      </div>
    </div>
    <div class="macro-list">
      <div class="macro-row"><div class="macro-dot" style="background:#3ecfff"></div><div class="macro-name">Protein</div><div class="macro-val" style="color:#3ecfff">${pro}g</div></div>
      <div class="macro-row"><div class="macro-dot" style="background:var(--accent)"></div><div class="macro-name">Carbs</div><div class="macro-val" style="color:var(--accent)">${carbs}g</div></div>
      <div class="macro-row"><div class="macro-dot" style="background:#ff8c3e"></div><div class="macro-name">Fats</div><div class="macro-val" style="color:#ff8c3e">${fats}g</div></div>
      <div class="macro-row" style="margin-top:4px">
        <div class="macro-name" style="color:${rem>=0?'var(--green)':'var(--red)'};font-weight:700;font-size:13px">
          ${rem>=0 ? rem+' kcal left' : Math.abs(rem)+' kcal over'}
        </div>
      </div>
    </div>
  </div>

  <!-- Search -->
  <div class="sec">Add Food</div>
  <div style="padding:0 16px 8px">
    <input id="food-search" type="text" class="inp" placeholder="Search chicken, rice, dal, eggs…" autocomplete="off">
  </div>
  <div id="food-results" style="padding:0 16px"></div>

  <!-- Custom -->
  <div class="sec">Add Custom Food</div>
  <div style="padding:0 16px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <input id="cf-name" type="text" class="inp" placeholder="Food name" style="grid-column:1/-1">
    <div>
      <label class="lbl">Calories</label>
      <input id="cf-cal" type="number" class="inp inp-sm" placeholder="0">
    </div>
    <div>
      <label class="lbl">Protein g</label>
      <input id="cf-p" type="number" class="inp inp-sm" placeholder="0">
    </div>
    <div>
      <label class="lbl">Carbs g</label>
      <input id="cf-c" type="number" class="inp inp-sm" placeholder="0">
    </div>
    <div>
      <label class="lbl">Fat g</label>
      <input id="cf-f" type="number" class="inp inp-sm" placeholder="0">
    </div>
    <button class="btn btn-o" style="grid-column:1/-1;margin-top:4px" onclick="addCustom()">Add Custom</button>
  </div>

  <!-- Log -->
  <div class="sec">Today's Food Log <span style="font-weight:400;font-size:12px;color:var(--sub)">(${(log.foods||[]).length} items)</span></div>
  <div class="card mx mb">
    ${(log.foods||[]).length===0
      ? `<div class="pad" style="color:var(--sub);font-size:13px">No food logged yet — search above</div>`
      : (log.foods||[]).map((f,i)=>`
        <div class="food-item">
          <div class="fi-info">
            <div class="fi-name">${f.name}</div>
            <div class="fi-mac">${f.p||0}g P · ${f.c||0}g C · ${f.f||0}g F</div>
          </div>
          <div class="fi-cal">${f.cal}</div>
          <button class="fi-rm" onclick="removeFood(${i})">×</button>
        </div>`).join('')
    }
  </div>`;
}

function foodSearch() {
  const q = document.getElementById('food-search')?.value.toLowerCase().trim();
  const res = document.getElementById('food-results');
  if (!res) return;
  if (!q) { res.innerHTML=''; return; }
  const hits = FOODS.filter(f=>f.name.toLowerCase().includes(q)).slice(0,7);
  res.innerHTML = hits.length
    ? hits.map(f=>`<div class="food-result" onclick="addFood('${f.name}',${f.cal},${f.p||0},${f.c||0},${f.f||0})">
        <span style="font-size:14px">${f.name}</span>
        <span class="fr-cal">${f.cal} kcal</span>
      </div>`).join('')
    : `<div style="font-size:13px;color:var(--sub);padding:8px 0">No matches — use custom below</div>`;
}

function addFood(name,cal,p,c,f) {
  todayLog().foods.push({name,cal,p,c,f});
  save();
  const s = document.getElementById('food-search');
  if(s) s.value='';
  const r = document.getElementById('food-results');
  if(r) r.innerHTML='';
  render();
  toast(name+' added!');
}
function addCustom() {
  const name=document.getElementById('cf-name')?.value.trim();
  const cal=parseInt(document.getElementById('cf-cal')?.value)||0;
  const p=parseFloat(document.getElementById('cf-p')?.value)||0;
  const c=parseFloat(document.getElementById('cf-c')?.value)||0;
  const f=parseFloat(document.getElementById('cf-f')?.value)||0;
  if(!name||!cal){toast('Enter name + calories',true);return;}
  todayLog().foods.push({name,cal,p,c,f});
  save(); render(); toast(name+' added!');
}
function removeFood(i) { todayLog().foods.splice(i,1); save(); render(); }

// ═══════════════════════════════════════════════
//  HISTORY + EDIT PAGE
// ═══════════════════════════════════════════════
function pgHistory() {
  const dates = Object.keys(S.logs).sort((a,b)=>new Date(b)-new Date(a));
  if (!dates.length) return `
    <div class="page-title">History</div>
    <div class="page-sub">No data logged yet. Start working out and logging food!</div>`;

  return `
  <div class="page-title">History</div>
  <div class="page-sub">Tap any day to view or edit</div>
  <div class="card mx">
    ${dates.map(d => {
      const log = S.logs[d];
      const sessions = log.sessions||[];
      const cal = (log.foods||[]).reduce((s,f)=>s+f.cal,0);
      const brn = sessions.reduce((s,sess)=>s+(sess.burn||0),0);
      const splitStr = sessions.length ? sessions.map(s=>META[s.split]?.label||s.split).join(', ') : '—';
      return `<div class="hist-item" onclick="openEdit('${d}')">
        <div class="hi-date">${fmtDate(d)}</div>
        <div class="hi-info">
          <div class="hi-split">${sessions.length?sessions[0]&&META[sessions[0].split]?.emoji+' ':''} ${splitStr}</div>
          <div class="hi-sub">${cal} kcal eaten · ${brn} kcal burned${log.bodyWeight?' · '+log.bodyWeight+'kg':''}</div>
        </div>
        <div class="hi-caret">›</div>
      </div>`;
    }).join('')}
  </div>
  <div style="height:8px"></div>`;
}

function openEdit(dateStr) {
  const log = dayLog(dateStr);
  const sessions = log.sessions||[];
  const cal = (log.foods||[]).reduce((s,f)=>s+f.cal,0);
  const brn = sessions.reduce((s,sess)=>s+(sess.burn||0),0);
  const dn = Math.floor((new Date(dateStr)-new Date(S.profile.startDate))/86400000)+1;
  const sp = splitFor(dn);
  const m = META[sp]||META.REST;

  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
  <div class="modal-backdrop" onclick="closeModal(event)">
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-head">
        <div class="modal-title">📝 Edit — ${fmtDate(dateStr)}</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>

      <!-- Day override note -->
      <div style="padding:12px 16px;background:var(--card2);border-bottom:1px solid var(--line)">
        <div style="font-size:12px;color:var(--sub)">Detected split: <strong style="color:${m.color}">${m.emoji} ${m.label}</strong></div>
      </div>

      <!-- Body weight -->
      <div class="edit-row">
        <label class="lbl">Body Weight (kg)</label>
        <input type="number" class="inp" step="0.1" id="edit-bw"
          value="${log.bodyWeight||''}" placeholder="kg">
      </div>

      <!-- Water -->
      <div class="edit-row">
        <label class="lbl">Water (glasses)</label>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          ${[1,2,3,4,5,6,7,8].map(i=>`<button class="glass ${(log.water||0)>=i?'on':''}"
            onclick="editWater('${dateStr}',${i})">${(log.water||0)>=i?'💧':'○'}</button>`).join('')}
          <span class="water-count">${log.water||0}/8</span>
        </div>
      </div>

      <!-- Calories overview -->
      <div class="edit-row">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:14px;font-weight:700">Calories Eaten</span>
          <span style="color:var(--accent);font-weight:700">${cal} kcal</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="font-size:14px;font-weight:700">Calories Burned</span>
          <span style="color:#ff4f4f;font-weight:700">${brn} kcal</span>
        </div>
      </div>

      <!-- Food log edit -->
      <div style="padding:12px 16px 4px">
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--sub);text-transform:uppercase;margin-bottom:8px">Food Log (${(log.foods||[]).length} items)</div>
        ${(log.foods||[]).length===0
          ? `<div style="font-size:13px;color:var(--sub)">No food logged</div>`
          : (log.foods||[]).map((f,i)=>`
            <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--line)">
              <div style="flex:1">
                <div style="font-size:13px;font-weight:600">${f.name}</div>
                <div style="font-size:11px;color:var(--sub)">${f.cal} kcal · ${f.p||0}g P</div>
              </div>
              <button style="background:none;border:none;color:var(--faint);font-size:20px;cursor:pointer;padding:4px 8px"
                onclick="editRemoveFood('${dateStr}',${i})">×</button>
            </div>`).join('')
        }
      </div>

      <!-- Add food to this day -->
      <div style="padding:12px 16px">
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--sub);text-transform:uppercase;margin-bottom:8px">Add Food to This Day</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <input id="ef-name" type="text" class="inp" placeholder="Food name" style="grid-column:1/-1">
          <input id="ef-cal" type="number" class="inp inp-sm" placeholder="Calories">
          <input id="ef-p" type="number" class="inp inp-sm" placeholder="Protein g">
          <button class="btn btn-o" style="grid-column:1/-1" onclick="editAddFood('${dateStr}')">Add Food</button>
        </div>
      </div>

      <!-- Session overview -->
      ${sessions.length>0 ? `
      <div style="padding:0 16px 12px">
        <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--sub);text-transform:uppercase;margin-bottom:8px">Sessions (${sessions.length})</div>
        ${sessions.map((sess,si)=>`
          <div style="background:var(--card2);border:1px solid var(--line);border-radius:8px;padding:12px;margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <span style="font-weight:700">${META[sess.split]?.emoji||''} ${META[sess.split]?.label||sess.split}</span>
              <span style="font-size:12px;color:var(--sub)">${fmt(sess.duration||0)}</span>
            </div>
            <div style="display:flex;gap:16px">
              <div>
                <label class="lbl" style="font-size:9px">Calories Burned</label>
                <input type="number" class="inp inp-sm" style="width:90px" value="${sess.burn||0}"
                  onchange="editBurn('${dateStr}',${si},this.value)">
              </div>
              <div>
                <label class="lbl" style="font-size:9px">Duration (min)</label>
                <input type="number" class="inp inp-sm" style="width:80px" value="${Math.round((sess.duration||0)/60)}"
                  onchange="editDuration('${dateStr}',${si},this.value)">
              </div>
            </div>
          </div>`).join('')}
      </div>` : ''}

      <!-- Delete day -->
      <div style="padding:0 16px 20px">
        <button class="btn btn-r" onclick="deleteDay('${dateStr}')">🗑 Delete This Day's Data</button>
      </div>

      <!-- Save -->
      <div style="padding:0 16px 24px">
        <button class="btn btn-a" onclick="saveEdit('${dateStr}')">Save Changes</button>
      </div>
    </div>
  </div>`;
}

function closeModal(e) {
  if (e && e.target !== document.querySelector('.modal-backdrop')) return;
  document.getElementById('modal-root').innerHTML='';
}
function editWater(d, g) { dayLog(d).water=g; save(); openEdit(d); }
function editRemoveFood(d, i) { dayLog(d).foods.splice(i,1); save(); openEdit(d); }
function editAddFood(d) {
  const name=document.getElementById('ef-name')?.value.trim();
  const cal=parseInt(document.getElementById('ef-cal')?.value)||0;
  const p=parseFloat(document.getElementById('ef-p')?.value)||0;
  if(!name||!cal){toast('Enter name + calories',true);return;}
  dayLog(d).foods.push({name,cal,p,c:0,f:0});
  save(); openEdit(d); toast('Food added!');
}
function editBurn(d, si, val) { dayLog(d).sessions[si].burn=parseInt(val)||0; save(); }
function editDuration(d, si, val) { dayLog(d).sessions[si].duration=(parseInt(val)||0)*60; save(); }
function deleteDay(d) {
  if(!confirm('Delete all data for '+fmtDate(d)+'?')) return;
  delete S.logs[d]; save();
  document.getElementById('modal-root').innerHTML='';
  render(); toast('Day deleted');
}
function saveEdit(d) {
  const bw = parseFloat(document.getElementById('edit-bw')?.value)||null;
  if(bw) dayLog(d).bodyWeight=bw;
  save();
  document.getElementById('modal-root').innerHTML='';
  render(); toast('Changes saved ✓');
}

// ═══════════════════════════════════════════════
//  EXPORT PAGE
// ═══════════════════════════════════════════════
function pgExport() {
  return `
  <div class="page-title">Export</div>
  <div class="page-sub">Download your workout & nutrition data</div>

  <div class="sec">Filter Period</div>
  <div class="filter-tabs">
    <button class="ftab${S.exportFilter==='daily'?' on':''}" onclick="setExpFilter('daily')">Today</button>
    <button class="ftab${S.exportFilter==='weekly'?' on':''}" onclick="setExpFilter('weekly')">This Week</button>
    <button class="ftab${S.exportFilter==='monthly'?' on':''}" onclick="setExpFilter('monthly')">This Month</button>
    <button class="ftab${S.exportFilter==='all'?' on':''}" onclick="setExpFilter('all')">All Time</button>
  </div>

  <div style="padding:12px 16px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div><label class="lbl">From</label><input type="date" id="exp-from" class="inp" value="${expDefaultFrom()}" onchange="updateExpPreview()"></div>
      <div><label class="lbl">To</label><input type="date" id="exp-to" class="inp" value="${new Date().toISOString().split('T')[0]}" onchange="updateExpPreview()"></div>
    </div>
  </div>

  <div id="exp-preview" style="padding:0 16px"></div>

  <div style="padding:0 16px;display:grid;gap:8px;margin-top:8px">
    <button class="btn btn-a" onclick="doExportCSV()">📊 Export CSV (Excel)</button>
    <button class="btn btn-o" onclick="doExportJSON()">📄 Export JSON</button>
    <button class="btn btn-o" onclick="doShareText()">📤 Share as Text</button>
  </div>
  <div style="height:8px"></div>`;
}

function expDefaultFrom() {
  const now = new Date();
  if(S.exportFilter==='daily') return now.toISOString().split('T')[0];
  if(S.exportFilter==='weekly'){const d=new Date(now);d.setDate(d.getDate()-6);return d.toISOString().split('T')[0];}
  if(S.exportFilter==='monthly'){const d=new Date(now);d.setDate(1);return d.toISOString().split('T')[0];}
  // all
  const dates=Object.keys(S.logs).sort();
  return dates.length ? new Date(dates[0]).toISOString().split('T')[0] : now.toISOString().split('T')[0];
}

function setExpFilter(f) {
  S.exportFilter=f;
  render();
  setTimeout(updateExpPreview,30);
}

function getExpLogs() {
  const from=new Date(document.getElementById('exp-from')?.value||expDefaultFrom());
  const to=new Date(document.getElementById('exp-to')?.value||new Date().toISOString().split('T')[0]);
  to.setHours(23,59,59);
  return Object.entries(S.logs)
    .filter(([d])=>{const dt=new Date(d);return dt>=from&&dt<=to;})
    .sort(([a],[b])=>new Date(a)-new Date(b));
}

function updateExpPreview() {
  const el=document.getElementById('exp-preview');
  if(!el) return;
  const logs=getExpLogs();
  if(!logs.length){el.innerHTML='<div style="font-size:13px;color:var(--sub);padding:8px 0">No data in this range</div>';return;}
  let totCal=0,totBurn=0,totSess=0;
  logs.forEach(([,l])=>{totCal+=consumed(l.__date||(l.foods&&''));totBurn+=(l.sessions||[]).reduce((s,sess)=>s+(sess.burn||0),0);totSess+=(l.sessions||[]).length;});
  // recalc properly
  totCal=0;totBurn=0;
  logs.forEach(([d,l])=>{totCal+=(l.foods||[]).reduce((s,f)=>s+f.cal,0);totBurn+=(l.sessions||[]).reduce((s,sess)=>s+(sess.burn||0),0);totSess+=(l.sessions||[]).length;});

  const rows=logs.map(([d,l])=>{
    const cal=(l.foods||[]).reduce((s,f)=>s+f.cal,0);
    const brn=(l.sessions||[]).reduce((s,sess)=>s+(sess.burn||0),0);
    const dur=(l.sessions||[]).reduce((s,sess)=>s+Math.round((sess.duration||0)/60),0);
    const sp=(l.sessions||[]).map(sess=>META[sess.split]?.label||sess.split).join(', ')||'—';
    return `<div class="exp-row">
      <div class="exp-row-head">${fmtDate(d)} <span style="font-size:12px;color:var(--sub);font-weight:400">· ${sp}</span></div>
      <div class="exp-row-body">
        <div class="exp-cell"><div class="ec-l">Duration</div><div class="ec-v">${dur} min</div></div>
        <div class="exp-cell"><div class="ec-l">Eaten</div><div class="ec-v a">${cal} kcal</div></div>
        <div class="exp-cell"><div class="ec-l">Burned</div><div class="ec-v" style="color:#ff4f4f">${brn} kcal</div></div>
        <div class="exp-cell"><div class="ec-l">Net</div><div class="ec-v ${cal-brn<=S.profile.targetCal?'g':'r'}">${cal-brn}</div></div>
        <div class="exp-cell"><div class="ec-l">Weight</div><div class="ec-v">${l.bodyWeight||'—'} ${l.bodyWeight?'kg':''}</div></div>
        <div class="exp-cell"><div class="ec-l">Water</div><div class="ec-v">${l.water||0}/8</div></div>
      </div>
    </div>`;
  }).join('');

  el.innerHTML=`
    <div class="exp-summary" style="margin-bottom:12px">
      <div class="exp-s"><div class="exp-sv">${logs.length}</div><div class="exp-sl">Days</div></div>
      <div class="exp-s"><div class="exp-sv">${totSess}</div><div class="exp-sl">Sessions</div></div>
      <div class="exp-s"><div class="exp-sv">${totBurn}</div><div class="exp-sl">kcal Burned</div></div>
      <div class="exp-s"><div class="exp-sv">${totCal}</div><div class="exp-sl">kcal Eaten</div></div>
    </div>
    ${rows}`;
}

function buildExpData() {
  return getExpLogs().map(([d,l])=>({
    date: d,
    split: (l.sessions||[]).map(s=>s.split).join(', '),
    duration_min: (l.sessions||[]).reduce((s,sess)=>s+Math.round((sess.duration||0)/60),0),
    calories_eaten: (l.foods||[]).reduce((s,f)=>s+f.cal,0),
    protein_g: Math.round((l.foods||[]).reduce((s,f)=>s+(f.p||0),0)),
    calories_burned: (l.sessions||[]).reduce((s,sess)=>s+(sess.burn||0),0),
    water_glasses: l.water||0,
    body_weight_kg: l.bodyWeight||'',
    exercises: (l.sessions||[]).flatMap(sess=>
      Object.values(sess.setLogs||{}).map(sets=>({
        name: sets[0]?.exName||'',
        sets: sets.filter(s=>s.done).map(s=>({weight:s.weight,reps:s.reps}))
      }))
    )
  }));
}
function dlFile(content,name,type){const b=new Blob([content],{type});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(u);}
function doExportCSV(){const d=buildExpData();if(!d.length){toast('No data',true);return;}const h=['Date','Split','Duration(min)','Cal Eaten','Protein(g)','Cal Burned','Water','Body Weight(kg)'];dlFile([h.join(','),...d.map(r=>[r.date,r.split,r.duration_min,r.calories_eaten,r.protein_g,r.calories_burned,r.water_glasses,r.body_weight_kg].join(','))].join('\n'),`fittrack_${S.exportFilter}.csv`,'text/csv');toast('CSV downloaded!');}
function doExportJSON(){const d=buildExpData();if(!d.length){toast('No data',true);return;}dlFile(JSON.stringify(d,null,2),`fittrack_${S.exportFilter}.json`,'application/json');toast('JSON downloaded!');}
function doShareText(){const d=buildExpData();if(!d.length){toast('No data',true);return;}const t=d.map(r=>`📅 ${r.date}\n💪 ${r.split||'Rest'} · ${r.duration_min}min\n🍽️ ${r.calories_eaten} kcal · 🔥 ${r.calories_burned} kcal burned\n🥩 ${r.protein_g}g protein · ⚖️ ${r.body_weight_kg||'—'}kg\n`).join('\n');if(navigator.share)navigator.share({title:'FitTrack Export',text:t});else{navigator.clipboard?.writeText(t);toast('Copied to clipboard!');}}

// ═══════════════════════════════════════════════
//  SETTINGS (accessible from history page header)
// ═══════════════════════════════════════════════
function openSettings() {
  const p = S.profile;
  const modal = document.getElementById('modal-root');
  modal.innerHTML = `
  <div class="modal-backdrop" onclick="closeModal(event)">
    <div class="modal" onclick="event.stopPropagation()">
      <div class="modal-head">
        <div class="modal-title">⚙️ Settings</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>

      <div style="padding:16px;display:grid;gap:12px">
        <div><label class="lbl">Your Name</label><input id="s-name" class="inp" value="${p.name}"></div>
        <div><label class="lbl">Body Weight (kg)</label><input id="s-bw" type="number" class="inp" step="0.1" value="${p.weightKg}"></div>
        <div><label class="lbl">Daily Calorie Target</label><input id="s-cal" type="number" class="inp" value="${p.targetCal}"></div>
        <div><label class="lbl">Daily Protein Target (g)</label><input id="s-pro" type="number" class="inp" value="${p.targetProtein}"></div>
        <div><label class="lbl">Program Start Date</label><input id="s-start" type="date" class="inp" value="${new Date(p.startDate).toISOString().split('T')[0]}"></div>

        <div style="background:var(--card2);border:1px solid var(--line);border-radius:var(--r);padding:14px">
          <div style="font-size:13px;font-weight:700;margin-bottom:10px">🗓 Manual Day Override</div>
          <div style="font-size:12px;color:var(--sub);margin-bottom:10px">Override the auto-calculated day number. Useful if you started mid-plan or skipped days.</div>
          <div style="display:flex;align-items:center;gap:10px">
            <input id="s-manday" type="number" class="inp" style="max-width:100px" min="1" max="100"
              placeholder="Day #" value="${p.manualDay||''}">
            <span style="font-size:13px;color:var(--sub)">leave blank = auto</span>
          </div>
        </div>

        <button class="btn btn-a" onclick="saveSettings()">Save Settings</button>
        <button class="btn btn-r" onclick="clearAllData()">🗑 Clear All Data</button>
      </div>
    </div>
  </div>`;
}

function saveSettings() {
  S.profile.name = document.getElementById('s-name')?.value.trim() || 'Athlete';
  S.profile.weightKg = parseFloat(document.getElementById('s-bw')?.value)||100;
  S.profile.targetCal = parseInt(document.getElementById('s-cal')?.value)||2300;
  S.profile.targetProtein = parseInt(document.getElementById('s-pro')?.value)||200;
  const sd = document.getElementById('s-start')?.value;
  if (sd) S.profile.startDate = new Date(sd).toDateString();
  const md = parseInt(document.getElementById('s-manday')?.value);
  S.profile.manualDay = (md>=1&&md<=100) ? md : null;
  save();
  document.getElementById('modal-root').innerHTML='';
  render();
  toast('Settings saved ✓');
}

function clearAllData() {
  if (!confirm('Delete ALL data? This cannot be undone.')) return;
  S.logs={};
  save();
  document.getElementById('modal-root').innerHTML='';
  render();
  toast('All data cleared');
}

// ── INIT ─────────────────────────────────────────
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
  load();
  render();

  // Add settings gear to history page dynamically
  const orig = pgHistory;

  // Patch nav to show settings button
  document.getElementById('nav').insertAdjacentHTML('afterend',
    `<button onclick="openSettings()" style="
      position:fixed;top:12px;right:12px;z-index:500;
      background:var(--card);border:1px solid var(--line);
      width:36px;height:36px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:18px;cursor:pointer;color:var(--text);
    ">⚙️</button>`);

  // On export page, auto-update preview
  const origRender = render;
  window.renderOrig = origRender;
});

// Patch render to update export preview
const _origRender = render;
function render() {
  const el = document.getElementById('scroll');
  if (!el) return;
  const pages = {home:pgHome, workout:pgWorkout, calories:pgCalories, history:pgHistory, export:pgExport};
  el.innerHTML = `<div class="page">${(pages[S.page]||pgHome)()}</div>`;
  bindPage();
  if (S.page==='export') setTimeout(updateExpPreview, 40);
}
