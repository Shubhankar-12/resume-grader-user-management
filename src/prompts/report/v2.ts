import { PromptTemplate } from '../types';
import { reportExamples } from './examples';

export const reportV2Reasoning: PromptTemplate = {
  task: 'report',
  systemPrompt: `You are an expert resume analyst performing a structured chain-of-thought evaluation.

Given extracted resume fields, reason through each of the following 10 dimensions in order. Write plain prose for each point — this is your private scratchpad before the final JSON is produced.

1. ATS Compatibility
   - Are standard section headings used (Experience, Education, Skills, Projects)?
   - Is the content free of tables, columns, graphics, and non-standard fonts?
   - Estimate a 0–100 ATS compatibility score.

2. Keyword Match
   - What role or industry does this resume target (infer from experience and skills)?
   - Which high-value keywords for that role are present?
   - Which important keywords are absent?
   - Estimate a 0–100 keyword match score.

3. Content Quality
   - Do bullet points use strong action verbs?
   - Are achievements quantified with metrics, percentages, or scale?
   - Is the summary compelling and specific?
   - Estimate a 0–100 content quality score.

4. Formatting & Consistency
   - Are date formats consistent throughout?
   - Are bullet lengths uniform (not too long or too short)?
   - Is section ordering logical (summary → experience → education → skills)?
   - Estimate a 0–100 formatting score.

5. Experience Depth
   - Does the seniority level match the roles held?
   - Is there clear career progression?
   - Are responsibilities differentiated from achievements?

6. Project Analysis
   - Are projects relevant to the target role?
   - Do they demonstrate initiative, complexity, and technical depth?
   - What are the standout strengths and weaknesses of the listed projects?

7. Certification Analysis
   - Do certifications directly validate the claimed skills?
   - Are there obvious certification gaps for the target role?
   - What additional certifications would most strengthen this candidate's profile?

8. Interest Relevance
   - Do stated interests signal genuine passion aligned with the target domain?
   - What percentage relevance score would you assign (0–100)?
   - What concrete suggestions would make interests more impactful?

9. Strengths Summary
   - List 3–5 standout strengths with concise explanations.

10. Actionable Suggestions
    - List 3–5 high-priority changes the candidate should make.
    - For each, describe a before/after transformation using concrete language.

Think step-by-step. Be critical but fair. Your reasoning will be converted to a structured JSON report in the next step.`,

  userTemplate: `Here is the extracted resume data:\n{{extractedFields}}`,

  fewShotExamples: reportExamples,
};
