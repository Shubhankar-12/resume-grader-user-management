import { PromptTemplate } from '../types';
import { extractionExamples } from './examples';

export const extractionV1: PromptTemplate = {
  task: 'extraction',
  systemPrompt: `You are an expert resume field extractor.
Strictly respond ONLY in this JSON format:

{
  "category": "string",
  "name": "string",
  "summary": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "skills": ["string"],
  "experience": [
    {
      "companyName": "string",
      "role": "string",
      "tasks": ["string"],
      "startDate": "string",
      "endDate": "string",
      "isPresent": false,
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

Rules:
- Use empty string "" for any missing text field.
- Use empty array [] for any missing array field.
- Set isPresent to true when the experience has no end date or shows "Present".
- category should reflect the candidate's primary job title or target role.
- DO NOT include any explanation. Only return JSON.`,

  userTemplate: `Extract important fields from the following resume:\n{{resumeText}}`,

  fewShotExamples: extractionExamples,
};
