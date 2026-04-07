import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default function CommentBox() {
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/comments", (msg) => {
        const newComment = JSON.parse(msg.body);
        setComments((prev) => [...prev, newComment]);
      });
    });

    setClient(stompClient);
  }, []);

  const sendMessage = () => {
    if (client && message) {
      client.send("/app/comment", {}, JSON.stringify({
        user: "User1",
        message: message
      }));
      setMessage("");
    }
  };

  return (
    <div>
      <h3>Comments</h3>
      <div>
        {comments.map((c, i) => (
          <p key={i}><b>{c.user}:</b> {c.message}</p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write comment..."
      />

      <button onClick={sendMessage}>Send</button>
      <button onClick={() => setComments([])}>Clear Comments</button>
    </div>
  );
};
