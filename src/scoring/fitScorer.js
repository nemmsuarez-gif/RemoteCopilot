import { fitScoreConfig } from '../config/fitScoreConfig.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function scoreTitle(preferredTitles, jobTitle, weight) {
  if (!preferredTitles?.length || !jobTitle) return { score: 0, reason: 'No title preference configured.' };
  const hit = preferredTitles.some((t) => jobTitle.toLowerCase().includes(t.toLowerCase()));
  return { score: hit ? weight : 0, reason: hit ? 'Job title matches preferred roles.' : 'Title does not match preferred roles.' };
}

function scoreSkills(userSkills, jobText, weight) {
  if (!userSkills?.length || !jobText) return { score: 0, reason: 'Skills comparison unavailable.' };
  const overlaps = userSkills.filter((s) => jobText.toLowerCase().includes(s.toLowerCase()));
  const ratio = overlaps.length / userSkills.length;
  return { score: weight * ratio, reason: `${overlaps.length}/${userSkills.length} preferred skills detected.` };
}

function scoreSalary(prefMin, prefMax, jobMin, jobMax, weight) {
  if (!jobMin && !jobMax) return { score: weight * 0.5, reason: 'Salary not listed; partial score assigned.' };
  const min = jobMin ?? jobMax;
  const max = jobMax ?? jobMin;
  const within = (!prefMin || max >= prefMin) && (!prefMax || min <= prefMax);
  return { score: within ? weight : weight * 0.2, reason: within ? 'Salary aligns with target range.' : 'Salary misaligned with target range.' };
}

function scoreRemote(preferences, jobRemoteType, weight, penalties) {
  const wantsFull = preferences.prioritizeFullyRemote;
  const pref = preferences.remotePreference || 'remote_or_hybrid';

  if (wantsFull && jobRemoteType === 'onsite') {
    return { score: 0, penalty: penalties.prioritizeFullyRemoteOnsite, reason: 'On-site role penalized for fully-remote priority.' };
  }
  if (wantsFull && jobRemoteType === 'hybrid') {
    return { score: weight * 0.25, penalty: penalties.prioritizeFullyRemoteHybrid, reason: 'Hybrid role heavily penalized for fully-remote priority.' };
  }

  const matching =
    pref === 'any' ||
    (pref === 'fully_remote' && jobRemoteType === 'remote') ||
    (pref === 'remote_or_hybrid' && ['remote', 'hybrid'].includes(jobRemoteType));

  return { score: matching ? weight : weight * 0.2, penalty: 0, reason: matching ? 'Remote preference matched.' : 'Remote preference mismatch.' };
}

function scoreLocation(preferredLocations, jobLocation, weight) {
  if (!preferredLocations?.length) return { score: weight, reason: 'No location restrictions configured.' };
  const matched = preferredLocations.some((loc) => (jobLocation || '').toLowerCase().includes(loc.toLowerCase()));
  return { score: matched ? weight : 0, reason: matched ? 'Location preference matched.' : 'Location preference mismatch.' };
}

function scoreExperience(prefLevel, jobText, weight) {
  if (!prefLevel) return { score: weight * 0.6, reason: 'No explicit experience preference set.' };
  const matched = (jobText || '').toLowerCase().includes(prefLevel.toLowerCase());
  return { score: matched ? weight : weight * 0.3, reason: matched ? 'Experience level matched.' : 'Experience level unclear/mismatched.' };
}

export function calculateFitScore({ preferences, job }) {
  const { weights, penalties } = fitScoreConfig;
  const reasons = [];

  const title = scoreTitle(preferences.preferredTitles, job.title, weights.titleMatch);
  const skills = scoreSkills(preferences.skills, `${job.cleanedJobText || ''} ${job.title || ''}`, weights.skillsOverlap);
  const salary = scoreSalary(preferences.salaryTargetMin, preferences.salaryTargetMax, job.salaryMin, job.salaryMax, weights.salaryMatch);
  const remote = scoreRemote(preferences, job.remoteType, weights.remotePreference, penalties);
  const location = scoreLocation(preferences.preferredLocations, job.location, weights.locationPreference);
  const experience = scoreExperience(preferences.experienceLevel, job.cleanedJobText, weights.experienceMatch);

  const subtotal = title.score + skills.score + salary.score + remote.score + location.score + experience.score;
  const score = clamp(Math.round(subtotal - (remote.penalty || 0)), 0, 100);

  [title, skills, salary, remote, location, experience].forEach((part) => reasons.push(part.reason));

  return {
    fitScore: score,
    fitReasoning: reasons.join(' '),
    breakdown: { title, skills, salary, remote, location, experience },
  };
}
