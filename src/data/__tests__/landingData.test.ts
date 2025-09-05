import {
  landingData,
  heroData,
  aboutData,
  experienceData,
  projectsData,
  skillsData,
  educationData,
  contactData,
} from '../landingData';

describe('landingData', () => {
  it('should export landingData from JSON file', () => {
    expect(landingData).toBeDefined();
    expect(typeof landingData).toBe('object');
  });

  it('should export heroData', () => {
    expect(heroData).toBeDefined();
    expect(heroData).toBe(landingData.hero);
  });

  it('should export aboutData', () => {
    expect(aboutData).toBeDefined();
    expect(aboutData).toBe(landingData.about);
  });

  it('should export experienceData', () => {
    expect(experienceData).toBeDefined();
    expect(experienceData).toBe(landingData.experience);
  });

  it('should export projectsData', () => {
    expect(projectsData).toBeDefined();
    expect(projectsData).toBe(landingData.projects);
  });

  it('should export skillsData', () => {
    expect(skillsData).toBeDefined();
    expect(skillsData).toBe(landingData.skills);
  });

  it('should export educationData', () => {
    expect(educationData).toBeDefined();
    expect(educationData).toBe(landingData.education);
  });

  it('should export contactData', () => {
    expect(contactData).toBeDefined();
    expect(contactData).toBe(landingData.contact);
  });

  it('should have all required sections in landingData', () => {
    expect(landingData).toHaveProperty('hero');
    expect(landingData).toHaveProperty('about');
    expect(landingData).toHaveProperty('experience');
    expect(landingData).toHaveProperty('projects');
    expect(landingData).toHaveProperty('skills');
    expect(landingData).toHaveProperty('education');
    expect(landingData).toHaveProperty('contact');
  });

  it('should have consistent data structure across all sections', () => {
    const sections = [
      heroData,
      aboutData,
      experienceData,
      projectsData,
      skillsData,
      educationData,
      contactData,
    ];

    sections.forEach(section => {
      expect(section).toBeDefined();
      expect(typeof section).toBe('object');
    });
  });
});
