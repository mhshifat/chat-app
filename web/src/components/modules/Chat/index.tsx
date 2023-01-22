import styles from "./ChatLayout.module.css";
import ChatHandle from "./ChatHandle/ChatHandle";
import ChatTypesSidebar from "./ChatTypesSidebar/ChatTypesSidebar";
import { PropsWithChildren, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../store";
import { useEffect } from "react";
import { useSocket } from "../../../providers/socket";
import { MessageDocument, addMessage, updateMessageReducer, deleteMessageReducer } from "../../../store/messageSlice";
import { ConversationDocument, addConversation, updateConversation } from './../../../store/conversationSlice';
import ChatParticipents from './ChatParticipents/ChatParticipents';
import { useParams } from "react-router-dom";

export default function ChatLayout({ children }: PropsWithChildren) {
  const { id } = useParams();
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
    }
    socketRef.socket?.on("onMessageUpdate", handleNewMsgUpdate);
    const handleNewMsgDelete = ({ message, conversation }: { message: MessageDocument, conversation: ConversationDocument }) => {
      functionsRef.current.dispatch(deleteMessageReducer(message));
      functionsRef.current.dispatch(updateConversation(conversation));
    }
    socketRef.socket?.on("onMessageDelete", handleNewMsgDelete);
    const handleNewConversation = (conversation: ConversationDocument) => {
      functionsRef.current.dispatch(addConversation(conversation));
    }
    socketRef.socket?.on("onConversationCreate", handleNewConversation);
    
    return () => {
      socketRef.socket?.emit("systemOut", user?.id);
      socketRef.socket?.off("onMessageCreate", handleNewMsgCreate);
      socketRef.socket?.off("onMessageUpdate", handleNewMsgUpdate);
      socketRef.socket?.off("onMessageDelete", handleNewMsgDelete);
      socketRef.socket?.off("onConversationCreate", handleNewConversation);
    }
  }, [user?.id]);

  return (
    <div className={styles.chatLayout}>
      <ChatHandle />
      <ChatTypesSidebar />
      {children}
      {id && <ChatParticipents />}
    </div>
  )
}