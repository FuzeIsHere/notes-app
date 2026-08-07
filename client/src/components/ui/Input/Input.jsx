import React from 'react';
import styles from './Input.module.css';
import { useUI } from '../../../hooks/useUI'; // Subscribed to useUI to control darkness namespaces

export const Input = ({
  label,
  error,
  id,
  type = 'text',
  className = '',
  value='',
  ...props
}) => {
  const { theme } = useUI(); // Grab 'light' or 'dark'

  const inputClasses = [
    styles.input,
    error ? styles.errorInput : '',
    className
  ].join(' ');

  return (
    /* We inject the current theme state at the root container to cleanly handle child states */
    <div className={`${styles.container} ${styles[theme]}`}>
      {/* Only render the label element if a label prop is provided */}
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        value={value}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'} // Tells screen readers if the input value is incorrect
        {...props}
      />

      {/* Render the validation error message dynamically */}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
