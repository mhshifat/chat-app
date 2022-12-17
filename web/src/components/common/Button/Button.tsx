import { ForwardedRef, ButtonHTMLAttributes, forwardRef, PropsWithChildren } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

function Button({ children, ...restProps }: PropsWithChildren<ButtonProps>, ref: ForwardedRef<HTMLButtonElement>) {
  return <button className={styles.button} {...restProps}>
    {children}
  </button>
}

export default forwardRef(Button);