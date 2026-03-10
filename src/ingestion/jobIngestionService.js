import { parseJobInput } from '../parsers/jobParser.js';
import { validateParsedJob } from '../validation/jobValidation.js';
import { assignDuplicateGroupId } from './dedupeService.js';

export class JobIngestionService {
  constructor({ repository, scorer }) {
    this.repository = repository;
    this.scorer = scorer;
  }

  async ingest({ input, userPreferences }) {
    const parsed = parseJobInput(input);
    const validation = validateParsedJob(parsed);

    if (!validation.valid) {
      return {
        status: 'rejected',
        errors: validation.errors,
      };
    }

    const dedupeGroup = assignDuplicateGroupId({
      ...parsed,
      postedDate: input.postedDate,
    });

    const fit = this.scorer({ preferences: userPreferences, job: parsed });

    const persisted = await this.repository.save({
      ...parsed,
      postedDate: input.postedDate || null,
      ingestionDate: new Date().toISOString(),
      duplicateGroupId: dedupeGroup,
      fitScore: fit.fitScore,
      fitReasoning: fit.fitReasoning,
    });

    return {
      status: 'saved',
      job: persisted,
      fit,
    };
  }
}
