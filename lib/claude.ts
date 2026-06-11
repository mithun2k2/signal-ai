import { Capture, UserProfile, SynthesisReport } from './types';

const CLAUDE_API = 'https://api.anthropic.com/v1/messages';

async function callClaude(prompt: string, systemPrompt: string): Promise<string> {
  const response = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await response.json();
  return data.content[0].text;
}

export async function synthesiseCaptures(
  captures: Capture[],
  profile: UserProfile
): Promise<SynthesisReport> {
  const captureText = captures
    .map(c => `[${c.type.toUpperCase()}] ${c.content}${c.context ? ` (Context: ${c.context})` : ''}`)
    .join('\n');

  const systemPrompt = `You are SignalAI, an expert at turning conference captures into actionable career intelligence. You always respond with valid JSON only. No markdown, no explanation, just the JSON object.`;

  const prompt = `
User Profile:
- Name: ${profile.name}
- Currently working on: ${profile.currentWork}
- Biggest challenge: ${profile.biggestChallenge}
- Can offer: ${profile.canOffer}
- Conference: ${profile.conference}

Conference Captures:
${captureText}

Generate a synthesis report as JSON matching this exact structure:
{
  "topInsights": [
    {
      "id": "i1",
      "title": "short title",
      "summary": "2-3 sentence insight specific to the user's work",
      "actionItem": "specific action to take this week",
      "relevanceScore": 8,
      "category": "technical"
    }
  ],
  "actionItems": ["action 1", "action 2", "action 3", "action 4", "action 5"],
  "followUpEmails": [
    {
      "personName": "name",
      "context": "how you met",
      "emailDraft": "full email text"
    }
  ],
  "linkedInPost": "full linkedin post text with emojis, 150-200 words",
  "roiScore": 75,
  "roiBreakdown": {
    "insightsCaptured": ${captures.length},
    "connectionsToFollow": 3,
    "actionItemsGenerated": 5,
    "estimatedValue": "High"
  }
}

Rules:
- Generate exactly 5 insights and 5 action items
- Make insights SPECIFIC to the user's currentWork and biggestChallenge, not generic
- Only generate followUpEmails for contacts actually captured
- estimatedValue must be one of: Low, Medium, High, Exceptional`;

  try {
    const raw = await callClaude(prompt, systemPrompt);
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return generateFallbackReport(captures, profile);
  }
}

function generateFallbackReport(captures: Capture[], profile: UserProfile): SynthesisReport {
  return {
    topInsights: captures.slice(0, 5).map((c, i) => ({
      id: `i${i}`,
      title: `Key insight from ${c.type}`,
      summary: c.content.slice(0, 120),
      actionItem: 'Review and apply this to your current project this week',
      relevanceScore: 7,
      category: 'technical' as const,
    })),
    actionItems: [
      'Review all captures from today',
      'Follow up with contacts within 48 hours',
      'Apply top technical insight to current project',
      'Share key takeaway on LinkedIn',
      'Block 1 hour this week to act on learnings',
    ],
    followUpEmails: [],
    linkedInPost: `Just wrapped an incredible day at ${profile.conference}. Here are my top takeaways as someone building in the AI space...`,
    roiScore: 65,
    roiBreakdown: {
      insightsCaptured: captures.length,
      connectionsToFollow: 0,
      actionItemsGenerated: 5,
      estimatedValue: 'Medium',
    },
  };
}