import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = () => {
    if (message !== "" && username !== "") {
      const messageData = {
        username,
        message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <div
        style={{
          width: "400px",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Real-Time Chat</h2>

        <input
          type="text"
          placeholder="Your Name..."
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
          }}
        />

        <div
          style={{
            height: "300px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "10px",
            overflowY: "scroll",
            marginBottom: "10px",
          }}
        >
          {messageList.map((msg, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <strong>{msg.username}</strong>{" "}
              <span style={{ fontSize: "12px", color: "gray" }}>
                {msg.time}
              </span>
              <div>{msg.message}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex" }}>
          <input
            type="text"
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "8px 15px",
              marginLeft: "5px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
