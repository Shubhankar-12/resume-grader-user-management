import type { FewShotExample } from '../types';

// Backend developer applying for a full-stack role at Acme Corp.
// The candidate has strong Node.js/Express experience and has done some React work,
// positioning themselves as a full-stack candidate who can grow into the frontend layer.
export const coverLetterExamples: FewShotExample[] = [
  {
    input: JSON.stringify({
      extractedFields: {
        name: 'Jordan Lee',
        category: 'Backend Developer',
        skills: ['Node.js', 'Express', 'MongoDB', 'React', 'REST APIs', 'Docker'],
        experience: [
          {
            companyName: 'DataBridge Solutions',
            role: 'Backend Developer',
            tasks: [
              'Designed and maintained Node.js/Express REST APIs serving 50k daily users',
              'Built React dashboards for internal analytics tooling',
              'Containerised microservices using Docker and deployed on AWS EC2',
            ],
            startDate: '2021-06',
            endDate: 'Present',
            isPresent: true,
          },
        ],
        education: [{ schoolName: 'Metro University', degree: "Bachelor's", subject: 'Software Engineering' }],
      },
      jobDescription: 'Full-Stack Engineer at Acme Corp — Node.js backend, React frontend, MongoDB, REST APIs, cloud deployment.',
      role: 'Full-Stack Engineer',
      company: 'Acme Corp',
    }),
    output: {
      cover_letter:
        "Dear Hiring Team at Acme Corp,\n\nI am excited to apply for the Full-Stack Engineer role. Over the past three years at DataBridge Solutions I have built and maintained Node.js/Express REST APIs that serve over 50,000 daily users, while also developing React dashboards that translate complex data into clear, actionable insights for internal teams. Containerising those services with Docker and deploying them on AWS has given me hands-on experience across the full delivery lifecycle.\n\nAcme Corp's mission to connect data-driven businesses through elegant software resonates with me. I am confident that my ability to own both the backend API layer and the React frontend — combined with my experience shipping production-grade features end-to-end — would let me contribute to your team from day one. I would love the opportunity to discuss how my background aligns with what you are building.\n\nThank you for your time and consideration.\n\nSincerely,\nJordan Lee",
      cover_letter_summary:
        "Jordan highlights three years of full-stack experience (Node.js, React, Docker/AWS), directly mirrors Acme Corp's tech stack, and closes with a confident statement of immediate contribution.",
    },
    explanation:
      'The cover letter is written in first person, runs approximately 170 words, personalises the opening with the company name and role, and connects the candidate\'s backend-dominant background to the full-stack requirements of the position.',
  },
];
