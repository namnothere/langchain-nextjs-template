"use client";

import { ChatWindow } from "@/components/ChatWindow";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const template = `Given an input question, first create a syntactically correct {dialect} query to run while exclude null values, then look at the results of the query and return the answer.
Use the following format:  
  
Question: "Question here"
SQLQuery: "SQL Query to run"
SQLResult: "Result of the SQLQuery"
Answer: "Final answer here"
  
Only use the following tables:  
  
{table_info}

If the result only has one record, include the link in the response.

Question: {input}`;


export default function AgentsPage() {
  const [prompt, setPrompt] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const endpoint = "api/chat/sql_query";

  function handleInputChange(e: any) {
    setPrompt(e.target.value);
  }

  async function getPrompt() {
    const response = await fetch(endpoint, {
      method: "GET",
    });
    const json = await response.json();
      if (response.status === 200) {
        setCurrentPrompt(json.prompt);
        setPrompt("");
      } else {
        if (json.error) {
          toast(json.error, {
            theme: "dark"
          });
          throw new Error(json.error);
        }
      }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getPrompt();
    };
    fetchData().catch((e) => {
      console.error("error while fetch data ", e);
    })
  }, []);

  async function updatePrompt(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        "prompt": prompt
      })
    });

    const json = await response.json();
      if (response.status === 200) {
        setCurrentPrompt(prompt);
        setPrompt("");
      } else {
        if (json.error) {
          toast(json.error, {
            theme: "dark"
          });
          throw new Error(json.error);
        }
      }
  }

  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        ▲ Next.js + LangChain.js Natural Language to SQL 🦜🔗
      </h1>
      <ul>
        <li className="text-l">
          🧱
          <span className="ml-2">
            This template showcases how to output structured responses with a{" "}
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>{" "}
            chain and the Vercel{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>{" "}
            in a{" "}
            <a href="https://nextjs.org/" target="_blank">
              Next.js
            </a>{" "}
            project.
          </span>
        </li>
      </ul>
      <ul>
        {currentPrompt}
      </ul>
      <form onSubmit={updatePrompt}>
      <div className="flex w-full mt-4">
        <input
              className="grow mr-8 p-4 rounded"
              value={prompt}
              placeholder="Want to update the prompt?"
              onChange={handleInputChange}
        />
        <button type="submit" className="shrink-0 px-8 py-4 bg-sky-600 rounded w-28">
            <span>Update</span>
          </button>
      </div>
      </form>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat/sql_query"
      emptyStateComponent={InfoCard}
      placeholder={`Ask question about our database!`}
      emoji="🧱"
      titleText="Structured Output"
      showIntermediateStepsToggle={true}
    ></ChatWindow>
  );
}
