import React from 'react';
import styles from './Button.module.css';

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
  const isDisabled = disabled || isLoading;

  const buttonClasses = [
    styles.button,
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
