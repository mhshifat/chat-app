import styles from "./ChatLayout.module.css";
import ChatHandle from "./ChatHandle/ChatHandle";
import ChatTypesSidebar from "./ChatTypesSidebar/ChatTypesSidebar";
import { PropsWithChildren } from "react";

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.chatLayout}>
      <ChatHandle />
      <ChatTypesSidebar />
      {children}
    </div>
  )
}