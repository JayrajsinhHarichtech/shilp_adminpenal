import React, { useState } from "react";
import API from "../../api/geminiApi";

export default function GeminiChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await API.post("/chat", { prompt: input });
      const aiMessage = { role: "ai", text: res.data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "AI failed to respond" },
      ]);
    }

    setLoading(false);
    setInput("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 pt-3">
      <h1 className="text-2xl font-bold mb-4">Gemini AI Chat</h1>

      <div className="flex-1 overflow-y-auto border rounded p-4 mb-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-green-100 text-left"
            }`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          ></div>
        ))}
        {loading && <p className="text-gray-500">Thinking...</p>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Gemini..."
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
