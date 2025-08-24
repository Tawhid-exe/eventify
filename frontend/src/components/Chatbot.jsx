// src/components/Chatbot.jsx
import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me about events 🎉" },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    const input = e.target.elements.msg.value.trim();
    if (!input) return;
    setMessages((m) => [
      ...m,
      { from: "user", text: input },
      { from: "bot", text: "Check the Events page for info!" },
    ]);
    e.target.reset();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-lg w-64 h-80 flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="bg-blue-600 text-white p-2 rounded-t flex justify-between items-center">
            <span>🤖 EventBot</span>
            <button onClick={() => setOpen(false)} className="text-white">✖</button>
          </div>
          <div className="flex-1 p-2 overflow-y-auto text-sm space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.from === "bot"
                    ? "text-blue-600 dark:text-blue-300"
                    : "text-right text-gray-800 dark:text-gray-200"
                }
              >
                {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex border-t border-gray-200 dark:border-gray-700">
            <input
              name="msg"
              className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-800 outline-none"
              placeholder="Type..."
            />
            <button className="px-3 text-blue-600 dark:text-blue-300">➤</button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg"
          title="Open EventBot"
        >
          💬
        </button>
      )}
    </div>
  );
}
