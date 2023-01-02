import { useState, useLayoutEffect } from 'react';
import styles from "./ChatMessagesHolder.module.css";
import { PropsWithChildren, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface ChatMessagesHolderTextProps {}
type PopupCoord = { x: number, y: number };

const CONTEXT_MENU_OPTIONS = ["Edit", "Delete"]

export default function ChatMessagesHolderText({ children }:PropsWithChildren<ChatMessagesHolderTextProps>) {
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
  }, []);

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
          <input type="text" defaultValue={children as string} autoFocus />
          <small><strong>Escape</strong> to close the input</small>
        </div>
      )}
      {popupCoord && createPortal(
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