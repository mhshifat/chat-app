import styles from "./ChatTypesSidebar.module.css";
import { BsSearch } from "react-icons/bs";
import Tab from "../../../common/Tab/Tab";
import PrivateGroupList from "../PrivateGroupList/PrivateGroupList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getConversationsThunk, setConversationType } from "../../../../store/conversationSlice";
import { AppDispatch, AppState } from "../../../../store";

export default function ChatTypesSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const { type } = useSelector((state: AppState) => state.conversationSlice);

  useEffect(() => {
    dispatch(getConversationsThunk())
  }, [dispatch]);

  return (
    <aside className={styles.chatTypesSidebar}>
      <form className={styles.chatTypesSidebar__search}>
        <BsSearch />
        <input type="search" placeholder="Search..." />
      </form>
      <Tab
        center
        forceActiveTab={type === "private" ? 0 : type === "group" ? 1 : 0}
        items={[
          {
            label: "Private",
            onClick: () => dispatch(setConversationType("private")),
            component: (
              <PrivateGroupList />
            ),
          },
          {
            label: "Group",
            onClick: () => dispatch(setConversationType("group")),
            component: (
              <PrivateGroupList type="group" />
            ),
          },
        ]}
      />
    </aside>
  )
}