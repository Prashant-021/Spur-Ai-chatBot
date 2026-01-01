# AI Live Chat Support Agent

This project is a mini AI-powered customer support chat application.  
It simulates a live chat widget where users can ask questions (e.g., shipping, returns, support hours) and receive AI-generated responses via a real LLM API.

The goal of this project is to demonstrate **clean architecture, robustness, and realistic product behavior**.

---

## ✨ Features

- Live chat UI with user and AI messages
- Session-based conversations (no authentication required)
- Persistent chat history
- LLM-powered responses (OpenRouter)
- Hardcoded FAQ / domain knowledge
- Input validation & error handling
- Clean separation of backend layers

---

## 🏗️ Tech Stack

### Frontend

- React.js
- Vite
- Fetch API
- Tailwind CSS

### Backend

- Node.js + TypeScript
- Express.js
- Prisma ORM
- SQLite (local)
- LLM API (OpenRouter)

---

## 📂 Repository Structure

```
ai-chatbot/
├── backend/
│ ├── prisma/
│ │ └── schema.prisma
│ ├── src/
│ │ ├── server.ts
│ │ ├── app.ts
│ │ ├── routes/
│ │ ├── controllers/
│ │ ├── services/
│ │ ├── repositories/
│ │ └── prisma.ts
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── api/
│ │ └── utils/
│ └── package.json
└── README.md
```

---

## 🚀 Running the Project Locally

### .env Setup (backend)

```bash
DATABASE_URL="file:./dev.db"
OPENROUTER_API_KEY=<Openroute Api Key>
# LLM Config
LLM_MODEL=<LLM_MODEL>
# Currently Used mistralai/mistral-7b-instruct:free
```

### Backend Setup

```bash
cd backend
npm install
```

### Database Setup

```bash
npx prisma generate
npx prisma db push
```

### Start Backend

```bash
npm run dev
```

### Backend runs at

```bash
http://localhost:3000
```

### Deployment Notes
The backend is deployed on Render’s free tier.
Due to free-tier limitations, the service may cold-start after periods of inactivity,
causing the first request to take longer than usual.

### .env Setup (frontend)

```bash
VITE_API_BASE_URL=http://localhost:3000

```

### Frontend Setup

```bash
cd frontend
npm install
```

### Start Frontend

```bash
npm run dev
```

### Frontend runs at

```bash
http://localhost:5173
```

🔄 Core User Flow

- User opens chat UI
- Types a message
- Frontend validates input (non-empty, character limit)
- Backend:
  - Creates or resumes a session
  - Persists user message
  - Sends conversation context to LLM
  - Saves AI response
- Frontend displays AI reply
- Session ID is reused to load history on refresh

## 📡 API Overview

### POST `/chat/message`

**Request**

```json
{
  "message": "What is your return policy?",
  "sessionId": "optional-session-id"
}
```

**Response**
```json
{
"reply": "Our return policy allows returns within 30 days.",
"sessionId": "session-id"
}

```

## 🧠 Backend Architecture

- **Routes** – HTTP endpoints
- **Controllers** – Request/response handling
- **Services** – Business logic
- **Repositories** – Database access via Prisma
- **LLM Service** – Encapsulates all AI logic

This structure allows:

- Adding new channels (WhatsApp, Instagram)
- Swapping LLM providers
- Adding tools/function calling in the future

---

## 🤖 LLM Integration

- Provider: OpenRouter
- Prompt includes:
  - System instructions (“You are a helpful support agent…”)
  - Recent conversation history
- Max message length enforced to control cost
- All LLM errors are caught and returned as friendly messages

---

## 🛡️ Robustness & Validation

- Empty messages are rejected
- Character limit enforced on frontend and backend
- Disabled send button during loading
- Graceful handling of:
  - LLM failures
  - Network errors
  - Invalid input
- No hard-coded secrets

---

## 🎨 UX Decisions

- Auto-scroll to latest message
- Clear distinction between user and AI messages
- Character counter with visual warning near limit
- Disabled send button when input is invalid
- Friendly error messages displayed in chat
