export class JobRepository {
  constructor() {
    this.jobs = [];
  }

  async save(job) {
    this.jobs.push(job);
    return job;
  }

  async list() {
    return [...this.jobs];
  }
}
