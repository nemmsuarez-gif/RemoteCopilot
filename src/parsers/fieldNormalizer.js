export function normalizeTitle(title) {
  return (title || '').trim().replace(/\s+/g, ' ');
}

export function normalizeCompany(company) {
  return (company || '').trim().replace(/\s+/g, ' ');
}

export function normalizeLocation(location) {
  return (location || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function normalizeSourceName(sourceName) {
  return (sourceName || 'manual').trim().toLowerCase();
}
