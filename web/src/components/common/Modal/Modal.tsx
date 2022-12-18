import ReactModal from 'react-modal';
import styles from "./Modal.module.css";
import { ReactElement, cloneElement, useState } from 'react';
import { useCallback } from 'react';
import { PropsWithChildren } from 'react';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: "var(--secondaryBgColor)",
    border: "none"
  },
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
};

interface ModalProps {
  modalBody: JSX.Element
}

export default function Modal({ children, modalBody }: PropsWithChildren<ModalProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <>
      {children && cloneElement(children as ReactElement, {
        onClick: () => setIsOpen(value => !value)
      })}
      <ReactModal
        isOpen={isOpen}
        onAfterOpen={() => {}}
        onRequestClose={closeModal}
        style={customStyles}
      >
        {cloneElement(modalBody, {
          closeModal,
          isOpen
        })}
      </ReactModal>
    </>
  )
}
