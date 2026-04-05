import { FewShotExample } from '../types';

export const reportExamples: FewShotExample[] = [
  {
    input: JSON.stringify({
      name: 'Alex Johnson',
      summary: 'Senior Software Engineer with 8 years of experience in distributed systems and cloud-native applications.',
      skills: ['TypeScript', 'Go', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'gRPC', 'Terraform'],
      experience: [
        {
          companyName: 'TechCorp Inc.',
          role: 'Senior Software Engineer',
          tasks: [
            'Architected microservices platform handling 50k req/s',
            'Reduced p99 latency by 40% via caching layer',
            'Led team of 5 engineers across 3 time zones',
          ],
          startDate: '2020-03',
          endDate: '',
          isPresent: true,
          location: 'San Francisco, CA',
          description: 'Core platform team building distributed services.',
        },
      ],
      education: [
        {
          schoolName: 'UC Berkeley',
          degree: 'B.S.',
          subject: 'Computer Science',
          location: 'Berkeley, CA',
          startDate: '2012-08',
          endDate: '2016-05',
        },
      ],
      projects: [
        {
          title: 'k8s-autoscaler',
          description: 'Custom Kubernetes autoscaler based on custom metrics from Prometheus.',
          technologies: ['Go', 'Kubernetes', 'Prometheus'],
          startDate: '2022-01',
          endDate: '2022-06',
          links: { GitHub: 'https://github.com/alexj/k8s-autoscaler', Website: '' },
        },
      ],
      certifications: ['AWS Solutions Architect – Professional', 'CKA (Certified Kubernetes Administrator)'],
      interests: ['Open source', 'Cloud infrastructure'],
      achievements: ['Speaker at KubeCon 2023', 'Patent: Adaptive rate-limiting algorithm'],
    }),
    output: {
      overallGrade: 'A',
      scoreOutOf100: 91,
      scoreBreakdown: {
        atsCompatibility: 90,
        keywordMatch: 93,
        contentQuality: 92,
        formatting: 88,
      },
      strengths: [
        {
          title: 'Strong Quantified Impact',
          description: 'Multiple bullet points include concrete metrics (50k req/s throughput, 40% latency reduction), making achievements easy for ATS and recruiters to parse.',
        },
        {
          title: 'Relevant Certifications',
          description: 'AWS Solutions Architect – Professional and CKA directly validate expertise advertised in the skills section, boosting credibility.',
        },
        {
          title: 'High-Signal Open Source Work',
          description: 'The k8s-autoscaler project demonstrates hands-on Kubernetes internals knowledge that goes beyond day-to-day job duties.',
        },
      ],
      areasForImprovement: [
        {
          title: 'Missing Observability Keywords',
          description: 'Distributed tracing (Jaeger, OpenTelemetry) and SLO/SLA language is absent; senior platform roles almost always require these.',
        },
        {
          title: 'No Summary Keyword Density',
          description: 'The summary reads well but lacks specific technologies, limiting ATS matching for cloud-native and distributed systems roles.',
        },
      ],
      keywordAnalysis: {
        presentKeywords: ['TypeScript', 'Go', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'gRPC', 'Terraform', 'microservices', 'distributed systems'],
        missingKeywords: ['OpenTelemetry', 'observability', 'CI/CD', 'Docker', 'service mesh', 'Istio', 'SLO', 'on-call'],
      },
      projectAnalysis: {
        strengths: [
          {
            title: 'Production-Grade Tooling',
            description: 'The autoscaler project addresses a real operational challenge with measurable scope, signalling senior-level initiative.',
          },
        ],
        areasForImprovement: [
          {
            title: 'No Links or README Details',
            description: 'Adding a live demo URL and a brief impact statement (stars, contributors, adoption) would strengthen the project entry.',
          },
        ],
      },
      certificationAnalysis: {
        strengths: [
          {
            title: 'Professional-Level AWS Cert',
            description: 'The Solutions Architect – Professional tier is highly respected and directly supports cloud infrastructure roles.',
          },
        ],
        areasForImprovement: [],
        recommendedCertifications: ['Google Cloud Professional Cloud Architect', 'HashiCorp Certified: Terraform Associate'],
      },
      interestAnalysis: {
        relevance: 80,
        comments: 'Open source and cloud infrastructure interests align well with the technical profile and signal genuine passion beyond employment.',
        suggestions: ['Mention specific OSS projects or communities (e.g., CNCF) to make interests more concrete and searchable.'],
      },
      actionableSuggestions: [
        {
          title: 'Add Observability Keywords to Summary',
          description: 'Weave in "OpenTelemetry", "distributed tracing", and "SLO" to lift ATS keyword match for senior platform roles.',
          block: '<div class="mt-2 p-3 bg-muted rounded-md text-sm"><p class="font-semibold">Before:</p><p class="text-red-500 line-through mt-1">Senior Software Engineer with 8 years of experience in distributed systems and cloud-native applications.</p><p class="font-semibold mt-2">After:</p><p class="text-green-500 mt-1">Senior Software Engineer with 8 years of experience designing distributed, cloud-native systems with deep expertise in observability (OpenTelemetry, Prometheus) and SLO-driven reliability.</p></div>',
        },
      ],
    },
    explanation: 'Senior engineer profile with strong quantified experience, high ATS score, and targeted suggestions for observability keyword gaps.',
  },
];
