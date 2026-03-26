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
  isLoading: boolean;
  initialize: () => Promise<void>;
  updateProfile: (profile: Profile) => Promise<void>;
  updateSkills: (skills: SkillCategory[]) => Promise<void>;
  updateExperience: (experience: Experience[]) => Promise<void>;
  addExperience: (exp: Experience) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  updateProjects: (projects: Project[]) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateEducation: (education: Education[]) => Promise<void>;
  addEducation: (edu: Education) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  updateContact: (contact: Contact) => Promise<void>;
  updateHeroBadges: (badges: HeroSkillBadge[]) => Promise<void>;
  exportData: () => string;
  importData: (jsonString: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

async function fetchFromKV(): Promise<PortfolioData | null> {
  try {
    const response = await fetch('/api/portfolio');
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    if (data.status === 'no_data') return null;
    return data as PortfolioData;
  } catch (e) {
    console.error('Error fetching from KV:', e);
    return null;
  }
}

async function saveToKV(data: PortfolioData) {
  try {
    const response = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save');
  } catch (e) {
    console.error('Error saving to KV:', e);
  }
}

function getPortfolioData(state: any): PortfolioData {
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
  ...defaultData as PortfolioData,
  isLoading: true,

  initialize: async () => {
    const kvData = await fetchFromKV();
    if (kvData) {
      // Merge with defaultData to ensure new fields are present
      set({
        ...defaultData,
        ...kvData,
        profile: { ...defaultData.profile, ...kvData.profile },
        contact: { ...defaultData.contact, ...kvData.contact },
        isLoading: false
      });
    } else {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profile) => {
    set({ profile });
    await saveToKV(getPortfolioData(get()));
  },

  updateSkills: async (skills) => {
    set({ skills });
    await saveToKV(getPortfolioData(get()));
  },

  updateExperience: async (experience) => {
    set({ experience });
    await saveToKV(getPortfolioData(get()));
  },

  addExperience: async (exp) => {
    const experience = [...get().experience, exp];
    set({ experience });
    await saveToKV(getPortfolioData(get()));
  },

  deleteExperience: async (id) => {
    const experience = get().experience.filter((e) => e.id !== id);
    set({ experience });
    await saveToKV(getPortfolioData(get()));
  },

  updateProjects: async (projects) => {
    set({ projects });
    await saveToKV(getPortfolioData(get()));
  },

  addProject: async (project) => {
    const projects = [...get().projects, project];
    set({ projects });
    await saveToKV(getPortfolioData(get()));
  },

  deleteProject: async (id) => {
    const projects = get().projects.filter((p) => p.id !== id);
    set({ projects });
    await saveToKV(getPortfolioData(get()));
  },

  updateEducation: async (education) => {
    set({ education });
    await saveToKV(getPortfolioData(get()));
  },

  addEducation: async (edu) => {
    const education = [...get().education, edu];
    set({ education });
    await saveToKV(getPortfolioData(get()));
  },

  deleteEducation: async (id) => {
    const education = get().education.filter((e) => e.id !== id);
    set({ education });
    await saveToKV(getPortfolioData(get()));
  },

  updateContact: async (contact) => {
    set({ contact });
    await saveToKV(getPortfolioData(get()));
  },

  updateHeroBadges: async (heroSkillBadges) => {
    set({ heroSkillBadges });
    await saveToKV(getPortfolioData(get()));
  },

  exportData: () => {
    return JSON.stringify(getPortfolioData(get()), null, 2);
  },

  importData: async (jsonString) => {
    try {
      const data = JSON.parse(jsonString) as PortfolioData;
      set(data);
      await saveToKV(data);
    } catch (e) {
      console.error('Failed to import data:', e);
      throw new Error('Invalid JSON data');
    }
  },

  resetToDefaults: async () => {
    const data = defaultData as PortfolioData;
    set(data);
    await saveToKV(data);
  },
}));

