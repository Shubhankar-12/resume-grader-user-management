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
- Last Updated: ${project.updated_at}`;
    })
    .join("\n\n");

  const prompt = `
You are a technical recruiter helping to evaluate GitHub projects for a software developer applying for the role of **${role}**.

Based on the project details below, evaluate each project and provide:
1. AI Score (0–100) based on relevance, quality, stars, description, and topics.
2. Relevance: HIGH / MEDIUM / LOW (based on fit for the role).
3. Reason: A short explanation of why this project is relevant or not.
4. Project ID: The ID of the project same as in the project details.
5. Select Top 3 projects that are most relevant for the role.
6. If Additional Comments are provided, use them to for the evaluation.
7. Add 2-3 key points for each project to highlight things that are most relevant to the role.

Projects:
${projectDescriptions}

Respond only with valid JSON of 3 top projects. 

No extra explanation, no wrapping text, no markdown — just pure JSON output.

Output format:
[
  {
    "id": <project_id>,
    "ai_score": <score>,
    "relevance": "HIGH" | "MEDIUM" | "LOW",
    "reason": "<short explanation>"
    "key_points": ["<key points>"]
  },
  ...
]
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
  });

  const content = response.choices[0]?.message?.content || "[]";
  try {
    const parsed = JSON.parse(content);
    return parsed; // Should be array of { id, ai_score, relevance, reason }
  } catch (err) {
    console.error("Failed to parse AI response:", content);
    throw new Error("Invalid AI response format.");
  }
}
