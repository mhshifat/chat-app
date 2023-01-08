import styles from "./ChatLayout.module.css";
import ChatHandle from "./ChatHandle/ChatHandle";
import ChatTypesSidebar from "./ChatTypesSidebar/ChatTypesSidebar";
import { PropsWithChildren, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../store";
import { useEffect } from "react";
import { useSocket } from "../../../providers/socket";
import { MessageDocument, addMessage, updateMessageReducer } from "../../../store/messageSlice";
import { ConversationDocument, updateConversation } from './../../../store/conversationSlice';

export default function ChatLayout({ children }: PropsWithChildren) {
  const socket = useSocket();
  const dispatch = useDispatch();
  const { user } = useSelector((state: AppState) => state.authSlice);
  const functionsRef = useRef({
    socket,
    dispatch
  });
  const socketEventRef = useRef<any>({
    initialTime: null,
    prevData: null
  });

  useEffect(() => {
    const socketRef = functionsRef.current;
    socketRef.socket?.emit("systemJoined", user?.id);
    const handleNewMsgCreate = ({ message, conversation }: { message: MessageDocument, conversation: ConversationDocument }) => {
      if (
        socketEventRef.current.initialTime &&
        ((socketEventRef.current.initialTime - new Date().getTime()) / 1000) <= 10 &&
        JSON.stringify(socketEventRef.current.prevData) === JSON.stringify(message)
      ) return;
      functionsRef.current.dispatch(addMessage(message));
      functionsRef.current.dispatch(updateConversation(conversation));
      socketEventRef.current.initialTime = new Date().getTime();
      socketEventRef.current.prevData = message;
    }
    socketRef.socket?.on("onMessageCreate", handleNewMsgCreate);
    const handleNewMsgUpdate = ({ message, conversation }: { message: MessageDocument, conversation: ConversationDocument }) => {
      functionsRef.current.dispatch(updateMessageReducer(message));
      functionsRef.current.dispatch(updateConversation(conversation));
      socketEventRef.current.initialTime = new Date().getTime();
      socketEventRef.current.prevData = message;
    }
    socketRef.socket?.on("onMessageUpdate", handleNewMsgUpdate);
    
    return () => {
      socketRef.socket?.emit("systemOut", user?.id);
      socketRef.socket?.off("onMessageCreate", handleNewMsgCreate);
      socketRef.socket?.off("onMessageUpdate", handleNewMsgUpdate);
    }
  }, [user?.id]);

  return (
    <div className={styles.chatLayout}>
      <ChatHandle />
      <ChatTypesSidebar />
      {children}
    </div>
  )
}