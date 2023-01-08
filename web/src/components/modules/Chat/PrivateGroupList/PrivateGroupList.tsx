import styles from "./PrivateGroupList.module.css";
import PlaceholderImage from "../../../../assets/images/placeholder.png";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";
import { ConversationDocument, ConversationState } from "../../../../store/conversationSlice";
import { useCallback, useMemo } from "react";
import { formatDistance } from 'date-fns';
import { useNavigate } from "react-router-dom";

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
      {filterConversationsAsType.map((con) => (
        <li
          key={con.id}
          // className={styles.privateGroupList__new}
          onClick={() => navigate(`/conversations/${con.id}`)}
        >
          <img src={PlaceholderImage} alt="" />
          <span>
            <h3>{conversationTitle(con)}</h3>
            <p>{con.lastMessageSent?.message} <small>{formatDistance(new Date(con.lastMessageSent?.created_at as unknown as Date), new Date(), { addSuffix: true })}</small></p>
          </span>
        </li>
      ))}
    </ul>
  )
}