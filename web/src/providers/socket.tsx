import React, { useState, useEffect, createContext, PropsWithChildren, useContext } from 'react';
import io, { Socket } from "socket.io-client";

const { REACT_APP_SOCKET_URI = "localhost" } = process.env;
const socket = io(`ws://${REACT_APP_SOCKET_URI}:8000`, {
  withCredentials: true,
});

const SocketContext = createContext<Socket | null>(null)
export default function SocketProvider({ children }: PropsWithChildren) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  console.log(`Socket ${isConnected ? "connected" : "disconnected"} - ${socket.id}`);
  
  useEffect(() => {
    const socketConnect = () => {
      setIsConnected(true);
    }
    const socketDisconnect = () => {
      setIsConnected(false);
    }
    socket.on('connect', socketConnect);
    socket.on('disconnect', socketDisconnect);

    return () => {
      socket.off('connect', socketConnect);
      socket.off('disconnect', socketDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
export const useSocket = () => useContext(SocketContext);