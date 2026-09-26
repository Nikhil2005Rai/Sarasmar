/**
 * SARASMER match score (0–100).
 *  70% — skill fit: required skills covered by the student, weighted by verified score
 *        (unverified skills count at 40% of a nominal 70 score).
 *  30% — availability: fraction of the project window the student is free for.
 */
export type MatchStudentSkill = { name: string; verified: boolean; score: number | null };

export function skillFit(required: string[], skills: MatchStudentSkill[]) {
  if (required.length === 0) return 1;
  const byName = new Map(skills.map((s) => [s.name.toLowerCase(), s]));
  let total = 0;
  for (const r of required) {
    const s = byName.get(r.toLowerCase());
    if (!s) continue;
    total += s.verified ? (s.score ?? 80) / 100 : 0.28;
  }
  return total / required.length;
}

export function availabilityFit(
  window: { from: Date; to: Date },
  availability: { from: Date; to: Date; status: string } | null | undefined,
) {
  if (!availability || availability.status !== "AVAILABLE") return 0;
  const start = Math.max(window.from.getTime(), availability.from.getTime());
  const end = Math.min(window.to.getTime(), availability.to.getTime());
  const span = window.to.getTime() - window.from.getTime();
  if (span <= 0) return 0;
  return Math.max(0, Math.min(1, (end - start) / span));
}

export function matchScore(
  required: string[],
  skills: MatchStudentSkill[],
  window: { from: Date; to: Date },
  availability: { from: Date; to: Date; status: string } | null | undefined,
) {
  return Math.round(100 * (0.7 * skillFit(required, skills) + 0.3 * availabilityFit(window, availability)));
}

export function matchedSkills(required: string[], skills: MatchStudentSkill[]) {
  const set = new Set(skills.filter((s) => s.verified).map((s) => s.name.toLowerCase()));
  return required.filter((r) => set.has(r.toLowerCase()));
}
