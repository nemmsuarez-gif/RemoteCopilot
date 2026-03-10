export function buildResumePrompt({ job, resume, userProfile }) {
  return [
    'You are an expert resume writer for remote roles.',
    `Target role: ${job.title} at ${job.company}.`,
    `Job summary: ${job.cleanedJobText || job.rawJobText || 'N/A'}`,
    `Candidate baseline resume: ${resume.rawText || ''}`,
    `Candidate profile: ${JSON.stringify(userProfile || {})}`,
    'Return a tailored resume draft in markdown with measurable outcomes.',
  ].join('\n');
}

export function buildCoverLetterPrompt({ job, resume, tone = 'professional' }) {
  return [
    'Write a concise cover letter for a remote job application.',
    `Tone: ${tone}.`,
    `Role: ${job.title} at ${job.company}.`,
    `Job details: ${job.cleanedJobText || ''}`,
    `Candidate resume data: ${resume.rawText || ''}`,
    'Keep it specific and editable.',
  ].join('\n');
}

export function buildScreeningAnswerPrompt({ job, resume, question }) {
  return [
    'Draft a screening question response for a job candidate.',
    `Question: ${question}`,
    `Role: ${job.title} at ${job.company}`,
    `Job details: ${job.cleanedJobText || ''}`,
    `Resume: ${resume.rawText || ''}`,
    'Return plain text answer under 180 words.',
  ].join('\n');
}
