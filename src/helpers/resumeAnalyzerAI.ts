import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getResumeAnalysisFromAI(text: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or "gpt-4"
    messages: [
      {
        role: "system",
        content:
          "You are an expert resume analyzer. Respond ONLY in a strict JSON format: { gradingScore: number, atsScore: number, suggestions: string[] }",
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
