import dotenv from 'dotenv'

dotenv.config()

export const env = {
    PORT: process.env.PORT || 3000,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY!,
    LLM_MODEL: process.env.LLM_MODEL,
};

if (!env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY missing");
}
