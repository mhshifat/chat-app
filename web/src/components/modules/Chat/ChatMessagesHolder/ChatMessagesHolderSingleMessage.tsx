import { formatDistance } from "date-fns";
import { MessageDocument } from "../../../../store/messageSlice";
import styles from "./ChatMessagesHolder.module.css";
import ChatMessagesHolderText from "./ChatMessagesHolderText";

interface ChatMessagesHolderSingleMessageProps {
  message: MessageDocument;
}

export default function ChatMessagesHolderSingleMessage({ message }:ChatMessagesHolderSingleMessageProps) {
  return (
    <div className={styles.chatMessagesHolderSingleMessage}>
      <span>
        <img src={message?.writter && "avatar" in message?.writter ? message.writter.avatar as string : "https://picsum.photos/200"} alt="" />
      </span>
      <span>
        <h3>{`${message?.writter?.first_name} ${message?.writter?.last_name}`} <small>{formatDistance(new Date(message.created_at as unknown as Date), new Date(), { addSuffix: true })}</small></h3>
        <ChatMessagesHolderText msg={message}>{message.message}</ChatMessagesHolderText>
      </span>
    </div>
  )
}