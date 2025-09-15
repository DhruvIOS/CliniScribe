import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function FollowUp() {
  const nav = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const decision = (params.get('decision') || '').toLowerCase();
    const rid = params.get('rid') || '';

    const metricsRaw = localStorage.getItem('userMetrics');
    const riskRaw = localStorage.getItem('currentRisk');
    const lastConfidenceRaw = localStorage.getItem('lastConfidence');

    let metrics = metricsRaw ? JSON.parse(metricsRaw) : { healthScore: 80, recoveryRate: 60 };
    let risk = riskRaw ? JSON.parse(riskRaw) : null;

    const conf = Math.max(0, Math.min(100, Number((risk && risk.confidence) || lastConfidenceRaw || 0)));
    // Scale impact by confidence: higher confidence => bigger impact
    const deltaHealth = Math.max(2, Math.round(2 + conf / 20)); // 2..7
    const deltaRecovery = Math.max(4, Math.round(4 + conf / 10)); // 4..14

    if (decision === 'yes') {
      metrics.healthScore = Math.min(100, (metrics.healthScore || 80) + deltaHealth);
      metrics.recoveryRate = Math.min(100, (metrics.recoveryRate || 60) + deltaRecovery);
      if (risk && (!rid || rid === risk.id)) {
        risk.responded = true;
        risk.outcome = 'improved';
        risk.needsReassessment = false;
      }
    } else if (decision === 'no') {
      metrics.healthScore = Math.max(0, (metrics.healthScore || 80) - deltaHealth);
      metrics.recoveryRate = Math.max(0, (metrics.recoveryRate || 60) - deltaRecovery);
      if (risk && (!rid || rid === risk.id)) {
        risk.responded = true;
        risk.outcome = 'worse';
        risk.needsReassessment = true;
      }
    }

    localStorage.setItem('userMetrics', JSON.stringify(metrics));
    if (risk) localStorage.setItem('currentRisk', JSON.stringify(risk));

    nav('/dashboard', { replace: true });
  }, [search, nav]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-200">
      Processing your response…
    </div>
  );
}
