import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the SmartPenny AI assistant for students. You help with:
- "Can I afford this?" (concerts, trips, events, purchases)
- Budget tweaks, spending, and semester planning
- Savings tips and cost-cutting (e.g. meal prep vs dining out, deals)
- Tuition, rent, and bill due dates / cash flow
- Student deals and discounts
Keep answers concise, practical, and student-friendly. No investing or loan advice—just smart financial planning.`;

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
