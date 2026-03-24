import { create } from 'zustand';
import defaultData from '../data/portfolioData.json';

export interface Profile {
  name: string;
  titles: string[];
  heroIntro: string;
  aboutHeading: string;
  summary: string;
  stats: { label: string; value: string }[];
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
  keyProjects: string[];
}

export interface Project {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string;
  tech: string[];
  highlights: string[];
  image?: string;
  liveUrl?: string;
}

export interface Education {
  id: string;
  university: string;
  degree: string;
  dates: string;
}

export interface Contact {
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
}

export interface HeroSkillBadge {
  text: string;
  color: string;
  textColor: string;
  rotation: number;
  shape: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  contact: Contact;
  heroSkillBadges: HeroSkillBadge[];
}

interface PortfolioStore extends PortfolioData {
  updateProfile: (profile: Profile) => void;
  updateSkills: (skills: SkillCategory[]) => void;
  updateExperience: (experience: Experience[]) => void;
  addExperience: (exp: Experience) => void;
  deleteExperience: (id: string) => void;
  updateProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  updateEducation: (education: Education[]) => void;
  addEducation: (edu: Education) => void;
  deleteEducation: (id: string) => void;
  updateContact: (contact: Contact) => void;
  updateHeroBadges: (badges: HeroSkillBadge[]) => void;
  exportData: () => string;
  importData: (jsonString: string) => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'portfolio_data';

function loadData(): PortfolioData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaultData to ensure new fields (titles, stats, etc.) are present
      return {
        ...defaultData,
        ...parsed,
        profile: { ...defaultData.profile, ...parsed.profile },
        contact: { ...defaultData.contact, ...parsed.contact }
      } as PortfolioData;
    }
  } catch (e) {
    console.error('Failed to load portfolio data from localStorage:', e);
  }
  return defaultData as PortfolioData;
}

function saveData(data: PortfolioData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save portfolio data to localStorage:', e);
  }
}

function getPortfolioData(state: PortfolioStore): PortfolioData {
  return {
    profile: state.profile,
    skills: state.skills,
    experience: state.experience,
    projects: state.projects,
    education: state.education,
    contact: state.contact,
    heroSkillBadges: state.heroSkillBadges,
  };
}

export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  ...loadData(),

  updateProfile: (profile) => {
    set({ profile });
    saveData({ ...getPortfolioData({ ...get(), profile }) });
  },

  updateSkills: (skills) => {
    set({ skills });
    saveData({ ...getPortfolioData({ ...get(), skills }) });
  },

  updateExperience: (experience) => {
    set({ experience });
    saveData({ ...getPortfolioData({ ...get(), experience }) });
  },

  addExperience: (exp) => {
    const experience = [...get().experience, exp];
    set({ experience });
    saveData({ ...getPortfolioData({ ...get(), experience }) });
  },

  deleteExperience: (id) => {
    const experience = get().experience.filter((e) => e.id !== id);
    set({ experience });
    saveData({ ...getPortfolioData({ ...get(), experience }) });
  },

  updateProjects: (projects) => {
    set({ projects });
    saveData({ ...getPortfolioData({ ...get(), projects }) });
  },

  addProject: (project) => {
    const projects = [...get().projects, project];
    set({ projects });
    saveData({ ...getPortfolioData({ ...get(), projects }) });
  },

  deleteProject: (id) => {
    const projects = get().projects.filter((p) => p.id !== id);
    set({ projects });
    saveData({ ...getPortfolioData({ ...get(), projects }) });
  },

  updateEducation: (education) => {
    set({ education });
    saveData({ ...getPortfolioData({ ...get(), education }) });
  },

  addEducation: (edu) => {
    const education = [...get().education, edu];
    set({ education });
    saveData({ ...getPortfolioData({ ...get(), education }) });
  },

  deleteEducation: (id) => {
    const education = get().education.filter((e) => e.id !== id);
    set({ education });
    saveData({ ...getPortfolioData({ ...get(), education }) });
  },

  updateContact: (contact) => {
    set({ contact });
    saveData({ ...getPortfolioData({ ...get(), contact }) });
  },

  updateHeroBadges: (heroSkillBadges) => {
    set({ heroSkillBadges });
    saveData({ ...getPortfolioData({ ...get(), heroSkillBadges }) });
  },

  exportData: () => {
    return JSON.stringify(getPortfolioData(get()), null, 2);
  },

  importData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString) as PortfolioData;
      set(data);
      saveData(data);
    } catch (e) {
      console.error('Failed to import data:', e);
      throw new Error('Invalid JSON data');
    }
  },

  resetToDefaults: () => {
    localStorage.removeItem(STORAGE_KEY);
    const data = defaultData as PortfolioData;
    set(data);
  },
}));
