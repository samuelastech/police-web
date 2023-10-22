import '../styles/components/input.css';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Icon } from '@phosphor-icons/react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  setProperty: (property: string) => void;
  icon: Icon;
}

export const Input = forwardRef(({ label, icon, setProperty, ...props }: InputProps, ref) => {
  const [focused, setFocused] = useState<boolean>(false)
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
        <Icon color={focused ? '#E6ECF3' : '#546575' } className='icon' />
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
})
