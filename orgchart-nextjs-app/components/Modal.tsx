import styles from "./Modal.module.css"

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: any;

}
const Modal = ({isOpen, onClose, children}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={e => e.stopPropagation()}>
        <button className={styles.closebtn} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};
export default Modal;