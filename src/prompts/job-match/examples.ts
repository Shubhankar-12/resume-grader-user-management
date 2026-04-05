import type { FewShotExample } from '../types';

// Partial match: a Python developer applying for a senior Python + AWS role.
// The candidate has solid Python and project experience but lacks AWS certifications
// and the seniority-level leadership responsibilities the JD demands.
export const jobMatchExamples: FewShotExample[] = [
  {
    input: JSON.stringify({
      extractedFields: {
        name: 'Alex Rivera',
        category: 'Python Developer',
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'REST APIs', 'Git'],
        experience: [
          {
            companyName: 'TechStartup Inc.',
            role: 'Python Developer',
            tasks: [
              'Built REST APIs using Django and PostgreSQL',
              'Containerised services with Docker',
              'Wrote unit tests with pytest',
            ],
            startDate: '2022-01',
            endDate: 'Present',
            isPresent: true,
          },
        ],
        education: [{ schoolName: 'State University', degree: "Bachelor's", subject: 'Computer Science' }],
        projects: [{ title: 'E-commerce API', description: 'Django REST API for product catalogue', technologies: ['Python', 'Django', 'PostgreSQL'] }],
        certifications: [],
        achievements: ['Reduced API response time by 30% through query optimisation'],
      },
      jobDescription:
        'Senior Python Engineer at CloudCorp. 5+ years Python, AWS (Lambda, S3, RDS), team leadership, CI/CD, Terraform, microservices architecture.',
    }),
    output: {
      keyRequirements: {
        requiredSkills: ['Python', 'AWS Lambda', 'AWS S3', 'AWS RDS', 'Terraform', 'CI/CD', 'Microservices'],
        experienceLevel: 'Senior (5+ years)',
        education: "Bachelor's in Computer Science or related field",
        keyResponsibilities: [
          'Design and maintain microservices on AWS',
          'Lead and mentor a team of 3–5 engineers',
          'Define CI/CD pipelines and infrastructure-as-code with Terraform',
        ],
      },
      resumeMatchAnalysis: {
        overallMatch: 48,
        matchingSkills: ['Python', 'REST APIs', 'Docker', 'PostgreSQL'],
        missingSkills: ['AWS Lambda', 'AWS S3', 'AWS RDS', 'Terraform', 'CI/CD pipelines', 'Microservices architecture'],
        experienceMatch: {
          isMatching: false,
          message: 'Candidate has ~2 years of experience; the role requires 5+ years at a senior level with team-lead responsibilities.',
        },
        educationMatch: {
          isMatching: true,
          message: "Bachelor's in Computer Science satisfies the stated educational requirement.",
        },
        projectsMatch: {
          isMatching: true,
          message: 'The E-commerce API project demonstrates relevant Python/Django backend skills, though no cloud-native projects are present.',
          relevantProjects: ['E-commerce API'],
        },
        certificationMatch: {
          isMatching: false,
          message: 'No AWS or cloud certifications found; the JD implicitly expects AWS expertise.',
          relevantCertifications: [],
          recommendedCertifications: ['AWS Certified Developer – Associate', 'AWS Certified Solutions Architect – Associate', 'HashiCorp Terraform Associate'],
        },
      },
    },
    explanation:
      'The candidate covers core Python skills and has a relevant project, but lacks AWS cloud experience, Terraform, CI/CD pipelines, and the years of seniority the role demands — yielding a partial match score of 48.',
  },
];
