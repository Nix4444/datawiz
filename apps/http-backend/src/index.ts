import express from "express";
const app = express()
import {openaiApiKey} from "@repo/agent/openaiApiKey";
console.log(openaiApiKey);
app.listen(3001);