// Mirrors data/schema.json. Keep the two in step.

export type SectionId = 'brands' | 'toolbox' | 'surfaces' | 'work' | 'writing' | 'contact';

export type VisibilityConfig = Partial<Record<SectionId, boolean>>;

export interface Brand {
  name: string;
  kind: 'client' | 'employer';
  logo?: string;
  scale?: number;
  disabled?: boolean;
}

export interface ToolGroup {
  id: string;
  label: string;
}

export interface Tool {
  name: string;
  group: string;
  icon: string;
  scale?: number;
  focus?: boolean;
  disabled?: boolean;
}

export interface Surface {
  name: string;
  icon?: string;
}

export interface Project {
  title: string;
  description: string;
  code: string;
  stack?: string[];
  disabled?: boolean;
}

export interface Article {
  title: string;
  description?: string;
  url: string;
  disabled?: boolean;
}

export interface Contact {
  email?: string;
  socials?: Record<string, string>;
}

export interface PortfolioData {
  visibility?: VisibilityConfig;
  name: string;
  role: string;
  location?: string;
  avatar?: string;
  statement: string;
  status?: string;
  description?: string;
  brands?: { note?: string; items: Brand[] };
  toolbox?: { groups: ToolGroup[]; items: Tool[] };
  surfaces?: Surface[];
  projects?: Project[];
  articles?: Article[];
  contact: Contact;
}
