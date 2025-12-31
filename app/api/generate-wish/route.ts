import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'edge';

// Ensure we pick up the key from the environment
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY3 || process.env.GOOGLE_API_KEY;

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!apiKey) {
            console.error("No API key found in environment variables (tried GEMINI_API_KEY, GOOGLE_API_KEY3, and GOOGLE_API_KEY)");
            return NextResponse.json({ error: "Missing API Key. Please check your .env" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `Generate a single, short, funny, and Gen-Z style New Year 2026 wish for someone named "${name || 'a friend'}". 

Requirements:
- Keep it under 25 words
- Use modern internet slang (like "delulu", "slay", "no cap", "lowkey", "vibes", "manifesting", etc.)
- Make it humorous and playful
- Include a subtle reference to 2026
- Do NOT include any hashtags, emojis, or quotation marks
- Just return the wish text, nothing else`;

        try {
            const result = await model.generateContent(prompt);
            const response = result.response;
            const generatedText = response.text()?.trim();

            if (!generatedText) {
                return NextResponse.json({ error: "Empty response from AI" }, { status: 500 });
            }

            return NextResponse.json({ wish: generatedText });
        } catch (modelError: any) {
            console.error("Model Error:", modelError);
            return NextResponse.json({
                error: "Model error",
                message: modelError.message
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Gemini SDK Error:", error);
        return NextResponse.json({
            error: "Failed to generate wish",
            message: error.message || "Unknown Error"
        }, { status: 500 });
    }
}
