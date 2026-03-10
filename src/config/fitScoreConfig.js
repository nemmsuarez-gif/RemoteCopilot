export const fitScoreConfig = {
  weights: {
    titleMatch: 25,
    skillsOverlap: 25,
    salaryMatch: 15,
    remotePreference: 20,
    locationPreference: 10,
    experienceMatch: 5,
  },
  penalties: {
    prioritizeFullyRemoteHybrid: 20,
    prioritizeFullyRemoteOnsite: 35,
  },
};
