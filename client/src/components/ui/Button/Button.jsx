import React from 'react';
import styles from './Button.module.css';
import { useUI } from '../../../hooks/useUI'; // Added useUI import to access current theme

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  children,
  className = '',
  ...props
}) => {
  const { theme } = useUI(); // Retrieve either 'light' or 'dark'
  const isDisabled = disabled || isLoading;

  const buttonClasses = [
    styles.button,
    styles[theme],   // Injected the theme class (styles.light or styles.dark)
    styles[variant],
    styles[size],
    className
  ].join(' ');

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={buttonClasses}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
