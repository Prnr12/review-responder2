export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { review, tone, stars, businessName } = req.body;

  if (!review || !review.trim()) {
    return res.status(400).json({ error: 'Review text is required' });
  }

  const starText = stars > 0 ? `${stars}-star` : 'unrated';
  const prompt = `You are an expert reputation manager for local businesses. Generate a ${tone} response to this ${starText} customer review${businessName ? ` for ${businessName}` : ''}.

Review: "${review}"

Rules:
- Keep it under 150 words
- Sound human, not robotic
- If negative (1-3 stars): acknowledge the issue, apologize sincerely, offer a solution or invite them back
- If positive (4-5 stars): thank them warmly, mention a specific detail from their review, invite them back
- Don't be defensive or make excuses
- Sign off naturally (no "Management" — use "The Team" or the business name if provided)
- Ready to copy-paste directly to Google/Yelp

Respond with ONLY the review response. No preamble, no labels, no quotes.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(500).json({ error: 'AI service error. Please try again.' });
    }

    const text = data.content?.map(b => b.text || '').join('') || '';

    if (!text) {
      return res.status(500).json({ error: 'No response generated. Please try again.' });
    }

    return res.status(200).json({ response: text.trim() });

  } catch (error) {
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
      }
