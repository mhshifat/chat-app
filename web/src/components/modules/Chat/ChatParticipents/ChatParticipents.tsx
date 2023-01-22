import { useSelector } from "react-redux";
import styles from "./ChatParticipents.module.css";
import { FaUsers } from "react-icons/fa";
import { AppState } from "../../../../store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../../../providers/socket";

interface ChatParticipentsProps {}

export default function ChatParticipents({}: ChatParticipentsProps) {
  const { id } = useParams();
  const socket = useSocket();
  const { conversations } = useSelector((state: AppState) => state.conversationSlice);
  const functionsRef = useRef({
    socket,
  });
  const [onlineUsersId, setOnlineUsersId] = useState<string[]>([]);
  const currentConversation = useMemo(() => {
    return conversations.find(c => String(c.id) === String(id));
  }, [id, conversations]);

  useEffect(() => {
    if (!id) return;
    const socketRef = functionsRef.current.socket;
    const timer = setInterval(() => {
      socketRef?.emit("getOnlineUsers", socketRef.id);
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, [id]);

  useEffect(() => {
    const socketRef = functionsRef.current.socket;
    const handleGetOnlineUsers = (data: any) => {
      setOnlineUsersId(data);
    }
    socketRef?.on("getOnlineUsers", handleGetOnlineUsers);

    return () => {
      socketRef?.off("getOnlineUsers", handleGetOnlineUsers);
    }
  }, [id]);
  
  return (
    <aside className={styles.chatParticipents}>
      <header className={styles.chatParticipentsHeader}>
        <FaUsers />
        <p>Participents</p>
      </header>
      <div className={styles.chatParticipentsBody}>
        <ul className={styles.chatParticipentsList}>
          {currentConversation?.users?.map(u => (
            <li key={u.id} className={styles.chatParticipentsItem}>
              <span className={`${styles.chatParticipentsItem__img} ${onlineUsersId.includes(String(u.id)) ? styles.chatParticipentsItemOnline : ""}`}>
                <img src="https://picsum.photos/200" alt="" />
              </span>
              <span className={styles.chatParticipentsItem__title}>{u.first_name} {u.last_name}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}