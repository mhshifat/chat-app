import { useEffect, useState } from "react";
import styles from "./Tab.module.css";

interface TabProps {
  center?: boolean;
  forceActiveTab?: number;
  items: { label: string; component: JSX.Element; onClick?: () => void; }[];
}

export default function Tab({ items, center, forceActiveTab }: TabProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (forceActiveTab === undefined) return;
    setSelectedTab(forceActiveTab);
  }, [forceActiveTab])

  return (
    <>
      <div className={`${styles.tab} ${center ? styles.tab__center : ""}`}>
        {items.map(({ label, onClick }, idx) => (
          <span
            key={label} 
            className={`${selectedTab === idx ? styles.tab__active : ""}`}
            onClick={() => {
              setSelectedTab(idx);
              onClick?.();
            }}
          >{label}</span>
        ))}
      </div>
      {items[selectedTab].component}
    </>
  )
}