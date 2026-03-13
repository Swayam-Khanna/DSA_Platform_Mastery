'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
// Strip /api from the end if it exists since Socket.io connects to the root domain typically
const SOCKET_URL = API_BASE_URL.replace(/\/api$/, '');

interface SocketContextData {
  socket: Socket | null;
  activeUsers: number;
}

const SocketContext = createContext<SocketContextData>({
  socket: null,
  activeUsers: 15000,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState(15000);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
    });

    setSocket(socketInstance);

    socketInstance.on('activeUsers', (count: number) => {
      setActiveUsers(count);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
