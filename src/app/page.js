'use client'
import React, {useEffect, useState, useRef} from "react";
import { Socket } from "socket.io-client";

export default function Home() {


  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const socketRef = useRef(null);

  useEffect(()=>{

    const socket = new WebSocket("ws://localhost:8000/ws/chat/testroom/");
    socketRef.current = socket


    socket.onopen = () => console.log("websocket is connected");

    socket.onmessage=(event)=>{
      const data = JSON.parse(event.data)
      console.log("data: ", data);

      setMessages((prev)=>[prev, data.message]);
    };

    socket.onclose=()=> console.log("websocket disconnect");

    return () => socket.close();
    
    
  },[]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white p-4">
    <h1 className="text-2xl font-bold mb-4">🧠 WebSocket Chat Test</h1>

    {/* Message box */}
    <div className="w-full max-w-md h-64 overflow-y-auto bg-[#1e293b] border border-[#334155] rounded shadow p-3 mb-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className="text-sm text-gray-200 py-1 border-b border-[#334155]"
        >
          {msg}
        </div>
      ))}
    </div>

    {/* Input + Button */}
    <div className="flex w-full max-w-md gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
        className="flex-1 px-3 py-2 bg-[#1e293b] border border-[#334155] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        onClick={() => {
          if (socketRef.current && input.trim() !== "") {
            socketRef.current.send(JSON.stringify({ message: input }));
            setInput("");
          }
        }}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Send
      </button>
    </div>
  </div>
  );
}


