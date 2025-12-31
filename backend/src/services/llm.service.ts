import OpenAI from "openai";
import { env } from "../config/env";
import type {
    ChatCompletionMessageParam
} from "openai/resources/chat/completions";


// const openai = new OpenAI({
//     apiKey: env.OPENAI_API_KEY
// })
const client = new OpenAI({
    apiKey: env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Spur AI Chat Assignment"
    }
})

const SYSTEM_PROMPT = `
You are a helpful support agent for a small e-commerce store.

Store policies:
- Shipping: Worldwide shipping. USA delivery in 5–7 business days.
- Returns: 30-day return policy.
- Refunds: Processed within 5 business days.
- Support hours: Mon–Fri, 9am–6pm IST.

Answer clearly and concisely.
`;

export async function generateReply(
    history: { role: "user" | "assistant"; content: string }[],
    userMessage: string
) {
    try {
        const messages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: SYSTEM_PROMPT
            },
            ...history.slice(-6).map(m => ({
                role: m.role,
                content: m.content
            })),
            {
                role: "user",
                content: userMessage
            }
        ];
        const response = await client.chat.completions.create({
            model: env.LLM_MODEL || 'mistralai/mistral-7b-instruct:free',
            messages,
            max_tokens: 200,
            temperature: 0.3
        })
        return response.choices[0]?.message?.content ?? ""
    } catch (error) {
        console.error("LLM error:", error)
        throw new Error("LLM_FAILED")

    }
}