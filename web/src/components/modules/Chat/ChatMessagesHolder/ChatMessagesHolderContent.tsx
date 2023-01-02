import styles from "./ChatMessagesHolder.module.css";
import ChatMessagesHolderSingleMessage from "./ChatMessagesHolderSingleMessage";
import ChatMessagesHolderMultiMessage from "./ChatMessagesHolderMultiMessage";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState } from "../../../../store";
import { MessageDocument, getMessagesThunk } from "../../../../store/messageSlice";
import { useParams } from "react-router-dom";

interface ChatMessagesHolderContentProps {}

export default function ChatMessagesHolderContent({}:ChatMessagesHolderContentProps) {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { mnessages } = useSelector((state: AppState) => state.messageSlice);
  
  useEffect(() => {
    if (!id) return;
    dispatch(getMessagesThunk({ conversationId: id! }));
  }, [dispatch, id]);

  const stucturalMessages = useMemo(() => {
    const newMessages: [string, MessageDocument[]][] = [];
    mnessages.forEach((msg, idx, array) => {
      if (!newMessages.length) {
        newMessages.push([msg.writter?.id!, [msg]]);
      } else if (+newMessages.slice(-1)?.[0]?.[0] === +msg.writter?.id!) {
        newMessages.slice(-1)?.[0]?.[1].push(msg);
      } else {
        newMessages.push([msg.writter?.id!, [msg]]);
      }
    });
    return newMessages;
  }, [mnessages]);
  console.log({ stucturalMessages });
  return (
    <div className={styles.chatMessagesHolderContent}>
      {stucturalMessages.map((arrayMsg, key) => arrayMsg[1].length > 1 ? (
        <ChatMessagesHolderMultiMessage key={key} messages={arrayMsg[1].reverse()} />
      ) : (
        <ChatMessagesHolderSingleMessage key={key} message={arrayMsg[1][0]} />
      ))}
    </div>
  )
}