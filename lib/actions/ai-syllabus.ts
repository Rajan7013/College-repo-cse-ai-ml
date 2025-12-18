'use server';

// Allow up to 60 seconds for AI processing (Vercel Hobby Limit)
export const maxDuration = 60;

import { groqClient, GROQ_MODEL } from '../groq-ai';
import { UnitTopic } from './curriculum';

export interface ExtractedSyllabus {
    code?: string;
    name?: string;
    regulation?: string;
    year?: number;
    semester?: number;
    units: { [key: string]: UnitTopic };
    textbooks?: string[];
    references?: string[];
}

export async function generateSyllabus(input: { text?: string, images?: string[] }): Promise<{ success: boolean; data?: ExtractedSyllabus; error?: string }> {
    try {
        if (!process.env.GROQ_API_KEY) {
            return { success: false, error: "Groq API Key not configured in .env.local" };
        }

        // Build the prompt
        let userMessage = `You are an expert curriculum data extractor. Your job is to parse syllabus text and return ONLY valid JSON.

STEP-BY-STEP EXTRACTION:

1. SUBJECT CODE: Find patterns like "23AHS02", "23ACS01", "22EE101" (YY + DEPT + NUMBER)
   - Usually in first 3 lines
   
2. SUBJECT NAME: Find the subject name (e.g., "CHEMISTRY", "DATA STRUCTURES")
   - Often appears right after the code
   - May be in ALL CAPS

3. REGULATION: Look for "R23", "R22", "R21" or infer from code
   - If code starts with "23", regulation is "R23"
   - If code starts with "22", regulation is "R22"

4. YEAR & SEMESTER:
   - Look for "I B.Tech I SEM", "1st year 1st semester", "Year 1 Sem 2"
   - Extract numeric values only

5. UNITS: Find ALL units (typically 5 units, but can be 4-8)
   - Look for: "UNIT I", "UNIT II", "Unit 1:", "UNIT-1", etc.
   - Unit title is the text immediately after unit label (before colon or newline)
   - Topics are everything under that unit until next unit starts
   - Split topics into concise bullet points (5-15 topics per unit)

6. TEXTBOOKS: Look for section starting with "Textbooks:", "Text Books:"
   - Extract numbered list items
   - Include author, title, edition, publisher, year

7. REFERENCES: Look for "Reference Books:", "References:"
   - Extract numbered list items
   - Same format as textbooks

OUTPUT FORMAT (STRICT):
{
    "code": "23AHS02",
    "name": "CHEMISTRY",
    "regulation": "R23",
    "year": 1,
    "semester": 1,
    "units": {
        "1": {
            "title": "Structure and Bonding Models",
            "topics": [
                "Fundamentals of Quantum mechanics",
                "Schrodinger Wave equation, significance of Ψ and Ψ2",
                "Particle in one dimensional box",
                "Molecular orbital theory – bonding in molecules",
                "Energy level diagrams of O2 and CO",
                "π-molecular orbitals of butadiene and benzene",
                "Calculation of bond order"
            ]
        },
        "2": { "title": "...", "topics": [...] }
    },
    "textbooks": [
        "Jain and Jain, Engineering Chemistry, 16/e, DhanpatRai, 2013",
        "Peter Atkins, Julio de Paula, Atkins' Physical Chemistry, 10/e, Oxford, 2010"
    ],
    "references": [
        "Skoog and West, Principles of Instrumental Analysis, 6/e, Thomson, 2007"
    ]
}

CRITICAL VALIDATION RULES:
✓ Keys must be lowercase: code, name, regulation, year, semester, units, textbooks, references
✓ Unit keys must be strings: "1", "2", "3", "4", "5"
✓ year and semester must be integers (1, 2, 3, 4)
✓ Each unit must have both "title" (string) and "topics" (array of strings)
✓ Extract ALL units found in the syllabus (don't skip any)
✓ Topics should be concise and descriptive (split long sentences)
✓ Return ONLY the JSON object - no markdown, no explanations, no code blocks

`;

        if (input.text) {
            userMessage += `\nSYLLABUS CONTENT:\n${input.text}`;
        }

        if (input.images && input.images.length > 0) {
            userMessage += `\n\n[Note: ${input.images.length} image(s) uploaded. Extract from text provided.]`;
        }

        console.log("Calling Groq API with model:", GROQ_MODEL);

        const completion = await groqClient.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a precise JSON extractor. Return ONLY valid JSON, no other text."
                },
                {
                    role: "user",
                    content: userMessage,
                }
            ],
            model: GROQ_MODEL,
            temperature: 0, // Zero temperature for maximum consistency
            max_tokens: 8000,
        });

        const responseText = completion.choices[0]?.message?.content || "";
        console.log("Groq Raw Response:", responseText.substring(0, 300) + "...");

        // Extract JSON from response (handle markdown code blocks)
        let jsonText = responseText.trim();

        // Remove markdown code blocks if present
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```json?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
        }

        // Find the JSON object
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("No JSON found in response");
            return { success: false, error: "AI did not return valid JSON. Please try again." };
        }

        const data = JSON.parse(jsonMatch[0]) as ExtractedSyllabus;

        // Validate extracted data
        if (!data.code || !data.name || !data.units) {
            return { success: false, error: "AI extraction incomplete. Please ensure syllabus includes subject code, name, and units." };
        }

        console.log("✓ Successfully extracted:", {
            code: data.code,
            name: data.name,
            unitCount: Object.keys(data.units).length
        });

        return { success: true, data };

    } catch (error: any) {
        console.error("Groq AI Generation Error:", error);

        if (error.status === 429) {
            return {
                success: false,
                error: "Rate limit exceeded. Please wait a moment and try again."
            };
        }

        if (error instanceof SyntaxError) {
            return {
                success: false,
                error: "AI returned invalid JSON. Please try again or simplify the input."
            };
        }

        return { success: false, error: "Failed to generate syllabus. " + (error.message || "Unknown error") };
    }
}
