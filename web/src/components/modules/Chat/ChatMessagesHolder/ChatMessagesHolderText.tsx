import { useState, useLayoutEffect, KeyboardEvent as KeyboardEventReact } from 'react';
import styles from "./ChatMessagesHolder.module.css";
import { PropsWithChildren, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MessageDocument, deleteMessageThunk, updateMessageThunk } from './../../../../store/messageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppState } from '../../../../store';
import { useRef } from 'react';

interface ChatMessagesHolderTextProps {
  msg: MessageDocument;
}
type PopupCoord = { x: number, y: number };

const CONTEXT_MENU_OPTIONS = ["Edit", "Delete"]

export default function ChatMessagesHolderText({ children, msg }:PropsWithChildren<ChatMessagesHolderTextProps>) {
  const dispatch = useDispatch<AppDispatch>();
  const functionsRef = useRef({
    dispatch
  });
  const [error, setError] = useState("");
  const { user } = useSelector((state: AppState) => state.authSlice);
  const [popupCoord, setPopupCoord] = useState<PopupCoord | null>(null);
  const [showInput, setShowInput] = useState(false);
  const handleContextMenu = useCallback((coord: PopupCoord) => {
    setPopupCoord(coord);
  }, []);
  const handleContextMenuOptionClick = useCallback((type: string) => {
    setPopupCoord(null);
    
    if (type === "edit") {
      setShowInput(true);
    }

    if (type === "delete") {
      functionsRef.current.dispatch(deleteMessageThunk(msg.id))
    }
  }, [msg.id]);

  const handleUpdateMessage = useCallback(async (e: KeyboardEventReact<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    if (e.key !== "Enter") return;
    if (value === children) return setShowInput(false);
    functionsRef.current.dispatch(updateMessageThunk({
      id: msg.id,
      values: {
        message: value
      }
    })).unwrap().then(() => setShowInput(false)).catch((err) => setError(err));
  }, [children, msg.id]);

  useLayoutEffect(() => {
    if (!showInput) return;
    const handleKeyPressEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowInput(false);
      }
    }
    window.addEventListener("keyup", handleKeyPressEvent);

    return () => {
      window.removeEventListener("keyup", handleKeyPressEvent)
    } 
  }, [showInput]);
  
  return (
    <>
      {!showInput ? (
        <p className={styles.chatMessagesHolderText} onContextMenu={(e) => {
          e.preventDefault();
          handleContextMenu({ x: e.clientX, y: e.clientY });
        }}>
          {children}
        </p>
      ) : (
        <div className={styles.chatMessagesHolderText__editableInput}>
          <input type="text" defaultValue={children as string} autoFocus onKeyUp={handleUpdateMessage} />
          <small className={error ? styles.chatMessagesHolderText__errorMsg : ""}>
            {!error ? (
              <>
                <strong>Escape</strong> to close the input
              </>
            ) : (
              error
            )}
          </small>
        </div>
      )}
      {msg.writter?.id === user?.id && popupCoord && createPortal(
        (
          <div
            className={styles.chatMessagesHolderText__menuWrapper}
            onClick={() => setPopupCoord(null)}
            onContextMenu={(e) => e.preventDefault()}
          >
            <ul
              style={{
                top: popupCoord?.y,
                left: popupCoord?.x
              }}
              className={styles.chatMessagesHolderText__menu}
              onClick={(e) => e.stopPropagation()}
            >
              {CONTEXT_MENU_OPTIONS.map((item) => (
                <li key={item} onClick={() => handleContextMenuOptionClick(item.toLowerCase())}>{item}</li>
              ))}
            </ul>
          </div>
        ),
        document.querySelector("body")!
      )}
    </>
  )
}