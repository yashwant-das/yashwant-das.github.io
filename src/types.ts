export interface Experience {
  role: string;
  company: string;
  period: string;
  /** 'break' marks a career break: a timeline marker, not a job. Defaults to 'role'. */
  kind?: 'role' | 'break';
  logo?: string;
  highlights?: string[];
  disabled?: boolean;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  live?: string;
  code?: string;
  disabled?: boolean;
  featured?: boolean;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  disabled?: boolean;
}

export interface Certification {
  name: string;
  organization: string;
  logo?: string;
  credentialUrl?: string;
  disabled?: boolean;
}

export interface HeroStat {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface Skill {
  name: string;
  disabled?: boolean;
}

export type SkillItem = string | Skill;

export interface Contact {
  socials?: Record<string, string>;
}

export interface VisibilityConfig {
  home?: boolean;
  about?: boolean;
  experience?: boolean;
  projects?: boolean;
  skills?: boolean;
  education?: boolean;
  certifications?: boolean;
  contact?: boolean;
}

export interface PortfolioData {
  visibility?: VisibilityConfig;
  name?: string;
  subtitle?: string;
  avatar?: string;
  resume?: string;
  heroSummary?: string;
  heroStats?: HeroStat[];
  about?: string;
  experience?: Experience[];
  projects?: Project[];
  skills?: Record<string, SkillItem[]> | SkillItem[];
  education?: Education[];
  certifications?: Certification[];
  contact?: Contact;
}
