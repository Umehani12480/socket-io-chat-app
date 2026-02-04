import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:4000", {
  transports: ["websocket"],
});


function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const joinChat = () => {
    if (username.trim()) {
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", {
        user: username,
        text: message,
      });
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  // 🔹 USERNAME SCREEN
  if (!joined) {
    return (
      <div className="app">
        <div className="join-box">
          <h2>💬 Join Chat</h2>
          <input
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={joinChat}>Join</button>
        </div>
      </div>
    );
  }

  // 🔹 CHAT SCREEN
  return (
    <div className="app">
      <header className="header">
        💬 Socket.IO Chat
        <p>Logged in as <b>{username}</b></p>
      </header>

      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.user === username ? "me" : "other"
              }`}
            >
              <strong>{msg.user}</strong>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>

        <div className="input-box">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
