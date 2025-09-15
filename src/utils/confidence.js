// Frontend fallback confidence computation mirroring backend, with expanded patterns

const KB = {
  gastroenteritis: ['diarrhea','nausea','vomiting','abdominal cramps','fever','dehydration','abdominal pain','cramps'],
  'common cold': ['runny nose','sore throat','cough','congestion','sneezing','low-grade fever'],
  migraine: ['throbbing headache','photophobia','phonophobia','nausea','aura'],
  pneumonia: ['fever','cough','productive sputum','chest pain','shortness of breath'],
  gerd: ['heartburn','regurgitation','worse at night','chest burning'],
  influenza: ['high fever','chills','myalgia','fatigue','cough','sore throat'],
  'covid-19': ['fever','dry cough','loss of smell','loss of taste','fatigue','shortness of breath'],
  'strep throat': ['sore throat','fever','swollen lymph nodes','tonsillar exudates','no cough'],
  uti: ['dysuria','urinary frequency','urgency','suprapubic pain','hematuria'],
  appendicitis: ['periumbilical pain','rlq pain','rebound tenderness','fever','nausea','vomiting'],
  asthma: ['wheezing','shortness of breath','chest tightness','cough','nighttime symptoms'],
  allergies: ['sneezing','itchy eyes','runny nose','watery eyes','nasal congestion'],
  sinusitis: ['facial pain','facial pressure','postnasal drip','purulent nasal discharge','congestion','headache'],
  bronchitis: ['productive cough','chest discomfort','wheezing','low-grade fever','fatigue'],
  'otitis media': ['ear pain','ear fullness','hearing loss','fever'],
  tonsillitis: ['sore throat','odynophagia','tonsillar exudates','fever','swollen lymph nodes'],
  gastritis: ['epigastric pain','nausea','vomiting','bloating','worse with nsaids'],
  'peptic ulcer disease': ['epigastric pain','burning pain','nocturnal pain','relieved by antacids','melena'],
  'kidney stone': ['flank pain','colicky pain','radiates to groin','hematuria','nausea','vomiting'],
};

function normalizeIllness(illness=''){
  const s = (illness||'').toLowerCase();
  if (s.includes('stomach flu')||s.includes('food poisoning')) return 'gastroenteritis';
  if (s.includes('uri')||s.includes('upper respiratory')) return 'common cold';
  if (s.includes('covid')) return 'covid-19';
  if (s.includes('urinary')) return 'uti';
  if (s.includes('acid reflux')||s.includes('heartburn')) return 'gerd';
  if (s.includes('flu')) return 'influenza';
  if (s.includes('strep')) return 'strep throat';
  if (s.includes('appendix')||s.includes('appendicitis')) return 'appendicitis';
  if (s.includes('sinus')) return 'sinusitis';
  if (s.includes('bronchitis')) return 'bronchitis';
  if (s.includes('ear infection')||s.includes('otitis')) return 'otitis media';
  if (s.includes('tonsillitis')) return 'tonsillitis';
  if (s.includes('gastritis')) return 'gastritis';
  if (s.includes('ulcer')) return 'peptic ulcer disease';
  if (s.includes('kidney stone')||s.includes('nephrolith')) return 'kidney stone';
  return s;
}

export function computeConfidence(symptomsText='', illness=''){
  const text = (symptomsText||'').toLowerCase();
  const tokens = text.split(/[,;\n]+|\band\b|\bwith\b/).map(s=>s.trim()).filter(Boolean);
  const count = tokens.length;
  const key = normalizeIllness(illness);
  const patterns = KB[key] || [];
  const weightSum = patterns.length || 1;
  let matched = 0;
  for(const p of patterns){ if(text.includes(p)) matched++; }
  const c = Math.min(count/8,1);
  const s = matched/weightSum;
  const m = s; // same proxy here
  let composite = 0.2*c + 0.4*s + 0.4*m;
  if(!KB[key]){
    const fallback = 0.25 + 0.5*c; // 25..75 based on richness
    composite = Math.max(composite, fallback);
  }
  let pct = Math.round(composite*100);
  pct = Math.max(5, Math.min(100, pct));
  return pct;
}
