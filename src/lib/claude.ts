import Anthropic from '@anthropic-ai/sdk';
import { claudeResponseSchema, type ClaudeResponse, type MessageInput } from './schema';

const SYSTEM_PROMPT = `You are an assistant that helps users rewrite conflict-prone messages before sending.
You must:
1) Classify tone as one of: aggressive, defensive, passive_aggressive, neutral.
2) Extract risky spans from the original message as character offsets (start, end) and type labels:
   blame, generalization, insult, threat, sarcasm, accusatory_question, profanity, ultimatum.
3) Produce exactly 3 revised versions that preserve intent:
   - soft (warm but not submissive)
   - neutral (fact-focused, low emotion)
   - assertive (clear boundaries, no insults)
4) Do NOT give relationship advice, moral judgments, or therapy.
5) If the user requests threats, coercion, gaslighting, or evidence manipulation, refuse with "blocked: true".
6) Return STRICT JSON only, matching the provided schema. Do not include any other text.

Expected JSON schema:
{
  "tone_label": "aggressive|defensive|passive_aggressive|neutral",
  "risk_level": "high|medium|low",
  "problem_summary": "string (1-2 lines, non-judgmental)",
  "highlighted_words": [
    { "start": number, "end": number, "type": "blame|generalization|insult|threat|sarcasm|accusatory_question|profanity|ultimatum", "token": "string" }
  ],
  "revised": {
    "soft": "string",
    "neutral": "string",
    "assertive": "string"
  },
  "blocked": false
}`;

function buildUserPrompt(input: MessageInput): string {
    const payload = {
        situation: input.situation || null,
        original_message: input.original_message,
        preferred_tone: input.preferred_tone || null,
        language: 'ko',
    };

    return `Analyze this message and provide revisions in JSON format:

${JSON.stringify(payload, null, 2)}`;
}

export async function analyzeMessage(input: MessageInput): Promise<ClaudeResponse> {
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
        throw new Error('CLAUDE_API_KEY is not configured');
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
            {
                role: 'user',
                content: buildUserPrompt(input),
            },
        ],
    });

    // Extract text content from response
    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text response from Claude');
    }

    const rawText = textBlock.text.trim();

    // Try to extract JSON from the response
    let jsonText = rawText;

    // Handle potential markdown code blocks
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
        jsonText = jsonMatch[1];
    }

    // Parse JSON
    let parsed: unknown;
    try {
        parsed = JSON.parse(jsonText);
    } catch {
        throw new Error(`Failed to parse Claude response as JSON: ${rawText.substring(0, 200)}`);
    }

    // Validate against schema
    const result = claudeResponseSchema.safeParse(parsed);

    if (!result.success) {
        console.error('Schema validation failed:', result.error);
        throw new Error(`Invalid Claude response schema: ${result.error.message}`);
    }

    return result.data;
}

/**
 * Get a fallback response when AI analysis fails
 */
export function getFallbackResponse(originalMessage: string): ClaudeResponse {
    return {
        tone_label: 'neutral',
        risk_level: 'medium',
        problem_summary: '분석을 완료할 수 없었습니다. 다시 시도해 주세요.',
        highlighted_words: [],
        revised: {
            soft: originalMessage,
            neutral: originalMessage,
            assertive: originalMessage,
        },
        blocked: false,
    };
}
