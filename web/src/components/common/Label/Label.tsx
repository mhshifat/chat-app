import styles from "./Label.module.css";
import { PropsWithChildren } from 'react';

interface LabelProps {
  title: string;
  inverted?: boolean;
  error?: string;
}

export default function Label({ children, title, error, inverted }: PropsWithChildren<LabelProps>) {
  return (
    <div className={`${styles.label} ${inverted ? styles.inverted : ""} ${error ? styles.error : ""}`}>
      <span>{error ? `Error: ${error}` : title}</span>
      {children}
    </div>
  )
}