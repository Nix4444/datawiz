"use client";
import { useState, ReactElement } from "react";
import SendArrow from "@repo/icons/SendArrow";
import { chatBubbleType } from "@repo/common/types";
import axios from "axios";


interface SendButtonProps {
  icon: ReactElement;
  onClick: () => void;
  inputText: string;
  loading:boolean
}
interface InputProps {
  messages: chatBubbleType[];
  setMessages: React.Dispatch<React.SetStateAction<chatBubbleType[]>>;
}

function SendButton({ icon, onClick, inputText,loading }: SendButtonProps) {
  const isEmpty = inputText.trim() === "";
  return (
    <button
      onClick={onClick}
      disabled={isEmpty || loading}
      className={`absolute right-3 top-3 ${
        isEmpty ? "bg-[#A0AEC0]" : "bg-white"
      } text-black rounded-full cursor-pointer p-2 transition-colors z-10`}
    >
      <div className="w-5 h-5">{icon}</div>
    </button>
  );
}

export function ChatInput(props: InputProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (inputText.trim() !== "" || !loading) {
      const questionText = inputText;
      const newQuestion: chatBubbleType = { type: "question", text: questionText,skeleton:false };
      const newAnswerSkeleton: chatBubbleType = { type: "answer", text: "", skeleton: true };
      props.setMessages((prev) => [...prev, newQuestion, newAnswerSkeleton]);
      setLoading(true);
      setInputText("");
      try {
        const res = await axios.post(`http://localhost:3001/chain/generate`, {
          question: questionText
        });
        props.setMessages((prev) =>
          prev.map((msg) =>
            msg.skeleton ? { ...msg, text: res.data.message, skeleton: false } : msg
          )
        );
      } catch (error) {
        console.error("Error sending request:", error);
        props.setMessages((prev) =>
          prev.map((msg) =>
            msg.skeleton ? { ...msg, text: "Error fetching answer", skeleton: false } : msg
          )
        );
      }
      setLoading(false);
    }
  };

  return (
    <div className="relative mb-20">
      <div className="relative">
        <textarea
          placeholder="Talk to your database..."
          className="w-200 border bg-[#303030] border-slate-300 px-6 py-4 rounded-xl focus:outline-none overflow-auto whitespace-normal pr-20 resize-none"
          style={{ lineHeight: "1.5" }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if(!loading && inputText !== ""){
                handleSend();
              }
              
            }
          }}
        />
        <div className="absolute right-3 top-3">
          <SendButton
            icon={<SendArrow />}
            onClick={handleSend}
            inputText={inputText}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
