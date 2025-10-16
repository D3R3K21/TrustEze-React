import React from 'react';
import './Button.css';

interface ButtonProps {
  name: string;
  size?: 'big' | 'med' | 'small';
  shape?: 'square' | 'round';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  name,
  size = 'med',
  shape = 'square',
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const buttonClasses = [
    'button',
    `button--${size}`,
    `button--${shape}`,
    disabled ? 'button--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default Button;
