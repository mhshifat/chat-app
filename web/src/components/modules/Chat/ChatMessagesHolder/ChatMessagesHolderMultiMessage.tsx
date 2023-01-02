import { formatDistance } from "date-fns";
import { MessageDocument } from "../../../../store/messageSlice";
import styles from "./ChatMessagesHolder.module.css";
import ChatMessagesHolderText from "./ChatMessagesHolderText";

interface ChatMessagesHolderMultiMessageProps {
  messages: MessageDocument[]
}

export default function ChatMessagesHolderMultiMessage({ messages }:ChatMessagesHolderMultiMessageProps) {
  return (
    <div className={styles.chatMessagesHolderMultiMessage}>
      <span>
      <img src={messages?.[0]?.writter && "avatar" in messages?.[0]?.writter ? messages?.[0].writter.avatar as string : "https://picsum.photos/200"} alt="" />
      </span>
      <span>
      <h3>{`${messages?.[0]?.writter?.first_name} ${messages?.[0]?.writter?.last_name}`} <small>{formatDistance(new Date(messages?.[0].created_at as unknown as Date), new Date(), { addSuffix: true })}</small></h3>
        {messages.map(msg => (
          <ChatMessagesHolderText key={msg.id}>{msg.message}</ChatMessagesHolderText>
        ))}
      </span>
    </div>
  )
}