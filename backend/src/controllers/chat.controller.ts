import { Request, Response } from "express";
import {
    getOrCreateConversation,
    saveMessage,
    getConversationHistory
} from "../services/conversation.services"
import { validateMessage } from "../utils/validate";
import { generateReply } from "../services/llm.service";


export async function postChatMessage(req: Request, res: Response) {
    try {
        const { message, sessionId } = req.body;
        const cleanMessage = validateMessage(message)
        const conversation = await getOrCreateConversation(sessionId)
        await saveMessage(conversation.id, "user", cleanMessage)
        const history = await getConversationHistory(conversation.id)
        const reply = await generateReply(history, cleanMessage)
        await saveMessage(conversation.id, "ai", reply)
        res.json({
            reply,
            sessionId: conversation.id
        })
    } catch (err: any) {
        res.status(400).json({
            reply:
                err.message === "LLM_FAILED"
                    ? "Sorry, our support agent is unavailable right now."
                    : err.message
        });
    }
}

export async function getChatHistory(req: Request, res: Response) {
    try {
        const { sessionId } = req.params;
        if (!sessionId) {
            return res.status(400).json({ error: "SessionId is required" })
        }
        const messages = await getConversationHistory(sessionId)

        res.json({
            sessionId,
            messages: messages.map(m => ({
                sender: m.role === "assistant" ? 'ai' : 'user',
                text: m.content
            }))
        })
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to fetch chat history"
        })
    }
}
