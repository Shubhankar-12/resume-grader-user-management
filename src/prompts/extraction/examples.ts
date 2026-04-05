import { FewShotExample } from '../types';

export const extractionExamples: FewShotExample[] = [
  {
    input: `Jane Smith
Senior Software Engineer
jane.smith@gmail.com | +1-415-555-0192 | San Francisco, CA
linkedin.com/in/janesmith | github.com/janesmith

SUMMARY
Senior Software Engineer with 8+ years of experience building scalable distributed systems
and developer-facing APIs. Passionate about clean architecture, performance optimization,
and mentoring junior engineers.

SKILLS
Languages: Python, Go, Java, TypeScript, SQL
Frameworks & Libraries: Django, FastAPI, gRPC, React, Node.js
Databases: PostgreSQL, Redis, Bigtable, Spanner
Cloud & Infrastructure: GCP, Kubernetes, Terraform, Docker, Pub/Sub
Tools: Git, GitHub Actions, Prometheus, Grafana, Datadog

EXPERIENCE

Google LLC — Mountain View, CA
Senior Software Engineer, Infrastructure Platform  |  Mar 2019 – Present
• Designed and led the migration of a monolithic deployment pipeline to a microservices
  architecture on GKE, reducing p99 deploy latency by 42%.
• Built a gRPC-based internal service mesh handling 2M+ requests/day with 99.99% uptime.
• Mentored a team of 5 junior engineers through code reviews, design docs, and 1:1s.
• Collaborated with SRE to introduce SLO-based alerting, cutting MTTR from 45 min to 8 min.

Google LLC — Mountain View, CA
Software Engineer II, Search Infrastructure  |  Jul 2016 – Feb 2019
• Optimised a distributed cache layer for search ranking signals, improving cache hit rate
  from 71% to 94% and saving ~$180K/year in compute costs.
• Contributed to open-source Kubernetes operators for stateful workloads (450+ GitHub stars).
• Implemented blue-green deployment strategy for a tier-1 Search service with zero downtime.

EDUCATION

Stanford University — Stanford, CA
M.S. Computer Science (Distributed Systems focus)  |  Sep 2014 – Jun 2016

University of Michigan — Ann Arbor, MI
B.S. Computer Science, Minor in Mathematics  |  Sep 2010 – May 2014

PROJECTS

Kube-Autoscaler-Optimizer (github.com/janesmith/kube-autoscaler-optimizer)
An open-source Kubernetes HPA extension that applies predictive autoscaling using historical
Prometheus metrics. 780+ GitHub stars. Built with Go, Prometheus, and Kubernetes client-go.
Jan 2022 – Present

DistCache (github.com/janesmith/distcache)
A lightweight distributed in-memory cache library for Go with consistent hashing, LRU eviction,
and replication. Benchmarked at 1.2M ops/sec on commodity hardware.
Aug 2020 – Dec 2021

CERTIFICATIONS
Google Cloud Professional Cloud Architect — issued May 2021
Certified Kubernetes Administrator (CKA) — issued Nov 2020

LANGUAGES
English (Native), Mandarin (Conversational)

INTERESTS
Open-source contribution, technical writing, distance running`,

    output: {
      category: 'Senior Software Engineer',
      name: 'Jane Smith',
      summary:
        'Senior Software Engineer with 8+ years of experience building scalable distributed systems and developer-facing APIs. Passionate about clean architecture, performance optimization, and mentoring junior engineers.',
      email: 'jane.smith@gmail.com',
      phone: '+1-415-555-0192',
      location: 'San Francisco, CA',
      skills: [
        'Python',
        'Go',
        'Java',
        'TypeScript',
        'SQL',
        'Django',
        'FastAPI',
        'gRPC',
        'React',
        'Node.js',
        'PostgreSQL',
        'Redis',
        'Bigtable',
        'Spanner',
        'GCP',
        'Kubernetes',
        'Terraform',
        'Docker',
        'Pub/Sub',
        'Git',
        'GitHub Actions',
        'Prometheus',
        'Grafana',
        'Datadog',
      ],
      experience: [
        {
          companyName: 'Google LLC',
          role: 'Senior Software Engineer, Infrastructure Platform',
          location: 'Mountain View, CA',
          startDate: 'Mar 2019',
          endDate: '',
          isPresent: true,
          description: '',
          tasks: [
            'Designed and led the migration of a monolithic deployment pipeline to a microservices architecture on GKE, reducing p99 deploy latency by 42%.',
            'Built a gRPC-based internal service mesh handling 2M+ requests/day with 99.99% uptime.',
            'Mentored a team of 5 junior engineers through code reviews, design docs, and 1:1s.',
            'Collaborated with SRE to introduce SLO-based alerting, cutting MTTR from 45 min to 8 min.',
          ],
        },
        {
          companyName: 'Google LLC',
          role: 'Software Engineer II, Search Infrastructure',
          location: 'Mountain View, CA',
          startDate: 'Jul 2016',
          endDate: 'Feb 2019',
          isPresent: false,
          description: '',
          tasks: [
            'Optimised a distributed cache layer for search ranking signals, improving cache hit rate from 71% to 94% and saving ~$180K/year in compute costs.',
            'Contributed to open-source Kubernetes operators for stateful workloads (450+ GitHub stars).',
            'Implemented blue-green deployment strategy for a tier-1 Search service with zero downtime.',
          ],
        },
      ],
      education: [
        {
          schoolName: 'Stanford University',
          degree: 'M.S.',
          subject: 'Computer Science (Distributed Systems focus)',
          location: 'Stanford, CA',
          startDate: 'Sep 2014',
          endDate: 'Jun 2016',
        },
        {
          schoolName: 'University of Michigan',
          degree: 'B.S.',
          subject: 'Computer Science, Minor in Mathematics',
          location: 'Ann Arbor, MI',
          startDate: 'Sep 2010',
          endDate: 'May 2014',
        },
      ],
      projects: [
        {
          title: 'Kube-Autoscaler-Optimizer',
          description:
            'An open-source Kubernetes HPA extension that applies predictive autoscaling using historical Prometheus metrics. 780+ GitHub stars.',
          technologies: ['Go', 'Prometheus', 'Kubernetes', 'client-go'],
          startDate: 'Jan 2022',
          endDate: '',
          links: {
            GitHub: 'github.com/janesmith/kube-autoscaler-optimizer',
            Website: '',
          },
        },
        {
          title: 'DistCache',
          description:
            'A lightweight distributed in-memory cache library for Go with consistent hashing, LRU eviction, and replication. Benchmarked at 1.2M ops/sec on commodity hardware.',
          technologies: ['Go'],
          startDate: 'Aug 2020',
          endDate: 'Dec 2021',
          links: {
            GitHub: 'github.com/janesmith/distcache',
            Website: '',
          },
        },
      ],
      achievements: [],
      certifications: [
        'Google Cloud Professional Cloud Architect — issued May 2021',
        'Certified Kubernetes Administrator (CKA) — issued Nov 2020',
      ],
      languages: ['English (Native)', 'Mandarin (Conversational)'],
      interests: ['Open-source contribution', 'technical writing', 'distance running'],
    },

    explanation:
      'The model correctly identifies every section of a senior engineer resume: flattens multi-line bullet tasks into arrays, marks the current role with isPresent=true, splits two Google tenures into separate experience objects, maps degrees/subjects precisely, captures project links, and lists certifications verbatim.',
  },
];
