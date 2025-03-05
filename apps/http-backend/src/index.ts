import express from "express";
import { unifiedQueryChain } from "@repo/agent";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

app.post("/chain/generate", async (req, res) => {
  try {
    const body = req.body;
    const question = body.question;
    const response = await unifiedQueryChain(question);
    res.json({ message: response.finalresponse });
  } catch (error) {
    res.status(500).json({message: "Please ask relevant questions to your database"});
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
