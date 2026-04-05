import { FewShotExample, ScoringRubric } from '../types';

export const gradingExamples: FewShotExample[] = [
  {
    input: `Jane Smith | Senior Software Engineer
jane@example.com | github.com/janesmith | linkedin.com/in/janesmith

SUMMARY
Results-driven Senior Software Engineer with 7+ years building scalable distributed systems at high-growth startups. Led architecture of a microservices platform serving 10M+ requests/day. Deep expertise in TypeScript, Go, Kubernetes, and AWS. Passionate about developer experience and mentoring junior engineers.

EXPERIENCE
Senior Software Engineer — Acme Corp (2020–Present)
• Architected and shipped a real-time event-streaming pipeline (Kafka + Go) processing 500K events/sec, reducing data latency by 80%.
• Led migration from monolith to microservices, cutting deployment time from 2 hours to 8 minutes.
• Mentored a team of 5 engineers; introduced ADRs and code review best practices, raising PR merge quality score by 35%.
• Reduced AWS infrastructure costs by $120K/year through right-sizing and spot-instance adoption.

Software Engineer — Beta Labs (2017–2020)
• Built RESTful APIs in Node.js/TypeScript serving 3M users, achieving 99.97% uptime.
• Designed a caching layer (Redis) that reduced DB read load by 60%.
• Delivered OAuth2 + JWT authentication system adopted company-wide.

EDUCATION
B.S. Computer Science — MIT, 2017 | GPA 3.9

SKILLS
TypeScript, Go, Python, Node.js, React, PostgreSQL, Redis, Kafka, Kubernetes, Docker, AWS (EKS, RDS, Lambda, S3, CloudWatch), Terraform, GitHub Actions

PROJECTS
OpenTrace — Open-source distributed tracing library (GitHub: 2.1k stars)
• Built from scratch in Go; integrated with Jaeger and Zipkin; adopted by 30+ companies.`,
    output: {
      gradingScore: 88,
      atsScore: 91,
      suggestions: [
        {
          title: 'Add a certifications section',
          description:
            'AWS Certified Solutions Architect or CKA certification would strengthen the already strong infrastructure profile and improve ATS matching for senior roles.',
        },
        {
          title: 'Quantify mentorship impact further',
          description:
            'The mentorship bullet is strong but could include retention or promotion outcomes to show leadership depth.',
        },
      ],
    },
    explanation:
      'Strong senior profile with quantified achievements, architecture-level ownership, and open-source credibility. Minor gaps in certifications and some bullets could be tighter.',
  },
  {
    input: `John Doe
johndoe123@gmail.com

OBJECTIVE
Looking for a software job where I can learn and grow and use my skills.

EDUCATION
B.Tech Computer Science — XYZ University (2020–2024)
CGPA: 6.2 / 10

SKILLS
C, C++, Java, HTML, CSS, Python

PROJECTS
To-Do App
• Made a to-do app using HTML, CSS and JavaScript.
• Added features like add task and delete task.

Calculator App
• Built a basic calculator app.

INTERNSHIP
Web Development Intern — Some Company (June 2023 – July 2023, 2 months)
• Worked on the frontend of the website.
• Helped fix some bugs.`,
    output: {
      gradingScore: 32,
      atsScore: 28,
      suggestions: [
        {
          title: 'Replace the objective with a professional summary',
          description:
            'Objective statements are outdated. Write a 2–3 sentence summary that highlights your strongest technical skills, any hands-on project achievements, and the type of role you are targeting.',
        },
        {
          title: 'Quantify every project and internship bullet',
          description:
            'Vague verbs like "worked on" and "helped fix" provide no signal to recruiters or ATS systems. Specify the technology stack, scope, and measurable outcome for each bullet (e.g., "Built a task management SPA in React + LocalStorage used by 20+ classmates").',
        },
        {
          title: 'Expand the skills section with modern frameworks',
          description:
            'Listing only core languages without frameworks (React, Spring Boot, Django) or tools (Git, Docker, SQL) severely limits ATS keyword matching for entry-level roles.',
        },
        {
          title: 'Add a GitHub or portfolio link',
          description:
            'Recruiters expect a link to see actual code. Even a GitHub profile with the two listed projects demonstrates initiative and gives ATS parsers additional keyword context.',
        },
        {
          title: 'Improve CGPA presentation or omit it',
          description:
            'A 6.2/10 CGPA can hurt more than help. Either omit it and focus on skills and projects, or convert to percentage if the institution norm makes it look stronger.',
        },
      ],
    },
    explanation:
      'Fresh graduate resume with minimal differentiation: generic objective, no metrics, thin project scope, and weak ATS keyword coverage. Significant structural and content improvements required.',
  },
];

export const gradingRubric: ScoringRubric = {
  ranges: [
    {
      min: 90,
      max: 100,
      grade: 'A+',
      description:
        'Exceptional resume. Stands out immediately to recruiters and clears ATS with high confidence.',
      criteria: [
        'All bullets are quantified with strong action verbs and measurable outcomes',
        'ATS keyword coverage is comprehensive and role-specific',
        'Clear career progression with demonstrated impact at each role',
        'Professional summary is concise, specific, and achievement-oriented',
        'Skills, education, certifications, and projects all reinforce the target role',
        'Zero formatting, grammar, or structural issues',
      ],
    },
    {
      min: 75,
      max: 89,
      grade: 'A/B+',
      description:
        'Strong resume with solid ATS performance. Minor refinements would push it to exceptional.',
      criteria: [
        'Most bullets quantified; a few could be stronger',
        'Good ATS keyword coverage with small gaps',
        'Clear progression and demonstrated ownership of work',
        'Summary present and mostly effective',
        'Formatting is clean and consistent',
      ],
    },
    {
      min: 60,
      max: 74,
      grade: 'B/C+',
      description:
        'Competent resume that will pass basic ATS filters but needs work to stand out.',
      criteria: [
        'Some bullets quantified but inconsistent — several are still vague',
        'ATS keyword coverage is partial; missing key role-specific terms',
        'Experience is present but impact is unclear in places',
        'Summary is generic or absent',
        'Minor formatting inconsistencies',
      ],
    },
    {
      min: 40,
      max: 59,
      grade: 'C/D',
      description:
        'Below-average resume. Likely to be filtered out by ATS or quickly passed over by recruiters.',
      criteria: [
        'Most bullets are task-based with no quantified outcomes',
        'ATS keyword coverage is weak — many important terms missing',
        'Gaps in experience section or role descriptions are too thin',
        'No summary, or summary is an outdated objective statement',
        'Formatting issues that hurt readability',
      ],
    },
    {
      min: 20,
      max: 39,
      grade: 'D/F',
      description:
        'Weak resume with significant structural and content deficiencies.',
      criteria: [
        'Bullets are mostly vague responsibilities with no metrics or outcomes',
        'Very poor ATS keyword coverage',
        'Critical sections (experience details, contact info) are incomplete',
        'Objective statement or placeholder language present',
        'Skills list is too short or irrelevant to the target role',
      ],
    },
    {
      min: 0,
      max: 19,
      grade: 'F',
      description:
        'Resume is incomplete, unformatted, or contains only placeholder content.',
      criteria: [
        'Missing one or more critical sections (experience, education, or contact)',
        'No ATS-compatible keywords present',
        'Content is placeholder, incoherent, or extremely sparse',
      ],
    },
  ],
};
