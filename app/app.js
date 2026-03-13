/* ═══════════════════════════════════════════════════════════
   FORGE TIMER v2 — app.js
   Fixes: mic permission flow, voice command reliability,
          timer resync on visibility, countdown animation,
          coach mode, import modal display, share encoding.
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ────────────────────────────────────────────────────────────
   TRANSLATIONS
──────────────────────────────────────────────────────────── */
const L = {
  en:{
    navHome:'Home', navCreate:'Create', navSaved:'Saved', navHistory:'History', navSettings:'Settings',
    eyebrow:'READY TO TRAIN?',
    tagline:"Tell us your workout. We'll handle the <em>timer</em>.",
    homeSub:'Type or speak your workout, or pick a preset.',
    inputPh:'e.g. "10 rounds 40s work 20s rest" or "Tabata"',
    quickStart:'QUICK START', recent:'RECENT',
    createTitle:'CREATE WORKOUT', createSub:'Build your custom timer',
    savedTitle:'SAVED WORKOUTS', savedSub:'Your presets',
    histTitle:'HISTORY', histSub:'Past workouts',
    settTitle:'SETTINGS', settSub:'Preferences',
    mInterval:'INTERVAL', mTabata:'TABATA', mEmom:'EMOM', mAmrap:'AMRAP', mRun:'RUNNING', mCircuit:'CIRCUIT',
    wname:'Name', warmup:'Warm-up', work:'Work', rest:'Rest',
    rounds:'Rounds', cooldown:'Cool-down',
    incWarm:'Include Warm-up', incCool:'Include Cool-down',
    voice:'Voice Guidance', vibration:'Vibration', sounds:'Sound Alerts', lang:'Language',
    coachMode:'Coach Mode', general:'GENERAL', audio:'AUDIO', timer:'TIMER',
    startW:'START WORKOUT', saveP:'SAVE PRESET',
    noSaved:'No saved workouts yet', noSavedDesc:'Create and save a workout to see it here.',
    noHist:'No completed workouts', noHistDesc:'Finish a workout to see your history.',
    phWork:'WORK', phRest:'REST', phWarm:'WARM-UP', phCool:'COOL-DOWN', phDone:'DONE', phReady:'GET READY',
    nextUp:'Next:', roundOf:'Round', of:'of',
    sumEyebrow:'WORKOUT COMPLETE', sumTitle:'GREAT WORK!',
    totalTime:'TIME', totalRounds:'ROUNDS', totalIntervals:'INTERVALS', calories:'CALS',
    doAgain:'DO IT AGAIN', backHome:'HOME', share:'SHARE', close:'CLOSE',
    shareTitle:'Share Workout', shareCopy:'COPY LINK', copied:'Link copied!',
    savedMsg:'Workout saved!', deletedMsg:'Deleted.',
    countdownSub:'GET READY', go:'GO!',
    voiceWork:'Start working', voiceRest:'Rest now', voiceNext:'Next round',
    voiceDone:'Workout complete. Great job!', voiceWarm:'Begin warm-up', voiceCool:'Cool down',
    voiceAlmost:'Almost done!',
    exportBtn:'EXPORT', importBtn:'IMPORT',
    importTitle:'Import Workouts', importDrop:'Paste JSON or drop a file here', importDo:'IMPORT',
    micListen:'Listening...', micError:'Mic unavailable', micUnsupported:'Voice not supported in this browser.',
    micDenied:'Microphone access denied. Please allow it in your browser settings.',
    micTip:'Tip: Try Chrome or Safari for best voice support.',
    voiceCmdOn:'VOICE COMMANDS ON', voiceCmdOff:'Voice cmds',
    seconds:'seconds',
  },
  es:{
    navHome:'Inicio', navCreate:'Crear', navSaved:'Guardados', navHistory:'Historial', navSettings:'Ajustes',
    eyebrow:'¿LISTO PARA ENTRENAR?',
    tagline:"Describe tu rutina. Nosotros manejamos el <em>timer</em>.",
    homeSub:'Escribe o habla tu rutina, o elige un preset.',
    inputPh:'"10 rondas 40s trabajo 20s descanso" o "Tabata"',
    quickStart:'INICIO RÁPIDO', recent:'RECIENTES',
    createTitle:'CREAR RUTINA', createSub:'Configura tu temporizador',
    savedTitle:'GUARDADOS', savedSub:'Tus presets',
    histTitle:'HISTORIAL', histSub:'Entrenamientos pasados',
    settTitle:'AJUSTES', settSub:'Preferencias',
    mInterval:'INTERVALO', mTabata:'TABATA', mEmom:'EMOM', mAmrap:'AMRAP', mRun:'CARRERA', mCircuit:'CIRCUITO',
    wname:'Nombre', warmup:'Calentamiento', work:'Trabajo', rest:'Descanso',
    rounds:'Rondas', cooldown:'Enfriamiento',
    incWarm:'Incluir calentamiento', incCool:'Incluir enfriamiento',
    voice:'Guía por voz', vibration:'Vibración', sounds:'Alertas de sonido', lang:'Idioma',
    coachMode:'Modo Coach', general:'GENERAL', audio:'AUDIO', timer:'TIMER',
    startW:'INICIAR', saveP:'GUARDAR',
    noSaved:'Sin rutinas guardadas', noSavedDesc:'Crea y guarda una rutina para verla aquí.',
    noHist:'Sin entrenamientos completados', noHistDesc:'Completa una rutina para ver tu historial.',
    phWork:'TRABAJO', phRest:'DESCANSO', phWarm:'CALENTAMIENTO', phCool:'ENFRIAMIENTO', phDone:'LISTO', phReady:'PREPÁRATE',
    nextUp:'Siguiente:', roundOf:'Ronda', of:'de',
    sumEyebrow:'ENTRENAMIENTO COMPLETO', sumTitle:'¡BIEN HECHO!',
    totalTime:'TIEMPO', totalRounds:'RONDAS', totalIntervals:'INTERVALOS', calories:'CALS',
    doAgain:'REPETIR', backHome:'INICIO', share:'COMPARTIR', close:'CERRAR',
    shareTitle:'Compartir Rutina', shareCopy:'COPIAR ENLACE', copied:'¡Enlace copiado!',
    savedMsg:'¡Rutina guardada!', deletedMsg:'Eliminada.',
    countdownSub:'PREPÁRATE', go:'¡YA!',
    voiceWork:'¡Empieza!', voiceRest:'Descansa', voiceNext:'Siguiente ronda',
    voiceDone:'Entrenamiento completo. ¡Muy bien!', voiceWarm:'Comienza el calentamiento', voiceCool:'Enfriamiento',
    voiceAlmost:'¡Casi terminado!',
    exportBtn:'EXPORTAR', importBtn:'IMPORTAR',
    importTitle:'Importar Rutinas', importDrop:'Pega JSON o suelta un archivo aquí', importDo:'IMPORTAR',
    micListen:'Escuchando...', micError:'Micrófono no disponible', micUnsupported:'Voz no compatible en este navegador.',
    micDenied:'Acceso al micrófono denegado. Permítelo en tu navegador.',
    micTip:'Tip: Usa Chrome o Safari para mejor soporte de voz.',
    voiceCmdOn:'COMANDOS DE VOZ ACTIVOS', voiceCmdOff:'Cmds de voz',
    seconds:'segundos',
  }
};

let lang = localStorage.getItem('forge-lang') || 'en';
const t = k => (L[lang][k] || L.en[k] || k);

/* ────────────────────────────────────────────────────────────
   SETTINGS & STORAGE
──────────────────────────────────────────────────────────── */
const DEF_SETTINGS = { voiceGuidance:true, soundAlerts:true, vibration:true, coachMode:false };
let S = (() => { try { return JSON.parse(localStorage.getItem('forge-settings')) || {...DEF_SETTINGS}; } catch(e) { return {...DEF_SETTINGS}; } })();
let savedWorkouts = (() => { try { return JSON.parse(localStorage.getItem('forge-workouts')) || []; } catch(e) { return []; } })();
let workoutHistory = (() => { try { return JSON.parse(localStorage.getItem('forge-history')) || []; } catch(e) { return []; } })();
const saveSettings = () => { try { localStorage.setItem('forge-settings', JSON.stringify(S)); } catch(e){} };
const saveSaved    = () => { try { localStorage.setItem('forge-workouts', JSON.stringify(savedWorkouts)); } catch(e){} };
const saveHistory  = () => { try { localStorage.setItem('forge-history', JSON.stringify(workoutHistory)); } catch(e){} };

/* ────────────────────────────────────────────────────────────
   AUDIO ENGINE
──────────────────────────────────────────────────────────── */
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function beep(freq, dur, type = 'square', vol = 0.35) {
  if (!S.soundAlerts) return;
  try {
    const c = getAudioCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g);
    g.connect(c.destination);
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.start(c.currentTime);
    o.stop(c.currentTime + dur);
  } catch (e) {}
}

function beepWork()      { beep(880,0.10,'square',.38); setTimeout(()=>beep(1100,0.14,'square',.28),140); }
function beepRest()      { beep(440,0.25,'sine',.25); }
function beepCountdown() { beep(660,0.08,'square',.28); }
function beepGo()        { beep(880,0.10,'square',.38); setTimeout(()=>beep(1100,0.10,'square',.38),90); setTimeout(()=>beep(1320,0.22,'square',.32),180); }
function beepDone()      { [0,140,280].forEach((d,i)=>setTimeout(()=>beep(880+i*220,0.18,'sine',.28),d)); }

/* ────────────────────────────────────────────────────────────
   VOICE SPEECH SYNTHESIS
──────────────────────────────────────────────────────────── */
const synth = window.speechSynthesis;

function speak(text) {
  if (!S.voiceGuidance || !synth) return;
  // Fix: cancel hanging utterances before speaking
  try { synth.cancel(); } catch(e){}
  const u = new SpeechSynthesisUtterance(text);
  u.lang  = lang === 'es' ? 'es-ES' : 'en-US';
  u.rate  = 0.92;
  u.pitch = 1.05;
  u.volume = 1.0;
  // Fix: iOS Safari often needs a small delay after cancel
  setTimeout(() => { try { synth.speak(u); } catch(e){} }, 60);
}

function vibe(pattern) {
  if (!S.vibration || !navigator.vibrate) return;
  try { navigator.vibrate(pattern); } catch(e) {}
}

/* ────────────────────────────────────────────────────────────
   MICROPHONE — IMPROVED & ROBUST
──────────────────────────────────────────────────────────── */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const MIC_SUPPORT = !!SR;

let micListening  = false;
let micRecognition = null;
let micAttempts   = 0;

/* Check / request mic permission */
async function checkMicPermission() {
  if (!MIC_SUPPORT) return 'unsupported';
  // Modern browsers expose permission API
  if (navigator.permissions) {
    try {
      const result = await navigator.permissions.query({ name:'microphone' });
      return result.state; // 'granted' | 'denied' | 'prompt'
    } catch(e) { return 'prompt'; }
  }
  return 'prompt';
}

function buildMicRecognition() {
  if (!SR) return null;
  const rec = new SR();
  rec.lang = lang === 'es' ? 'es-ES' : 'en-US';
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 3;
  return rec;
}

async function startMic() {
  if (!MIC_SUPPORT) {
    toast(t('micUnsupported'));
    showMicBanner('unsupported');
    return;
  }
  // Request permission explicitly first
  const perm = await checkMicPermission();
  if (perm === 'denied') {
    toast(t('micDenied'));
    showMicBanner('denied');
    return;
  }

  // Build fresh instance each time (fixes stuck-state bug)
  micRecognition = buildMicRecognition();

  micRecognition.onstart = () => {
    micListening = true;
    micAttempts  = 0;
    $('mic-btn').classList.add('on');
    $('mic-btn').classList.remove('listening');
    setMicStatus(t('micListen'));
  };

  micRecognition.onresult = (e) => {
    // Pick best transcript from alternatives
    let best = '';
    let bestConf = 0;
    for (let i = 0; i < e.results[e.results.length-1].length; i++) {
      const alt = e.results[e.results.length-1][i];
      if (alt.confidence > bestConf) { bestConf = alt.confidence; best = alt.transcript; }
    }
    if (!best && e.results[e.results.length-1][0]) best = e.results[e.results.length-1][0].transcript;
    $('smart-input').value = best;
    stopMic();
  };

  micRecognition.onerror = (e) => {
    const code = e.error;
    if (code === 'not-allowed' || code === 'permission-denied') {
      toast(t('micDenied'));
      showMicBanner('denied');
    } else if (code === 'no-speech') {
      // Re-attempt once silently
      if (micAttempts < 1) {
        micAttempts++;
        try { micRecognition.start(); return; } catch(ex) {}
      }
      toast(t('micError'));
    } else if (code === 'network') {
      toast(t('micError') + ' (network)');
    } else if (code === 'audio-capture') {
      toast(t('micError'));
      showMicBanner('denied');
    }
    stopMic(false);
  };

  micRecognition.onend = () => {
    if (micListening) {
      stopMic(false);
    }
  };

  try {
    micRecognition.start();
  } catch(e) {
    toast(t('micError'));
    stopMic(false);
  }
}

function stopMic(resetState = true) {
  micListening = false;
  $('mic-btn').classList.remove('on', 'listening');
  setMicStatus('');
  if (micRecognition) {
    try { micRecognition.stop(); } catch(e) {}
    micRecognition = null; // discard so next call builds fresh
  }
}

function setMicStatus(msg) {
  const el = $('mic-status');
  if (!el) return;
  if (msg) { el.textContent = msg; el.classList.add('show'); }
  else      { el.classList.remove('show'); }
}

function showMicBanner(reason) {
  const banner = $('mic-banner');
  if (!banner) return;
  if (reason === 'unsupported') {
    banner.querySelector('.mic-banner-msg').textContent = t('micUnsupported') + ' ' + t('micTip');
  } else {
    banner.querySelector('.mic-banner-msg').textContent = t('micDenied') + ' ' + t('micTip');
  }
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 6000);
}

/* ────────────────────────────────────────────────────────────
   VOICE COMMANDS (timer screen)
──────────────────────────────────────────────────────────── */
let voiceCmdActive = false;
let cmdRecognition = null;

function buildCmdRecognition() {
  if (!SR) return null;
  const rec = new SR();
  rec.lang = lang === 'es' ? 'es-ES' : 'en-US';
  rec.continuous = true;
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    const txt = e.results[e.results.length-1][0].transcript.toLowerCase().trim();
    handleVoiceCommand(txt);
  };
  rec.onerror = (e) => {
    if (e.error === 'not-allowed') { voiceCmdActive = false; updateVoiceCmdBtn(); }
  };
  rec.onend = () => {
    if (voiceCmdActive) {
      // auto-restart if still active (handles Android/Chrome auto-stop)
      setTimeout(() => { if (voiceCmdActive && cmdRecognition) try { cmdRecognition.start(); } catch(ex){} }, 300);
    }
  };
  return rec;
}

function handleVoiceCommand(txt) {
  if (/\b(start|iniciar|empezar|resume)\b/.test(txt) && Timer.paused)   Timer.resume();
  if (/\b(pause|pausar|pausa)\b/.test(txt)           && Timer.running)  Timer.pause();
  if (/\b(stop|parar|detener|terminar)\b/.test(txt))                    Timer.stop();
  if (/\b(next|siguiente|skip|saltar)\b/.test(txt))                     Timer.skip();
}

async function toggleVoiceCmd(btn) {
  if (!MIC_SUPPORT) { toast(t('micUnsupported')); return; }

  if (voiceCmdActive) {
    voiceCmdActive = false;
    if (cmdRecognition) { try { cmdRecognition.stop(); } catch(e){} cmdRecognition = null; }
    updateVoiceCmdBtn();
    return;
  }

  const perm = await checkMicPermission();
  if (perm === 'denied') { toast(t('micDenied')); return; }

  cmdRecognition = buildCmdRecognition();
  if (!cmdRecognition) return;

  try {
    cmdRecognition.start();
    voiceCmdActive = true;
    updateVoiceCmdBtn();
    showVoicePill(t('voiceCmdOn'), 2200);
  } catch(e) {
    toast(t('micError'));
  }
}

function updateVoiceCmdBtn() {
  const btn = $('ctrl-voice');
  if (!btn) return;
  btn.classList.toggle('on', voiceCmdActive);
}

function showVoicePill(msg, dur) {
  const p = $('voice-pill');
  if (!p) return;
  p.textContent = msg;
  p.classList.add('show');
  setTimeout(() => p.classList.remove('show'), dur);
}

/* ────────────────────────────────────────────────────────────
   WORKOUT PARSER
──────────────────────────────────────────────────────────── */
const Parser = {
  parse(raw) {
    const txt = raw.toLowerCase().trim();

    if (/tabata/.test(txt)) {
      const rounds = this._num(txt,['rounds','round','rondas','ronda'],8);
      return { name:'Tabata', mode:'tabata', workSec:20, restSec:10, rounds, warmupSec:0, cooldownSec:0 };
    }
    if (/emom/.test(txt)) {
      const min = this._num(txt,['minutes','minute','min','minutos','minuto'],10);
      return { name:`EMOM ${min}min`, mode:'emom', workSec:60, restSec:0, rounds:min, warmupSec:0, cooldownSec:0 };
    }
    if (/amrap/.test(txt)) {
      const min = this._num(txt,['minutes','minute','min','minutos','minuto'],10);
      return { name:`AMRAP ${min}min`, mode:'amrap', workSec:min*60, restSec:0, rounds:1, warmupSec:0, cooldownSec:0 };
    }

    const rounds  = this._num(txt,['rounds','round','rondas','ronda','×','x'],10);
    const workSec = this._phaseSec(txt,['work','on','trabajo','ejercicio','run','correr'])
                 || this._nthNum(txt, 0, 10, 600) || 40;
    const restSec = this._phaseSec(txt,['rest','off','descanso','recuper','walk','caminar'])
                 || this._nthNum(txt, 1, 5, 300) || 20;

    return { name:`${rounds}×${workSec}s/${restSec}s`, mode:'interval', workSec, restSec, rounds, warmupSec:0, cooldownSec:0 };
  },

  _num(txt, kws, def) {
    // Try keyword-adjacent number first
    for (const k of kws) {
      const r = new RegExp(`(\\d+)\\s*(?:${k})|(?:${k})\\s*(\\d+)`, 'i');
      const x = txt.match(r);
      if (x) return +(x[1] || x[2]);
    }
    // Fallback: first standalone number
    const m = txt.match(/(\d+)\s*(?:rounds?|rondas?|minutes?|min)/i);
    if (m) return +m[1];
    return def;
  },

  _phaseSec(txt, kws) {
    for (const k of kws) {
      // "40s work", "work 40s", "40 seconds work", "work 40 seconds"
      const patterns = [
        new RegExp(`(\\d+)\\s*s(?:ec(?:ond)?s?)?\\s+${k}`, 'i'),
        new RegExp(`${k}\\s+(\\d+)\\s*s(?:ec(?:ond)?s?)?`, 'i'),
        new RegExp(`(\\d+)\\s+${k}`, 'i'),
        new RegExp(`${k}\\s+(\\d+)`, 'i'),
      ];
      for (const p of patterns) {
        const m = txt.match(p);
        if (m) return +m[1];
      }
    }
    return null;
  },

  _nthNum(txt, n, min, max) {
    const all = [...txt.matchAll(/(\d+)/g)].map(m=>+m[1]).filter(v=>v>=min&&v<=max);
    return all[n] ?? null;
  }
};

/* ────────────────────────────────────────────────────────────
   SEGMENT BUILDER
──────────────────────────────────────────────────────────── */
function buildSegments(w) {
  const segs = [];
  if (w.warmupSec > 0)   segs.push({ type:'warmup',   dur:w.warmupSec,   lbl:t('phWarm'), round:null });
  if (w.mode === 'emom' || w.mode === 'amrap') {
    for (let r=1; r<=w.rounds; r++) segs.push({ type:'work', dur:w.workSec, lbl:t('phWork'), round:r });
  } else {
    for (let r=1; r<=w.rounds; r++) {
      segs.push({ type:'work', dur:w.workSec, lbl:t('phWork'), round:r });
      // No rest after LAST round
      if (w.restSec > 0 && r < w.rounds) segs.push({ type:'rest', dur:w.restSec, lbl:t('phRest'), round:r });
    }
  }
  if (w.cooldownSec > 0) segs.push({ type:'cooldown', dur:w.cooldownSec, lbl:t('phCool'), round:null });
  return segs;
}

/* ────────────────────────────────────────────────────────────
   TIMER ENGINE
──────────────────────────────────────────────────────────── */
const Timer = {
  workout:        null,
  segments:       [],
  segIdx:         0,
  running:        false,
  paused:         false,
  startTs:        0,   // Date.now() when current segment started
  pausedElapsed:  0,   // ms elapsed when paused
  raf:            null,
  workoutStartTs: 0,

  get seg()         { return this.segments[this.segIdx]; },
  get totalRounds() { return this.workout?.rounds || 1; },

  start(workout) {
    this.workout   = workout;
    this.segments  = buildSegments(workout);
    this.segIdx    = 0;
    this.running   = false;
    this.paused    = false;
    this.pausedElapsed = 0;
    this.workoutStartTs = Date.now();
    _lastPhase = '';
    _lastRound = -1;

    // Update workout name in timer
    const wn = $('timer-wname');
    if (wn) wn.textContent = workout.name.toUpperCase();

    showScreen('timer');
    startCountdown();
  },

  _beginSegment() {
    this.startTs = Date.now();
    this.pausedElapsed = 0;
    const seg = this.seg;
    if (seg) this._onSegStart(seg);
  },

  _go() {
    this.running = true;
    this.paused  = false;
    this.startTs = Date.now() - this.pausedElapsed;
    this.pausedElapsed = 0;
    cancelAnimationFrame(this.raf);
    this._tick();
  },

  pause() {
    if (!this.running) return;
    this.pausedElapsed = Date.now() - this.startTs;
    this.running = false;
    this.paused  = true;
    cancelAnimationFrame(this.raf);
    updateControlsBtns();
  },

  resume() {
    if (!this.paused) return;
    this.startTs = Date.now() - this.pausedElapsed;
    this.pausedElapsed = 0;
    this.running = true;
    this.paused  = false;
    this._tick();
    updateControlsBtns();
  },

  togglePause() { this.paused ? this.resume() : this.pause(); },

  skip() {
    if (!this.running && !this.paused) return;
    this._advanceSeg();
  },

  stop() {
    this.running = false;
    this.paused  = false;
    cancelAnimationFrame(this.raf);
    // Stop voice commands when timer stops
    if (voiceCmdActive) {
      voiceCmdActive = false;
      if (cmdRecognition) { try { cmdRecognition.stop(); } catch(e){} cmdRecognition = null; }
      updateVoiceCmdBtn();
    }
    showScreen('home');
  },

  _tick() {
    if (!this.running) return;
    const elapsed    = Date.now() - this.startTs;
    const seg        = this.seg;
    if (!seg) { this._finish(); return; }

    const remaining = Math.max(0, seg.dur * 1000 - elapsed);
    renderTimerUI(remaining, seg);

    if (remaining <= 0) {
      this._advanceSeg();
    } else {
      this.raf = requestAnimationFrame(() => this._tick());
    }
  },

  _advanceSeg() {
    cancelAnimationFrame(this.raf);
    this.segIdx++;
    if (this.segIdx >= this.segments.length) {
      this._finish();
      return;
    }
    this.startTs = Date.now();
    this.pausedElapsed = 0;
    this._onSegStart(this.seg);
    this._tick();
  },

  _onSegStart(seg) {
    if (!seg) return;
    if (seg.type === 'work')     { beepWork();  speak(seg.round > 1 ? `${t('voiceNext')}. ${t('voiceWork')}` : t('voiceWork')); vibe([80,40,80]); }
    if (seg.type === 'rest')     { beepRest();  speak(t('voiceRest')); vibe([50]); }
    if (seg.type === 'warmup')   { beepRest();  speak(t('voiceWarm')); }
    if (seg.type === 'cooldown') { beepRest();  speak(t('voiceCool')); }
  },

  _finish() {
    this.running = false;
    beepDone();
    speak(t('voiceDone'));
    vibe([100,40,100,40,200]);
    const totalMs   = Date.now() - this.workoutStartTs;
    const rounds    = this.workout.rounds;
    const intervals = this.segments.filter(s=>s.type==='work'||s.type==='rest').length;
    const cals      = Math.round((totalMs/1000/60) * 8.5);
    const entry     = { totalMs, rounds, intervals, cals, workout:this.workout, date:new Date().toISOString() };
    showSummary(entry);
    workoutHistory.unshift(entry);
    if (workoutHistory.length > 50) workoutHistory.pop();
    saveHistory();
  },

  // Resync after coming back from background — uses real timestamps so it's exact
  resync() {
    if (!this.running) return;
    cancelAnimationFrame(this.raf);
    this._tick();
  }
};

/* ────────────────────────────────────────────────────────────
   COUNTDOWN 3-2-1-GO
──────────────────────────────────────────────────────────── */
function startCountdown() {
  const overlay = $('cdown-overlay');
  const numEl   = overlay.querySelector('.cdown-num');
  overlay.classList.add('show');
  let n = 3;

  function tick() {
    if (n > 0) {
      // Force reflow to restart CSS animation
      numEl.className = '';
      numEl.textContent = n;
      void numEl.offsetHeight;
      numEl.className = 'cdown-num';
      beepCountdown();
      vibe([30]);
      n--;
      setTimeout(tick, 1000);
    } else {
      numEl.className = '';
      numEl.textContent = t('go');
      void numEl.offsetHeight;
      numEl.className = 'cdown-num go';
      beepGo();
      vibe([70,30,70]);
      setTimeout(() => {
        overlay.classList.remove('show');
        Timer.running = true;
        Timer.paused  = false;
        Timer._beginSegment();
        Timer._tick();
        updateControlsBtns();
      }, 900);
    }
  }
  tick();
}

/* ────────────────────────────────────────────────────────────
   TIMER UI RENDERING
──────────────────────────────────────────────────────────── */
let _lastPhase = '';
let _lastRound = -1;

function renderTimerUI(remainingMs, seg) {
  if (!seg) return;
  const secs  = Math.ceil(remainingMs / 1000);
  const phase = seg.type;
  const roundNum = seg.round != null ? seg.round : _lastRound;

  // Format time — show mm:ss when >= 60s
  const mm = Math.floor(secs / 60);
  const ss = secs % 60;
  const display = mm > 0 ? `${mm}:${ss.toString().padStart(2,'0')}` : String(secs);
  $('timer-time').textContent = display;

  // Background / badge — only update when phase changes
  if (phase !== _lastPhase) {
    $('timer-time').className  = `timer-time ph-${phase}`;
    $('timer-bg').className    = `timer-bg ph-${phase}`;
    $('phase-badge').textContent = seg.lbl;
    $('ring-prog').className   = `ring-prog ph-${phase}`;
    _lastPhase = phase;
  }

  // Progress ring
  const r     = 110;
  const circ  = 2 * Math.PI * r;
  const pct   = Math.max(0, Math.min(1, remainingMs / (seg.dur * 1000)));
  $('ring-prog').style.strokeDasharray  = circ;
  $('ring-prog').style.strokeDashoffset = circ * (1 - pct);

  // Rounds dots — update when round changes
  if (roundNum !== _lastRound) {
    _lastRound = roundNum;
    renderDots(roundNum, Timer.totalRounds);
    $('rounds-lbl').textContent = `${t('roundOf')} ${roundNum} ${t('of')} ${Timer.totalRounds}`;
  }

  // Next segment
  const next = Timer.segments[Timer.segIdx + 1];
  if (next) {
    const nm = Math.floor(next.dur/60), ns = next.dur%60;
    const nd = nm > 0 ? `${nm}:${ns.toString().padStart(2,'0')}` : `${next.dur}s`;
    $('timer-next').innerHTML = `${t('nextUp')} <b>${next.lbl} · ${nd}</b>`;
  } else {
    $('timer-next').textContent = '';
  }

  // Almost done — once, at exactly 3s remaining for work intervals
  if (secs === 3 && S.voiceGuidance && phase === 'work') {
    speak(t('voiceAlmost'));
  }
}

function renderDots(current, total) {
  const wrap = $('rounds-dots');
  wrap.innerHTML = '';
  const max = Math.min(total, 20);
  for (let i = 1; i <= max; i++) {
    const d = document.createElement('div');
    d.className = 'rdot' + (i < current ? ' done' : i === current ? ' cur' : '');
    wrap.appendChild(d);
  }
  if (total > 20) {
    const lbl = document.createElement('span');
    Object.assign(lbl.style, { fontFamily:'var(--font-c)', fontSize:'12px', color:'rgba(255,255,255,.3)', marginLeft:'6px' });
    lbl.textContent = `+${total-20}`;
    wrap.appendChild(lbl);
  }
}

function updateControlsBtns() {
  const pp = $('ctrl-playpause');
  if (!pp) return;
  if (Timer.paused) {
    pp.innerHTML = `<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" style="fill:#080808"/></svg>`;
  } else {
    pp.innerHTML = `<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" style="fill:#080808"/><rect x="14" y="4" width="4" height="16" rx="1" style="fill:#080808"/></svg>`;
  }
}

/* ────────────────────────────────────────────────────────────
   WORKOUT SUMMARY
──────────────────────────────────────────────────────────── */
function showSummary({ totalMs, rounds, intervals, cals, workout }) {
  const mm = Math.floor(totalMs/60000);
  const ss = Math.floor((totalMs%60000)/1000);
  $('sum-stat-time').textContent      = `${mm}:${ss.toString().padStart(2,'0')}`;
  $('sum-stat-rounds').textContent    = rounds;
  $('sum-stat-intervals').textContent = intervals;
  $('sum-stat-cals').textContent      = cals;
  $('sum-lbl-time').textContent       = t('totalTime');
  $('sum-lbl-rounds').textContent     = t('totalRounds');
  $('sum-lbl-intervals').textContent  = t('totalIntervals');
  $('sum-lbl-cals').textContent       = t('calories');
  $('sum-eyebrow').textContent        = t('sumEyebrow');
  $('sum-title').textContent          = t('sumTitle');
  $('btn-again').textContent          = t('doAgain');
  $('btn-home').textContent           = t('backHome');
  $('btn-share-sum').textContent      = t('share');
  $('summary').dataset.workout        = JSON.stringify(workout);
  $('summary').classList.add('show');
}

/* ────────────────────────────────────────────────────────────
   CREATE FORM
──────────────────────────────────────────────────────────── */
let form = {
  name:'My Workout', mode:'interval', workSec:40, restSec:20,
  rounds:10, warmupSec:120, cooldownSec:120,
  warmupEnabled:false, cooldownEnabled:false,
};

const MODE_PRESETS = {
  interval:{ workSec:40, restSec:20, rounds:10, name:'Interval' },
  tabata:  { workSec:20, restSec:10, rounds:8,  name:'Tabata'   },
  emom:    { workSec:60, restSec:0,  rounds:10, name:'EMOM'     },
  amrap:   { workSec:600,restSec:0,  rounds:1,  name:'AMRAP'    },
  running: { workSec:60, restSec:30, rounds:8,  name:'Run/Walk' },
  circuit: { workSec:45, restSec:15, rounds:5,  name:'Circuit'  },
};

function applyModePreset(mode) {
  const p = MODE_PRESETS[mode];
  if (!p) return;
  form.mode    = mode;
  form.workSec = p.workSec;
  form.restSec = p.restSec;
  form.rounds  = p.rounds;
  form.name    = p.name;
  renderForm();
}

function renderForm() {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('sel', b.dataset.mode === form.mode));
  setV('work-val',     fmtDur(form.workSec));
  setV('rest-val',     fmtDur(form.restSec));
  setV('rounds-val',   form.rounds);
  setV('warmup-val',   fmtDur(form.warmupSec));
  setV('cooldown-val', fmtDur(form.cooldownSec));
  const wRow = $('warmup-row');
  const cRow = $('cooldown-row');
  if (wRow) wRow.style.display = form.warmupEnabled ? '' : 'none';
  if (cRow) cRow.style.display = form.cooldownEnabled ? '' : 'none';
  const ni = $('workout-name-input');
  if (ni) ni.value = form.name;
  const wt = $('warmup-toggle');
  const ct = $('cooldown-toggle');
  if (wt) wt.className = 'toggle' + (form.warmupEnabled ? ' on' : '');
  if (ct) ct.className = 'toggle' + (form.cooldownEnabled ? ' on' : '');
}

function setV(id, val) { const e = $(id); if (e) e.textContent = val; }

function fmtDur(s) {
  if (s >= 60) return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  return `${s}s`;
}

function stepChange(field, dir) {
  const isRounds = field === 'rounds';
  const step = isRounds ? 1 : 5;
  const min  = isRounds ? 1 : 0;
  const max  = isRounds ? 99 : (field === 'warmupSec' || field === 'cooldownSec') ? 1200 : 600;
  form[field] = Math.max(min, Math.min(max, form[field] + dir * step));
  renderForm();
}

function buildWorkoutFromForm() {
  return {
    name:        $('workout-name-input')?.value?.trim() || form.name || 'Workout',
    mode:        form.mode,
    workSec:     form.workSec,
    restSec:     form.restSec,
    rounds:      form.rounds,
    warmupSec:   form.warmupEnabled  ? form.warmupSec  : 0,
    cooldownSec: form.cooldownEnabled ? form.cooldownSec : 0,
  };
}

/* ────────────────────────────────────────────────────────────
   SHARE
──────────────────────────────────────────────────────────── */
function encodeWorkout(workout) {
  // Fix: use TextEncoder for proper UTF-8 handling
  try {
    const json = JSON.stringify(workout);
    return btoa(unescape(encodeURIComponent(json)));
  } catch(e) {
    return btoa(JSON.stringify(workout));
  }
}

function decodeWorkout(b64) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(b64))));
  } catch(e) {
    try { return JSON.parse(atob(b64)); } catch(e2) { return null; }
  }
}

function getShareUrl(workout) {
  const base = `${location.origin}${location.pathname}`;
  return `${base}?w=${encodeWorkout(workout)}`;
}

function openShareModal(workout) {
  $('share-link').textContent = getShareUrl(workout);
  $('share-title-el').textContent = t('shareTitle');
  $('share-copy-btn').textContent = t('shareCopy');
  $('share-modal').classList.add('show');
}

function checkSharedWorkout() {
  const p = new URLSearchParams(location.search);
  const w = p.get('w');
  if (!w) return;
  const workout = decodeWorkout(w);
  if (workout && workout.workSec && workout.rounds) {
    form.name    = workout.name    || form.name;
    form.mode    = workout.mode    || form.mode;
    form.workSec = workout.workSec || form.workSec;
    form.restSec = workout.restSec != null ? workout.restSec : form.restSec;
    form.rounds  = workout.rounds  || form.rounds;
    form.warmupSec    = workout.warmupSec   || 0;
    form.cooldownSec  = workout.cooldownSec || 0;
    form.warmupEnabled  = form.warmupSec > 0;
    form.cooldownEnabled = form.cooldownSec > 0;
    renderForm();
    showScreen('create');
    toast(`Loaded: ${workout.name}`);
    // Clear param from URL without reload
    history.replaceState(null, '', location.pathname);
  }
}

/* ────────────────────────────────────────────────────────────
   EXPORT / IMPORT
──────────────────────────────────────────────────────────── */
function exportWorkouts() {
  if (savedWorkouts.length === 0) { toast('No workouts to export.'); return; }
  const blob = new Blob([JSON.stringify(savedWorkouts, null, 2)], { type:'application/json' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = 'forge-workouts.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function importWorkouts(jsonStr) {
  if (!jsonStr.trim()) { toast('Nothing to import.'); return; }
  try {
    const arr = JSON.parse(jsonStr);
    if (!Array.isArray(arr)) throw new Error('Not an array');
    let added = 0;
    arr.forEach(w => {
      if (w.name && !savedWorkouts.find(x => x.name === w.name)) {
        savedWorkouts.push(w);
        added++;
      }
    });
    saveSaved();
    renderSaved();
    toast(`Imported ${added} workout${added !== 1 ? 's' : ''}`);
  } catch(e) {
    toast('Invalid JSON');
  }
}

/* ────────────────────────────────────────────────────────────
   SCREEN NAVIGATION
──────────────────────────────────────────────────────────── */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = $(`screen-${name}`);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.screen === name);
  });
  const nav = $('bottom-nav');
  if (nav) nav.style.display = name === 'timer' ? 'none' : '';
  if (name === 'saved')    renderSaved();
  if (name === 'history')  renderHistory();
  if (name === 'settings') renderSettings();
  if (name === 'home')     renderHome();
  if (name === 'create')   renderForm();
}

/* ────────────────────────────────────────────────────────────
   RENDER: HOME
──────────────────────────────────────────────────────────── */
function renderHome() {
  $('home-eyebrow').textContent  = t('eyebrow');
  $('home-title').innerHTML      = t('tagline');
  $('home-sub').textContent      = t('homeSub');
  $('smart-input').placeholder   = t('inputPh');
  $('sec-label-quick').textContent = t('quickStart');
  const srl = $('sec-label-recent');
  if (srl) srl.textContent = t('recent');

  const recWrap = $('recent-wrap');
  if (!recWrap) return;
  recWrap.innerHTML = '';
  const recent = workoutHistory.slice(0, 3);
  if (recent.length === 0) {
    if (srl) srl.style.display = 'none';
    recWrap.style.display = 'none';
    return;
  }
  if (srl) srl.style.display = '';
  recWrap.style.display = '';
  recent.forEach(h => {
    const mm = Math.floor(h.totalMs/60000), ss = Math.floor((h.totalMs%60000)/1000);
    const card = mkEl('div','wcard',`
      <div class="wcard-ico" style="background:rgba(255,61,0,.1)">${modeIcon(h.workout?.mode)}</div>
      <div class="wcard-body">
        <div class="wcard-name">${esc(h.workout?.name||'Workout')}</div>
        <div class="wcard-meta">${mm}:${ss.toString().padStart(2,'0')} · ${h.rounds} ${t('rounds').toLowerCase()}</div>
      </div>
      <div class="wcard-act"><svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg></div>
    `);
    card.addEventListener('click', () => Timer.start(h.workout));
    recWrap.appendChild(card);
  });
}

/* ────────────────────────────────────────────────────────────
   RENDER: PRESETS
──────────────────────────────────────────────────────────── */
const HOME_PRESETS = [
  { mode:'tabata',  name:'Tabata',     desc:'20s work · 10s rest · 8 rds', badge:'🔥',
    workout:{ name:'Tabata', mode:'tabata', workSec:20, restSec:10, rounds:8, warmupSec:0, cooldownSec:0 } },
  { mode:'emom',    name:'EMOM 10',    desc:'Every minute · 10 rounds',
    workout:{ name:'EMOM 10min', mode:'emom', workSec:60, restSec:0, rounds:10, warmupSec:0, cooldownSec:0 } },
  { mode:'interval',name:'HIIT 10×40', desc:'40s work · 20s rest · 10 rds',
    workout:{ name:'HIIT 10×40', mode:'interval', workSec:40, restSec:20, rounds:10, warmupSec:0, cooldownSec:0 } },
  { mode:'amrap',   name:'AMRAP 10',   desc:'10 minute AMRAP',
    workout:{ name:'AMRAP 10min', mode:'amrap', workSec:600, restSec:0, rounds:1, warmupSec:0, cooldownSec:0 } },
  { mode:'running', name:'Run/Walk',   desc:'60s run · 30s walk · 8 rds',
    workout:{ name:'Run/Walk', mode:'running', workSec:60, restSec:30, rounds:8, warmupSec:120, cooldownSec:120 } },
];

function renderPresets() {
  const grid = $('preset-grid');
  if (!grid) return;
  grid.innerHTML = '';
  HOME_PRESETS.forEach((p, i) => {
    const card = mkEl('div', 'pcard' + (i === 0 ? ' feat' : ''), `
      <div class="pcard-mode">${p.mode.toUpperCase()}</div>
      <div class="pcard-name">${p.name}</div>
      <div class="pcard-desc">${p.desc}</div>
      ${p.badge ? `<div class="pcard-badge">${p.badge}</div>` : ''}
    `);
    card.addEventListener('click', () => Timer.start(p.workout));
    grid.appendChild(card);
  });
}

/* ────────────────────────────────────────────────────────────
   RENDER: SAVED
──────────────────────────────────────────────────────────── */
function renderSaved() {
  const wrap = $('saved-list');
  wrap.innerHTML = '';
  if (savedWorkouts.length === 0) {
    wrap.appendChild(emptyState('🏅', t('noSaved'), t('noSavedDesc')));
    return;
  }
  savedWorkouts.forEach((w, i) => {
    const card = mkEl('div','wcard',`
      <div class="wcard-ico" style="background:rgba(255,61,0,.1)">${modeIcon(w.mode)}</div>
      <div class="wcard-body">
        <div class="wcard-name">${esc(w.name)}</div>
        <div class="wcard-meta">${w.rounds} rds · ${totalDurationStr(w)} · ${w.workSec}s/${w.restSec}s</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <div class="wcard-del" data-idx="${i}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/>
          </svg>
        </div>
        <div class="wcard-act">
          <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
        </div>
      </div>
    `);
    card.querySelector('.wcard-act').addEventListener('click', e => { e.stopPropagation(); Timer.start(w); });
    card.querySelector('.wcard-del').addEventListener('click', e => {
      e.stopPropagation();
      savedWorkouts.splice(i, 1);
      saveSaved();
      renderSaved();
      toast(t('deletedMsg'));
    });
    card.addEventListener('click', () => {
      Object.assign(form, w);
      form.warmupEnabled   = (w.warmupSec || 0) > 0;
      form.cooldownEnabled = (w.cooldownSec || 0) > 0;
      renderForm();
      showScreen('create');
    });
    wrap.appendChild(card);
  });
}

/* ────────────────────────────────────────────────────────────
   RENDER: HISTORY
──────────────────────────────────────────────────────────── */
function renderHistory() {
  const wrap = $('history-list');
  wrap.innerHTML = '';
  if (workoutHistory.length === 0) {
    wrap.appendChild(emptyState('📊', t('noHist'), t('noHistDesc')));
    return;
  }
  workoutHistory.forEach(h => {
    const mm = Math.floor(h.totalMs/60000), ss = Math.floor((h.totalMs%60000)/1000);
    const d  = new Date(h.date);
    const ds = d.toLocaleDateString(lang==='es'?'es-ES':'en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
    const card = mkEl('div','hcard',`
      <div class="hcard-top">
        <span class="tag tag-work">${(h.workout?.mode||'INTERVAL').toUpperCase()}</span>
        <span class="wcard-name" style="font-size:15px">${esc(h.workout?.name||'Workout')}</span>
        <span class="hcard-date">${ds}</span>
      </div>
      <div class="hstats">
        <div class="hstat"><div class="hstat-val">${mm}:${ss.toString().padStart(2,'0')}</div><div class="hstat-lbl">${t('totalTime')}</div></div>
        <div class="hstat"><div class="hstat-val">${h.rounds}</div><div class="hstat-lbl">${t('totalRounds')}</div></div>
        <div class="hstat"><div class="hstat-val">${h.cals}</div><div class="hstat-lbl">${t('calories')}</div></div>
      </div>
    `);
    wrap.appendChild(card);
  });
}

/* ────────────────────────────────────────────────────────────
   RENDER: SETTINGS
──────────────────────────────────────────────────────────── */
function renderSettings() {
  const tog = (id, val) => { const e=$(id); if(e) e.className = 'toggle'+(val?' on':''); };
  tog('sett-voice', S.voiceGuidance);
  tog('sett-sound', S.soundAlerts);
  tog('sett-vibe',  S.vibration);
  tog('sett-coach', S.coachMode);
  // Apply coach mode to timer layout
  document.querySelector('.timer-layout')?.classList.toggle('coach-mode', S.coachMode);
  // Lang buttons
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.style.opacity    = b.dataset.lang === lang ? '1' : '.35';
    b.style.fontWeight = b.dataset.lang === lang ? '900' : '400';
  });
}

/* ────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
function mkEl(tag, cls, html='') {
  const e = document.createElement(tag);
  e.className = cls;
  e.innerHTML = html;
  return e;
}
function emptyState(ico, title, sub) {
  return mkEl('div','empty',`<div class="empty-ico">${ico}</div><div class="empty-ttl">${title}</div><div class="empty-sub">${sub}</div>`);
}
function toast(msg, dur=2400) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), dur);
}
function modeIcon(mode) {
  return { tabata:'⚡', emom:'⏱', amrap:'🔥', running:'🏃', circuit:'🔄', interval:'💪' }[mode] || '🏋️';
}
function totalDurationStr(w) {
  const sec = (w.warmupSec||0) + (w.workSec + (w.restSec||0)) * w.rounds - (w.restSec||0) + (w.cooldownSec||0);
  const m = Math.floor(sec/60), s = sec%60;
  return m > 0 ? `~${m}min` : `${s}s`;
}
function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ────────────────────────────────────────────────────────────
   BACKGROUND VISIBILITY SYNC
──────────────────────────────────────────────────────────── */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') Timer.resync();
});

/* ────────────────────────────────────────────────────────────
   APPLY LANGUAGE
──────────────────────────────────────────────────────────── */
function applyLang() {
  // Update recognizer languages if active
  if (cmdRecognition) try { cmdRecognition.lang = lang==='es'?'es-ES':'en-US'; } catch(e){}
  // data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  // Lang buttons
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.style.opacity    = b.dataset.lang === lang ? '1' : '.35';
    b.style.fontWeight = b.dataset.lang === lang ? '900' : '400';
  });
  // Specific mapped elements
  const map = {
    'nav-home':'navHome','nav-create':'navCreate','nav-saved':'navSaved',
    'nav-history':'navHistory','nav-settings':'navSettings',
    'screen-title-saved':'savedTitle','screen-sub-saved':'savedSub',
    'screen-title-history':'histTitle','screen-sub-history':'histSub',
    'screen-title-settings':'settTitle','screen-sub-settings':'settSub',
    'cdown-sub':'countdownSub',
  };
  Object.entries(map).forEach(([id,key]) => { const e=$(id); if(e) e.textContent=t(key); });
  // Update mic button placeholder
  if ($('smart-input')) $('smart-input').placeholder = t('inputPh');
}

/* ────────────────────────────────────────────────────────────
   APP INIT
──────────────────────────────────────────────────────────── */
function init() {
  applyLang();
  renderPresets();
  renderHome();
  renderForm();
  showScreen('home');
  checkSharedWorkout();

  // ── Navigation ──────────────────────────────────────────
  document.querySelectorAll('.nav-item').forEach(n => {
    n.addEventListener('click', () => showScreen(n.dataset.screen));
  });

  // ── Smart Input ─────────────────────────────────────────
  function submitSmartInput() {
    const val = $('smart-input').value.trim();
    if (!val) { $('smart-input').focus(); return; }
    const workout = Parser.parse(val);
    Timer.start(workout);
  }
  $('smart-submit').addEventListener('click', submitSmartInput);
  $('smart-input').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); submitSmartInput(); } });

  // ── Mic Button ──────────────────────────────────────────
  $('mic-btn').addEventListener('click', () => {
    if (micListening) stopMic();
    else startMic();
  });

  // ── Mode Buttons ─────────────────────────────────────────
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.addEventListener('click', () => applyModePreset(b.dataset.mode));
  });

  // ── Steppers ─────────────────────────────────────────────
  document.querySelectorAll('[data-step]').forEach(btn => {
    btn.addEventListener('click', () => stepChange(btn.dataset.step, +btn.dataset.dir));
  });

  // ── Toggles (warmup / cooldown) ───────────────────────────
  $('warmup-toggle').addEventListener('click',  () => { form.warmupEnabled   = !form.warmupEnabled;   if(!form.warmupSec)   form.warmupSec=120;   renderForm(); });
  $('cooldown-toggle').addEventListener('click',() => { form.cooldownEnabled = !form.cooldownEnabled; if(!form.cooldownSec) form.cooldownSec=120; renderForm(); });

  // ── Name Input ────────────────────────────────────────────
  $('workout-name-input').addEventListener('input', e => { form.name = e.target.value; });

  // ── Start / Save ──────────────────────────────────────────
  $('btn-start-workout').addEventListener('click', () => Timer.start(buildWorkoutFromForm()));
  $('btn-save-preset').addEventListener('click', () => {
    const w = buildWorkoutFromForm();
    if (!savedWorkouts.find(x => x.name === w.name)) savedWorkouts.push(w);
    saveSaved();
    toast(t('savedMsg'));
  });

  // ── Timer Controls ────────────────────────────────────────
  $('ctrl-playpause').addEventListener('click', () => Timer.togglePause());
  $('ctrl-skip').addEventListener('click', () => Timer.skip());
  $('ctrl-stop').addEventListener('click', () => Timer.stop());
  $('ctrl-voice').addEventListener('click', () => toggleVoiceCmd($('ctrl-voice')));
  $('coach-btn').addEventListener('click', () => {
    S.coachMode = !S.coachMode;
    saveSettings();
    document.querySelector('.timer-layout')?.classList.toggle('coach-mode', S.coachMode);
  });

  // ── Summary ───────────────────────────────────────────────
  $('btn-again').addEventListener('click', () => {
    const w = JSON.parse($('summary').dataset.workout || 'null');
    $('summary').classList.remove('show');
    if (w) Timer.start(w);
  });
  $('btn-home').addEventListener('click', () => {
    $('summary').classList.remove('show');
    showScreen('home');
  });
  $('btn-share-sum').addEventListener('click', () => {
    const w = JSON.parse($('summary').dataset.workout || 'null');
    if (w) openShareModal(w);
  });

  // ── Share Modal ───────────────────────────────────────────
  $('share-copy-btn').addEventListener('click', () => {
    const link = $('share-link').textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => toast(t('copied'))).catch(() => fallbackCopy(link));
    } else {
      fallbackCopy(link);
    }
  });
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast(t('copied')); } catch(e) {}
    document.body.removeChild(ta);
  }
  $('share-modal').addEventListener('click', e => { if (e.target === $('share-modal')) $('share-modal').classList.remove('show'); });
  $('share-close').addEventListener('click', () => $('share-modal').classList.remove('show'));

  // ── Settings Toggles ──────────────────────────────────────
  $('sett-voice').addEventListener('click', () => { S.voiceGuidance = !S.voiceGuidance; saveSettings(); renderSettings(); });
  $('sett-sound').addEventListener('click', () => { S.soundAlerts   = !S.soundAlerts;   saveSettings(); renderSettings(); });
  $('sett-vibe').addEventListener('click',  () => { S.vibration     = !S.vibration;     saveSettings(); renderSettings(); });
  $('sett-coach').addEventListener('click', () => { S.coachMode     = !S.coachMode;     saveSettings(); renderSettings(); });

  // ── Language Toggle ───────────────────────────────────────
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.addEventListener('click', () => {
      if (lang === b.dataset.lang) return;
      lang = b.dataset.lang;
      localStorage.setItem('forge-lang', lang);
      applyLang();
      renderPresets();
      renderHome();
      renderForm();
      renderSettings();
    });
  });

  // ── Export / Import ───────────────────────────────────────
  $('btn-export').addEventListener('click', exportWorkouts);
  $('btn-import-trigger').addEventListener('click', () => {
    const modal = $('import-modal');
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('show'));
  });
  function closeImportModal() {
    const modal = $('import-modal');
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 260);
  }
  $('btn-import-do').addEventListener('click', () => {
    importWorkouts($('import-input').value);
    closeImportModal();
  });
  $('import-modal').addEventListener('click', e => { if (e.target === $('import-modal')) closeImportModal(); });

  // File drop for import
  $('import-drop-area').addEventListener('dragover', e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--red)'; });
  $('import-drop-area').addEventListener('dragleave', e => { e.currentTarget.style.borderColor = ''; });
  $('import-drop-area').addEventListener('drop', e => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { $('import-input').value = ev.target.result; };
    reader.readAsText(file);
  });

  // ── Service Worker ────────────────────────────────────────
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js').catch(() => {});
  }

  // ── Unlock AudioContext on first interaction ──────────────
  const unlockAudio = () => { try { getAudioCtx(); } catch(e){} };
  document.addEventListener('touchstart', unlockAudio, { once:true });
  document.addEventListener('click',      unlockAudio, { once:true });

  // ── Initial settings render ───────────────────────────────
  renderSettings();
}

document.addEventListener('DOMContentLoaded', init);
