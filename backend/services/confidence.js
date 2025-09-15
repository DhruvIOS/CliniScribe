// Heuristic diagnosis confidence computation
// Uses: symptom count, specificity of matched symptoms for the illness, and match strength.

const KB = {
  gastroenteritis: { patterns: [
    { k: 'diarrhea', w: 0.9 },
    { k: 'nausea', w: 0.7 },
    { k: 'vomiting', w: 0.8 },
    { k: 'abdominal pain', w: 0.6 },
    { k: 'cramps', w: 0.5 },
    { k: 'fever', w: 0.4 },
    { k: 'dehydration', w: 0.8 },
  ]},
  'common cold': { patterns: [
    { k: 'runny nose', w: 0.8 },
    { k: 'sore throat', w: 0.6 },
    { k: 'cough', w: 0.6 },
    { k: 'congestion', w: 0.6 },
    { k: 'sneezing', w: 0.7 },
    { k: 'low-grade fever', w: 0.3 },
  ]},
  migraine: { patterns: [
    { k: 'throbbing headache', w: 0.9 },
    { k: 'photophobia', w: 0.8 },
    { k: 'phonophobia', w: 0.7 },
    { k: 'nausea', w: 0.5 },
    { k: 'aura', w: 0.8 },
  ]},
  pneumonia: { patterns: [
    { k: 'fever', w: 0.5 },
    { k: 'cough', w: 0.6 },
    { k: 'productive sputum', w: 0.8 },
    { k: 'chest pain', w: 0.7 },
    { k: 'shortness of breath', w: 0.85 },
  ]},
  gerd: { patterns: [
    { k: 'heartburn', w: 0.8 },
    { k: 'regurgitation', w: 0.7 },
    { k: 'worse at night', w: 0.6 },
    { k: 'chest burning', w: 0.7 },
  ]},
  influenza: { patterns: [
    { k: 'high fever', w: 0.8 },
    { k: 'chills', w: 0.7 },
    { k: 'myalgia', w: 0.7 },
    { k: 'fatigue', w: 0.5 },
    { k: 'cough', w: 0.5 },
    { k: 'sore throat', w: 0.4 },
  ]},
  'covid-19': { patterns: [
    { k: 'fever', w: 0.5 },
    { k: 'dry cough', w: 0.7 },
    { k: 'loss of smell', w: 0.9 },
    { k: 'loss of taste', w: 0.9 },
    { k: 'shortness of breath', w: 0.7 },
    { k: 'fatigue', w: 0.5 }
  ]},
  'strep throat': { patterns: [
    { k: 'sore throat', w: 0.8 },
    { k: 'fever', w: 0.5 },
    { k: 'swollen lymph nodes', w: 0.6 },
    { k: 'tonsillar exudates', w: 0.8 },
    { k: 'no cough', w: 0.4 },
  ]},
  uti: { patterns: [
    { k: 'dysuria', w: 0.8 },
    { k: 'urinary frequency', w: 0.7 },
    { k: 'urgency', w: 0.6 },
    { k: 'suprapubic pain', w: 0.6 },
    { k: 'hematuria', w: 0.7 },
  ]},
  appendicitis: { patterns: [
    { k: 'rlq pain', w: 0.9 },
    { k: 'right lower quadrant pain', w: 0.9 },
    { k: 'rebound tenderness', w: 0.8 },
    { k: 'fever', w: 0.5 },
    { k: 'nausea', w: 0.5 },
    { k: 'vomiting', w: 0.5 },
  ]},
  asthma: { patterns: [
    { k: 'wheezing', w: 0.8 },
    { k: 'shortness of breath', w: 0.8 },
    { k: 'chest tightness', w: 0.7 },
    { k: 'cough', w: 0.5 },
    { k: 'nighttime symptoms', w: 0.4 },
  ]},
  allergies: { patterns: [
    { k: 'sneezing', w: 0.7 },
    { k: 'itchy eyes', w: 0.6 },
    { k: 'runny nose', w: 0.7 },
    { k: 'watery eyes', w: 0.6 },
    { k: 'nasal congestion', w: 0.6 },
  ]},
  sinusitis: { patterns: [
    { k: 'facial pain', w: 0.8 },
    { k: 'facial pressure', w: 0.8 },
    { k: 'postnasal drip', w: 0.7 },
    { k: 'purulent nasal discharge', w: 0.9 },
    { k: 'worse when bending over', w: 0.6 },
    { k: 'congestion', w: 0.6 },
    { k: 'headache', w: 0.5 },
  ]},
  bronchitis: { patterns: [
    { k: 'productive cough', w: 0.8 },
    { k: 'chest discomfort', w: 0.6 },
    { k: 'wheezing', w: 0.6 },
    { k: 'low-grade fever', w: 0.4 },
    { k: 'fatigue', w: 0.4 },
  ]},
  'otitis media': { patterns: [
    { k: 'ear pain', w: 0.9 },
    { k: 'hearing loss', w: 0.6 },
    { k: 'ear fullness', w: 0.6 },
    { k: 'fever', w: 0.4 },
  ]},
  tonsillitis: { patterns: [
    { k: 'sore throat', w: 0.8 },
    { k: 'odynophagia', w: 0.8 },
    { k: 'tonsillar exudates', w: 0.9 },
    { k: 'fever', w: 0.5 },
    { k: 'swollen lymph nodes', w: 0.6 },
  ]},
  gastritis: { patterns: [
    { k: 'epigastric pain', w: 0.8 },
    { k: 'nausea', w: 0.5 },
    { k: 'vomiting', w: 0.5 },
    { k: 'bloating', w: 0.6 },
    { k: 'worse with nsaids', w: 0.7 },
  ]},
  'peptic ulcer disease': { patterns: [
    { k: 'epigastric pain', w: 0.8 },
    { k: 'burning pain', w: 0.7 },
    { k: 'nocturnal pain', w: 0.8 },
    { k: 'relieved by antacids', w: 0.7 },
    { k: 'melena', w: 0.9 },
  ]},
  'kidney stone': { patterns: [
    { k: 'flank pain', w: 0.9 },
    { k: 'colicky pain', w: 0.8 },
    { k: 'radiates to groin', w: 0.8 },
    { k: 'hematuria', w: 0.8 },
    { k: 'nausea', w: 0.4 },
    { k: 'vomiting', w: 0.4 },
  ]},
};

function tokenizeSymptoms(text = '') {
  const lowered = (text || '').toLowerCase();
  return lowered
    .split(/[,;\n]+|\band\b|\bwith\b/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function matchScore(symptomTokens, illnessKey) {
  const entry = KB[illnessKey];
  if (!entry) return { specScore: 0, matchStrength: 0 };
  const text = symptomTokens.join(' ');
  let specSum = 0;
  let weightSum = 0;
  let matchedWeights = 0;
  for (const p of entry.patterns) {
    weightSum += p.w;
    if (text.includes(p.k)) {
      specSum += p.w; // specificity sum
      matchedWeights += p.w;
    }
  }
  const specScore = weightSum > 0 ? specSum / weightSum : 0; // 0..1
  const matchStrength = weightSum > 0 ? matchedWeights / weightSum : 0; // 0..1
  return { specScore, matchStrength };
}

function normalizeIllness(illness = '') {
  const s = (illness || '').toLowerCase().trim();
  if (s.includes('gastroenteritis') || s.includes('stomach flu') || s.includes('food poisoning')) return 'gastroenteritis';
  if (s.includes('common cold') || s.includes('uri') || s.includes('upper respiratory')) return 'common cold';
  if (s.includes('migraine')) return 'migraine';
  if (s.includes('pneumonia')) return 'pneumonia';
  if (s.includes('gerd') || s.includes('acid reflux') || s.includes('heartburn')) return 'gerd';
  if (s.includes('influenza') || s.includes('flu')) return 'influenza';
  if (s.includes('covid')) return 'covid-19';
  if (s.includes('strep')) return 'strep throat';
  if (s.includes('uti') || s.includes('urinary')) return 'uti';
  if (s.includes('appendicitis') || s.includes('appendix')) return 'appendicitis';
  if (s.includes('asthma')) return 'asthma';
  if (s.includes('allerg')) return 'allergies';
  if (s.includes('sinus')) return 'sinusitis';
  if (s.includes('bronchitis')) return 'bronchitis';
  if (s.includes('ear infection') || s.includes('otitis')) return 'otitis media';
  if (s.includes('tonsillitis')) return 'tonsillitis';
  if (s.includes('gastritis')) return 'gastritis';
  if (s.includes('ulcer')) return 'peptic ulcer disease';
  if (s.includes('kidney stone') || s.includes('nephrolith')) return 'kidney stone';
  return s;
}

// Returns confidence in 0..100
function computeConfidence(symptomsText = '', illness = '') {
  const tokens = tokenizeSymptoms(symptomsText);
  const symptomCount = tokens.length; // volume contributes to reliability

  const illKey = normalizeIllness(illness);
  const { specScore, matchStrength } = matchScore(tokens, illKey);

  // Components: count (c), specificity (s), strength (m)
  const c = Math.min(symptomCount / 8, 1); // saturate around 8 symptoms
  const s = specScore;
  const m = matchStrength;

  let composite = 0.2 * c + 0.4 * s + 0.4 * m;

  // If we couldn't map illness to KB, fallback to a reasonable range based on richness
  if (!KB[illKey]) {
    const fallback = 0.25 + 0.5 * c; // 25%..75% based on count
    composite = Math.max(composite, fallback);
  }

  let pct = Math.round(composite * 100);
  pct = Math.max(5, Math.min(100, pct));
  return pct;
}

module.exports = { computeConfidence };
