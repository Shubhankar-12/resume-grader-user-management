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
