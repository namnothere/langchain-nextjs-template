'use client';

import { ChatWindow } from "@/components/ChatWindow";
import { ChangeEventHandler, useState } from "react";
export default function AgentsPage() {

  const [prompt, setPrompt] = useState("");

  function handleInputChange(e: any) {
    setPrompt(e.target.value);
  }

  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        ▲ Next.js + LangChain.js Natural Language to 🦜🔗
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
      <input
            className="grow mr-8 p-4 rounded"
            value={prompt}
            onChange={handleInputChange}
      />
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
