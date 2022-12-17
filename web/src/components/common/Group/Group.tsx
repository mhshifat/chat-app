import { PropsWithChildren } from "react";
import styles from "./Group.module.css";

interface GroupProps {
  direction?: "column" | "row";
  justify?: "center" | "flex-start" | "flex-end";
  align?: "center" | "flex-start" | "flex-end";
  height?: string;
}

export default function Group({ direction = "row", justify = "center", align = "center", height, children }: PropsWithChildren<GroupProps>) {
  return (
    <div 
      className={styles.group}
      style={{
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        height: height || "100%"
      }}
    >
      {children}
    </div>
  )
}