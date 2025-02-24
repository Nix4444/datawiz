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

app.post("/", async (req, res) => {
  try {
    const body = req.body;
    const question = body.question;
    const response = await unifiedQueryChain(question);
    res.json({ response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Please ask relevant questions." });
  }
});

let database_name:string [] =[]
app.post("/database", async (req, res) => {
  try {
    const body = req.body;
    database_name.push(body.database)
    console.log(database_name)
    res.send("Received!");
  } catch (error) {
    console.log(error);
  }
});

app.get("/databaseinfo", async (req, res) => {
  try {
    res.json({database:database_name});
  } catch (error) {
    console.error("Error in /databaseinfo:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
