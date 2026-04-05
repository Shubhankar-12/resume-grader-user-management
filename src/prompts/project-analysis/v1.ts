import { PromptTemplate } from '../types';
import { getRoleKeywords } from './role-keywords';
import { projectAnalysisExamples } from './examples';

/**
 * Builds a project analysis prompt template for a specific role and set of project descriptions.
 *
 * This is a builder function rather than a static constant because the role name and
 * project descriptions are interpolated directly into the system prompt at build time,
 * giving the model precise role context before it sees any user content.
 */
export function buildProjectAnalysisTemplate(
  role: string,
  projectDescriptions: string
): PromptTemplate {
  const roleSpecificKeywords = getRoleKeywords(role);

  return {
    task: 'projectAnalysis',
    systemPrompt: `You are a technical recruiter expert specializing in evaluating software projects for resume optimization. You are evaluating GitHub projects for a candidate applying for a **${role}** position.

Provide precise, data-driven project evaluations in clean JSON format.

# Role Context
Target role: ${role}
Key skills to look for: ${roleSpecificKeywords}

# Output Requirements
Return a JSON array of exactly 3 project objects representing the most relevant and impressive projects for the target role. Each object must include:
- id: the numeric project ID from the input
- ai_score: 0–100 overall quality and relevance score
- relevance: "HIGH" | "MEDIUM" | "LOW"
- reason: concise explanation of why this project demonstrates qualifications for the role
- key_points: array of 3 specific, quantifiable achievements using strong action verbs (Implemented, Developed, Architected, Optimized, etc.) with metrics, percentages, or scale where inferable

ONLY output valid JSON — no explanations, markdown, or text outside the array.`,
    userTemplate: `# Candidate Projects
${projectDescriptions}

# Task
Analyze the projects above and identify the 3 most impressive and relevant repositories for a **${role}** position.

# Evaluation Criteria
For each project, evaluate:

1. Technical alignment with ${role} (languages, frameworks, tools commonly used in this role)
2. Project complexity and sophistication
3. Code quality indicators (from description, topics, and readme)
4. Industry relevance and practical application
5. Project activity and maintenance (stars, update frequency)
6. Demonstration of key skills: ${roleSpecificKeywords}

# Important Instructions
- Only include 3 projects with the highest relevance to ${role}
- Award higher scores to projects matching ${role} requirements
- Infer technical achievements even if not explicitly stated
- Convert technical features into business value statements when possible
- Prioritize projects with measurable impacts (performance, scale, efficiency)
- Each "key_points" entry must contain specific metrics (%, numbers, timeframes) where possible
- Use strong action verbs at the start of each key point`,
    fewShotExamples: projectAnalysisExamples,
  };
}
