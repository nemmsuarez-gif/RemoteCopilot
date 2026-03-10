const REMOTE_PATTERNS = {
  remote: [/\bfully remote\b/i, /\bremote only\b/i, /\b100% remote\b/i, /\bremote\b/i],
  hybrid: [/\bhybrid\b/i, /\bin-office.*\d+\s*days?\b/i, /\bmix of remote/i],
  onsite: [/\bonsite\b/i, /\bon-site\b/i, /\bin office\b/i, /\bon premises\b/i],
};

export function classifyRemoteType(text) {
  if (!text) return 'unknown';
  if (REMOTE_PATTERNS.hybrid.some((p) => p.test(text))) return 'hybrid';
  if (REMOTE_PATTERNS.onsite.some((p) => p.test(text))) return 'onsite';
  if (REMOTE_PATTERNS.remote.some((p) => p.test(text))) return 'remote';
  return 'unknown';
}
