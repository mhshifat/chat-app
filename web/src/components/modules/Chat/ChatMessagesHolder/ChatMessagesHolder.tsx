import styles from "./ChatMessagesHolder.module.css";
import ChatMessagesHolderHeader from "./ChatMessagesHolderHeader";
import ChatMessagesHolderInput from "./ChatMessagesHolderInput";
import ChatMessagesHolderContent from "./ChatMessagesHolderContent";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";
import { useEffect, useMemo } from "react";

interface ChatMessagesHolderProps {}

export default function ChatMessagesHolder({}:ChatMessagesHolderProps) {
  const { id } = useParams();
  const { conversations } = useSelector((state: AppState) => state.conversationSlice);
  const { user } = useSelector((state: AppState) => state.authSlice);

  const currentConversation = useMemo(() => {
    return conversations.find(c => String(c.id) === String(id));
  }, [id, conversations]);

  if (currentConversation?.banned_users?.find(bu => String(bu.id) === user?.id) 
    || !currentConversation?.users?.find(u => String(u.id) === String(user?.id)) 
    || !currentConversation
  ) return <Navigate to="/dashboard" />;
  return (
    <div className={styles.chatMessagesHolder}>
      <ChatMessagesHolderHeader />
      <ChatMessagesHolderContent />
      <ChatMessagesHolderInput />
    </div>
  )
}