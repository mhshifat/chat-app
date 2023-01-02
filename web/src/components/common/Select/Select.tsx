import styles from "./Select.module.css";
import { ForwardedRef, HTMLAttributes, forwardRef } from 'react';

interface SelectProps extends HTMLAttributes<HTMLSelectElement> {
  options?: { label: string; value: string }[]
}

function Select({ options, ...restProps }: SelectProps, ref: ForwardedRef<HTMLSelectElement>) {
  return (
    <div className={styles.select}>
      <select {...restProps} ref={ref}>
        <option value="">Select</option>
        {options?.map(({ label, value }) => (
          <option key={label} value={value}>{label}</option>
        ))}
      </select>
    </div>
  )
}

export default forwardRef(Select);