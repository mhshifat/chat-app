import styles from "./ChatMessagesHolder.module.css";
import { TbPhoneCall } from "react-icons/tb";
import { BsCameraVideo } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../../store";
import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { setConversationType } from "../../../../store/conversationSlice";

interface ChatMessagesHolderHeaderProps {}

export default function ChatMessagesHolderHeader({}: ChatMessagesHolderHeaderProps) {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { conversations } = useSelector((state: AppState) => state.conversationSlice);
  const { user } = useSelector((state: AppState) => state.authSlice);

  const currentConversation = useMemo(() => {
    return conversations.find(c => String(c.id) === String(id));
  }, [id, conversations]);
  const getRecipient = useMemo(() => {
    return currentConversation?.users?.find(u => String(u.id) !== String(user?.id));
  }, [currentConversation, user]);

  useEffect(() => {
    dispatch(setConversationType(currentConversation?.type || "private"));
  }, [dispatch, currentConversation, id])
  return (
    <div className={styles.chatMessagesHolderHeader}>
      <span>
        <img src={currentConversation?.type === "group" ? "https://picsum.photos/200" : `${getRecipient && 'avatar' in getRecipient ? getRecipient.avatar : "https://picsum.photos/200"}`} alt="" />
        <h3>{currentConversation?.type === "group" ? currentConversation.name : `${getRecipient?.first_name} ${getRecipient?.last_name}`}</h3>
      </span>

      <ul>
        <li><BsCameraVideo /></li>
        <li><TbPhoneCall /></li>
      </ul>
    </div>
  )
}