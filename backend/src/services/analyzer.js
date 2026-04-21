import Groq from 'groq-sdk';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Analyse extracted text using Groq (llama3).
 * Returns { summary, entities, sentiment, keyTopics, wordCount, readingTime }
 */
export async function analyseDocument(text) {
  const truncated = text.slice(0, 9000);

  const prompt = `You are a professional document analysis engine.

Analyse the document text below and return ONLY a raw JSON object — no markdown fences, no explanation.

Document:
"""
${truncated}
"""

Return exactly:
{
  "summary": "<2-3 sentence summary: who, what, key outcome>",
  "entities": {
    "names": ["<person name>"],
    "dates": ["<date as written>"],
    "organizations": ["<org/company>"],
    "amounts": ["<monetary value with symbol>"],
    "locations": ["<city, country, address>"]
  },
  "sentiment": "<Positive|Neutral|Negative>",
  "sentimentScore": <float -1.0 to 1.0>,
  "keyTopics": ["<topic1>", "<topic2>", "<topic3>"],
  "documentType": "<Invoice|Contract|Report|Letter|Article|Resume|Legal|Other>",
  "language": "<English|Hindi|etc>"
}

Rules:
- Empty arrays [] when nothing found
- sentimentScore: -1.0 = very negative, 0 = neutral, 1.0 = very positive
- keyTopics: 3-5 short keywords/phrases
- Return ONLY the JSON object, nothing else, no extra text`;

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: 'You are a document analysis engine. Always respond with only a valid JSON object. No markdown, no explanation, no extra text.'
      },
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  let raw = completion.choices[0].message.content.trim();
  raw = raw.replace(/```json|```/g, '').trim();

  // Extract JSON if there's extra text around it
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) raw = jsonMatch[0];

  const result = JSON.parse(raw);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return {
    ...result,
    wordCount,
    readingTime: Math.ceil(wordCount / 200),
    charCount: text.length
  };
}
