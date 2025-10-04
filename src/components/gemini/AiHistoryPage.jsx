import React, { useEffect, useState } from "react";
import API from "../../api/geminiApi";

export default function AiHistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/history");
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI History</h1>
      <ul>
        {history.map((item) => (
          <li key={item._id} className="border p-2 mb-2 rounded">
            <p><b>Prompt:</b> {item.prompt}</p>
            <p><b>Response:</b> {item.response}</p>
            <p className="text-gray-400 text-sm">{new Date(item.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
