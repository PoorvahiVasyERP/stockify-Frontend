import React, { useState, useEffect, useRef } from "react";
import API_URL from "../../services/ApiService";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function CommentBox({ moduleType, moduleId }) {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);

  const [users, setUsers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionQuery, setSuggestionQuery] = useState("");
  const currentUser = localStorage.getItem("username") || "User";

  // Load comments
  useEffect(() => {
    API_URL.get(`/api/comments/${moduleType}/${moduleId}`)
      .then((res) => setComments(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
  }, [moduleType, moduleId]);

  // Load users for mentions
  useEffect(() => {
    API_URL.get("/api/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
  }, []);

  // WebSocket connection
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        client.subscribe(`/topic/comments/${moduleType}/${moduleId}`, (msg) => {
          const newComment = JSON.parse(msg.body);
          setComments((prev) => [...prev, newComment]);
        });
      },
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, [moduleType, moduleId]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setMessage(val);

    // Check if user is typing an @mention
    const words = val.split(/[\s\n]+/);
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith("@")) {
      setSuggestionQuery(lastWord.slice(1).toLowerCase());
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleMentionSelect = (username) => {
    // Replace the last typed (incomplete) mention with the fully selected one
    const lines = message.split("\n");
    const lastLine = lines.pop() || "";
    const words = lastLine.split(" ");
    words.pop(); // remove incomplete mention
    const newText =
      words.join(" ") + (words.length > 0 ? " " : "") + "@" + username + " ";
    lines.push(newText);
    setMessage(lines.join("\n"));
    setShowSuggestions(false);
  };

  const sendMessage = () => {
    if (stompClient && stompClient.connected && message.trim()) {
      stompClient.publish({
        destination: "/app/comment",
        body: JSON.stringify({
          content: message.trim(),
          moduleType,
          moduleId,
          username: currentUser,
        }),
      });
      setMessage("");
      setShowSuggestions(false);
    }
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter((u) => u.toLowerCase().startsWith(suggestionQuery))
    : [];

  const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderCommentWithHighlights = (content) => {
    if (!content) return null;
    const parts = content.split(/(@\w+)/g);
    return parts.map((part, i) =>
      part.startsWith("@") ? (
        <span key={i} style={{ color: "#e94560", fontWeight: "bold" }}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxHeight: 300,
          overflowY: "auto",
          overflowX: "hidden",
          border: "1px solid #ccc",
          padding: 10,
          borderRadius: 5,
          marginBottom: 15,
          background: "#f9f9f9",
          wordBreak: "break-word",
        }}
      >
        {comments.length > 0
          ? comments.map((c, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 10,
                  borderBottom:
                    i < comments.length - 1 ? "1px solid #eaeaea" : "none",
                  paddingBottom: i < comments.length - 1 ? 5 : 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.85rem",
                    color: "#666",
                    marginBottom: 3,
                  }}
                >
                  <b>{c.username}</b>
                  <span>{formatTime(c.timestamp)}</span>
                </div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {renderCommentWithHighlights(c.content)}
                </div>
              </div>
            ))
          : "No comments yet."}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          <textarea
            placeholder="Write a comment... (Type @ to mention)"
            value={message}
            onChange={handleTextChange}
            style={{
              width: "100%",
              minHeight: "70px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />

          <button
            className="btn-submit"
            onClick={sendMessage}
            disabled={!message.trim()}
            style={{
              alignSelf: "flex-end",
              marginRight: "95px",
              borderRadius: "6px",
              background: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
              opacity: message.trim() ? 1 : 0.6,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
