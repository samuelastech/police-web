import '../styles/components/modal.css';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  text: string;
  buttonText: string;
  setIsOpen: (isOpen: boolean) => void;
  action: () => void;
}

export const Modal = ({ isOpen, action, setIsOpen, text, buttonText }: ModalProps) => {
  return (
    <div className={`modal-container ${isOpen ? '' : '-hidden'}`} onClick={() => setIsOpen(false)}>
      <div className='modal-box'>
        <div className='text'>{text}</div>
        <Button text={buttonText} color='orange' action={action} />
      </div>
    </div>
  );
};