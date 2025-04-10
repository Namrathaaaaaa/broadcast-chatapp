import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const socketRef = useRef<WebSocket | null>(null);
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);

  useEffect(() => {
    // connect to backend
    socketRef.current = new WebSocket('ws://localhost:8080');

    socketRef.current.onmessage = (event) => {
      setChatLog(prev => [...prev, `Received: ${event.data}`]);
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const handleJoin = () => {
    if (socketRef.current && roomId) {
      socketRef.current.send(JSON.stringify({
        type: 'join',
        payload: {
          roomId: roomId
        }
      }));
      setJoined(true);
    }
  };

  const handleSend = () => {
    if (socketRef.current && message) {
      socketRef.current.send(JSON.stringify({
        type: 'chat',
        payload: {
          message: message
        }
      }));
      setChatLog(prev => [...prev, `You: ${message}`]);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: 20 , color:'pink' }}>
      <h2>WebSocket Chat</h2>

      {!joined && (
        <div>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={handleJoin}>Join Room</button>
        </div>
      )}

      {joined && (
        <div>
          <p>Joined Room: {roomId}</p>
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
          </div>
          <div style={{ border: '1px solid black', padding: 10, height: 200, overflowY: 'scroll' }}>
            {chatLog.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
