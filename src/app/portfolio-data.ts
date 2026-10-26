export interface SkillGroup {
  readonly title: string;
  readonly mark: string;
  readonly skills: readonly string[];
}

export interface PortfolioProject {
  readonly name: string;
  readonly category: string;
  readonly description: string;
  readonly technologies: readonly string[];
  readonly liveUrl: string;
  readonly sourceUrl: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly imageCaption: string;
  readonly focus?: string;
}

export interface ExperienceEntry {
  readonly role: string;
  readonly company: string;
  readonly dates: string;
  readonly responsibilities: readonly string[];
}

export const PROFILE = {
  name: 'Mohammed Mujeeba',
  title: 'Front-End Developer | Angular | React | TypeScript',
  location: 'Riyadh, Saudi Arabia',
  email: 'mdmujeeba66@gmail.com',
  github: 'https://github.com/muzy326',
  linkedin: 'https://linkedin.com/in/mujeeba-mohammed-277953363',
  summary:
    'I am a front-end developer experienced in building responsive web applications using Angular, React, JavaScript, and TypeScript. I also work with Node.js, Express.js, REST APIs, PostgreSQL, and AI integrations. I enjoy building practical applications, creating user-friendly interfaces, solving technical problems, and deploying projects that people can use.',
} as const;

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    title: 'Frontend',
    mark: 'UI',
    skills: [
      'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Angular', 'React',
      'RxJS', 'Responsive Web Design', 'Bootstrap', 'Tailwind CSS',
    ],
  },
  {
    title: 'Backend and APIs',
    mark: 'API',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'Authentication and Authorization', 'Zod'],
  },
  {
    title: 'Databases',
    mark: 'DB',
    skills: ['PostgreSQL', 'Drizzle ORM', 'Neon', 'Firebase Firestore'],
  },
  {
    title: 'Tools and Deployment',
    mark: 'OPS',
    skills: ['Git and GitHub', 'Docker', 'Linux', 'Nginx', 'AWS EC2', 'Vercel', 'Firebase'],
  },
  {
    title: 'AI Integration',
    mark: 'AI',
    skills: ['Gemini API', 'n8n workflows', 'AI-assisted search and booking workflows'],
  },
];

export const PROJECTS: readonly PortfolioProject[] = [
  {
    name: 'DriveAI',
    category: 'Car rental application',
    description:
      'A full-stack car rental application featuring responsive car listings, booking workflows, user authentication, and administrative functionality. Includes AI-assisted car search and booking workflows using Gemini API and n8n.',
    technologies: [
      'Angular', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL',
      'Docker', 'Nginx', 'Gemini API', 'n8n',
    ],
    liveUrl: 'https://driveai-web-1.onrender.com',
    sourceUrl: 'https://github.com/muzy326/car_application',
    image: '/images/driveai-live-demo.png',
    imageAlt: 'DriveAI public live-demo screenshot showing its sign-in screen.',
    imageCaption: 'Live demo capture · sign-in screen',
    focus: 'Frontend, backend, database integration, deployment, and AI workflow.',
  },
  {
    name: 'Bakery-Hub',
    category: 'Online bakery ordering platform',
    description:
      'A full-stack bakery ordering and management platform with product browsing, a shopping cart, ordering workflows, authentication, and an admin dashboard.',
    technologies: [
      'React', 'TypeScript', 'Express.js', 'PostgreSQL', 'Drizzle ORM', 'Neon', 'TanStack Query',
    ],
    liveUrl: 'https://bakery-hub-eta.vercel.app',
    sourceUrl: 'https://github.com/muzy326/Bakery-Hub',
    image: '/images/bakery-hub-live-demo.png',
    imageAlt: 'Bakery-Hub public live-demo homepage screenshot; the current page is branded Ovenly Bakery.',
    imageCaption: 'Live demo capture · homepage branded Ovenly Bakery',
  },
  {
    name: 'PlumAI',
    category: 'E-commerce application',
    description:
      'An Angular e-commerce application featuring responsive interfaces, product browsing, authentication, reactive forms, and route guards.',
    technologies: [
      'Angular', 'TypeScript', 'Firebase Authentication', 'Firestore', 'RxJS',
    ],
    liveUrl: 'https://e-commerce-d8c67.web.app',
    sourceUrl: 'https://github.com/muzy326/e-commerce',
    image: '/images/plumai-live-demo.png',
    imageAlt: 'PlumAI public live-demo screenshot showing its sign-in screen.',
    imageCaption: 'Live demo capture · sign-in screen',
  },
];

export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
    role: 'Front-End Developer',
    company: 'PEP Systems',
    dates: 'June 2023 – May 2025',
    responsibilities: [
      'Developed and maintained frontend interfaces using Angular and TypeScript.',
      'Implemented reusable UI components and responsive layouts.',
      'Integrated REST APIs and fixed interface issues.',
      'Used Git and GitHub for version control and collaboration.',
      'Worked with application deployment and development environments.',
    ],
  },
  {
    role: 'Independent Developer',
    company: 'Personal projects',
    dates: 'June 2025 – Present',
    responsibilities: [
      'Design, develop, test, and deploy personal full-stack projects.',
      'Build applications using Angular, React, Node.js, Express.js, and PostgreSQL.',
      'Integrate authentication, APIs, and AI-assisted workflows.',
      'Improve application usability, maintainability, and reliability.',
    ],
  },
];

export const EDUCATION = {
  qualification:
    'Master of Technology (M.Tech.) in Electrical and Electronics Engineering — Power System Analysis',
  institution: 'Jawaharlal Nehru Technological University Hyderabad (JNTUH)',
} as const;
