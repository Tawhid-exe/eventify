import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you with events today? 🎉" },
  ]);
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const input = e.target.elements.msg.value.trim();
    if (!input || isLoading) return;

    // Add user message to state
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    e.target.reset();

    try {
      // Send message to your new backend endpoint
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botMessage = { from: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Failed to fetch bot reply:", error);
      const errorMessage = { from: "bot", text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-lg w-72 h-96 flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="bg-blue-600 text-white p-2 rounded-t flex justify-between items-center">
            <span className="font-bold">🤖 EventBot</span>
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">✖</button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "bot" ? "justify-start" : "justify-end"}`}>
                <div className={`rounded-lg px-3 py-2 max-w-xs ${
                  m.from === "bot"
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    : "bg-blue-500 text-white"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="rounded-lg px-3 py-2 max-w-xs bg-gray-200 dark:bg-gray-700 text-gray-500">
                   <span>●</span><span>●</span><span>●</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="flex border-t border-gray-200 dark:border-gray-700">
            <input
              name="msg"
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 outline-none rounded-b-lg"
              placeholder="Ask about events..."
              autoComplete="off"
              disabled={isLoading}
            />
            <button type="submit" className="px-4 text-blue-600 dark:text-blue-300 font-bold" disabled={isLoading}>➤</button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg hover:bg-blue-700 transition"
          title="Open EventBot"
        >
          💬
        </button>
      )}
    </div>
  );
}
