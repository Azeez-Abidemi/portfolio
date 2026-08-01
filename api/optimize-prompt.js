export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY.' });
    }

    const { rawPrompt, tone, role } = req.body || {};

    if (!rawPrompt || typeof rawPrompt !== 'string' || !rawPrompt.trim()) {
        return res.status(400).json({ error: 'rawPrompt is required.' });
    }

    const metaPrompt = `You are a prompt engineering expert. Rewrite the user's rough prompt into a single, clear, well-structured prompt.

Requirements:
- Give the AI the role/persona: "${role}"
- Tone: ${tone}
- Add relevant context and specificity the original was missing
- Keep it under 150 words
- Output ONLY the rewritten prompt text — no preamble, no quotes, no markdown

Original prompt:
"""
${rawPrompt.trim()}
"""`;

    try {
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: metaPrompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
                }),
            }
        );

        if (!geminiRes.ok) {
            const errorText = await geminiRes.text();
            console.error('Gemini API error:', geminiRes.status, errorText);
            return res.status(502).json({ error: 'The AI service failed to respond.' });
        }

        const data = await geminiRes.json();
        const optimizedPrompt = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!optimizedPrompt) {
            return res.status(502).json({ error: 'The AI service returned nothing.' });
        }

        return res.status(200).json({ optimizedPrompt });
    } catch (err) {
        return res.status(500).json({ error: 'Unexpected server error.' });
    }
}