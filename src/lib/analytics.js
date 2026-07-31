export function averageEnergy(signals) {
  if (!signals.length) return 0;
  return Math.round(signals.reduce((sum, signal) => sum + signal.energy, 0) / signals.length);
}

export function averageConfidence(signals) {
  if (!signals.length) return 0;
  return Math.round(signals.reduce((sum, signal) => sum + signal.confidence, 0) / signals.length);
}

export function stageCounts(signals) {
  return signals.reduce((acc, signal) => {
    acc[signal.stage] = (acc[signal.stage] || 0) + 1;
    return acc;
  }, { seed: 0, growing: 0, bloom: 0 });
}

export function momentumScore(signals, activity, now = Date.now()) {
  const avg = averageEnergy(signals);
  const recentEvents = activity.filter((event) => now - event.createdAt < 604800000).length;
  const blooms = signals.filter((signal) => signal.stage === 'bloom').length;
  return Math.min(100, Math.round(avg * 0.65 + recentEvents * 3 + blooms * 4));
}

export function strongestSignal(signals) {
  return [...signals].sort((a, b) => scoreSignal(b) - scoreSignal(a))[0] || null;
}

export function scoreSignal(signal) {
  return Math.round(signal.energy * 0.65 + signal.confidence * 0.35);
}

export function formatRelative(timestamp, now = Date.now()) {
  const minutes = Math.max(1, Math.floor((now - timestamp) / 60000));
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  return `${Math.floor(hours / 24)} дн назад`;
}
