import landingContent from "./landing-content.json";

// Load data from JSON file
export const landingData = landingContent;

// Export individual sections for easy access
export const heroData = landingData.hero;
export const aboutData = landingData.about;
export const experienceData = landingData.experience;
export const projectsData = landingData.projects;
export const skillsData = landingData.skills;
export const educationData = landingData.education;
export const contactData = landingData.contact; 