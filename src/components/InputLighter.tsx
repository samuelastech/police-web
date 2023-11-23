import '../styles/components/input-lighter.css';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Icon } from '@phosphor-icons/react';

interface InputLighterProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: Icon;
  setProperty: (property: string) => void;
}

export const InputLighter = forwardRef(({ label, icon, setProperty, ...props }: InputLighterProps, ref) => {
  const [focused, setFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const Icon = icon;

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
      setFocused(true);
    },
  }));
  
  return (
    <div className='input-container'>
      <label className='label' htmlFor={label}>{label}</label>
      <div className={`icon-input ${focused ? '-focus' : ''}`}>
        <Icon color={focused ? '#1293EF' : '#546575' } className='icon' />
        <input
          className='input'
          id={label.toLocaleLowerCase()}
          ref={inputRef}
          onChange={(event) => setProperty(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props} />
      </div>
    </div>
  );
});
