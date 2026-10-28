// Links and lists used by the home page. Texts live in src/locales so they can be translated.

export const CONTACT = {
  email: 'iuri.andrade.mundstock@gmail.com',
  github: 'https://github.com/IuriDkill',
  linkedin: 'https://www.linkedin.com/in/iuri-mundstock-905397192/',
} as const;

export const SKILL_GROUPS = [
  { key: 'frontend', items: ['React', 'React Native', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'] },
  { key: 'styling', items: ['Tailwind CSS', 'Styled Components', 'Bootstrap', 'CSS Modules', 'Framer Motion'] },
  { key: 'backend', items: ['Node.js', 'PHP', 'Python', 'Firebase', 'AWS'] },
  { key: 'security', items: ['Cybersecurity', 'Firestore Rules', 'Performance', 'Jupyter'] },
] as const;

// Skills that orbit the 3D core in the hero.
export const ORBIT_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'React Native', 'Tailwind', 'PHP', 'Security'] as const;

type Project = {
  key: string;
  name: string;
  stack: readonly string[];
  // Deployed site, shown as the main "see it live" link.
  live?: string;
  repo?: string;
  featured?: boolean;
};

export const PROJECTS: readonly Project[] = [
  {
    key: 'lovelyMoments',
    name: 'Lovely Moments',
    live: 'https://dhgcufq39xb3m.cloudfront.net/',
    stack: ['React 19', 'TypeScript', 'Vite', 'Firebase', 'AWS', 'i18n'],
    featured: true,
  },
  {
    key: 'reactLib',
    name: 'react-lib',
    repo: 'https://github.com/IuriDkill/react-lib',
    stack: ['React', 'JavaScript'],
  },
  {
    key: 'performance',
    name: 'performanceEvaluation',
    repo: 'https://github.com/IuriDkill/performanceEvaluation',
    stack: ['Python', 'Jupyter Notebook'],
  },
  {
    key: 'blanke3d',
    name: 'Blanke Criações 3D',
    live: 'https://site-3d.blanke3d.workers.dev/',
    stack: ['React', 'TypeScript', 'Vite', 'Cloudflare Workers', 'i18n'],
    featured: true,
  },
  {
    key: 'upgrade',
    name: 'Upgrade',
    repo: 'https://github.com/IuriDkill/Upgrade',
    stack: ['JavaScript'],
  },
  {
    key: 'lides',
    name: 'lides',
    repo: 'https://github.com/IuriDkill/lides',
    stack: ['TypeScript'],
  },
];

export const EDUCATION = [
  { key: 'masters', current: true },
  { key: 'bachelor', current: false },
] as const;
