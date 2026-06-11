declare module '*/landing-content.json' {
  interface HeroData {
    title: string;
    name: string;
    subtitle: string;
    cta: {
      primary: {
        text: string;
        href: string;
      };
      secondary: {
        text: string;
        href: string;
      };
    };
  }

  interface AboutData {
    title: string;
    subtitle: string;
    personalLine?: string;
    content: string[];
    contact: {
      location: string;
      email: string;
      phone: string;
    };
  }

  interface ExperienceItem {
    title: string;
    company: string;
    period: string;
    location: string;
    responsibilities: string[];
  }

  interface ExperienceData {
    title: string;
    subtitle: string;
    earlierRolesLabel: string;
    items: ExperienceItem[];
  }

  interface ProjectOutcome {
    problem: string;
    result: string;
  }

  interface Project {
    title: string;
    slug: string;
    role: string;
    url: string;
    outcome?: ProjectOutcome;
    description: string[];
    technologies: string[];
  }

  interface ProjectsData {
    title: string;
    subtitle: string;
    items: Project[];
  }

  interface SkillCategory {
    title: string;
    skills: string[];
  }

  interface SkillsData {
    title: string;
    subtitle: string;
    categories: SkillCategory[];
  }

  interface EducationItem {
    degree: string;
    institution: string;
    location: string;
    period: string;
  }

  interface EducationData {
    title: string;
    subtitle: string;
    items: EducationItem[];
  }

  interface ContactInfo {
    label: string;
    value: string;
  }

  interface SocialLink {
    name: string;
    url: string;
    icon: string;
  }

  interface ContactData {
    title: string;
    subtitle: string;
    info: {
      location: ContactInfo;
      email: ContactInfo;
      phone: ContactInfo;
    };
    social: SocialLink[];
  }

  interface BlogSectionData {
    title: string;
    subtitle: string;
    limit: number;
    viewAllText: string;
  }

  interface ResumeData {
    href: string;
    label: string;
    downloadName: string;
  }

  interface LandingContent {
    hero: HeroData;
    resume: ResumeData;
    about: AboutData;
    experience: ExperienceData;
    projects: ProjectsData;
    skills: SkillsData;
    education: EducationData;
    blog: BlogSectionData;
    contact: ContactData;
  }

  const value: LandingContent;
  export default value;
}
