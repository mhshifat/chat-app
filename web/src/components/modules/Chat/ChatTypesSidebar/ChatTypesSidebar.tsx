import styles from "./ChatTypesSidebar.module.css";
import { BsSearch } from "react-icons/bs";
import Tab from "../../../common/Tab/Tab";
import PrivateGroupList from "../PrivateGroupList/PrivateGroupList";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getConversationsThunk, setConversationType } from "../../../../store/conversationSlice";
import { AppDispatch } from "../../../../store";

export default function ChatTypesSidebar() {
  const dispatch = useDispatch<AppDispatch>();

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
        items={[
          {
            label: "Private",
            onClick: () => dispatch(setConversationType("private")),
            component: (
              <PrivateGroupList />
            )
          },
          {
            label: "Group",
            onClick: () => dispatch(setConversationType("group")),
            component: (
              <PrivateGroupList type="group" />
            )
          },
        ]}
      />
    </aside>
  )
}