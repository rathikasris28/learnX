import { SkillItem } from '../types';

export const ALL_SKILLS: SkillItem[] = [
  // Technical Skills
  {
    id: 'python',
    name: 'Python',
    category: 'technical',
    description: 'Master programming fundamentals, data structures, automation scripts, and backend development with Python.',
    iconName: 'Code',
    popularMentorsCount: 42,
    learnersCount: 310,
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['Programming', 'Scripting', 'Backend', 'AI']
  },
  {
    id: 'java',
    name: 'Java',
    category: 'technical',
    description: 'Object-oriented programming, JVM architecture, Spring Boot microservices, and enterprise application logic.',
    iconName: 'Cpu',
    popularMentorsCount: 28,
    learnersCount: 220,
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['OOP', 'Backend', 'Enterprise']
  },
  {
    id: 'c',
    name: 'C',
    category: 'technical',
    description: 'Core procedural programming, memory management, pointers, and systems development basics.',
    iconName: 'Terminal',
    popularMentorsCount: 19,
    learnersCount: 150,
    levels: ['Beginner', 'Intermediate'],
    tags: ['System', 'Memory', 'Foundations']
  },
  {
    id: 'cpp',
    name: 'C++',
    category: 'technical',
    description: 'High-performance computing, STL containers, object orientation, algorithms, and competitive programming.',
    iconName: 'Binary',
    popularMentorsCount: 25,
    learnersCount: 190,
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['DSA', 'High Performance', 'Game Dev']
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'technical',
    description: 'Interactive web applications, ES6+, asynchronous JavaScript, DOM manipulation, and modern web patterns.',
    iconName: 'FileCode2',
    popularMentorsCount: 48,
    learnersCount: 380,
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['Web', 'Frontend', 'Dynamic']
  },
  {
    id: 'web-dev',
    name: 'Web Development',
    category: 'technical',
    description: 'Full stack web construction using modern HTML5, CSS3, responsive Tailwind layout, and React components.',
    iconName: 'Layout',
    popularMentorsCount: 54,
    learnersCount: 410,
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['Fullstack', 'Frontend', 'UI']
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    category: 'technical',
    description: 'Modern AI concepts, prompt engineering, generative models, neural architectures, and intelligent workflows.',
    iconName: 'Sparkles',
    popularMentorsCount: 35,
    learnersCount: 290,
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['GenAI', 'Deep Learning', 'Automation']
  },
  {
    id: 'data-science',
    name: 'Data Science',
    category: 'technical',
    description: 'Data wrangling with Pandas, exploratory data analysis, NumPy arrays, visualization, and statistical modeling.',
    iconName: 'BarChart3',
    popularMentorsCount: 31,
    learnersCount: 240,
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['Analytics', 'Statistics', 'Pandas']
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    category: 'technical',
    description: 'Supervised and unsupervised learning, Scikit-Learn pipelines, regression, classification, and model evaluation.',
    iconName: 'Network',
    popularMentorsCount: 29,
    learnersCount: 215,
    levels: ['Intermediate', 'Advanced'],
    tags: ['ML', 'Algorithms', 'Models']
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    category: 'technical',
    description: 'Cloud architecture principles, Google Cloud, AWS fundamentals, container deployment, and serverless architectures.',
    iconName: 'Cloud',
    popularMentorsCount: 22,
    learnersCount: 165,
    levels: ['Beginner', 'Intermediate'],
    tags: ['DevOps', 'Infrastructure', 'Scale']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'technical',
    description: 'Network security fundamentals, ethical hacking principles, encryption, and secure coding practices.',
    iconName: 'ShieldCheck',
    popularMentorsCount: 18,
    learnersCount: 140,
    levels: ['Beginner', 'Intermediate'],
    tags: ['Security', 'Protection', 'Network']
  },
  {
    id: 'excel',
    name: 'Excel',
    category: 'technical',
    description: 'Spreadsheet formulas (VLOOKUP, XLOOKUP), Pivot Tables, data cleaning, and dynamic reporting dashboards.',
    iconName: 'Table',
    popularMentorsCount: 39,
    learnersCount: 350,
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['Business', 'Productivity', 'Data']
  },
  {
    id: 'powerpoint',
    name: 'PowerPoint',
    category: 'technical',
    description: 'Impactful slide design, data storytelling, animations, pitch deck crafting, and executive presentation design.',
    iconName: 'Presentation',
    popularMentorsCount: 24,
    learnersCount: 180,
    levels: ['Beginner', 'Intermediate'],
    tags: ['Design', 'Slides', 'Productivity']
  },

  // Non-Technical Skills
  {
    id: 'english-speaking',
    name: 'English Speaking',
    category: 'non-technical',
    description: 'Conversational fluency, natural vocabulary, clear pronunciation, sentence construction, and daily dialog practice.',
    iconName: 'Languages',
    popularMentorsCount: 62,
    learnersCount: 520,
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['Language', 'Fluency', 'Spoken']
  },
  {
    id: 'tamil',
    name: 'Tamil',
    category: 'non-technical',
    description: 'Spoken Tamil conversation, formal & informal nuances, cultural colloquialisms, reading and writing basics.',
    iconName: 'Globe',
    popularMentorsCount: 38,
    learnersCount: 270,
    levels: ['Beginner', 'Intermediate'],
    tags: ['Language', 'Regional', 'Communication']
  },
  {
    id: 'hindi',
    name: 'Hindi',
    category: 'non-technical',
    description: 'Conversational Hindi for workplace and daily interactions, grammar clarity, vocabulary building, and dialogs.',
    iconName: 'BookOpen',
    popularMentorsCount: 41,
    learnersCount: 295,
    levels: ['Beginner', 'Intermediate'],
    tags: ['Language', 'Spoken', 'National']
  },
  {
    id: 'communication-skills',
    name: 'Communication Skills',
    category: 'non-technical',
    description: 'Active listening, articulation, assertive communication, email etiquette, and workplace interaction mastery.',
    iconName: 'MessageSquare',
    popularMentorsCount: 45,
    learnersCount: 390,
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['Soft Skills', 'Career', 'Interpersonal']
  },
  {
    id: 'public-speaking',
    name: 'Public Speaking',
    category: 'non-technical',
    description: 'Stage presence, overcoming speech anxiety, voice modulation, structuring memorable keynotes, and body language.',
    iconName: 'Mic',
    popularMentorsCount: 26,
    learnersCount: 210,
    levels: ['Beginner', 'Intermediate'],
    tags: ['Oratory', 'Confidence', 'Leadership']
  },
  {
    id: 'leadership',
    name: 'Leadership',
    category: 'non-technical',
    description: 'Peer mentorship, team motivation, decision making, conflict resolution, and collaborative project guidance.',
    iconName: 'Award',
    popularMentorsCount: 20,
    learnersCount: 160,
    levels: ['Intermediate', 'Advanced'],
    tags: ['Management', 'Strategy', 'Growth']
  },
  {
    id: 'drawing',
    name: 'Drawing',
    category: 'non-technical',
    description: 'Pencil sketching, perspective fundamentals, shading techniques, character illustration, and visual art creation.',
    iconName: 'Palette',
    popularMentorsCount: 17,
    learnersCount: 130,
    levels: ['Beginner', 'Intermediate'],
    tags: ['Art', 'Creativity', 'Sketching']
  },
  {
    id: 'cooking',
    name: 'Cooking',
    category: 'non-technical',
    description: 'Traditional home cooking, spice balancing, knife skills, quick healthy student meals, and culinary basics.',
    iconName: 'Utensils',
    popularMentorsCount: 23,
    learnersCount: 175,
    levels: ['Beginner', 'Intermediate'],
    tags: ['Culinary', 'Life Skills', 'Recipes']
  },
  {
    id: 'resume-building',
    name: 'Resume Building',
    category: 'non-technical',
    description: 'ATS-friendly layout design, action-verb bullet formulation, portfolio linking, and showcasing impactful achievements.',
    iconName: 'FileText',
    popularMentorsCount: 34,
    learnersCount: 320,
    levels: ['Beginner', 'Intermediate'],
    tags: ['Career', 'Jobs', 'Hiring']
  },
  {
    id: 'interview-skills',
    name: 'Interview Skills',
    category: 'non-technical',
    description: 'Mock behavioral interviews, STAR method mastery, answering tough technical questions, and salary negotiation talk.',
    iconName: 'Users',
    popularMentorsCount: 36,
    learnersCount: 340,
    levels: ['Beginner', 'Intermediate', 'Advanced'],
    tags: ['Career', 'Mock', 'Confidence']
  },
  {
    id: 'presentation-skills',
    name: 'Presentation Skills',
    category: 'non-technical',
    description: 'Audience engagement, concise storytelling, handling Q&A under pressure, and effective live demonstration tricks.',
    iconName: 'MonitorPlay',
    popularMentorsCount: 27,
    learnersCount: 205,
    levels: ['Beginner', 'Intermediate'],
    tags: ['Slides', 'Storytelling', 'Executive']
  },
  {
    id: 'photography',
    name: 'Photography',
    category: 'non-technical',
    description: 'Exposure triangle (ISO, Aperture, Shutter Speed), framing composition, mobile camera mastery, and lighting techniques.',
    iconName: 'Camera',
    popularMentorsCount: 19,
    learnersCount: 155,
    levels: ['Beginner', 'Intermediate'],
    tags: ['Visual', 'Camera', 'Composition']
  },
  {
    id: 'video-editing',
    name: 'Video Editing',
    category: 'non-technical',
    description: 'Video cuts, pacing, color correction, audio mixing, B-roll integration, and storytelling in CapCut / Premiere.',
    iconName: 'Video',
    popularMentorsCount: 25,
    learnersCount: 225,
    levels: ['Beginner', 'Intermediate'],
    tags: ['Content', 'Media', 'Production']
  },
  {
    id: 'basic-life-skills',
    name: 'Basic Life Skills',
    category: 'non-technical',
    description: 'Personal budgeting, time management, home organization, critical thinking, and resilient daily habits.',
    iconName: 'HeartHandshake',
    popularMentorsCount: 21,
    learnersCount: 170,
    levels: ['Beginner'],
    tags: ['Life', 'Productivity', 'Wellness']
  }
];
