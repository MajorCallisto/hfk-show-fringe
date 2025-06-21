'use client';

import { useEffect, useRef, useState } from "react";

export default function ControlPage() {
  const socketRef = useRef<WebSocket | null>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000/ws');
    socketRef.current = socket;

    socket.onopen = () => console.log('WebSocket connected');
    socket.onclose = () => console.log('WebSocket disconnected');
    socket.onerror = (err) => console.error('WebSocket error', err);

    return () => {
      socket.close();
    };
  }, []);

  const sendGyro = (gx: number, gy: number, gz: number) => {
    const message = JSON.stringify({ gx, gy, gz });
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  useEffect(() => {
    sendGyro(x, y, z);
  }, [x, y, z]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Orientation Control</h2>

      <label>
        X (gx): {x}
        <input
          type="range"
          min={-180}
          max={180}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </label>

      <label>
        Y (gy): {y}
        <input
          type="range"
          min={-180}
          max={180}
          value={y}
          onChange={(e) => setY(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </label>

      <label>
        Z (gz): {z}
        <input
          type="range"
          min={-180}
          max={180}
          value={z}
          onChange={(e) => setZ(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </label>
    </div>
  );
}
