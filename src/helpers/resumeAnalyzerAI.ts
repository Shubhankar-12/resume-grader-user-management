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
  }[]
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

Given extracted resume fields (name, summary, skills, experience, education), generate a detailed JSON report with the following structure:

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
