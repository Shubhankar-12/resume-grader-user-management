import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getResumeAnalysisFromAI(text: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are an expert resume analyzer.
Strictly respond ONLY in this JSON format:

{
  gradingScore: number,
  atsScore: number,
  suggestions: string[],
  extractedFields: {
    name: string,
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
      isPresent: boolean
    }[]
  }
}

DO NOT include any explanation. Only return JSON.`,
      },
      {
        role: "user",
        content: `Analyze the following resume:\n${text}`,
      },
    ],
    temperature: 0,
  });

  const aiContent = response.choices[0].message.content;

  try {
    const analysis = JSON.parse(aiContent!);
    return analysis;
  } catch (error) {
    console.error("Failed to parse AI response:", aiContent);
    throw new Error("Invalid AI Response Format");
  }
}
