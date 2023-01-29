import { useDispatch, useSelector } from "react-redux";
import CustomSelect from "../../../common/CustomSelect/CustomSelect";
import { AppDispatch, AppState } from "../../../../store";
import Button from "../../../common/Button/Button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchFriendsThunk } from "../../../../store/authSlice";
import styles from "./ChatParticipents.module.css";
import { useParams } from "react-router-dom";
import { addConversationPerticipentThunk } from "../../../../store/conversationSlice";

export interface AddChatParticipentParams {
  conversationId: string;
  participentId: string;
}

export default function AddChatParticipentModal({ closeModal }: { closeModal?: () => void }) {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { friends } = useSelector((state: AppState) => state.authSlice);
  const { loading, conversations } = useSelector((state: AppState) => state.conversationSlice);
  const [participentsId, setParticipentsId] = useState<string | null>(null);

  const currentConversation = useMemo(() => {
    return conversations.find(c => String(c.id) === String(id));
  }, [id, conversations]);
  const getFriends = useMemo(() => {
    return friends.filter(f => !currentConversation?.users?.find(u => u.id === f.id));
  }, [currentConversation, friends]);

  useEffect(() => {
    dispatch(fetchFriendsThunk(""))
  }, [dispatch]);
  
  const handleAddChantParticipent = useCallback(() => {
    if (!id || !participentsId) return;
    dispatch(addConversationPerticipentThunk({
      conversationId: id,
      participentId: participentsId
    }));
    closeModal?.();
  }, [dispatch, id, participentsId, closeModal])
  return (
    <div className={styles.addChatParticipentModal}>
      <CustomSelect
        placeholder="Reciepient"
        searchable={true}
        items={getFriends.map(friend => ({
          label: `${friend.first_name} ${friend.last_name} (${friend.email})`,
          value: friend!.id + ""
        }))}
        onChange={(values) => {
          if (!values[0]?.value) return;
          setParticipentsId(values[0].value);
        }}
      />
      <Button onClick={handleAddChantParticipent}>{loading ? "Loading..." : "Add"}</Button>
    </div>
  )
}