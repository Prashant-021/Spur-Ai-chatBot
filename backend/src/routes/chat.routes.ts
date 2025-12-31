import { Router } from "express";
import { postChatMessage, getChatHistory } from "../controllers/chat.controller";


const router = Router()

router.post('/message', postChatMessage)
router.get('/history/:sessionId', getChatHistory)

export default router