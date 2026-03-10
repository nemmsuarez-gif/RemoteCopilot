const YEARLY_MULTIPLIERS = {
  year: 1,
  yearly: 1,
  annual: 1,
  month: 12,
  monthly: 12,
  week: 52,
  weekly: 52,
  day: 260,
  daily: 260,
  hour: 2080,
  hourly: 2080,
};

function parseAmount(raw) {
  const sanitized = raw.replace(/[$,]/g, '').trim();
  const amount = Number.parseFloat(sanitized);
  return Number.isFinite(amount) ? Math.round(amount) : null;
}

export function parseSalary(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  const currency = /\$/g.test(text) ? 'USD' : 'USD';

  const rangeMatch = text.match(/\$?\s?([\d,.]+)\s?(k|m)?\s?(?:-|to)\s?\$?\s?([\d,.]+)\s?(k|m)?/i);
  const singleMatch = text.match(/\$\s?([\d,.]+)\s?(k|m)?/i);
  const cadenceMatch = lower.match(/per\s+(year|month|week|day|hour)|\b(yearly|annual|monthly|weekly|daily|hourly)\b/i);
  const cadence = cadenceMatch ? (cadenceMatch[1] || cadenceMatch[2]).toLowerCase() : 'year';
  const multiplier = YEARLY_MULTIPLIERS[cadence] ?? 1;

  const toNumber = (val, suffix) => {
    const base = parseAmount(val);
    if (base == null) return null;
    if (!suffix) return base;
    return suffix.toLowerCase() === 'm' ? base * 1_000_000 : base * 1_000;
  };

  let salaryMin;
  let salaryMax;

  if (rangeMatch) {
    salaryMin = toNumber(rangeMatch[1], rangeMatch[2]);
    salaryMax = toNumber(rangeMatch[3], rangeMatch[4]);
  } else if (singleMatch) {
    salaryMin = toNumber(singleMatch[1], singleMatch[2]);
    salaryMax = salaryMin;
  } else {
    return null;
  }

  return {
    salaryMin: Math.round(salaryMin * multiplier),
    salaryMax: Math.round(salaryMax * multiplier),
    currency,
    cadence,
  };
}
