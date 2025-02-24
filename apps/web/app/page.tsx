"use client"
import React,{useState,useEffect} from "react"
import Sidebar from "./UI_library/sidebar"
import Modal from "./UI_library/modal"
import Chat from "./UI_library/chat"

export default function Home(){
return(
  <div className="flex">
  <Chat/>
  <Sidebar/>
  </div>
)
}