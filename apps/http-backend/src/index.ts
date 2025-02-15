import express from "express";
import { unifiedQueryChain } from "@repo/agent";
const app = express()
app.use(express.json());
app.post("/", async(req, res) => {
    try{
        const body = req.body;
        const question = body.question;
        const response = await unifiedQueryChain(question);
        res.json({ response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Please ask relevant questions." });
    }
});
app.listen(3001);