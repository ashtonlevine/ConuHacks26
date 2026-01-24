import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the SmartPenny in-app assistant. The user is in an app with Budget, "After essentials," Deals, tuition/rent, runway, and savings goals. You do NOT have access to their live numbers.

STRICT RESPONSE FORMAT for any steps (affordability, savings, budgeting, deals, etc.):

1. **Yes / No / Maybe** — one short line for affordability questions.

2. **Why (1–2 sentences max)** — very short explanation. Only include facts. No extra encouragement, examples, or storytelling.

3. **Steps** — **provide a maximum of 5 steps only**. Each step must be:
   - One short line (no sub-bullets, no commas separating mini-actions, no "e.g." or extra explanation).
   - A concrete action the user can do (in the app or in real life).
   - Each step separated by a blank line.

**Rules:**
- Do NOT expand steps beyond one line.
- Do NOT provide extra paragraphs or mini-essays.
- Do NOT ask the user questions in steps.
- Always include step 1: "Check your 'After essentials' in Budget" or "Check your runway" if you don't have live numbers.
- Steps may include setting a savings goal, cutting a category by 10–20%, or checking Deals.
- Keep language simple, direct, and student-friendly. No investing or loan advice.

**Example output:**

Maybe. Your After essentials show limited room for extra spending.

1. Check your "After essentials" in the Budget section.

2. Set a small savings goal in the app.

3. Reduce one spending category by 10–20%.

4. Check Deals before purchasing.

5. Track your spending daily for the next week.
`;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured. Add it to .env.local." },
      { status: 500 }
    );
  }

  let body: { message?: string; messages?: { role: "user" | "assistant"; content: string }[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Expected { message: string } or { messages: [...] }." },
      { status: 400 }
    );
  }

  const messages = body.messages ?? (body.message ? [{ role: "user" as const, content: body.message }] : null);
  if (!messages?.length) {
    return NextResponse.json(
      { error: "Provide 'message' or 'messages' in the request body." },
      { status: 400 }
    );
  }

  const contents = messages.map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      contents,
    });

    const text = response.text ?? "";
    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gemini API request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
