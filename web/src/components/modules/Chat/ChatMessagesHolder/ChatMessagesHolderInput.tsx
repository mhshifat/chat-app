import { useCallback } from "react";
import styles from "./ChatMessagesHolder.module.css";
import { AiOutlineSend, AiOutlinePlus } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { createMessageThunk } from "../../../../store/messageSlice";
import { useParams } from 'react-router-dom';
import { AppDispatch } from "../../../../store";

interface ChatMessagesHolderInputProps {}

export interface CreateMessageFormValues {
  message: string;
  conversationId: string;
}

export default function ChatMessagesHolderInput({}:ChatMessagesHolderInputProps) {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const sendMessage = useCallback((content: string) => {
    if (!id || !content) return;
    dispatch(createMessageThunk({
      message: content,
      conversationId: id
    }));
  }, [dispatch, id]);

  return (
    <ul className={styles.chatMessagesHolderInput}>
      <li><AiOutlinePlus /></li>
      <li>
        <input type="text" placeholder="Send Message to #" onKeyUp={({ currentTarget, key }) => {
          if (key === "Enter") {
            sendMessage(currentTarget.value);
            currentTarget.value = "";
          }
        }} />
      </li>
      <li><AiOutlineSend /></li>
    </ul>
  )
}