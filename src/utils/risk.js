// Risk assessment utilities
// Maps common conditions to base severity, applies red-flag escalation, and computes follow-up.

export const CONDITION_SEVERITY = {
  'myocardial infarction': 'High',
  'heart attack': 'High',
  'stroke': 'High',
  'meningitis': 'High',
  'sepsis': 'High',
  'pulmonary embolism': 'High',
  'appendicitis': 'High',
  'ectopic pregnancy': 'High',
  'gi bleed': 'High',
  'upper gi bleed': 'High',
  'lower gi bleed': 'High',

  pneumonia: 'Moderate',
  asthma: 'Moderate',
  gastroenteritis: 'Moderate',
  uti: 'Moderate',
  'urinary tract infection': 'Moderate',
  cellulitis: 'Moderate',
  fracture: 'Moderate',
  migraine: 'Moderate',

  'common cold': 'Low',
  'viral uri': 'Low',
  'upper respiratory infection': 'Low',
  'tension headache': 'Low',
  'allergic rhinitis': 'Low',
  allergies: 'Low',
  gerd: 'Low',
  'acid reflux': 'Low',
  sprain: 'Low',
};

const RED_FLAG_TERMS = [
  'chest pain',
  'shortness of breath',
  'severe trouble breathing',
  'bluish lips',
  'confusion',
  'fainting',
  'unresponsive',
  'seizure',
  'stiff neck',
  'severe headache',
  'bloody stool',
  'coughing blood',
  'severe bleeding',
  'black tarry stool',
  'severe abdominal pain',
  'rigid abdomen',
  'cannot keep fluids',
  'persistent vomiting',
  'signs of dehydration',
  'very drowsy',
  'cannot stay awake',
  'high fever',
  '103',
  '39.5',
];

export function severityFromCondition(illness = '', symptoms = '', advice = {}) {
  const ill = (illness || '').toLowerCase();
  const sym = (symptoms || '').toLowerCase();

  const redFlag =
    RED_FLAG_TERMS.some((t) => sym.includes(t)) ||
    (Array.isArray(advice?.redFlags) && advice.redFlags.some((r) => (r || '').toLowerCase().includes('seek')));
  if (redFlag) return 'High';

  let mapped = null;
  for (const [k, v] of Object.entries(CONDITION_SEVERITY)) {
    if (ill.includes(k) || sym.includes(k)) {
      mapped = v;
      break;
    }
  }

  if ((ill.includes('asthma') || sym.includes('asthma')) && /severe|cannot speak|wheezing badly/.test(sym)) {
    return 'High';
  }
  if ((ill.includes('appendicitis') || sym.includes('appendicitis')) && /severe|rigid abdomen|rebound/.test(sym)) {
    return 'High';
  }

  return mapped || 'Low';
}

export function assessRisk(likelyCondition, symptoms, advice = {}) {
  const severity = severityFromCondition(likelyCondition, symptoms, advice);
  if (severity === 'High') {
    return {
      severity,
      urgency: 'Seek immediate care (ER/urgent care).',
      followUpHours: [12, 24],
      followUpNeeded: true,
    };
  }
  if (severity === 'Moderate') {
    return {
      severity,
      urgency: 'Monitor closely; see a clinician if not improving.',
      followUpHours: [24, 48],
      followUpNeeded: true,
    };
  }
  return {
    severity,
    urgency: 'Self-care and monitor for changes.',
    followUpHours: [48, 72],
    followUpNeeded: true,
  };
}

export function computeFollowUpDate(hoursRange) {
  if (!hoursRange || !hoursRange.length) return null;
  const d = new Date(Date.now() + hoursRange[0] * 3600000);
  return d.toISOString();
}

