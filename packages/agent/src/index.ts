import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const openaiApiKey = process.env.OPENAI_API_KEY || "";

export async function unifiedQueryChain(question: string) {
    const datasource = new DataSource({
        type: "postgres",
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: true,
    });

    const db = await SqlDatabase.fromDataSourceParams({ appDataSource: datasource });

    const queryPrompt = PromptTemplate.fromTemplate(`Based on the provided SQL table schema below, write a SQL query that would answer the user's question.
    IMPORTANT:
    1. The SQL query **must be strictly read-only**. You are ONLY permitted to use SELECT statements (and safe clauses like WITH). **Do not include any DML commands** such as INSERT, UPDATE, DELETE, MERGE, or any other commands that modify data.
    2. If you determine that answering the question would require data modifications, output "false"
    3. The output must contain **only the SQL query code**. Do not include any additional explanation or commentary.
    4. Return the SQL query without any markdown formatting or code fences, do not add any new line characters.
    5. If the query is related to listing the contents or rows, **strictly limit the results by 3**.
    ------------
    SCHEMA: {schema}
    ------------
    QUESTION: {question}
    ------------`);

    const finalResponsePrompt = PromptTemplate.fromTemplate(`Based on the table schema below, question, SQL query, and SQL response, write a natural language response:
    ------------
    QUESTION: {question}
    ------------
    SQL QUERY: {query}
    ------------
    SQL RESPONSE: {response}
    ------------
    NATURAL LANGUAGE RESPONSE:`);

    const retryResponsePrompt = PromptTemplate.fromTemplate(`Based on the hint provided, modify the SQL query on which an error was encountered and return the corrected query:
     IMPORTANT:
     1. The output must contain **only the SQL query code**. Do not include any additional explanation or commentary.
     2. Return the SQL query without any markdown formatting or code fences, do not add any new line characters.
     -------------
     HINT: {hint}
     -------------
     SQL QUERY: {query}
     -------------`);

    const retryQuery = async (hint: string, query: string): Promise<string> => {
        const retryChain = RunnableSequence.from([
            {
                hint: () => hint,
                query: () => query
            },
            retryResponsePrompt,
            new ChatOpenAI({ modelName: "gpt-4o-mini-2024-07-18", temperature: 0, verbose: false }),
            new StringOutputParser(),
        ]);

        return await retryChain.invoke({});
    };

    const unifiedChain = RunnableSequence.from([
        {
            schema: async () => db.getTableInfo(),
            question: () => question,
        },
        queryPrompt,
        new ChatOpenAI({ temperature: 0, verbose: true, modelName: "gpt-4o-mini-2024-07-18" }),
        new StringOutputParser(),
        {
            transformOutput: (output) => ({ query: output }),
        },
        {
            executeQuery: async (context) => {
                if (context.query === "false") {
                    throw new Error("Query generation failed. No valid query.");
                }
                let generatedQuery = context.transformOutput.query;
                const queryArray = generatedQuery.split(';');
                let queryResponse = "";

                for (let i = 0; i < queryArray.length; i++) {
                    let attempt = 0;
                    while (attempt < 3) { 
                        try {
                            queryResponse += await db.run(queryArray[i]) + "\n";
                            break; 
                        } catch (error: any) {
                            if (attempt < 2 && error.hint) {
                                console.log(`Retrying query due to error: ${error.hint}`);
                                queryArray[i] = await retryQuery(error.hint, queryArray[i]);
                            } else {
                                console.log("Failed after retries:", error);
                                break;
                            }
                        }
                        attempt++;
                    }
                }

                return { ...context, queryResponse };
            },
        },
        {
            query: (context) => context.executeQuery.transformOutput.query,
            response: (context) => context.executeQuery.queryResponse,
            question: () => question
        },
        finalResponsePrompt,
        new ChatOpenAI({ modelName: "gpt-4o-mini-2024-07-18", temperature: 0, verbose: false }),
        new StringOutputParser(),
    ]);

    return await unifiedChain.invoke({ question });
}
