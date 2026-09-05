import {
  UserProfile,
  Trainer,
  LearningSession,
  WalletTransaction,
  LearningPlan,
  Quiz,
  PartnerCourse,
  Certificate,
  NotificationItem,
  Achievement,
  AdminStats
} from '../types';

export const INITIAL_LEARNER_USER: UserProfile = {
  id: 'usr_learner_01',
  name: 'Aarav Sundaram',
  email: 'aarav.sundaram@learnx.org',
  role: 'learner',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  country: 'India',
  state: 'Tamil Nadu',
  city: 'Chennai',
  languages: ['Tamil', 'English'],
  bio: 'Engineering undergraduate passionate about software engineering, data science, and improving global English communication.',
  joinedDate: 'August 2026',
  timeCredits: 5,
  totalEarnedCredits: 4,
  totalUsedCredits: 1,
  rating: 4.8,
  reliabilityScore: 98,
  trustScore: 95,
  skillsLearning: ['Python', 'English Speaking', 'Data Science'],
  skillsTeaching: ['C', 'Mathematics'],
  learningLevel: 'Beginner',
  learningGoal: 'Career Development',
  isEmailVerified: true,
  termsAccepted: true,
  termsVersion: '1.0',
  termsAcceptedDate: '2026-08-15T10:00:00Z'
};

export const INITIAL_TEACHER_USER: UserProfile = {
  id: 'usr_teacher_01',
  name: 'Priya Raman',
  email: 'priya.raman@learnx.org',
  role: 'teacher',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  country: 'India',
  state: 'Tamil Nadu',
  city: 'Coimbatore',
  languages: ['Tamil', 'English'],
  bio: 'Software engineer and dedicated peer educator with 4+ years of Python & web development experience. Love simplifying tricky coding logic!',
  joinedDate: 'July 2026',
  timeCredits: 0,
  totalEarnedCredits: 15,
  totalUsedCredits: 3,
  rating: 4.9,
  reliabilityScore: 98,
  trustScore: 97,
  skillsLearning: ['Public Speaking', 'Artificial Intelligence'],
  skillsTeaching: ['Python', 'Web Development', 'Data Structures'],
  teachingLevel: 'Expert',
  availability: ['Morning', 'Evening', 'Night'],
  isEmailVerified: true,
  termsAccepted: true,
  termsVersion: '1.0',
  termsAcceptedDate: '2026-07-20T09:30:00Z'
};

export const INITIAL_ADMIN_USER: UserProfile = {
  id: 'usr_admin_01',
  name: 'Kavitha Natarajan',
  email: 'admin.kavitha@learnx.org',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  country: 'India',
  state: 'Karnataka',
  city: 'Bengaluru',
  languages: ['English', 'Tamil', 'Hindi'],
  bio: 'Platform Integrity & Peer Learning Quality Officer at LearnX.',
  joinedDate: 'January 2026',
  timeCredits: 50,
  totalEarnedCredits: 50,
  totalUsedCredits: 0,
  rating: 5.0,
  reliabilityScore: 100,
  trustScore: 99,
  skillsLearning: [],
  skillsTeaching: ['Platform Integrity', 'EdTech Systems'],
  isEmailVerified: true,
  termsAccepted: true,
  termsVersion: '1.0',
  termsAcceptedDate: '2026-01-01T00:00:00Z'
};

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'tr_01',
    name: 'Priya Raman',
    title: 'Python Knowledge Sharer & Backend Developer',
    bio: 'Experienced Python mentor focused on hands-on building, practical algorithmic thinking, and clean code hygiene.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 48,
    aiMatchScore: 96,
    languages: ['Tamil', 'English'],
    teachingStyles: ['Beginner Friendly', 'Practical', 'Project Based'],
    status: 'active',
    currentSessionInfo: undefined,
    nextAvailableTime: '6:00 PM Today',
    reliabilityScore: 98,
    trustScore: 97,
    completedSessions: 92,
    skills: [
      { name: 'Python', level: 'institution-verified', experienceYears: 4 },
      { name: 'Web Development', level: 'community-verified', experienceYears: 3 },
      { name: 'Data Structures', level: 'ai-assessed', experienceYears: 2 }
    ],
    availabilitySlots: [
      { time: '4:00 PM', status: 'booked' },
      { time: '5:00 PM', status: 'in-class' },
      { time: '6:00 PM', status: 'available' },
      { time: '7:00 PM', status: 'available' },
      { time: '8:30 PM', status: 'available' }
    ],
    matchReasons: [
      'Advanced Python knowledge matching your learning goals',
      'Beginner-friendly and patient communication style',
      'Shares preferred languages: Tamil and English',
      'High reliability score (98%) with zero last-minute cancellations',
      'Available at your preferred evening time slot (6:00 PM)'
    ]
  },
  {
    id: 'tr_02',
    name: 'Karthik Sivakumar',
    title: 'Fullstack Web Engineer & React Enthusiast',
    bio: 'Building responsive user interfaces and modern JavaScript tooling. Loves breaking down complex state management.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 36,
    aiMatchScore: 91,
    languages: ['English', 'Tamil'],
    teachingStyles: ['Interactive Coding', 'Code Reviews', 'Visual Diagrams'],
    status: 'in-class',
    currentSessionInfo: '1-on-1 React Hooks deep-dive with Learner Vikram',
    nextAvailableTime: '6:30 PM Today',
    reliabilityScore: 95,
    trustScore: 93,
    completedSessions: 64,
    skills: [
      { name: 'JavaScript', level: 'institution-verified', experienceYears: 3 },
      { name: 'Web Development', level: 'institution-verified', experienceYears: 4 },
      { name: 'Python', level: 'community-verified', experienceYears: 2 }
    ],
    availabilitySlots: [
      { time: '5:00 PM', status: 'in-class' },
      { time: '6:30 PM', status: 'available' },
      { time: '7:30 PM', status: 'available' }
    ],
    matchReasons: [
      'Strong JavaScript & frontend foundations',
      'Fluent in English and Tamil',
      'High practical project experience'
    ]
  },
  {
    id: 'tr_03',
    name: 'Ananya Sharma',
    title: 'Public Speaking Coach & Corporate Communications',
    bio: 'Helping learners conquer stage fright, articulate persuasive ideas, and speak with magnetic natural confidence.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviewsCount: 52,
    aiMatchScore: 89,
    languages: ['Hindi', 'English'],
    teachingStyles: ['Encouraging', 'Speech Drills', 'Impromptu Exercises'],
    status: 'active',
    currentSessionInfo: undefined,
    nextAvailableTime: 'Available Now',
    reliabilityScore: 99,
    trustScore: 98,
    completedSessions: 88,
    skills: [
      { name: 'Public Speaking', level: 'institution-verified', experienceYears: 5 },
      { name: 'English Speaking', level: 'institution-verified', experienceYears: 4 },
      { name: 'Communication Skills', level: 'community-verified', experienceYears: 4 }
    ],
    availabilitySlots: [
      { time: '4:30 PM', status: 'available' },
      { time: '5:30 PM', status: 'available' },
      { time: '7:00 PM', status: 'available' }
    ],
    matchReasons: [
      'Top-rated spoken English & oratory coach',
      'Fluent in English and Hindi',
      'Exceptional 99% reliability score'
    ]
  },
  {
    id: 'tr_04',
    name: 'Arjun Patel',
    title: 'Data Science Researcher & ML Practitioner',
    bio: 'Passionate about exploratory data analysis, mathematical modeling, and real-world predictive AI systems.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    rating: 4.75,
    reviewsCount: 29,
    aiMatchScore: 88,
    languages: ['English', 'Hindi', 'Gujarati'],
    teachingStyles: ['Conceptual First', 'Mathematical Rigor', 'Notebook Driven'],
    status: 'inactive',
    currentSessionInfo: undefined,
    nextAvailableTime: 'Tomorrow 10:00 AM',
    reliabilityScore: 94,
    trustScore: 92,
    completedSessions: 45,
    skills: [
      { name: 'Data Science', level: 'institution-verified', experienceYears: 3 },
      { name: 'Machine Learning', level: 'ai-assessed', experienceYears: 2 },
      { name: 'Python', level: 'community-verified', experienceYears: 3 }
    ],
    availabilitySlots: [
      { time: 'Tomorrow 10:00 AM', status: 'available' },
      { time: 'Tomorrow 2:00 PM', status: 'available' }
    ],
    matchReasons: [
      'In-depth data science and statistical grounding',
      'Great for transition from Python basics to Data Science'
    ]
  },
  {
    id: 'tr_05',
    name: 'Meera Krishnan',
    title: 'Culinary Artist & Traditional South Indian Cooking',
    bio: 'Sharing authentic spice blending, heirloom vegetarian recipes, and easy 20-minute nutritious meals for busy learners.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 33,
    aiMatchScore: 82,
    languages: ['Tamil', 'English'],
    teachingStyles: ['Step-by-Step Cooking', 'Interactive Kitchen', 'Recipe Notes'],
    status: 'active',
    currentSessionInfo: undefined,
    nextAvailableTime: 'Available Now',
    reliabilityScore: 97,
    trustScore: 96,
    completedSessions: 58,
    skills: [
      { name: 'Cooking', level: 'community-verified', experienceYears: 8 },
      { name: 'Basic Life Skills', level: 'self-claimed', experienceYears: 5 }
    ],
    availabilitySlots: [
      { time: '4:00 PM', status: 'available' },
      { time: '6:00 PM', status: 'available' }
    ],
    matchReasons: [
      'Passionate home chef with structured step-by-step guidance',
      'Tamil and English medium'
    ]
  },
  {
    id: 'tr_06',
    name: 'David Wilson',
    title: 'Cybersecurity Analyst & Cloud Infrastructure',
    bio: 'Demystifying network packets, penetration testing basics, and practical cloud hygiene for developers.',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    rating: 4.82,
    reviewsCount: 40,
    aiMatchScore: 85,
    languages: ['English'],
    teachingStyles: ['Hands-on Labs', 'Scenario Drills', 'Security First'],
    status: 'in-class',
    currentSessionInfo: 'Conducting Network Traffic Analysis with Learner Sneha',
    nextAvailableTime: '7:15 PM Today',
    reliabilityScore: 96,
    trustScore: 94,
    completedSessions: 72,
    skills: [
      { name: 'Cybersecurity', level: 'institution-verified', experienceYears: 4 },
      { name: 'Cloud Computing', level: 'institution-verified', experienceYears: 3 }
    ],
    availabilitySlots: [
      { time: '7:15 PM', status: 'available' },
      { time: '8:15 PM', status: 'available' }
    ],
    matchReasons: [
      'Hands-on security exercises',
      'Strong cloud and systems knowledge'
    ]
  },
  {
    id: 'tr_07',
    name: 'Divya Mohan',
    title: 'HR Specialist & Career Transition Mentor',
    bio: 'Helped 120+ students review resumes, prepare for behavioral interviews with the STAR technique, and shine in HR rounds.',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    rating: 4.92,
    reviewsCount: 65,
    aiMatchScore: 94,
    languages: ['Tamil', 'English', 'Hindi'],
    teachingStyles: ['Mock Practice', 'Honest Feedback', 'Actionable Edits'],
    status: 'active',
    currentSessionInfo: undefined,
    nextAvailableTime: '5:30 PM Today',
    reliabilityScore: 99,
    trustScore: 98,
    completedSessions: 110,
    skills: [
      { name: 'Resume Building', level: 'institution-verified', experienceYears: 5 },
      { name: 'Interview Skills', level: 'institution-verified', experienceYears: 5 },
      { name: 'Communication Skills', level: 'community-verified', experienceYears: 4 }
    ],
    availabilitySlots: [
      { time: '5:30 PM', status: 'available' },
      { time: '6:30 PM', status: 'available' },
      { time: '8:00 PM', status: 'available' }
    ],
    matchReasons: [
      'High alignment with Career Development goal',
      'Multilingual communication support (Tamil, English, Hindi)',
      '99% reliability with stellar mock review track record'
    ]
  }
];

export const INITIAL_SESSIONS: LearningSession[] = [
  {
    id: 'ses_01',
    skillTitle: 'Python',
    topic: 'Python Functions & Scope Deep Dive',
    trainerId: 'tr_01',
    trainerName: 'Priya Raman',
    trainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    learnerId: 'usr_learner_01',
    learnerName: 'Aarav Sundaram',
    learnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    date: 'Today',
    time: '6:00 PM',
    duration: '45 mins',
    creditsCost: 1,
    status: 'scheduled',
    learningGoal: 'Master parameters, return values, and lambda functions with practical examples.',
    notes: 'Please review variables and conditional loops before session.'
  },
  {
    id: 'ses_02',
    skillTitle: 'English Speaking',
    topic: 'Daily Conversational Fluency & Accent Reduction',
    trainerId: 'tr_03',
    trainerName: 'Ananya Sharma',
    trainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    learnerId: 'usr_learner_01',
    learnerName: 'Aarav Sundaram',
    learnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    date: 'Yesterday',
    time: '5:00 PM',
    duration: '45 mins',
    creditsCost: 1,
    status: 'completed',
    learningGoal: 'Overcoming conversational hesitation when describing technical concepts.',
    learnerConfirmed: true,
    trainerConfirmed: true,
    ratingGiven: 5,
    feedback: 'Ananya gave great practical feedback on pausing and pronunciation!'
  },
  {
    id: 'ses_03',
    skillTitle: 'C',
    topic: 'Pointers and Memory Addressing (Knowledge Shared by Aarav)',
    trainerId: 'usr_learner_01', // Aarav shared his knowledge!
    trainerName: 'Aarav Sundaram',
    trainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    learnerId: 'usr_guest_04',
    learnerName: 'Siddharth V.',
    learnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    date: '3 days ago',
    time: '4:00 PM',
    duration: '45 mins',
    creditsCost: 1,
    status: 'completed',
    learningGoal: 'Help Siddharth understand pointer arithmetic and malloc.',
    learnerConfirmed: true,
    trainerConfirmed: true,
    ratingGiven: 5,
    feedback: 'Aarav explained pointer addresses with visual memory grid drawings!'
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_01',
    type: 'starter',
    amount: 5,
    description: 'Welcome to LearnX! Starter Time Credits credited to begin your learning journey.',
    date: 'August 15, 2026',
    timestamp: 1723716000000
  },
  {
    id: 'tx_02',
    type: 'used',
    amount: -1,
    description: 'Completed 1-to-1 Learning Session: English Speaking with Ananya Sharma',
    partnerName: 'Ananya Sharma',
    skillName: 'English Speaking',
    date: 'September 4, 2026',
    timestamp: 1725451200000
  },
  {
    id: 'tx_03',
    type: 'earned',
    amount: 1,
    description: 'Verified Knowledge Sharing: Conducted C Pointers session with Siddharth V.',
    partnerName: 'Siddharth V.',
    skillName: 'C Programming',
    date: 'September 2, 2026',
    timestamp: 1725278400000
  },
  {
    id: 'tx_04',
    type: 'earned',
    amount: 3,
    description: 'Bonus Credits for maintaining 7-Day Consistent Learning & Knowledge Exchange Streak',
    date: 'September 1, 2026',
    timestamp: 1725192000000
  }
];

export const INITIAL_LEARNING_PLAN: LearningPlan = {
  id: 'plan_py_01',
  skillName: 'Python',
  duration: '4-Week Structured Plan',
  overallProgress: 72,
  weeks: [
    {
      weekNumber: 1,
      title: 'Week 1: Python Basics & Syntax',
      description: 'Variables, primitive types, operators, and basic logic controls',
      status: 'completed',
      topics: ['Variables & Print Statements', 'User Input & Type Casting', 'Arithmetic Logic']
    },
    {
      weekNumber: 2,
      title: 'Week 2: Conditions and Loops',
      description: 'Branching logic, for loops, while loops, and iterator patterns',
      status: 'completed',
      topics: ['If / Else / Elif Conditionals', 'For Loops & Range', 'While Loops & Break']
    },
    {
      weekNumber: 3,
      title: 'Week 3: Functions and Data Structures',
      description: 'Defining functions, return parameters, lists, and dictionaries',
      status: 'in-progress',
      topics: ['Defining Functions & Returns', 'Lists, Tuples, Dictionaries', 'List Comprehensions']
    },
    {
      weekNumber: 4,
      title: 'Week 4: Mini Project & Application',
      description: 'File input/output, JSON parsing, and peer code review session',
      status: 'upcoming',
      topics: ['File Handling & JSON', 'CLI Student Tracker', 'Peer Code Review with Mentor']
    }
  ],
  modules: [
    {
      id: 'mod_1',
      title: 'Week 1: Python Basics & Syntax',
      topics: [
        { id: 't_1', title: 'Variables, Types, and Print Statements', completed: true },
        { id: 't_2', title: 'User Input & Type Casting', completed: true },
        { id: 't_3', title: 'Basic Operators & Arithmetic Logic', completed: true }
      ]
    },
    {
      id: 'mod_2',
      title: 'Week 2: Conditions and Loops',
      topics: [
        { id: 't_4', title: 'If / Else / Elif Conditionals', completed: true },
        { id: 't_5', title: 'For Loops & Range Function', completed: true },
        { id: 't_6', title: 'While Loops, Break, and Continue', completed: true }
      ]
    },
    {
      id: 'mod_3',
      title: 'Week 3: Functions and Data Structures',
      topics: [
        { id: 't_7', title: 'Defining Functions & Return Values', completed: true },
        { id: 't_8', title: 'Lists, Tuples, and Dictionaries', completed: false },
        { id: 't_9', title: 'List Comprehensions & Scope Rules', completed: false }
      ]
    },
    {
      id: 'mod_4',
      title: 'Week 4: Mini Project & Real-World Application',
      topics: [
        { id: 't_10', title: 'File Handling & JSON Data Parsing', completed: false },
        { id: 't_11', title: 'Building a CLI Student Grade Tracker', completed: false },
        { id: 't_12', title: 'Peer Code Review with Knowledge Sharer', completed: false }
      ]
    }
  ]
};

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz_py_01',
    skillName: 'Python',
    title: 'Python Basics & Functions Quiz',
    questions: [
      {
        id: 'q1',
        question: 'Which keyword is used to define a function in Python?',
        options: ['function', 'def', 'define', 'fun'],
        correctAnswerIndex: 1,
        explanation: 'In Python, functions are defined using the "def" keyword followed by the function name and parentheses.'
      },
      {
        id: 'q2',
        question: 'What is the correct syntax to output "Hello World" in Python 3?',
        options: ['echo "Hello World"', 'print("Hello World")', 'Console.WriteLine("Hello World")', 'p("Hello World")'],
        correctAnswerIndex: 1,
        explanation: 'Python uses the built-in print() function to write output to the console.'
      },
      {
        id: 'q3',
        question: 'Which of the following data types in Python is immutable?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correctAnswerIndex: 2,
        explanation: 'Tuples cannot be altered after creation, making them immutable.'
      },
      {
        id: 'q4',
        question: 'How do you insert comments in Python code?',
        options: ['// this is a comment', '/* this is a comment */', '# this is a comment', '-- this is a comment'],
        correctAnswerIndex: 2,
        explanation: 'Python uses the hash (#) symbol for single-line comments.'
      },
      {
        id: 'q5',
        question: 'What will be the output of: len([10, 20, 30])?',
        options: ['3', '2', '4', 'Error'],
        correctAnswerIndex: 0,
        explanation: 'The len() function returns the number of items in a container, which is 3.'
      }
    ]
  },
  {
    id: 'quiz_comm_01',
    skillName: 'English Speaking',
    title: 'Effective Workplace Communication Quiz',
    questions: [
      {
        id: 'cq1',
        question: 'What does the "STAR" technique in interview responses stand for?',
        options: [
          'Skills, Talent, Attitude, Results',
          'Situation, Task, Action, Result',
          'Speech, Tone, Articulation, Rhythm',
          'Summary, Topic, Argument, Resolution'
        ],
        correctAnswerIndex: 1,
        explanation: 'STAR stands for Situation, Task, Action, Result—a structured method of answering behavioral questions.'
      },
      {
        id: 'cq2',
        question: 'When participating in active listening, what is a recommended practice?',
        options: [
          'Immediately interrupt to show your excitement',
          'Plan your rebuttal while the other person speaks',
          'Paraphrase key points and maintain attentive eye contact',
          'Check your smartphone for facts'
        ],
        correctAnswerIndex: 2,
        explanation: 'Active listening involves focused presence, nod/eye contact, and paraphrasing to confirm understanding.'
      }
    ]
  }
];

export const INITIAL_PARTNER_COURSES: PartnerCourse[] = [
  {
    id: 'course_01',
    title: 'Python Fundamentals & Clean Code Architecture',
    partnerOrganization: 'ABC Technologies Academy',
    category: 'Technical',
    duration: '5 Days (Daily 1-Hour Webinar)',
    mode: 'Interactive Online Webinar',
    sessionsCount: 5,
    attendanceRequirement: 'Minimum 4 of 5 sessions attended',
    completionRequirement: 'Capstone mini-project submission and final quiz score > 75%',
    timeCreditRequirement: 2, // 2 Time Credits
    certificateEligible: true,
    startDate: 'September 10, 2026',
    endDate: 'September 15, 2026',
    schedule: '7:00 PM – 8:00 PM IST',
    description: 'Comprehensive industry-aligned bootcamp covering idiomatic Python, modular software design, object-oriented concepts, and API interaction led by senior engineers from ABC Technologies.',
    progressPercent: 80,
    attendedSessions: 4,
    isRegistered: true
  },
  {
    id: 'course_02',
    title: 'Executive Communication & Presentation Mastery',
    partnerOrganization: 'Apex Global Leadership Council',
    category: 'Communication',
    duration: '3 Days',
    mode: 'Live Cohort Interactive Workshop',
    sessionsCount: 3,
    attendanceRequirement: '100% live session attendance',
    completionRequirement: '2-minute recorded pitch evaluation by panel',
    timeCreditRequirement: 1, // 1 Time Credit
    certificateEligible: true,
    startDate: 'September 18, 2026',
    endDate: 'September 20, 2026',
    schedule: '6:30 PM – 7:45 PM IST',
    description: 'Transform anxiety into charismatic presence. Learn vocal dynamics, rhetorical framing, slide economy, and handling difficult executive questions.',
    progressPercent: 0,
    attendedSessions: 0,
    isRegistered: false
  },
  {
    id: 'course_03',
    title: 'Applied Machine Learning Workshop & Pipelines',
    partnerOrganization: 'TechNext Research Institute',
    category: 'AI and Technology',
    duration: '4 Days',
    mode: 'Hands-on Cloud Lab Series',
    sessionsCount: 4,
    attendanceRequirement: 'Minimum 3 of 4 sessions',
    completionRequirement: 'Scikit-Learn model deployment notebook approval',
    timeCreditRequirement: 3, // 3 Time Credits
    certificateEligible: true,
    startDate: 'September 24, 2026',
    endDate: 'September 28, 2026',
    schedule: '8:00 PM – 9:30 PM IST',
    description: 'From raw dataset to operational ML models: feature selection, cross-validation, hyperparameter tuning, and containerized deployment.',
    progressPercent: 0,
    attendedSessions: 0,
    isRegistered: false
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_01',
    courseTitle: 'Python Fundamentals & Clean Code Architecture',
    partnerOrganization: 'ABC Technologies Academy',
    recipientName: 'Aarav Sundaram',
    completionDate: 'September 2026',
    certificateId: 'LX-PY-2026-00125',
    status: 'Valid',
    skillsGained: ['Python 3', 'Clean Architecture', 'Data Structures', 'Git Workflow']
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_01',
    title: 'Consistent Learner',
    description: 'Engaged in peer learning 5 consecutive days without skipping.',
    icon: 'Flame',
    unlocked: true,
    progress: 100,
    unlockedDate: 'Sep 3, 2026'
  },
  {
    id: 'ach_02',
    title: 'Skill Explorer',
    description: 'Explored and scheduled sessions across 3 diverse skill categories.',
    icon: 'Compass',
    unlocked: true,
    progress: 100,
    unlockedDate: 'Sep 1, 2026'
  },
  {
    id: 'ach_03',
    title: 'Learning Streak (7 Days)',
    description: 'Achieved a complete 7-day uninterrupted streak of knowledge growth.',
    icon: 'Zap',
    unlocked: true,
    progress: 100,
    unlockedDate: 'Today'
  },
  {
    id: 'ach_04',
    title: 'Knowledge Sharer',
    description: 'Conducted your first verified peer-to-peer knowledge sharing session.',
    icon: 'GraduationCap',
    unlocked: true,
    progress: 100,
    unlockedDate: 'Sep 2, 2026'
  },
  {
    id: 'ach_05',
    title: 'Trusted Peer Mentor',
    description: 'Attain a 95%+ Trust and Reliability Score across at least 5 sessions.',
    icon: 'ShieldCheck',
    unlocked: true,
    progress: 100,
    unlockedDate: 'Sep 4, 2026'
  },
  {
    id: 'ach_06',
    title: 'Skill Mastery',
    description: 'Complete all 4 modules and quizzes in a structured learning path.',
    icon: 'Award',
    unlocked: false,
    progress: 72
  },
  {
    id: 'ach_07',
    title: 'Peer Learning Champion',
    description: 'Accumulate 10 or more verified knowledge exchange hours.',
    icon: 'Trophy',
    unlocked: false,
    progress: 60
  },
  {
    id: 'ach_08',
    title: 'Learning Achiever',
    description: 'Earn a verified partner certificate from an accredited organization.',
    icon: 'CheckCircle2',
    unlocked: true,
    progress: 100,
    unlockedDate: 'Today'
  },
  {
    id: 'ach_09',
    title: 'Practice Pro',
    description: 'Score 100% on three interactive skill quizzes.',
    icon: 'BrainCircuit',
    unlocked: false,
    progress: 66
  },
  {
    id: 'ach_10',
    title: 'Learning Contributor',
    description: 'Help 5 different community learners master fundamental topics.',
    icon: 'Users',
    unlocked: false,
    progress: 40
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    category: 'session_reminder',
    title: 'Upcoming Session in 2 Hours',
    message: 'Your Python Functions session with Priya Raman is scheduled for 6:00 PM today.',
    timestamp: '10 mins ago',
    read: false,
    actionView: 'sessions'
  },
  {
    id: 'notif_02',
    category: 'ai_match',
    title: 'New AI Teacher Recommendation: 96% Match',
    message: 'We matched Priya Raman with your Python learning goals based on Tamil/English fluency and 98% reliability.',
    timestamp: '2 hours ago',
    read: false,
    actionView: 'trainer-profile'
  },
  {
    id: 'notif_03',
    category: 'credit_earned',
    title: 'Time Credit Earned (+1)',
    message: 'You earned 1 Time Credit for conducting a verified C pointers peer sharing session with Siddharth.',
    timestamp: 'Yesterday',
    read: true,
    actionView: 'wallet'
  },
  {
    id: 'notif_04',
    category: 'certificate_ready',
    title: 'Partner Certificate Issued! 🎓',
    message: 'ABC Technologies Academy issued your "Python Fundamentals" certificate (LX-PY-2026-00125).',
    timestamp: '2 days ago',
    read: true,
    actionView: 'my-learning'
  },
  {
    id: 'notif_05',
    category: 'trainer_active',
    title: 'Ananya Sharma is Now Online',
    message: 'Ananya Sharma has marked her status as ACTIVE for English Speaking & Oratory.',
    timestamp: '3 hours ago',
    read: false,
    actionView: 'learn'
  }
];

export const INITIAL_ADMIN_STATS: AdminStats = {
  totalUsers: 14280,
  activeLearners: 9840,
  activeTeachers: 4440,
  learningSessions: 38290,
  learningHours: 28710,
  timeCreditsExchanged: 38290,
  averageRating: 4.88,
  totalPartnerCourses: 24,
  issuedCertificates: 3120,
  pendingReports: 2
};
