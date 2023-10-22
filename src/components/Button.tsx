import '../styles/components/button.css';

enum ButtonColors {
  BLUE = 'blue',
  ORGANGE = 'orange',
}

interface ButtonProps {
  text: string;
  action?: () => void;
  color?: string;
}

export const Button = ({ text, action, color }: ButtonProps) => {
  return <button
    className={`button ${color === ButtonColors.ORGANGE ? '-orange' : '-blue'}`}
    onClick={action ? action : undefined}
  >
    {text}
  </button>;
}
