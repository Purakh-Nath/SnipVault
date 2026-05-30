import * as SecureStore from 'expo-secure-store';

const API_KEY_STORE_KEY = 'ai_api_key';
const API_PROVIDER_KEY  = 'ai_provider';

export type AIProvider = 'z-ai' | 'openai' | 'gemini' | 'groq';

export interface AIExplanation {
  explanation: string;
  summary: string;
  improvements: string[];
}

//  Key management

export async function saveApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(API_KEY_STORE_KEY, key);
}

export async function getApiKey(): Promise<string | null> {
  return SecureStore.getItemAsync(API_KEY_STORE_KEY);
}

export async function deleteApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(API_KEY_STORE_KEY);
}

export async function hasApiKey(): Promise<boolean> {
  const key = await getApiKey();
  return !!key && key.length > 0;
}

// AI call

const SYSTEM_PROMPT = `You are a senior software engineer. 
Analyze the provided code and respond ONLY with valid JSON.
No markdown, no backticks, no explanation outside the JSON.
Format:
{
  "explanation": "detailed explanation of what this code does",
  "summary": "one sentence summary max 20 words",
  "improvements": ["suggestion 1", "suggestion 2", "suggestion 3"]
}`;

export async function explainCode(
  code: string,
  language: string
): Promise<AIExplanation> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('NO_API_KEY');

  const userMessage = `Language: ${language}\n\nCode:\n${code}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
  model: 'z-ai/glm-4.5-air:free',
  messages: [
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
    {
      role: 'user',
      content: userMessage,
    },
  ],
  temperature: 0.2,
  max_tokens: 600,
}),
  });

  // if (!response.ok) {
  //   const err = await response.json().catch(() => ({}));
  //   const msg = (err as any)?.error?.message ?? `HTTP ${response.status}`;
  //   throw new Error(msg);
  // }

  if (!response.ok) {
  const errorText = await response.text();

  console.log('STATUS:', response.status);
  console.log('ERROR:', errorText);

  throw new Error(errorText);
}

  const data = await response.json();
  const raw  = data.choices?.[0]?.message?.content ?? '';

  try {
    return JSON.parse(raw) as AIExplanation;
  } catch {
    return {
      explanation: raw,
      summary: 'AI analysis complete',
      improvements: [],
    };
  }
}