"use client";
import { useState, ReactElement } from "react";
import SendArrow from "@repo/icons/SendArrow";
import { chatBubbleType } from "@repo/common/types";
interface SendButtonProps {
  icon: ReactElement;
  onClick: () => void;
  inputText: string;
}
interface InputProps {
  messages: chatBubbleType[];
  setMessages: React.Dispatch<React.SetStateAction<chatBubbleType[]>>;
}

function SendButton({ icon, onClick, inputText }: SendButtonProps) {
  const isEmpty = inputText.trim() === "";
  return (
    <button
      onClick={onClick}
      disabled={isEmpty}
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


  const handleSend = () => {
    if (inputText.trim() !== "") {
      const newQuestion: chatBubbleType = { type: "question", text: inputText };
      props.setMessages((prev) => [...prev, newQuestion]);
      setInputText("");
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
            if (e.key === "Enter") {
              if (e.shiftKey) return;
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <div className="absolute right-3 top-3">
          <SendButton
            icon={<SendArrow />}
            onClick={handleSend}
            inputText={inputText}
          />
        </div>
      </div>
    </div>
  );
}
