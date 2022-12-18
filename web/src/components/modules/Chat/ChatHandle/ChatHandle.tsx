import { BiMessageMinus } from "react-icons/bi";
import { AiOutlinePoweroff } from "react-icons/ai";
import styles from "./ChatHandle.module.css";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { signOutLoggedInUserThunk } from "../../../../store/authSlice";
import { AppDispatch } from "../../../../store";

export default function ChatHandle() {
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = useCallback(() => {
    dispatch(signOutLoggedInUserThunk());
  }, [dispatch]);

  return (
    <div className={styles.chatHandle}>
      <div className={styles.chatHandle__profile}>
        <img src="https://picsum.photos/200" alt="" />
      </div>

      <ul className={`${styles.chatHandle__links} ${styles.chatHandle__ySpacing}`}>
        <li>
          <BiMessageMinus />
        </li>
      </ul>

      <ul className={`${styles.chatHandle__links} ${styles.chatHandle__mtAuto}`}>
        <li onClick={handleLogout}>
          <AiOutlinePoweroff />
        </li>
      </ul>
    </div>
  )
}