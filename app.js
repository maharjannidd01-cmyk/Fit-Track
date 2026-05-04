// ═══════════════════════════════════════════════════
//  FITTRACK — 100 Day Workout & Calorie Tracker
//  All data, state, and rendering in one module
// ═══════════════════════════════════════════════════

// ─── 100-DAY PLAN DATA ───────────────────────────
const SPLITS = {
  PUSH: 'PUSH',
  PULL: 'PULL',
  LEGS: 'LEGS',
  UPPER: 'UPPER',
  LOWER: 'LOWER',
  HIIT: 'HIIT',
  REST: 'REST'
};

// Rotation: Push · Pull · Legs · Upper · Lower · HIIT · Rest
const DAY_ROTATION = [
  SPLITS.PUSH, SPLITS.PULL, SPLITS.LEGS,
  SPLITS.UPPER, SPLITS.LOWER, SPLITS.HIIT, SPLITS.REST
];

const SPLIT_META = {
  PUSH:  { label: 'Push Day',   color: '#ff5e3a', emoji: '💪', sub: 'Chest · Shoulders · Triceps' },
  PULL:  { label: 'Pull Day',   color: '#00cfff', emoji: '🔙', sub: 'Back · Biceps · Rear Delts' },
  LEGS:  { label: 'Leg Day',    color: '#b57fd4', emoji: '🦵', sub: 'Quads · Hamstrings · Glutes · Calves' },
  UPPER: { label: 'Upper Body', color: '#ffb800', emoji: '🏋️', sub: 'Full Upper Body Compound' },
  LOWER: { label: 'Lower Body', color: '#2ecc71', emoji: '⬇️', sub: 'Full Lower Body Power' },
  HIIT:  { label: 'HIIT Cardio',color: '#ff3d6a', emoji: '🔥', sub: 'High Intensity Intervals' },
  REST:  { label: 'Rest & Recovery', color: '#555', emoji: '😴', sub: 'Active recovery, stretch, walk' }
};

const WORKOUTS = {
  PUSH: [
    { name: 'Band Pull-Apart', sets: 3, reps: '15', note: 'Shoulder warm-up — always first' },
    { name: 'Incline Bench Press', sets: 4, reps: '10–12', note: 'Tempo 3-1-1, 40–65 kg' },
    { name: 'Flat DB Chest Press', sets: 3, reps: '12', note: 'Full stretch at bottom' },
    { name: 'Pec Dec / Fly Machine', sets: 3, reps: '12–15', note: 'Drop set on last set' },
    { name: 'DB Shoulder Press', sets: 3, reps: '12', note: 'Dumbbells — shoulder-safe' },
    { name: 'DB Lateral Raise', sets: 3, reps: '15', note: 'Superset with Face Pulls' },
    { name: 'Cable Face Pull', sets: 3, reps: '15', note: 'Superset with Lateral Raise' },
    { name: 'Cable Pushdown', sets: 3, reps: '12', note: 'Drop set last set' },
    { name: 'DB Overhead Extension', sets: 3, reps: '12', note: 'Elbows in, control' }
  ],
  PULL: [
    { name: 'Lat Pulldown (Wide)', sets: 4, reps: '10–12', note: 'Tempo 3-1-1, 45–70 kg' },
    { name: 'Seated Cable Row', sets: 4, reps: '12', note: 'Retract shoulder blades first' },
    { name: 'T-Bar Row', sets: 3, reps: '10–12', note: 'Chest on pad, full range' },
    { name: 'Single Arm DB Row', sets: 3, reps: '12 each', note: 'Keep hips square' },
    { name: 'Hammer Curl', sets: 3, reps: '12', note: 'Superset with Face Pull' },
    { name: 'Cable Face Pull', sets: 3, reps: '15', note: 'Superset with Hammer Curl' },
    { name: 'Preacher Curl', sets: 3, reps: '12', note: 'Drop set last set, 10–15 kg' },
    { name: 'Cable Straight Bar Curl', sets: 3, reps: '15', note: 'Squeeze at peak' }
  ],
  LEGS: [
    { name: 'Cycling Warm-up', sets: 1, reps: '5–8 min', note: 'Low resistance, knee warm-up' },
    { name: 'Weighted Sumo Squat', sets: 4, reps: '12', note: 'Tempo 3-1-1, 25–40 kg' },
    { name: 'Romanian Deadlift (RDL)', sets: 4, reps: '10–12', note: 'Feel hamstring stretch' },
    { name: 'Hamstring Curl (Lying)', sets: 4, reps: '12', note: 'Drop set last set, 40–55 kg' },
    { name: 'Wide Leg Press', sets: 3, reps: '12', note: 'Feet high+wide = glutes, 100–160 kg' },
    { name: 'Hip Thrust', sets: 3, reps: '15', note: 'Smith machine or barbell' },
    { name: 'Calf Raise', sets: 4, reps: '15–20', note: 'Superset with Tibialis Raise' },
    { name: 'Tibialis Raise', sets: 4, reps: '20', note: 'Superset — shin strength' }
  ],
  UPPER: [
    { name: 'Flat Barbell Bench Press', sets: 4, reps: '8–10', note: 'Heaviest compound, 60–75 kg' },
    { name: 'Bent Over Barbell Row', sets: 4, reps: '8–10', note: 'Superset with bench' },
    { name: 'DB Shoulder Press', sets: 3, reps: '10–12', note: 'Controlled tempo' },
    { name: 'Lat Pulldown', sets: 3, reps: '12', note: 'Full stretch at top' },
    { name: 'Incline DB Press', sets: 3, reps: '12', note: 'Upper chest focus' },
    { name: 'Cable Row', sets: 3, reps: '12', note: 'Squeeze at peak' },
    { name: 'Tricep Pushdown', sets: 3, reps: '12', note: 'Superset with Bicep Curl' },
    { name: 'EZ Bar Curl', sets: 3, reps: '12', note: 'Superset with Pushdown' },
    { name: 'Lateral Raise', sets: 3, reps: '15', note: 'Finisher — to failure' }
  ],
  LOWER: [
    { name: 'Cycling Warm-up', sets: 1, reps: '5 min', note: 'Activation warm-up' },
    { name: 'Back Squat', sets: 5, reps: '5', note: 'Heavy 5×5 — 60–80 kg' },
    { name: 'Leg Press', sets: 4, reps: '10–12', note: '160–200 kg, standard width' },
    { name: 'Walking Lunges', sets: 3, reps: '12 each', note: '15–20 kg dumbbells' },
    { name: 'Leg Extension', sets: 4, reps: '15', note: 'Drop set last set' },
    { name: 'Seated Hamstring Curl', sets: 3, reps: '12', note: 'Superset with Leg Ext' },
    { name: 'Adductor Machine', sets: 3, reps: '15', note: 'Hip stability' },
    { name: 'Calf Raise (Standing)', sets: 4, reps: '20', note: 'Full range, slow eccentric' }
  ],
  HIIT: [
    { name: 'Dynamic Warm-up', sets: 1, reps: '5 min', note: 'Jumping jacks, high knees' },
    { name: 'Bike Sprints', sets: 10, reps: '20s on / 40s off', note: 'Max effort each interval' },
    { name: 'Rowing Machine', sets: 8, reps: '250m sprint / 90s rest', note: 'All-out effort' },
    { name: 'Treadmill Sprint', sets: 8, reps: '30s on / 30s walk', note: 'Speed 10–12 on sprint' },
    { name: 'Battle Ropes', sets: 5, reps: '30s on / 30s off', note: 'Alternating waves' },
    { name: 'Burpees', sets: 3, reps: '10', note: 'Full extension at top' },
    { name: 'Cool-down Walk', sets: 1, reps: '5 min', note: 'HR back to 100 bpm' }
  ],
  REST: [
    { name: 'Light Walk', sets: 1, reps: '20–30 min', note: 'Keep moving, low intensity' },
    { name: 'Full Body Stretch', sets: 1, reps: '15 min', note: 'Focus on worked muscles' },
    { name: 'Foam Rolling', sets: 1, reps: '10 min', note: 'Quads, hamstrings, lats' },
    { name: 'Breathwork / Meditation', sets: 1, reps: '10 min', note: 'Stress = cortisol = fat storage' }
  ]
};

const CALORIE_BURN = {
  PUSH: 380, PULL: 350, LEGS: 480, UPPER: 420, LOWER: 460, HIIT: 550, REST: 120
};

// ─── FOOD DATABASE ────────────────────────────────
const FOOD_DB = [
  { name: 'Chicken Breast (100g)', cal: 165, p: 31, c: 0, f: 3.6 },
  { name: 'Brown Rice (100g cooked)', cal: 112, p: 2.6, c: 24, f: 0.9 },
  { name: 'White Rice (100g cooked)', cal: 130, p: 2.7, c: 28, f: 0.3 },
  { name: 'Eggs (1 whole)', cal: 78, p: 6, c: 0.6, f: 5 },
  { name: 'Egg White (1)', cal: 17, p: 3.6, c: 0.2, f: 0.1 },
  { name: 'Paneer (100g)', cal: 265, p: 18, c: 3, f: 20 },
  { name: 'Dal / Lentils (100g cooked)', cal: 116, p: 9, c: 20, f: 0.4 },
  { name: 'Soya Chunks (100g dry)', cal: 345, p: 52, c: 26, f: 0.5 },
  { name: 'Greek Yogurt (100g)', cal: 59, p: 10, c: 3.6, f: 0.4 },
  { name: 'Curd / Dahi (100g)', cal: 98, p: 11, c: 3.4, f: 4.3 },
  { name: 'Banana (1 medium)', cal: 89, p: 1.1, c: 23, f: 0.3 },
  { name: 'Apple (1 medium)', cal: 95, p: 0.5, c: 25, f: 0.3 },
  { name: 'Oats (100g dry)', cal: 389, p: 17, c: 66, f: 7 },
  { name: 'Whey Protein (1 scoop 30g)', cal: 120, p: 24, c: 3, f: 1.5 },
  { name: 'Roti / Chapati (1)', cal: 104, p: 3, c: 20, f: 1.5 },
  { name: 'Milk (200ml)', cal: 122, p: 6.4, c: 9.6, f: 4.8 },
  { name: 'Peanut Butter (1 tbsp)', cal: 94, p: 4, c: 3, f: 8 },
  { name: 'Almonds (10 nuts)', cal: 69, p: 2.5, c: 2.4, f: 6 },
  { name: 'Sweet Potato (100g)', cal: 86, p: 1.6, c: 20, f: 0.1 },
  { name: 'Fish Rohu (100g)', cal: 97, p: 17, c: 0, f: 2.8 },
  { name: 'Broccoli (100g)', cal: 34, p: 2.8, c: 7, f: 0.4 },
  { name: 'Spinach (100g)', cal: 23, p: 2.9, c: 3.6, f: 0.4 },
  { name: 'Potato (100g boiled)', cal: 87, p: 1.9, c: 20, f: 0.1 },
  { name: 'Chana / Chickpeas (100g)', cal: 164, p: 9, c: 27, f: 2.6 },
  { name: 'Olive Oil (1 tbsp)', cal: 119, p: 0, c: 0, f: 14 },
  { name: 'Coconut Oil (1 tbsp)', cal: 121, p: 0, c: 0, f: 14 },
  { name: 'Protein Bar (1)', cal: 200, p: 20, c: 22, f: 7 },
  { name: 'Dosa (1 plain)', cal: 133, p: 3, c: 26, f: 2 },
  { name: 'Idli (1)', cal: 39, p: 1.9, c: 8, f: 0.2 },
  { name: 'Sambar (100ml)', cal: 55, p: 3, c: 8, f: 1 }
];

// ─── STATE ────────────────────────────────────────
const STATE = {
  currentPage: 'home',
  startDate: null,
  today: new Date().toDateString(),
  logs: {},       // { 'Mon Jan 01 2026': { done: [], calories: [], water: 0, weight: null } }
  profile: { name: 'Athlete', targetCals: 2300, targetProtein: 200 }
};

function getStorage() {
  try {
    const d = localStorage.getItem('fittrack_data');
    return d ? JSON.parse(d) : {};
  } catch { return {}; }
}
function setStorage(data) {
  try { localStorage.setItem('fittrack_data', JSON.stringify(data)); } catch {}
}

function loadState() {
  const saved = getStorage();
  if (saved.startDate) STATE.startDate = saved.startDate;
  if (saved.logs) STATE.logs = saved.logs;
  if (saved.profile) STATE.profile = { ...STATE.profile, ...saved.profile };
}
function saveState() {
  setStorage({ startDate: STATE.startDate, logs: STATE.logs, profile: STATE.profile });
}

function getTodayLog() {
  if (!STATE.logs[STATE.today]) {
    STATE.logs[STATE.today] = { done: [], calories: [], water: 0, weight: null, cardioMin: 0 };
  }
  return STATE.logs[STATE.today];
}

function getDayNumber() {
  if (!STATE.startDate) return 1;
  const start = new Date(STATE.startDate);
  const now = new Date();
  const diff = Math.floor((now - start) / 86400000) + 1;
  return Math.min(Math.max(diff, 1), 100);
}

function getDaySplit(dayNum) {
  return DAY_ROTATION[(dayNum - 1) % 7];
}

function getTotalCaloriesConsumed() {
  return getTodayLog().calories.reduce((s, f) => s + f.cal, 0);
}
function getTotalProtein() {
  return getTodayLog().calories.reduce((s, f) => s + (f.p || 0), 0);
}
function getCaloriesBurned() {
  const split = getDaySplit(getDayNumber());
  const log = getTodayLog();
  const base = log.done.length > 0 ? CALORIE_BURN[split] : 0;
  const cardio = (log.cardioMin || 0) * 7;
  return base + cardio;
}

// ─── RENDER SYSTEM ────────────────────────────────
function $(id) { return document.getElementById(id); }
function html(tag, cls, content, attrs = '') {
  return `<${tag} class="${cls}" ${attrs}>${content}</${tag}>`;
}

function renderApp() {
  loadState();
  if (!STATE.startDate) STATE.startDate = new Date().toDateString();
  document.getElementById('app').innerHTML = buildShell();
  attachNav();
  renderPage(STATE.currentPage);
}

function buildShell() {
  return `
    <div id="shell">
      <div id="page-content"></div>
      <nav id="bottom-nav">
        <button class="nav-btn" data-page="home" onclick="navigate('home')">
          <span class="nav-icon">🏠</span><span class="nav-label">Home</span>
        </button>
        <button class="nav-btn" data-page="workout" onclick="navigate('workout')">
          <span class="nav-icon">💪</span><span class="nav-label">Workout</span>
        </button>
        <button class="nav-btn" data-page="calories" onclick="navigate('calories')">
          <span class="nav-icon">🍽️</span><span class="nav-label">Calories</span>
        </button>
        <button class="nav-btn" data-page="progress" onclick="navigate('progress')">
          <span class="nav-icon">📈</span><span class="nav-label">Progress</span>
        </button>
        <button class="nav-btn" data-page="plan" onclick="navigate('plan')">
          <span class="nav-icon">📅</span><span class="nav-label">Plan</span>
        </button>
      </nav>
    </div>`;
}

function attachNav() {
  updateNavActive();
}

function navigate(page) {
  STATE.currentPage = page;
  updateNavActive();
  renderPage(page);
}

function updateNavActive() {
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === STATE.currentPage);
  });
}

function renderPage(page) {
  const pc = $('page-content');
  if (!pc) return;
  const pages = { home: renderHome, workout: renderWorkout, calories: renderCalories, progress: renderProgress, plan: renderPlan };
  pc.innerHTML = (pages[page] || renderHome)();
  bindPageEvents(page);
}

// ─── HOME PAGE ────────────────────────────────────
function renderHome() {
  const dayNum = getDayNumber();
  const split = getDaySplit(dayNum);
  const meta = SPLIT_META[split];
  const log = getTodayLog();
  const consumed = getTotalCaloriesConsumed();
  const burned = getCaloriesBurned();
  const protein = getTotalProtein();
  const progress = Math.round((dayNum / 100) * 100);
  const workoutsDone = log.done.length;
  const totalExercises = WORKOUTS[split].length;
  const net = consumed - burned;
  const deficit = STATE.profile.targetCals - consumed;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return `
  <div class="page home-page">
    <div class="home-header">
      <div class="home-greeting">
        <div class="greeting-text">Day <span class="day-num">${dayNum}</span> of 100</div>
        <div class="date-str">${dateStr}</div>
      </div>
      <div class="streak-badge">🔥 ${getStreak()} day streak</div>
    </div>

    <div class="today-card" style="--split-color:${meta.color}">
      <div class="today-split-label">TODAY'S SPLIT</div>
      <div class="today-split-name">${meta.emoji} ${meta.label}</div>
      <div class="today-split-sub">${meta.sub}</div>
      <div class="today-progress-row">
        <span>${workoutsDone}/${totalExercises} exercises</span>
        <span>${Math.round((workoutsDone/totalExercises)*100)}%</span>
      </div>
      <div class="today-progress-bar">
        <div class="today-progress-fill" style="width:${Math.round((workoutsDone/totalExercises)*100)}%"></div>
      </div>
      <button class="btn-primary" onclick="navigate('workout')">Start Workout →</button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🍽️</div>
        <div class="stat-val">${consumed}</div>
        <div class="stat-label">kcal eaten</div>
        <div class="stat-sub">target ${STATE.profile.targetCals}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-val">${burned}</div>
        <div class="stat-label">kcal burned</div>
        <div class="stat-sub">est. from training</div>
      </div>
      <div class="stat-card ${net > STATE.profile.targetCals ? 'warn' : 'good'}">
        <div class="stat-icon">⚖️</div>
        <div class="stat-val">${net > 0 ? '+' : ''}${net}</div>
        <div class="stat-label">net calories</div>
        <div class="stat-sub">${deficit > 0 ? deficit + ' under target' : Math.abs(deficit) + ' over target'}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🥩</div>
        <div class="stat-val">${Math.round(protein)}g</div>
        <div class="stat-label">protein</div>
        <div class="stat-sub">target ${STATE.profile.targetProtein}g</div>
      </div>
    </div>

    <div class="section-title">100-Day Progress</div>
    <div class="overall-progress">
      <div class="overall-bar">
        <div class="overall-fill" style="width:${progress}%"></div>
        <div class="overall-label">${progress}% complete</div>
      </div>
    </div>

    <div class="section-title">Water & Weight</div>
    <div class="water-weight-row">
      <div class="water-card">
        <div class="ww-label">💧 Water</div>
        <div class="water-glasses">
          ${[1,2,3,4,5,6,7,8].map(i => `<button class="glass-btn ${(log.water||0) >= i ? 'filled' : ''}" onclick="logWater(${i})">${(log.water||0) >= i ? '💧' : '○'}</button>`).join('')}
        </div>
        <div class="ww-sub">${log.water || 0}/8 glasses</div>
      </div>
      <div class="weight-card">
        <div class="ww-label">⚖️ Weight</div>
        <input type="number" class="weight-input" placeholder="${log.weight || 'kg'}" value="${log.weight || ''}" onchange="logWeight(this.value)" step="0.1">
        <div class="ww-sub">log today's weight</div>
      </div>
    </div>

    <div class="upcoming-section">
      <div class="section-title">Upcoming Days</div>
      <div class="upcoming-list">
        ${[1,2,3].map(i => {
          const d = dayNum + i;
          if (d > 100) return '';
          const s = getDaySplit(d);
          const m = SPLIT_META[s];
          return `<div class="upcoming-item" style="border-left-color:${m.color}">
            <span class="upcoming-day">Day ${d}</span>
            <span class="upcoming-split">${m.emoji} ${m.label}</span>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

function logWater(glasses) {
  getTodayLog().water = glasses;
  saveState();
  renderPage('home');
}
function logWeight(val) {
  getTodayLog().weight = parseFloat(val);
  saveState();
}
function getStreak() {
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const key = d.toDateString();
    const log = STATE.logs[key];
    if (log && (log.done.length > 0 || log.calories.length > 0)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

// ─── WORKOUT PAGE ─────────────────────────────────
function renderWorkout() {
  const dayNum = getDayNumber();
  const split = getDaySplit(dayNum);
  const meta = SPLIT_META[split];
  const exercises = WORKOUTS[split];
  const log = getTodayLog();

  return `
  <div class="page workout-page">
    <div class="page-header" style="--split-color:${meta.color}">
      <div class="page-header-top">
        <div class="ph-day">Day ${dayNum} · ${meta.label}</div>
        <div class="ph-sub">${meta.sub}</div>
      </div>
      <div class="est-burn">~${CALORIE_BURN[split]} kcal estimated burn</div>
    </div>

    <div class="cardio-log-row">
      <label class="cardio-label">Extra Cardio / LISS (minutes):</label>
      <div class="cardio-input-row">
        <input type="number" id="cardio-min" class="cardio-min-input" value="${log.cardioMin || 0}" min="0" max="120">
        <button class="btn-small" onclick="saveCardio()">Save</button>
      </div>
    </div>

    <div class="exercises-list">
      ${exercises.map((ex, i) => {
        const done = log.done.includes(i);
        return `
        <div class="exercise-item ${done ? 'done' : ''}" id="ex-${i}" onclick="toggleExercise(${i})">
          <div class="ex-check">${done ? '✓' : ''}</div>
          <div class="ex-info">
            <div class="ex-name">${ex.name}</div>
            <div class="ex-sets">${ex.sets} sets × ${ex.reps}</div>
            <div class="ex-note">${ex.note}</div>
          </div>
          <div class="ex-right">
            <div class="ex-num">${i + 1}</div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="workout-footer">
      <div class="workout-completion">
        ${log.done.length}/${exercises.length} exercises completed
      </div>
      ${log.done.length === exercises.length ? `
        <div class="workout-complete-badge">🎉 Workout Complete!</div>
      ` : ''}
      <button class="btn-primary" onclick="navigate('calories')" style="margin-top:16px">Log Food →</button>
    </div>
  </div>`;
}

function toggleExercise(idx) {
  const log = getTodayLog();
  const pos = log.done.indexOf(idx);
  if (pos === -1) log.done.push(idx);
  else log.done.splice(pos, 1);
  saveState();
  renderPage('workout');
}
function saveCardio() {
  const val = parseInt($('cardio-min').value) || 0;
  getTodayLog().cardioMin = val;
  saveState();
  showToast('Cardio saved!');
}

// ─── CALORIES PAGE ────────────────────────────────
function renderCalories() {
  const log = getTodayLog();
  const consumed = getTotalCaloriesConsumed();
  const protein = getTotalProtein();
  const carbs = log.calories.reduce((s, f) => s + (f.c || 0), 0);
  const fats = log.calories.reduce((s, f) => s + (f.f || 0), 0);
  const remaining = STATE.profile.targetCals - consumed;
  const pct = Math.min(Math.round((consumed / STATE.profile.targetCals) * 100), 100);

  return `
  <div class="page calories-page">
    <div class="page-header">
      <div class="ph-day">Calorie Tracker</div>
      <div class="ph-sub">Target: ${STATE.profile.targetCals} kcal · ${STATE.profile.targetProtein}g protein</div>
    </div>

    <div class="calorie-ring-section">
      <div class="calorie-ring">
        <svg viewBox="0 0 120 120" class="ring-svg">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#1a1a2e" stroke-width="12"/>
          <circle cx="60" cy="60" r="52" fill="none" stroke="#c8ff00" stroke-width="12"
            stroke-dasharray="${2*Math.PI*52}" stroke-dashoffset="${2*Math.PI*52*(1-pct/100)}"
            stroke-linecap="round" transform="rotate(-90 60 60)"/>
        </svg>
        <div class="ring-center">
          <div class="ring-val">${consumed}</div>
          <div class="ring-label">eaten</div>
        </div>
      </div>
      <div class="macro-summary">
        <div class="macro-item"><span class="macro-dot" style="background:#00cfff"></span><span>${Math.round(protein)}g Protein</span></div>
        <div class="macro-item"><span class="macro-dot" style="background:#c8ff00"></span><span>${Math.round(carbs)}g Carbs</span></div>
        <div class="macro-item"><span class="macro-dot" style="background:#ff5e3a"></span><span>${Math.round(fats)}g Fats</span></div>
        <div class="macro-item remaining ${remaining < 0 ? 'over' : ''}">
          <span>→</span><span>${remaining >= 0 ? remaining + ' kcal left' : Math.abs(remaining) + ' kcal over'}</span>
        </div>
      </div>
    </div>

    <div class="food-search-section">
      <div class="section-title">Add Food</div>
      <input type="text" id="food-search" class="food-search-input" placeholder="Search food..." oninput="renderFoodSearch()" autocomplete="off">
      <div id="food-results" class="food-results"></div>
    </div>

    <div class="custom-food-section">
      <div class="section-title">Add Custom</div>
      <div class="custom-food-form">
        <input type="text" id="cf-name" placeholder="Food name" class="cf-input">
        <input type="number" id="cf-cal" placeholder="Calories" class="cf-input small">
        <input type="number" id="cf-p" placeholder="Protein g" class="cf-input small">
        <input type="number" id="cf-c" placeholder="Carbs g" class="cf-input small">
        <input type="number" id="cf-f" placeholder="Fat g" class="cf-input small">
        <button class="btn-primary" onclick="addCustomFood()" style="width:100%">Add to Log</button>
      </div>
    </div>

    <div class="food-log-section">
      <div class="section-title">Today's Food Log</div>
      ${log.calories.length === 0 ? '<div class="empty-log">No food logged yet</div>' :
        log.calories.map((f, i) => `
          <div class="food-log-item">
            <div class="food-log-info">
              <div class="food-log-name">${f.name}</div>
              <div class="food-log-macros">${f.p||0}g P · ${f.c||0}g C · ${f.f||0}g F</div>
            </div>
            <div class="food-log-cal">${f.cal} kcal</div>
            <button class="food-remove-btn" onclick="removeFood(${i})">✕</button>
          </div>`).join('')
      }
    </div>
  </div>`;
}

function renderFoodSearch() {
  const q = $('food-search').value.toLowerCase().trim();
  const res = $('food-results');
  if (!q) { res.innerHTML = ''; return; }
  const matches = FOOD_DB.filter(f => f.name.toLowerCase().includes(q)).slice(0, 6);
  res.innerHTML = matches.map(f => `
    <div class="food-result-item" onclick="addFood('${f.name}',${f.cal},${f.p},${f.c},${f.f})">
      <span class="fr-name">${f.name}</span>
      <span class="fr-cal">${f.cal} kcal</span>
    </div>`).join('') || '<div class="no-results">No matches</div>';
}

function addFood(name, cal, p, c, f) {
  getTodayLog().calories.push({ name, cal, p, c, f });
  saveState();
  $('food-search').value = '';
  $('food-results').innerHTML = '';
  renderPage('calories');
  showToast(`${name} added!`);
}

function addCustomFood() {
  const name = $('cf-name').value.trim();
  const cal = parseInt($('cf-cal').value) || 0;
  const p = parseFloat($('cf-p').value) || 0;
  const c = parseFloat($('cf-c').value) || 0;
  const f = parseFloat($('cf-f').value) || 0;
  if (!name || !cal) { showToast('Enter name and calories', true); return; }
  getTodayLog().calories.push({ name, cal, p, c, f });
  saveState();
  renderPage('calories');
  showToast(`${name} added!`);
}

function removeFood(idx) {
  getTodayLog().calories.splice(idx, 1);
  saveState();
  renderPage('calories');
}

// ─── PROGRESS PAGE ────────────────────────────────
function renderProgress() {
  const dayNum = getDayNumber();
  const totalWorkouts = Object.values(STATE.logs).filter(l => l.done && l.done.length > 0).length;
  const totalCalLogged = Object.values(STATE.logs).filter(l => l.calories && l.calories.length > 0).length;
  const weights = Object.entries(STATE.logs)
    .filter(([, l]) => l.weight)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .slice(-10);
  const streak = getStreak();

  // Weekly summary for last 7 days
  const weekData = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const key = d.toDateString();
    const log = STATE.logs[key] || {};
    weekData.push({
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      cal: (log.calories || []).reduce((s, f) => s + f.cal, 0),
      exercisesDone: (log.done || []).length,
      water: log.water || 0
    });
  }

  const maxCal = Math.max(...weekData.map(d => d.cal), STATE.profile.targetCals);

  return `
  <div class="page progress-page">
    <div class="page-header">
      <div class="ph-day">Your Progress</div>
      <div class="ph-sub">Day ${dayNum} of 100</div>
    </div>

    <div class="progress-stats">
      <div class="prog-stat"><div class="ps-val">${dayNum}</div><div class="ps-label">Day</div></div>
      <div class="prog-stat"><div class="ps-val">${totalWorkouts}</div><div class="ps-label">Workouts</div></div>
      <div class="prog-stat"><div class="ps-val">${streak}</div><div class="ps-label">Streak 🔥</div></div>
      <div class="prog-stat"><div class="ps-val">${totalCalLogged}</div><div class="ps-label">Days Logged</div></div>
    </div>

    <div class="section-title">Weekly Calories</div>
    <div class="chart-container">
      <div class="bar-chart">
        ${weekData.map(d => `
          <div class="bar-col">
            <div class="bar-wrap">
              <div class="bar-fill ${d.cal > STATE.profile.targetCals ? 'over' : 'under'}"
                style="height:${maxCal > 0 ? Math.round((d.cal/maxCal)*100) : 0}%">
                ${d.cal > 0 ? `<span class="bar-val">${d.cal}</span>` : ''}
              </div>
            </div>
            <div class="bar-label">${d.label}</div>
          </div>`).join('')}
      </div>
      <div class="target-line" style="bottom:${Math.round((STATE.profile.targetCals/maxCal)*100)}%">
        <span class="target-label">Target</span>
      </div>
    </div>

    <div class="section-title">Weight History</div>
    ${weights.length === 0 ? '<div class="empty-log">No weight logged yet — log daily from Home</div>' :
      `<div class="weight-list">
        ${weights.map(([date, log]) => `
          <div class="weight-entry">
            <span class="we-date">${new Date(date).toLocaleDateString('en-IN', {day:'numeric',month:'short'})}</span>
            <span class="we-weight">${log.weight} kg</span>
          </div>`).join('')}
      </div>`
    }

    <div class="section-title">This Week Activity</div>
    <div class="week-activity">
      ${weekData.map(d => `
        <div class="wa-item">
          <div class="wa-day">${d.label}</div>
          <div class="wa-bar ${d.exercisesDone > 0 ? 'active' : ''}">
            ${d.exercisesDone > 0 ? d.exercisesDone : '—'}
          </div>
          <div class="wa-sub">ex done</div>
        </div>`).join('')}
    </div>

    <div class="section-title">Profile Settings</div>
    <div class="profile-form">
      <label class="pf-label">Name</label>
      <input class="pf-input" id="pf-name" value="${STATE.profile.name}" placeholder="Your name">
      <label class="pf-label">Daily Calorie Target (kcal)</label>
      <input class="pf-input" id="pf-cals" type="number" value="${STATE.profile.targetCals}">
      <label class="pf-label">Daily Protein Target (g)</label>
      <input class="pf-input" id="pf-protein" type="number" value="${STATE.profile.targetProtein}">
      <label class="pf-label">Program Start Date</label>
      <input class="pf-input" id="pf-start" type="date" value="${STATE.startDate ? new Date(STATE.startDate).toISOString().split('T')[0] : ''}">
      <button class="btn-primary" onclick="saveProfile()" style="margin-top:12px">Save Profile</button>
    </div>
  </div>`;
}

function saveProfile() {
  STATE.profile.name = $('pf-name').value || 'Athlete';
  STATE.profile.targetCals = parseInt($('pf-cals').value) || 2300;
  STATE.profile.targetProtein = parseInt($('pf-protein').value) || 200;
  const sd = $('pf-start').value;
  if (sd) STATE.startDate = new Date(sd).toDateString();
  saveState();
  showToast('Profile saved!');
  renderPage('progress');
}

// ─── PLAN PAGE ────────────────────────────────────
function renderPlan() {
  const dayNum = getDayNumber();
  return `
  <div class="page plan-page">
    <div class="page-header">
      <div class="ph-day">100-Day Plan</div>
      <div class="ph-sub">Full split breakdown — tap a day to view</div>
    </div>

    <div class="split-legend">
      ${Object.entries(SPLIT_META).map(([k, m]) => `
        <div class="legend-item" style="border-color:${m.color}">
          <span>${m.emoji}</span><span>${m.label}</span>
        </div>`).join('')}
    </div>

    <div class="days-grid">
      ${Array.from({length:100},(_,i)=>{
        const d = i+1;
        const s = getDaySplit(d);
        const m = SPLIT_META[s];
        const isDone = d < dayNum;
        const isToday = d === dayNum;
        const log = Object.values(STATE.logs)[0]; // rough check
        return `<div class="day-cell ${isDone ? 'done' : ''} ${isToday ? 'today' : ''}"
          style="--dc:${m.color}" onclick="showDayDetail(${d})">
          <div class="dc-num">${d}</div>
          <div class="dc-emoji">${m.emoji}</div>
        </div>`;
      }).join('')}
    </div>

    <div id="day-detail" class="day-detail-panel" style="display:none"></div>
  </div>`;
}

function showDayDetail(d) {
  const split = getDaySplit(d);
  const meta = SPLIT_META[split];
  const exercises = WORKOUTS[split];
  const panel = $('day-detail');
  panel.style.display = 'block';
  panel.innerHTML = `
    <div class="dd-header" style="border-color:${meta.color}">
      <div class="dd-title">${meta.emoji} Day ${d} — ${meta.label}</div>
      <div class="dd-sub">${meta.sub}</div>
      <button class="dd-close" onclick="$('day-detail').style.display='none'">✕</button>
    </div>
    <div class="dd-exercises">
      ${exercises.map((ex, i) => `
        <div class="dd-ex">
          <div class="dd-ex-num">${i+1}</div>
          <div class="dd-ex-info">
            <div class="dd-ex-name">${ex.name}</div>
            <div class="dd-ex-sets">${ex.sets} × ${ex.reps}</div>
            <div class="dd-ex-note">${ex.note}</div>
          </div>
        </div>`).join('')}
    </div>
    <div class="dd-burn">~${CALORIE_BURN[split]} kcal estimated burn</div>`;
  panel.scrollIntoView({ behavior: 'smooth' });
}

// ─── EVENTS ───────────────────────────────────────
function bindPageEvents(page) {
  // page-specific bindings handled inline
}

// ─── TOAST ────────────────────────────────────────
function showToast(msg, isError = false) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = 'toast ' + (isError ? 'toast-error' : 'toast-ok');
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 2200);
}

// ─── INIT ─────────────────────────────────────────
window.onload = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  renderApp();
};
