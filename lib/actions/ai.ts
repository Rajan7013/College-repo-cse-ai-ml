'use server';

import { geminiModel } from '@/lib/google-ai';
import { Project } from '@/lib/types/projects';

// Helper to clean JSON string
function cleanJsonString(input: string): string {
    let clean = input.trim();
    // Remove markdown code blocks if present
    if (clean.startsWith('```json')) {
        clean = clean.replace(/^```json/, '').replace(/```$/, '');
    } else if (clean.startsWith('```')) {
        clean = clean.replace(/^```/, '').replace(/```$/, '');
    }
    return clean.trim();
}

const SYSTEM_PROMPT = `
You are an expert project manager and educator. Your task is to extract or generate detailed project information for a student hackathon or capstone project.
You must output ONLY valid JSON matching the following structure. Do not include any explanation.

IMPORTANT: Do NOT use Markdown formatting (like **, ##, *, -) in any of the text fields. Use plain text only. Use dashed lists (-) only if absolutely necessary for readability, but prefer plain block text.

Structure:
{
  "title": "Project Title",
  "problemStatement": "Detailed problem statement...",
  "proposedSolution": "Proposed solution approach...",
  "description": "Comprehensive description...",
  "features": ["Feature 1", "Feature 2", ...],
  "advantages": ["Advantage 1", ...],
  "technologies": ["React", "Node.js", ...],
  "tools": ["VS Code", "GitHub", ...],
  "teamSize": {
    "min": 1,
    "max": 4,
    "boysCount": 0,
    "girlsCount": 0
  },
  "eligibility": ["Criteria 1", ...],
  "registrationStartDate": "YYYY-MM-DD",
  "registrationEndDate": "YYYY-MM-DD",
  "submissionDate": "YYYY-MM-DD",
  "rulesAndRegulations": "Plain text rules...",
  "certificates": "Certificate details...",
  "awards": "Award details..."
}

Ensure the content is professional, detailed, and clear.
`;

export async function generateProjectContent(input: string, type: 'url' | 'idea') {
    try {
        let prompt = '';

        if (type === 'url') {
            try {
                const response = await fetch(input);
                if (!response.ok) throw new Error('Failed to fetch URL');
                const html = await response.text();
                // Simple cleanup to reduce token count, removing scripts and styles
                const textContent = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "")
                    .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gm, "")
                    .replace(/<[^>]+>/g, "\n")
                    .replace(/\s+/g, " ")
                    .slice(0, 20000); // Limit context

                prompt = `Extract project details from the following webpage content. If specific details are missing, infer reasonable defaults based on the context.\n\nContent:\n${textContent}`;
            } catch (error) {
                return { success: false, error: 'Failed to access the provided link. Please ensure it is publicly accessible.' };
            }
        } else {
            prompt = `Generate a complete project proposal based on this idea: "${input}". Expand on it to create a comprehensive project definition.`;
        }

        const result = await geminiModel.generateContent([SYSTEM_PROMPT, prompt]);
        const response = await result.response;
        const text = response.text();

        try {
            const data = JSON.parse(cleanJsonString(text));
            return { success: true, data };
        } catch (e) {
            console.error('JSON Parse Error', text);
            return { success: false, error: 'Failed to parse AI response' };
        }

    } catch (error) {
        console.error('AI Generation Error:', error);
        return { success: false, error: 'Failed to generate content. Please try again.' };
    }
}
