import { FewShotExample } from '../types';

export const projectAnalysisExamples: FewShotExample[] = [
  {
    input: `Role: Backend Developer

Project 1:
- ID: 101
- Name: distributed-task-queue
- Description: A Redis-backed distributed task queue with retry logic and dead-letter support
- Stars: 312
- Language: Go
- Topics: redis, distributed-systems, queue, golang, concurrency
- Additional Comments: Used in production by 3 companies
- Readme Excerpt: Supports horizontal scaling, configurable retry policies, and Prometheus metrics out of the box.
- Last Updated: 2024-11-15

Project 2:
- ID: 102
- Name: portfolio-site
- Description: Personal portfolio website
- Stars: 4
- Language: HTML
- Topics: html, css, javascript
- Additional Comments: None
- Readme: None
- Last Updated: 2023-03-20

Project 3:
- ID: 103
- Name: auth-service
- Description: Microservice handling JWT authentication, OAuth2 flows, and RBAC for multi-tenant SaaS
- Stars: 87
- Language: TypeScript
- Topics: jwt, oauth2, authentication, microservices, rbac, nodejs
- Additional Comments: None
- Readme Excerpt: Supports Google, GitHub, and custom SAML providers. Rate limiting via sliding window algorithm.
- Last Updated: 2024-09-01

Project 4:
- ID: 104
- Name: csv-to-json-converter
- Description: Simple utility to convert CSV files to JSON
- Stars: 11
- Language: Python
- Topics: csv, json, utility
- Additional Comments: None
- Readme: None
- Last Updated: 2022-07-10`,
    output: {
      projects: [
      {
        id: 101,
        ai_score: 91,
        relevance: 'HIGH',
        reason:
          'Demonstrates deep backend expertise in distributed systems, concurrency, and production-grade reliability — all core to a Backend Developer role. Real-world adoption by 3 companies validates production quality.',
        key_points: [
          'Architected a Redis-backed distributed task queue in Go with horizontal scaling support, adopted in production by 3 companies',
          'Implemented configurable retry policies and dead-letter queue support, reducing message loss risk in high-throughput workloads',
          'Integrated Prometheus metrics out of the box, enabling observability for distributed workloads at scale',
        ],
      },
      {
        id: 103,
        ai_score: 83,
        relevance: 'HIGH',
        reason:
          'Auth-service directly demonstrates backend API design, security architecture, and microservices — key skills for a Backend Developer. OAuth2, JWT, and RBAC implementation shows strong security engineering fundamentals.',
        key_points: [
          'Developed a multi-provider OAuth2 microservice supporting Google, GitHub, and SAML for multi-tenant SaaS environments',
          'Implemented role-based access control (RBAC) with JWT, enabling fine-grained authorization across tenant boundaries',
          'Applied sliding window rate limiting algorithm to protect authentication endpoints from brute-force attacks',
        ],
      },
      {
        id: 104,
        ai_score: 22,
        relevance: 'LOW',
        reason:
          'Simple file-format conversion utility with no server-side logic, database interaction, or API design. Minimal relevance to backend development responsibilities.',
        key_points: [
          'Built a command-line CSV-to-JSON conversion tool in Python for local data transformation tasks',
          'Handles basic parsing edge cases for malformed CSV inputs',
          'Lightweight utility with no external dependencies',
        ],
      },
    ],
    },
    explanation:
      'The two backend-relevant projects (distributed queue and auth service) score high due to production use, technical depth, and direct alignment with Backend Developer skills. The portfolio site is excluded (HTML/CSS, no backend relevance) and the CSV utility is included as the third selection but scored low.',
  },
];
