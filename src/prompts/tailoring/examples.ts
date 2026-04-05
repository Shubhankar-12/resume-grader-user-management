import { FewShotExample } from '../types';

export const tailoringExamples: FewShotExample[] = [
  {
    input: `Resume (backend engineer) applying to Full-Stack Engineer JD at FinTech startup.

JD excerpt:
"We are looking for a Full-Stack Engineer with strong React and Node.js skills. You will own features end-to-end — from designing REST APIs to building responsive UIs. Experience with TypeScript, PostgreSQL, and AWS is required. Bonus: GraphQL, Redis, or prior fintech exposure."

Existing resume summary:
"Backend engineer with 4 years of experience building scalable Node.js microservices and REST APIs. Strong in TypeScript, PostgreSQL, and Redis. Led backend architecture for a payments processing service handling $5M/day."

Existing skills:
["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "AWS", "Express.js", "Kafka"]

Existing projects:
- PayStream: "Built a Node.js microservice for real-time payment processing." Technologies: ["Node.js", "PostgreSQL", "Redis", "Docker"]`,
    output: {
      category: 'Full-Stack Engineer',
      name: 'Alex Rivera',
      summary:
        'Full-stack engineer with 4 years of experience building end-to-end features using Node.js and React. Proven track record in TypeScript, PostgreSQL, and Redis at scale — including a payments processing service handling $5M/day. Comfortable owning full feature delivery from API design through responsive UI implementation.',
      atsScore: 82,
      email: 'alex@example.com',
      phone: '+1-555-000-0000',
      location: 'San Francisco, CA',
      skills: [
        'TypeScript',
        'Node.js',
        'React',
        'PostgreSQL',
        'Redis',
        'REST APIs',
        'AWS',
        'Docker',
        'Express.js',
        'GraphQL',
        'Kafka',
      ],
      experience: [
        {
          companyName: 'Acme Payments',
          role: 'Backend Engineer',
          tasks: [
            'Designed and owned REST APIs powering a payments processing service processing $5M/day with 99.99% uptime.',
            'Built responsive dashboard UIs in React to surface real-time transaction analytics for ops teams.',
            'Architected Redis-based caching layer reducing PostgreSQL read load by 60%.',
            'Containerised all services with Docker and deployed to AWS ECS, cutting release cycle from 2 days to 4 hours.',
          ],
          startDate: '2021-03',
          endDate: '',
          isPresent: true,
          location: 'San Francisco, CA',
          description:
            'Full-stack ownership of core payments platform features — from API design to production UI delivery.',
        },
      ],
      education: [
        {
          schoolName: 'University of California, Berkeley',
          degree: 'B.S.',
          subject: 'Computer Science',
          location: 'Berkeley, CA',
          startDate: '2017-08',
          endDate: '2021-05',
        },
      ],
      projects: [
        {
          title: 'PayStream',
          description:
            'End-to-end payment processing platform featuring a Node.js microservice backend and a React dashboard for real-time transaction monitoring. Integrates PostgreSQL for durable storage and Redis for sub-millisecond caching.',
          technologies: ['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
          startDate: '2022-06',
          endDate: '2022-10',
          links: {
            GitHub: 'https://github.com/alexrivera/paystream',
            Website: '',
          },
        },
      ],
      achievements: [
        'Reduced infrastructure costs by $40K/year through AWS spot-instance adoption.',
        'Introduced TypeScript across the team, eliminating an entire class of runtime errors.',
      ],
      certifications: ['AWS Certified Developer – Associate'],
      languages: ['English', 'Spanish'],
      interests: ['Fintech', 'Open Source', 'Developer Tooling'],
    },
    explanation:
      'The summary was rewritten to highlight full-stack capability and fintech context, directly echoing the JD language. React was surfaced prominently in skills and tasks despite being a secondary skill in the original resume. The PayStream project description was expanded to include the React dashboard angle. ATS score of 82 reflects strong keyword alignment with minor gaps (no explicit GraphQL experience).',
  },
];
