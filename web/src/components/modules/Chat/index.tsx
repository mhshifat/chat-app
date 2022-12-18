import styles from "./ChatLayout.module.css";
import ChatHandle from "./ChatHandle/ChatHandle";

export default function ChatLayout() {
  return (
    <div className={styles.chatLayout}>
      <ChatHandle />
      <p>Welcome</p>
    </div>
  )
}