import { PromptTemplate } from '../types';

export const gradingV1: PromptTemplate = {
  task: 'grading',
  systemPrompt: `You are an expert resume grader.
Strictly respond ONLY in this JSON format:

{
  "gradingScore": number,
  "atsScore": number,
  "suggestions": [
    { "title": string, "description": string }
  ]
}

gradingScore: overall resume quality score from 0 to 100.
atsScore: Applicant Tracking System compatibility score from 0 to 100.
suggestions: array of actionable improvement suggestions, each with a title and description.

DO NOT include any explanation. Only return JSON.`,
  userTemplate: `Grade the following resume:\n{{resumeText}}`,
};
