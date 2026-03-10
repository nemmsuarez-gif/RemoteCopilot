import { buildCoverLetterPrompt, buildResumePrompt, buildScreeningAnswerPrompt } from './promptBuilders.js';

export class GenerationService {
  constructor({ provider, defaultModel = 'gpt-4.1-mini', promptVersion = 'v1' }) {
    this.provider = provider;
    this.defaultModel = defaultModel;
    this.promptVersion = promptVersion;
  }

  async generateTailoredResume(input) {
    const prompt = buildResumePrompt(input);
    return this.#generate({ prompt, docType: 'resume_tailored', metadata: { jobId: input.job.id, resumeId: input.resume.id } });
  }

  async generateCoverLetter(input) {
    const prompt = buildCoverLetterPrompt(input);
    return this.#generate({
      prompt,
      docType: 'cover_letter',
      metadata: { jobId: input.job.id, resumeId: input.resume.id, tone: input.tone || 'professional' },
    });
  }

  async generateScreeningAnswer(input) {
    const prompt = buildScreeningAnswerPrompt(input);
    return this.#generate({ prompt, docType: 'screening_answer', metadata: { jobId: input.job.id, question: input.question } });
  }

  async #generate({ prompt, docType, metadata }) {
    const response = await this.provider.generate({ prompt, model: this.defaultModel });
    return {
      docType,
      content: response.content,
      modelProvider: this.provider.name,
      modelName: this.defaultModel,
      promptVersion: this.promptVersion,
      generationMetadata: metadata,
      editable: true,
    };
  }
}
