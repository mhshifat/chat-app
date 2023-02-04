import { useDispatch, useSelector } from "react-redux";
import styles from "./ChatParticipents.module.css";
import { AppDispatch, AppState } from "../../../../store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../../../../providers/socket";
import { HiOutlineUserPlus } from "react-icons/hi2";
import Modal from "../../../common/Modal/Modal";
import AddChatParticipentModal from './AddChatParticipantModal';
import { BsThreeDotsVertical } from "react-icons/bs";
import Dropdown from "../../../common/Dropdown/Dropdown";
import { banConversationPerticipentThunk, muteConversationPerticipentThunk, removeConversationPerticipentThunk, unbanConversationPerticipentThunk, unmuteConversationPerticipentThunk } from "../../../../store/conversationSlice";

interface ChatParticipentsProps {}

export default function ChatParticipents({}: ChatParticipentsProps) {
  const { id } = useParams();
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: AppState) => state.authSlice);
  const { conversations, type } = useSelector((state: AppState) => state.conversationSlice);
  const functionsRef = useRef({
    socket,
  });
  const [onlineUsersId, setOnlineUsersId] = useState<string[]>([]);
  const currentConversation = useMemo(() => {
    return conversations.find(c => String(c.id) === String(id));
  }, [id, conversations]);

  useEffect(() => {
    if (!id) return;
    const socketRef = functionsRef.current.socket;
    const timer = setInterval(() => {
      socketRef?.emit("getOnlineUsers", socketRef.id);
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, [id]);

  useEffect(() => {
    const socketRef = functionsRef.current.socket;
    const handleGetOnlineUsers = (data: any) => {
      setOnlineUsersId(data);
    }
    socketRef?.on("getOnlineUsers", handleGetOnlineUsers);

    return () => {
      socketRef?.off("getOnlineUsers", handleGetOnlineUsers);
    }
  }, [id]);
  
  return (
    <aside className={styles.chatParticipents}>
      <header className={styles.chatParticipentsHeader}>
        <p>Participents</p>
        {type === "group" && currentConversation?.creator?.id === user?.id && (
          <Modal
            modalBody={<AddChatParticipentModal />}
          >
            <HiOutlineUserPlus />
          </Modal>
        )}
      </header>
      <div className={styles.chatParticipentsBody}>
        <p>Online</p>
        <ul className={styles.chatParticipentsList}>
          {currentConversation?.users?.filter(u => onlineUsersId.includes(String(u.id))).filter(u => !currentConversation.muted_users?.find(bu => String(bu.id) === String(u.id))).map(u => (
            <li key={u.id} className={styles.chatParticipentsItem}>
              <span className={`${styles.chatParticipentsItem__img} ${styles.chatParticipentsItemOnline}`}>
                <img src="https://picsum.photos/200" alt="" />
              </span>
              <span className={styles.chatParticipentsItem__title}>{u.first_name} {u.last_name}</span>

              {user?.id !== u?.id && currentConversation?.creator?.id === user?.id && <Dropdown
                position="right-bottom"
                dropdownEl={({ setOpenDropdown }) => (
                  <ul className={styles.chatParticipentsItem__options}>
                    <li onClick={() => {
                      dispatch(removeConversationPerticipentThunk({
                        conversationId: id!,
                        participentId: u.id!
                      }));
                      setOpenDropdown(false)
                    }}>Kisck User</li>
                    <li onClick={() => {
                      dispatch(banConversationPerticipentThunk({
                        conversationId: id!,
                        participentId: u.id!
                      }));
                      setOpenDropdown(false);
                    }}>Ban User</li>
                    <li onClick={() => {
                      dispatch(muteConversationPerticipentThunk({
                        conversationId: id!,
                        participentId: u.id!
                      }));
                      setOpenDropdown(false);
                    }}>Mute User</li>
                    <li onClick={() => setOpenDropdown(false)}>Transfer Ownership</li>
                  </ul>
                )}
              >
                <span style={{
                    marginLeft: "auto"
                  }}>
                  <BsThreeDotsVertical cursor="pointer" />
                </span>
              </Dropdown>}
            </li>
          ))}
        </ul>

        <p>Offline</p>
        <ul className={styles.chatParticipentsList}>
          {currentConversation?.users?.filter(u => !onlineUsersId.includes(String(u.id))).filter(u => !currentConversation.muted_users?.find(bu => String(bu.id) === String(u.id))).map(u => (
            <li key={u.id} className={styles.chatParticipentsItem}>
              <span className={`${styles.chatParticipentsItem__img}`}>
                <img src="https://picsum.photos/200" alt="" />
              </span>
              <span className={styles.chatParticipentsItem__title}>{u.first_name} {u.last_name}</span>

              {user?.id !== u?.id && currentConversation?.creator?.id === user?.id && <Dropdown
                position="right-bottom"
                dropdownEl={({ setOpenDropdown }) => (
                  <ul className={styles.chatParticipentsItem__options}>
                    <li onClick={() => {
                      dispatch(removeConversationPerticipentThunk({
                        conversationId: id!,
                        participentId: u.id!
                      }));
                      setOpenDropdown(false)
                    }}>Kisck User</li>
                    <li onClick={() => {
                      dispatch(banConversationPerticipentThunk({
                        conversationId: id!,
                        participentId: u.id!
                      }));
                      setOpenDropdown(false);
                    }}>Ban User</li>
                    <li onClick={() => {
                      dispatch(muteConversationPerticipentThunk({
                        conversationId: id!,
                        participentId: u.id!
                      }));
                      setOpenDropdown(false);
                    }}>Mute User</li>
                    <li onClick={() => setOpenDropdown(false)}>Transfer Ownership</li>
                  </ul>
                )}
              >
                <span style={{
                    marginLeft: "auto"
                  }}>
                  <BsThreeDotsVertical cursor="pointer" />
                </span>
              </Dropdown>}
            </li>
          ))}
        </ul>

        <p>Muted</p>
        <ul className={styles.chatParticipentsList}>
          {currentConversation?.muted_users?.map(u => (
            <li key={u.id} className={styles.chatParticipentsItem}>
              <span className={`${styles.chatParticipentsItem__img} ${onlineUsersId.includes(String(u.id)) ? styles.chatParticipentsItemOnline : ""}`}>
                <img src="https://picsum.photos/200" alt="" />
              </span>
              <span className={styles.chatParticipentsItem__title}>{u.first_name} {u.last_name}</span>

              {user?.id !== u?.id && currentConversation?.creator?.id === user?.id && <Dropdown
                position="right-bottom"
                dropdownEl={({ setOpenDropdown }) => (
                  <ul className={styles.chatParticipentsItem__options}>
                    <li onClick={() => {
                      dispatch(removeConversationPerticipentThunk({
                        conversationId: id!,
                        participentId: u.id!
                      }));
                      setOpenDropdown(false)
                    }}>Kisck User</li>
                    <li onClick={() => {
                      dispatch(banConversationPerticipentThunk({
                        conversationId: id!,
                        participentId: u.id!
                      }));
                      setOpenDropdown(false);
                    }}>Ban User</li>
                    <li onClick={() => {
                      dispatch(unmuteConversationPerticipentThunk({
                        conversationId: id!,
                        participentId: u.id!
                      }));
                      setOpenDropdown(false);
                    }}>Unmute User</li>
                    <li onClick={() => setOpenDropdown(false)}>Transfer Ownership</li>
                  </ul>
                )}
              >
                <span style={{
                    marginLeft: "auto"
                  }}>
                  <BsThreeDotsVertical cursor="pointer" />
                </span>
              </Dropdown>}
            </li>
          ))}
        </ul>

        {currentConversation?.creator?.id === user?.id && (
          <>
            <p>Banned</p>
            <ul className={styles.chatParticipentsList}>
              {currentConversation?.banned_users?.map(u => (
                <li key={u.id} className={styles.chatParticipentsItem}>
                  <span className={`${styles.chatParticipentsItem__img} ${onlineUsersId.includes(String(u.id)) ? styles.chatParticipentsItemOnline : ""}`}>
                    <img src="https://picsum.photos/200" alt="" />
                  </span>
                  <span className={styles.chatParticipentsItem__title}>{u.first_name} {u.last_name}</span>

                  {user?.id !== u?.id && currentConversation?.creator?.id === user?.id && <Dropdown
                    position="right-bottom"
                    dropdownEl={({ setOpenDropdown }) => (
                      <ul className={styles.chatParticipentsItem__options}>
                        <li onClick={() => {
                          dispatch(removeConversationPerticipentThunk({
                            conversationId: id!,
                            participentId: u.id!
                          }));
                          setOpenDropdown(false)
                        }}>Kisck User</li>
                        <li onClick={() => {
                          dispatch(unbanConversationPerticipentThunk({
                            conversationId: id!,
                            participentId: u.id!
                          }));
                          setOpenDropdown(false);
                        }}>Unban User</li>
                      </ul>
                    )}
                  >
                    <span style={{
                        marginLeft: "auto"
                      }}>
                      <BsThreeDotsVertical cursor="pointer" />
                    </span>
                  </Dropdown>}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </aside>
  )
}