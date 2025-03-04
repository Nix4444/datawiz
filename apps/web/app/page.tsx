"use client"
import {useState } from "react"; 
import {ChatInput} from "./ui/ChatInput"
import { chatBubbleType } from "@repo/common/types";
export default function Home() {
  const [messages, setMessages] = useState<chatBubbleType[]>([
  ]);
  return (
    <div className="bg-[#212121] text-white min-h-screen min-w-screen flex flex-col overflow-hidden">
      <div className="flex justify-center ml-82 h-152">
      <div className="flex flex-col flex-grow space-y-4 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thumb-rounded-md" style={{ scrollbarGutter: 'stable' }}>
      
      <div>
      {messages.map((msg, idx) =>
        msg.type === "question" ? (
          <div key={idx} className="flex justify-end mr-82 mt-4">
            <div className="bg-[#303030] max-w-xs p-3 rounded-xl text-white break-words">
              {msg.text}
            </div>
          </div>
        ) : (
          <div key={idx} className="flex justify-start mt-4">
            <div className="bg-[#303030] max-w-xs p-3 rounded-xl text-white break-words">
              {msg.text}
            </div>
          </div>
        )
      )}
    </div>
        </div>
      </div>
      <div className="flex justify-center items-end flex-grow">
        <ChatInput messages={messages} setMessages={setMessages}/>
      </div>
    </div>
  );
}

