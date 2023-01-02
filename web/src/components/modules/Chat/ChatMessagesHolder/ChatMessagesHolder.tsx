import styles from "./ChatMessagesHolder.module.css";
import ChatMessagesHolderHeader from "./ChatMessagesHolderHeader";
import ChatMessagesHolderInput from "./ChatMessagesHolderInput";
import ChatMessagesHolderContent from "./ChatMessagesHolderContent";

interface ChatMessagesHolderProps {}

export default function ChatMessagesHolder({}:ChatMessagesHolderProps) {
  return (
    <div className={styles.chatMessagesHolder}>
      <ChatMessagesHolderHeader />
      <ChatMessagesHolderContent />
      <ChatMessagesHolderInput />
    </div>
  )
}