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