import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// First Query: Grading + ATS + Suggestions
export async function getResumeScoreAndSuggestions(text: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are an expert resume grader.
Strictly respond ONLY in this JSON format:

{
  gradingScore: number,
  atsScore: number,
  suggestions: string[]
}

DO NOT include any explanation. Only return JSON.`,
      },
      {
        role: "user",
        content: `Grade the following resume:\n${text}`,
      },
    ],
    temperature: 0,
  });

  const aiContent = response.choices[0].message.content;

  try {
    const gradingResult = JSON.parse(aiContent!);
    return gradingResult;
  } catch (error) {
    console.error("Failed to parse grading AI response:", aiContent);
    throw new Error("Invalid AI Grading Response Format");
  }
}

// Second Query: Extract Personal Info, Skills, Experience, Education
export async function getResumeExtractedFields(text: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are an expert resume field extractor.
Strictly respond ONLY in this JSON format:

{
  category: string,
  name: string,
  summary: string,
  email: string,
  phone: string,
  location: string,
  skills: string[],
  experience: {
    companyName: string,
    role: string,
    tasks: string[],
    startDate: string,
    endDate: string,
    isPresent: boolean,
    location: string,
    description: string
  }[],
  education: {
    schoolName: string,
    degree: string,
    subject: string,
    location: string,
    startDate: string,
    endDate: string
  }[],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"],
      "startDate": "string",
      "endDate": "string",
      "links": {
        "GitHub": "string",
        "Website": "string"
      }
    }
  ],
  "achievements": ["string"],
  "certifications": ["string"],
  "languages": ["string"],
  "interests": ["string"],
}

DO NOT include any explanation. Only return JSON.`,
      },
      {
        role: "user",
        content: `Extract important fields from the following resume:\n${text}`,
      },
    ],
    temperature: 0,
  });

  const aiContent = response.choices[0].message.content;

  try {
    const extractedFields = JSON.parse(aiContent!);
    return extractedFields;
  } catch (error) {
    console.error("Failed to parse extracted fields AI response:", aiContent);
    throw new Error("Invalid AI Extract Fields Response Format");
  }
}

export async function generateResumeReportFromExtractedText(
  extractedFields: any
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or "gpt-4" if you want more quality
    messages: [
      {
        role: "system",
        content: `
You are an expert resume analyst.

Given extracted resume fields (name, summary, skills, experience, education, projects, achievements, certifications, interests), generate a detailed JSON report with the following structure:

overallGrade: string (e.g., "B+")

scoreOutOf100: number (e.g., 75)

scoreBreakdown:

atsCompatibility: number (percentage)

keywordMatch: number (percentage)

contentQuality: number (percentage)

formatting: number (percentage)

strengths: array of { title: string, description: string }

areasForImprovement: array of { title: string, description: string }

keywordAnalysis:

presentKeywords: string[]

missingKeywords: string[]

projectAnalysis:
  strengths: array of { title: string, description: string }
  areasForImprovement: array of { title: string, description: string }
  
certificationAnalysis:
  strengths: array of { title: string, description: string }
  areasForImprovement: array of { title: string, description: string }
  recommendedCertifications: string[]

interestAnalysis:
  relevance: number (percentage)
  comments: string
  suggestions: string[]

actionableSuggestions: array of:

{ title: string, description: string, block: string (valid simple HTML using <p>, <ul>, <li>, <strong>, etc., styled with Tailwind classes like: mt-2, p-3, bg-muted, rounded-md, text-sm, text-red-500 line-through, text-green-500 mt-1, font-semibold) }

Important Instructions:

Respond only with valid JSON.

No extra explanation, no wrapping text, no markdown — just pure JSON output.`,
      },
      {
        role: "user",
        content: `Here is the extracted resume data:\n${JSON.stringify(
          extractedFields
        )}`,
      },
    ],
    temperature: 0,
  });

  const aiContent = response.choices[0].message.content;

  try {
    const report = JSON.parse(aiContent!);
    return report;
  } catch (error) {
    console.error("Failed to parse AI response for resume report:", aiContent);
    throw new Error("Invalid AI Report Format");
  }
}

export async function generateTailoredResume(
  extractedFields: any,
  jobDescription: string
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
Tailored Resume Generation Prompt:
You are an expert resume writer specialized in tailoring resumes to job descriptions.

Given:

Old resume data (structured)

New job description (JD text)

Tailor and enhance the resume specifically for the new JD, following this exact output structure:

{
  "category": "string",
  "name": "string",
  "summary": "string",
  "atsScore": number,
  "email": "string",
  "phone": "string",
  "location": "string",
  "skills": ["string", "string", "..."],
  "experience": [
    {
      "companyName": "string",
      "role": "string",
      "tasks": ["string", "string", "..."],
      "startDate": "string",
      "endDate": "string",
      "isPresent": boolean,
      "location": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "schoolName": "string",
      "degree": "string",
      "subject": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"],
      "startDate": "string",
      "endDate": "string",
      "links": {
        "GitHub": "string",
        "Website": "string"
      }
    }
  ],
  "achievements": ["string"],
  "certifications": ["string"],
  "languages": ["string"],
  "interests": ["string"]
}

Tailoring Instructions:

- Improve summary and skills to match JD keywords and focus areas.
- Adjust experience descriptions and tasks to highlight the most relevant achievements and responsibilities for the JD.
- Enhance project descriptions to better reflect skills, technologies, and achievements relevant to the JD.
- Strengthen achievements to align with JD's required skills, leadership, or results.
- Keep education mostly unchanged unless relevant coursework or honors match JD.
- Maintain all dates and companies correctly.
- Certify that links (GitHub, Website) are preserved as given.
- Add any relevant interests.
- Category is the role required in job description.
- ATS Score is a number between 0 and 100, representing how well this resume matches the job description.

Important Rules:

- Respond ONLY with valid JSON.
- No extra explanation, no wrapping text, no markdown — just pure JSON.
`,
      },
      {
        role: "user",
        content: `Here is the old resume data:\n${JSON.stringify(
          extractedFields
        )}\n\nHere is the new JD:\n${jobDescription}`,
      },
    ],
    temperature: 0,
  });

  const aiContent = response.choices[0].message.content;

  try {
    const tailoredResume = JSON.parse(aiContent!);
    return tailoredResume;
  } catch (error) {
    console.error(
      "Failed to parse AI response for tailored resume:",
      aiContent
    );
    throw new Error("Invalid AI Tailored Resume Format");
  }
}

export async function generateResumeJobMatchReport(
  extractedFields: any,
  jobDescription: string
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or "gpt-4" if you want more quality
    messages: [
      {
        role: "system",
        content: `
You are an expert resume analyst specialized in matching resumes to job descriptions.

Given extracted resume fields and a job description, generate a detailed JSON report with the following structure:

{
  "keyRequirements": {
    "requiredSkills": string[],
    "experienceLevel": string,
    "education": string,
    "keyResponsibilities": string[]
  },
  "resumeMatchAnalysis": {
    "overallMatch": number,
    "matchingSkills": string[],
    "missingSkills": string[],
    "experienceMatch": {
      "isMatching": boolean,
      "message": string
    },
    "educationMatch": {
      "isMatching": boolean,
      "message": string
    },
    "projectsMatch": {
      "isMatching": boolean,
      "message": string,
      "relevantProjects": string[]
    },
    "certificationMatch": {
      "isMatching": boolean,
      "message": string,
      "relevantCertifications": string[],
      "recommendedCertifications": string[]
    }
  }
 
}

Important Instructions:

1. Extract required skills, experience level, education requirements, and key responsibilities from the job description.
2. Calculate an overall match percentage (0-100) based on skills, experience, education, and project matches.
3. Provide a list of matching skills that are present in both the resume and job description.
4. Provide a list of missing skills that are in the job description but not in the resume.
5. Analyze if the candidate's experience level matches the job requirements.
6. Analyze if the candidate's education matches the job requirements.
7. Identify relevant projects from the resume that match job requirements.
8. Analyze if certifications match job requirements and recommend additional certifications if needed.

Respond only with valid JSON.

No extra explanation, no wrapping text, no markdown — just pure JSON output.`,
      },
      {
        role: "user",
        content: `
Resume Data:
${JSON.stringify(extractedFields)}

Job Description:
${jobDescription}`,
      },
    ],
    temperature: 0,
  });

  const aiContent = response.choices[0].message.content;

  try {
    const report = JSON.parse(aiContent!);
    return report;
  } catch (error) {
    console.error(
      "Failed to parse AI response for job match report:",
      aiContent
    );
    throw new Error("Invalid AI Report Format");
  }
}

export async function generateResumeCoverLetterFromExtractedText(
  extractedResumeData: any,
  jobDescription: string,
  role: string,
  company: string
) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or "gpt-4" if you want more quality
    messages: [
      {
        role: "system",
        content: `
You are an expert resume cover letter generator.

Given extracted resume fields, role and company and a job description, generate a detailed JSON cover letter with the following structure:

{
  "cover_letter": string,
  "cover_letter_summary": string
}

Important Instructions:

1. Generate a cover letter based on the resume data and the job description.
2. Provide a summary of the cover letter.
3. Cover letter and summary should be in first person perspective.
4. Cover letter should be 150-200 words long.
5. Persolanize the cover letter with the role and company.

Respond only with valid JSON. 

No extra explanation, no wrapping text, no markdown — just pure JSON output.`,
      },
      {
        role: "user",
        content: `
Resume Data:
${JSON.stringify(extractedResumeData)}

Job Description:
${jobDescription}

Role:
${role}

Company:
${company}
`,
      },
    ],
    temperature: 0,
  });

  const aiContent = response.choices[0].message.content;

  try {
    const report = JSON.parse(aiContent!);
    return report;
  } catch (error) {
    console.error(
      "Failed to parse AI response for job match report:",
      aiContent
    );
    throw new Error("Invalid AI Report Format");
  }
}

export async function generateResumeProjectAnalysis(
  role: string,
  projects: {
    id: number;
    name: string;
    description: string;
    stars: number;
    language: string;
    languageColor: string;
    topics: string[];
    updated_at: string;
    additional_comments?: string;
    readme?: string;
  }[]
) {
  const projectDescriptions = projects
    .map((project, index) => {
      return `Project ${index + 1}:
- ID: ${project.id}
- Name: ${project.name}
- Description: ${project.description || "N/A"}
- Stars: ${project.stars}
- Language: ${project.language}
- Topics: ${project.topics?.join(", ") || "None"}
- Additional Comments: ${project.additional_comments || "None"}
${
  project.readme
    ? `- Readme Excerpt: ${project.readme.substring(0, 500)}${
        project.readme.length > 500 ? "..." : ""
      }`
    : "- Readme: None"
}
- Last Updated: ${project.updated_at}`;
    })
    .join("\n\n");

  const roleSpecificKeywords = getRoleKeywords(role);

  const prompt = `
You are an expert technical recruiter with deep knowledge of software development evaluating GitHub projects for a candidate applying for a **${role}** position.

# Candidate Projects
${projectDescriptions}

# Task
Analyze these projects and identify the 3 most impressive and relevant repositories for a **${role}** position. 

# Evaluation Criteria
For each project, evaluate:

1. Technical alignment with ${role} (languages, frameworks, tools commonly used in this role)
2. Project complexity and sophistication
3. Code quality indicators (from description, topics, and readme)
4. Industry relevance and practical application
5. Project activity and maintenance (stars, update frequency)
6. Demonstration of key skills: ${roleSpecificKeywords}

# Required Output Format
Provide a JSON array of exactly 3 project objects, selecting only the most relevant projects for a ${role} position:

[
  {
    "id": <project_id>,
    "ai_score": <0-100 score based on overall quality and relevance>,
    "relevance": "HIGH" | "MEDIUM" | "LOW",
    "reason": "<concise explanation of why this project demonstrates qualifications for the role>",
    "key_points": [
      "<3 specific, quantifiable achievements with metrics and action verbs>",
      "<focus on technical accomplishments that would impress a hiring manager>"
    ]
  },
  ...
]

# Important Instructions
- Only include 3 projects with the highest relevance to ${role}
- Award higher scores to projects matching ${role} requirements
- Infer technical achievements even if not explicitly stated
- Convert technical features into business value statements when possible
- Prioritize projects with measurable impacts (performance, scale, efficiency)
- ONLY output valid JSON - no explanations, markdown, or text outside the JSON array
- Each "key_points" must contain specific metrics (%, numbers, timeframes) in  ["<key points>"] format
- Use strong action verbs at the start of each key point (Implemented, Developed, Architected, Optimized, etc.)
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a technical recruiter expert specializing in evaluating software projects for resume optimization. Provide precise, data-driven project evaluations in clean JSON format.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content || "[]";
  try {
    const parsed = JSON.parse(content);
    return parsed; // Array of { id, ai_score, relevance, reason, key_points }
  } catch (err) {
    console.error("Failed to parse AI response:", content);
    throw new Error("Invalid AI response format.");
  }
}

/**
 * Helper function to get role-specific keywords based on job title
 */
function getRoleKeywords(role: string): string {
  const roleLower = role.toLowerCase();

  const keywordMap: Record<string, string> = {
    // Development Roles
    "frontend developer":
      "UI/UX implementation, responsive design, component architecture, state management, performance optimization, accessibility, CSS frameworks, frontend testing, bundling tools, animation",
    "backend developer":
      "API design, database optimization, microservices, security, scalability, performance tuning, caching strategies, queue management, logging, authentication",
    "fullstack developer":
      "end-to-end implementation, full application lifecycle, cross-stack optimization, system architecture, API integration, database design, UI/UX, testing strategies, deployment pipelines",
    "software engineer":
      "software architecture, system design, algorithm optimization, testing strategy, technical documentation, code quality, design patterns, performance analysis, scalability solutions",
    "mobile developer":
      "native app development, cross-platform solutions, mobile UI/UX, performance optimization, offline capabilities, app store deployment, push notifications, mobile-specific APIs, responsive layouts",
    "android developer":
      "Java/Kotlin development, Android SDK, material design, app lifecycle management, background processing, UI performance, Play Store deployment, device compatibility",
    "ios developer":
      "Swift/Objective-C, UIKit/SwiftUI, Core Data, app lifecycle, performance optimization, App Store guidelines, TestFlight, Apple design principles",
    "web developer":
      "responsive web design, browser compatibility, progressive enhancement, web performance, SEO optimization, accessibility standards, modern web APIs, HTML/CSS/JavaScript mastery",
    "game developer":
      "game engine expertise, 3D modeling integration, physics simulation, game performance optimization, animation, shader programming, multiplayer implementation, game UI/UX",

    // Data Roles
    "data scientist":
      "data analysis, machine learning models, statistical analysis, data visualization, predictive modeling, hypothesis testing, feature engineering, A/B testing, experiment design",
    "data engineer":
      "data pipeline architecture, ETL processes, data warehousing, distributed computing, data cleaning, schema design, data governance, real-time processing, data integration",
    "machine learning engineer":
      "model development, ML pipelines, algorithm optimization, feature engineering, model deployment, MLOps, experiment tracking, hyperparameter tuning, model monitoring",
    "data analyst":
      "data visualization, SQL expertise, statistical analysis, business intelligence tools, dashboard creation, metric definition, data cleaning, reporting automation, insight generation",
    "business intelligence developer":
      "dashboard development, KPI monitoring, data storytelling, ETL processes, SQL optimization, data modeling, report automation, business metrics, executive reporting",
    "computer vision engineer":
      "image processing algorithms, neural network architectures, feature extraction, model optimization, video analysis, object detection, segmentation, tracking systems",
    "nlp engineer":
      "text processing, sentiment analysis, language models, entity recognition, text classification, information extraction, document understanding, conversational AI",

    // Infrastructure Roles
    "devops engineer":
      "CI/CD pipelines, infrastructure as code, container orchestration, monitoring, security automation, configuration management, cloud services, automated testing, deployment strategies",
    "site reliability engineer":
      "system reliability, incident response, scalability planning, performance optimization, observability, automated recovery, service level objectives, capacity planning",
    "cloud engineer":
      "multi-cloud architecture, serverless computing, cloud security, cost optimization, resource management, cloud migration, high availability design, disaster recovery",
    "security engineer":
      "threat modeling, security testing, vulnerability management, incident response, security architecture, authentication systems, encryption implementation, compliance frameworks",
    "network engineer":
      "network architecture, protocol implementation, traffic optimization, network security, load balancing, routing algorithms, failover systems, latency minimization",
    "systems administrator":
      "server management, user administration, backup systems, OS optimization, automation scripting, security patching, resource monitoring, troubleshooting, disaster recovery",

    // Product Development Roles
    "qa engineer":
      "test automation, test case design, regression testing, performance testing, bug reporting, quality metrics, CI integration, test coverage analysis, user acceptance testing",
    "product manager":
      "feature prioritization, user research, product roadmap, market analysis, stakeholder management, requirement specification, user stories, product metrics, launch planning",
    "ux designer":
      "user research, usability testing, wireframing, prototyping, information architecture, user flows, accessibility standards, visual design principles, interaction design",
    "technical product manager":
      "technical roadmapping, feature specification, cross-team collaboration, technical debt management, API planning, system architecture, product metrics, release planning",

    // Architecture Roles
    "solutions architect":
      "enterprise architecture, technology stack selection, integration design, scalability planning, technical documentation, stakeholder management, best practices, cost optimization",
    "enterprise architect":
      "technology standardization, business-IT alignment, system integration, architectural governance, technology roadmap, legacy modernization, compliance architecture",
    "security architect":
      "security framework design, threat modeling, risk assessment, compliance architecture, zero-trust implementation, authentication/authorization design, security governance",
    "cloud architect":
      "multi-cloud strategy, migration architecture, cloud-native design, security controls, cost optimization, performance architecture, disaster recovery planning",

    // Leadership Roles
    "engineering manager":
      "team leadership, technical mentorship, project planning, performance management, hiring, process improvement, cross-team collaboration, delivery management",
    "technical lead":
      "technical direction, architecture decisions, code quality standards, mentoring, technical debt management, code reviews, technology selection, implementation strategies",
    cto: "technology strategy, technical vision, architecture oversight, technology stack decisions, innovation leadership, technical team building, executive communication, digital transformation",
    "vp of engineering":
      "engineering organization, delivery frameworks, technical leadership, team structure, hiring strategy, technology roadmap, cross-department collaboration, resource planning",
    "director of engineering":
      "department management, technical strategy, team growth, delivery predictability, engineering culture, cross-functional leadership, resource allocation",

    // Specialized Development Roles
    "blockchain developer":
      "smart contract development, consensus mechanisms, cryptographic implementations, decentralized applications, token economics, blockchain security, web3 integration",
    "embedded systems engineer":
      "firmware development, hardware interfaces, real-time operating systems, power optimization, device drivers, sensor integration, memory management",
    "robotics engineer":
      "motion planning, sensor integration, control systems, hardware interfaces, real-time processing, simulator development, robotic operating system, calibration systems",
    "ar/vr developer":
      "3D rendering, spatial computing, gesture recognition, immersive UI/UX, performance optimization, 3D asset integration, physics simulation, tracking systems",
    "graphics programmer":
      "rendering pipelines, shader development, 3D mathematics, optimization techniques, physics simulation, graphics APIs, visual effects, animation systems",
    "quantum computing engineer":
      "quantum algorithms, quantum circuit design, qubit manipulation, quantum simulation, error correction, quantum-classical integration, quantum advantage analysis",

    // Database Roles
    "database administrator":
      "database optimization, query performance, backup strategies, high availability configuration, data security, schema design, migration planning, monitoring setup",
    "database engineer":
      "database architecture, query optimization, indexing strategies, data modeling, sharding implementation, replication setup, database security, scaling solutions",
    "data architect":
      "enterprise data modeling, data governance, master data management, data integration, warehouse architecture, data quality frameworks, metadata management",

    // AI/ML Roles
    "ai research scientist":
      "algorithm development, research papers, experimental design, model innovation, baseline comparison, literature review, theoretical frameworks, proof-of-concept implementation",
    "mlops engineer":
      "ML pipeline automation, model deployment, monitoring systems, feature store implementation, experiment tracking, model versioning, infrastructure scaling, CI/CD for ML",
    "reinforcement learning engineer":
      "policy optimization, environment modeling, reward function design, multi-agent systems, simulation integration, RL algorithm implementation, state representation",

    // Other Technical Roles
    "technical writer":
      "documentation strategy, API documentation, user guides, technical tutorials, information architecture, content standards, documentation testing, audience analysis",
    "developer advocate":
      "technical content creation, community engagement, sample application development, technical presentations, API feedback collection, developer experience improvement",
    "developer relations":
      "technical community building, developer feedback collection, technical content strategy, platform evangelism, partnership programs, technical workshops, API advocacy",
    "sales engineer":
      "technical demonstrations, solution architecture, customer requirements mapping, technical objection handling, proof-of-concept development, integration planning",
  };

  // Find the closest matching role or return a generic set of keywords
  for (const [key, value] of Object.entries(keywordMap)) {
    if (roleLower.includes(key) || key.includes(roleLower)) {
      return value;
    }
  }

  return "code quality, technical documentation, problem-solving, system design, scalability, performance optimization";
}
