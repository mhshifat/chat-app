import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

function Input({ ...restProps }: InputProps, ref: ForwardedRef<HTMLInputElement>) {
  return <input className={styles.input} type="text" {...restProps} ref={ref} />
}

export default forwardRef(Input);