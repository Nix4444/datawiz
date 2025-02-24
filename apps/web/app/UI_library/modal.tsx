"use client";
import React, { useState } from "react";
import axios from "axios";
import Button from "./button";

interface ModalProps {
  isHidden: boolean;
  setIsHidden: (value: boolean) => void;
}

export default function Modal({ isHidden, setIsHidden }: ModalProps) {
  const [databaseName, setDatabaseName] = useState("");
  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleClick = async () => {

    const body = {
      database: databaseName,
      host:host,
      username:username,
      password:password,
      name:name,
    };
    
    const url = "http://localhost:3001/database";
    await axios.post(url, body,{
      headers: {
        "Content-Type": "application/json",
      },
    });

    setIsHidden(false);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-500 ${isHidden ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="w-[400px] bg-black rounded-xl p-4 text-white">
        <h3 className="text-xl font-bold mb-2">Database Name:</h3>
        <input
          className="w-full p-2 border-2 border-white rounded-lg mb-2 text-white"
          onChange={(event) => setDatabaseName(event.target.value)}
        />

        <h3 className="text-xl font-bold mb-2">Host:</h3>
        <input
          className="w-full p-2 border-2 border-white rounded-lg mb-2 text-white"
          onChange={(event) => setHost(event.target.value)}
        />

        <h3 className="text-xl font-bold mb-2">Username:</h3>
        <input
          className="w-full p-2 border-2 border-white rounded-lg mb-2 text-white"
          onChange={(event) => setUsername(event.target.value)}
        />

        <h3 className="text-xl font-bold mb-2">Password:</h3>
        <input
          className="w-full p-2 border-2 border-white rounded-lg mb-2 text-white"
          onChange={(event) => setPassword(event.target.value)}
        />

        <h3 className="text-xl font-bold mb-2">Name:</h3>
        <input
          className="w-full p-2 border-2 border-white rounded-lg mb-4 text-white"
          onChange={(event) => setName(event.target.value)}
        />

        <div className="flex justify-between">
          <Button variant="small" onClick={() => setIsHidden(false)} text="Close" />
          <Button variant="small" onClick={handleClick} text="Submit" />
        </div>
      </div>
    </div>
  );
}
