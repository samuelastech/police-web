import '../styles/components/button-icon.css';
import { Icon } from '@phosphor-icons/react';

enum ButtonColors {
  BLUE = 'blue',
  RED = 'red',
}

interface ButtonIconProps {
  text: string;
  action?: () => void;
  color?: string;
  icon: Icon;
  isLoading?: boolean;
  loadingText?: string;
}

export const ButtonIcon = ({ text, action, color, icon, isLoading, loadingText }: ButtonIconProps) => {
  const Icon = icon;

  return (
    <button
      className={`button-icon ${color === ButtonColors.RED ? '-red' : '-blue'}`}
      onClick={action ? action : undefined}
    >
      {isLoading ? (
        <>
          <span className='text -loading'>{loadingText}...</span>
        </>
      ) : (
        <>
          <Icon size={20} className='icon' color='#E6ECF3' />
          <span className='text'>{text}</span>
        </>
      )}
    </button>
  );
}
