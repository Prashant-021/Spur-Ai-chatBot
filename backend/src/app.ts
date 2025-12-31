import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

export default app;
