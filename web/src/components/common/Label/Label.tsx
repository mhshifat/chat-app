import styles from "./Label.module.css";
import { PropsWithChildren } from 'react';

interface LabelProps {
  title: string;
  inverted?: boolean;
}

export default function Label({ children, title, inverted }: PropsWithChildren<LabelProps>) {
  return (
    <div className={`${styles.label} ${inverted ? styles.inverted : ""}`}>
      <span>{title}</span>
      {children}
    </div>
  )
}