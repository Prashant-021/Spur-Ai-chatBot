import { prisma, Prisma } from '../db/prisma'

export async function getOrCreateConversation(sessionID?: string) {
    if (sessionID) {
        const converstion = await prisma.conversation.findUnique({
            where: { id: sessionID }
        })
        if (converstion) return converstion
    }
    return prisma.conversation.create({ data: {} })
}

export async function saveMessage(
    conversationId: string,
    sender: "user" | "ai",
    text: string
) {
    return prisma.message.create({
        data: {
            conversationId,
            sender,
            text
        }
    })
}

export async function getConversationHistory(
    conversationId: string
): Promise<{ role: "user" | "assistant"; content: string }[]> {
    const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" }
    });

    return messages.map(m => ({
        role: m.sender === "ai" ? "assistant" : "user",
        content: m.text
    }));
}