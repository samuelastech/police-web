/* eslint-disable react/display-name */
import '../styles/components/callout.css';
import { Icon } from '@phosphor-icons/react';
import { forwardRef, useImperativeHandle, useRef } from 'react';

interface CalloutProps {
  text: string;
  icon: Icon;
}

export const Callout = forwardRef(({ text, icon }: CalloutProps, ref) => {
  const Icon = icon;

  const calloutRef = useRef<HTMLDivElement>(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => {
      calloutRef.current?.focus();
    },
  }));
  
  return (
    <div className='callout-container' aria-live='assertive' ref={calloutRef}>
      <Icon className='icon' color='#E6ECF3' size={20} />
      <p className='text'>{text}</p>
    </div>
  );
});

