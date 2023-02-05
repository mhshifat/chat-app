import styles from "./PrivateGroupList.module.css";
import PlaceholderImage from "../../../../assets/images/placeholder.png";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";
import { ConversationDocument, ConversationState } from "../../../../store/conversationSlice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatDistance } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../../providers/socket";
import { UserDocument } from "../../../../store/authSlice";

interface PrivateGroupListProps {
  type?: ConversationState["type"];
}

export default function PrivateGroupList({ type = "private" }: PrivateGroupListProps) {
  const navigate = useNavigate();
  const { conversations } = useSelector((state: AppState) => state.conversationSlice);
  const { user } = useSelector((state: AppState) => state.authSlice);
  const filterConversationsAsType = useMemo(() => {
    return conversations.filter((c) => c.type === type)
  }, [type, conversations]);

  const conversationTitle = useCallback((conversation: ConversationDocument) => {
    return conversation.type === "private" 
      ? `${conversation.users?.find(u => u.id !== user?.id)?.first_name} ${conversation.users?.find(u => u.id !== user?.id)?.last_name}`
      : (conversation?.name || "");
  }, [user?.id]);

  return (
    <ul className={styles.privateGroupList}>
      {filterConversationsAsType.filter(u => !u.banned_users?.find(bu => String(bu.id) === String(user?.id))).map((con) => (
        <li
          key={con.id}
          // className={styles.privateGroupList__new}
          onClick={() => navigate(`/conversations/${con.id}`)}
        >
          <img src={PlaceholderImage} alt="" />
          <ConversationContent
            title={conversationTitle(con)}
            con={con}
          />
        </li>
      ))}
    </ul>
  )
}

interface ConversationContentProps {
  title: string;
  con: ConversationDocument;
}

function ConversationContent({ title, con }: ConversationContentProps) {
  const socket = useSocket();
  const functionsRef = useRef({
    socket
  });
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const socketRef = functionsRef.current.socket;
    const handleUserTyping = ({ conversation }: { conversation: ConversationDocument }) => {
      if (String(conversation.id) !== String(con?.id)) return;
      setIsTyping(true);
    }
    socketRef?.on("isTyping", handleUserTyping);
    const handleUserTypingStoped = ({ conversation }: { conversation: ConversationDocument }) => {
      if (String(conversation.id) !== String(con?.id)) return;
      setIsTyping(false);
    }
    socketRef?.on("stopedTyping", handleUserTypingStoped);
    
    return () => {
      socketRef?.off("isTyping", handleUserTyping);
      socketRef?.off("stopedTyping", handleUserTypingStoped);
    }
  }, [con?.id])

  return (
    <span>
      <h3>{title}</h3>
      {isTyping ? (
        <p>...</p>
      ) : (
        <p>{con.lastMessageSent?.message} <small>{formatDistance(new Date(con.lastMessageSent?.created_at as unknown as Date), new Date(), { addSuffix: true })}</small></p>
      )}
    </span>
  )
}