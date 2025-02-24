"use client";
import React, { useState, useEffect } from "react";
import Button from "./button";
import Modal from "./modal";
import axios from "axios";

export default function Sidebar() {
  const [isHidden, setIsHidden] = useState(false);
  const [databaseInfo, setDatabaseInfo] = useState<string[]>([]);

  const handleClick = () => {
    setIsHidden(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:3001/databaseinfo";
        const res = await axios.get(url);
        const data = res.data.array || []; 
        console.log(data)
        setDatabaseInfo(data);
      } catch (error) {
        console.error("Error fetching database info:", error);
        setDatabaseInfo([]); 
      }
    };

    fetchData();
  }, [databaseInfo]); 

  return (
    <div className="w-1/5 h-screen bg-black p-4 flex flex-col space-y-4 overflow-auto">
      <div className="text-2xl text-white font-bold ml-15 mt-4">
        <h2>Datawiz.ai</h2>
      </div>
      <Button variant="large" onClick={handleClick} text="Add" />
      {isHidden && <Modal isHidden={isHidden} setIsHidden={setIsHidden} />}
      <div>
        {databaseInfo.length > 0 ? (
          databaseInfo.map((q, i) => (
            <div key={i}>
              <br></br>
              <Button variant="large" onClick={handleClick} text={q} />
              <br></br>
            </div>
          ))
        ) : (
          <p className="text-white">No data available</p> 
        )}
      </div>
    </div>
  );
}
