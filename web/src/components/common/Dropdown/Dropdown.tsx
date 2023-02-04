import { cloneElement, ReactElement, useRef, useState, isValidElement, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from "./Dropdown.module.css";

interface DropdownProps {
  open?: boolean;
  position?: "right-bottom";
  dropdownEl: ((values: { openDropdown: boolean; dropDownWidth?: number; setOpenDropdown: (value: boolean) => void }) => JSX.Element) | JSX.Element;
  children: ((values: { openDropdown: boolean; dropDownWidth?: number; }) => JSX.Element) | ReactElement;
}

export default function Dropdown({ children, dropdownEl, open, position }: DropdownProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  
  const dropDownWidth = useRef(0);

  useEffect(() => {
    if (typeof open === "boolean") {
      setOpenDropdown(open);
    }
  }, [open]);
  
  return (
    <>
      {cloneElement(!isValidElement(children) ? (children as any)?.({ openDropdown, dropDownWidth: dropDownWidth.current }) : children as ReactElement, {
        ...open === undefined ?{
          onClick: () => setOpenDropdown(value => !value)
        }:{},
        ref: (el: HTMLElement | null) => {
          triggerRef.current = el;
          if (dropDownWidth.current === 0 && el && dropDownWidth.current !== el!.offsetWidth) {
            dropDownWidth.current = el!.offsetWidth;
          }
        }
      })}
      {createPortal((
        <div
          ref={optionsRef}
          className={`${styles.dropdown}`}
          style={{
            ...openDropdown?{
              top: position === "right-bottom" ? (triggerRef.current?.getBoundingClientRect().height || -99999999999999) + (triggerRef.current?.getBoundingClientRect().top || -99999999999999) : (triggerRef.current?.getBoundingClientRect().height || -99999999999999) + (triggerRef.current?.getBoundingClientRect().top || -99999999999999),
              left: position === "right-bottom" ? (((triggerRef.current?.getBoundingClientRect()?.left || 0) - (optionsRef.current?.offsetWidth || 0)) || -99999999999999) : (triggerRef.current?.getBoundingClientRect().left || -99999999999999),
            }:{},
          }}
        >
          {!isValidElement(dropdownEl) ? (dropdownEl as any)?.({ openDropdown, setOpenDropdown, dropDownWidth: dropDownWidth.current }) : dropdownEl}
        </div>
      ), document.querySelector("body")!)}
    </>
  )
}