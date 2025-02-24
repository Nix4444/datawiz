"use client"
import React, { useState } from "react"
import {useGet} from "../hooks/useGet"
import Button from "./button"


export default function Chat() {
  const [value, setValue] = useState(false)
  const [question, setQuestion] = useState("")
  const [question_array,setQuestionArray] = useState<string[]>([]) 
  const [answer_array,setAnswerArray] = useState<string[]>([]) 
 

  const print_div = (question:any,answer:any) =>{
        return(<div>
          {question}
          <div>
          {answer}
          </div>
        </div>)
  }

  const HandleClick = async () => {
    const res = await useGet(question);  
    const answer = res.data.response;
    
    setQuestionArray(prev => [...prev, question]);
    setAnswerArray(prev => [...prev, answer]);
  };
 
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
   };

  

  return (
    <div>
    <div className = "fixed right-0 bottom-0 w-4/5">
    <div className = " relative w-200 h-160 rounded-lg left-20 bottom-35 overflow-auto"> 
     
    {question_array.map((q, i) => (
     <div key={i}>
     <div className=" m-2 w-175 h-20 bg-blue-500 rounded-lg" > 
      {q}
      </div> 
    <div className="m-2">{answer_array[i]}</div>
      </div>
      ))}
      </div>
      <div>
      <input
        placeholder="enter the question..."
        onChange={handleChange}
        className = "absolute w-200 h-20 border-2 rounded-lg left-20 bottom-15"
      />
      <div className = "absolute left-190 bottom-20">
     <Button variant="small" onClick={HandleClick} text="Submit" />
     </div>
     </div>
   </div>
    </div>
  )
}


