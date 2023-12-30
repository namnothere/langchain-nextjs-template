import { DataSource } from "typeorm";
import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { NextRequest, NextResponse } from "next/server";
import { createSqlAgent, SqlToolkit } from 'langchain/agents/toolkits/sql';
import path from "path";
import fs from 'fs';
import { AgentExecutor } from "langchain/agents";
import { SqlDatabaseChain } from "langchain/chains/sql_db";
import { PromptTemplate } from "langchain/prompts";

const PROMPT_TEMPLATE = `Translate the following question/order to SQL and \
execute it. Return the result as natural language summarize. \
If the input does not make sense, stop the process.
`
const template = `Given an input question, first create a syntactically correct {dialect} query to run, then look at the results of the query and return the answer.  
Use the following format:  
  
Question: "Question here"  
SQLQuery: "SQL Query to run"  
SQLResult: "Result of the SQLQuery"  
Answer: "Final answer here"  
  
Only use the following tables:  
  
{table_info}  
  
If someone asks for the table foobar, they really mean the employee table.  
  
Question: {input}`;

// const filePath = path.join(__dirname, 'Chinook_Sqlite.sqlite');
const filePath = path.join(__dirname, 'real-estate.db');
fs.readFileSync(filePath);

const datasource = new DataSource({
    type: "sqlite",
    database: filePath,
});

var executor: AgentExecutor;
var dbChain: SqlDatabaseChain;
var initLoad = false;
async function init() {
    const db = await SqlDatabase.fromDataSourceParams({
        appDataSource: datasource,
    });
    const model = new OpenAI({ temperature: 0 });
    const toolkit = new SqlToolkit(db, model);
    const prompt = PromptTemplate.fromTemplate(template);

    dbChain = new SqlDatabaseChain({
        llm: model,
        database: db,
        sqlOutputKey: "sql",
        prompt: prompt,
    })
    executor = createSqlAgent(model, toolkit);
    initLoad = true;
}


export async function POST(req: NextRequest) {

    if (!initLoad) await init();

    const body = await req.json();
    const messages = body.messages ?? [];
    const currentMessageContent = messages[messages.length - 1].content;

    console.log(`Executing with input ${currentMessageContent}`);
    

    // const result = await executor.invoke({ input: currentMessageContent, prompt: PROMPT_TEMPLATE });
    // const result = await dbChain.call(currentMessageContent, {
        // recursionLimit: 3
    // });
    const result = await dbChain.call({ query: currentMessageContent }, {
        recursionLimit: 3
    });
    console.log(result);
    result.output = result.result;

    return NextResponse.json(
        { 
            output: result.output, 
            intermediate_steps: result.intermediateSteps ? result.intermediateSteps : null,
            sql: [result.sql]
        },
        { status: 200 },
      );
}