export function validateParsedJob(parsed) {
  const errors = [];
  if (!parsed.title || parsed.title === 'Untitled role') errors.push('Title missing');
  if (!parsed.company || parsed.company === 'Unknown company') errors.push('Company missing');
  if (parsed.salaryMin && parsed.salaryMax && parsed.salaryMin > parsed.salaryMax) errors.push('Salary range invalid');

  return {
    valid: errors.length === 0,
    errors,
  };
}
