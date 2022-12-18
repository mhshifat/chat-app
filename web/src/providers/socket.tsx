import React, { useState, useEffect, createContext, PropsWithChildren, useContext } from 'react';
import io, { Socket } from "socket.io-client";

const { REACT_APP_SOCKET_URI = "localhost" } = process.env;
const socket = io(`ws://${REACT_APP_SOCKET_URI}:8000`, {
  withCredentials: true,
});

const SocketContext = createContext<Socket | null>(null)
export default function SocketProvider({ children }: PropsWithChildren) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  console.log(`Sopcket ${isConnected ? "connected" : "disconnected"}`);
  
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
export const useSocket = () => useContext(SocketContext);