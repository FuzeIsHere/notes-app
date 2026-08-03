import React from 'react';
import styles from './Input.module.css';

export const Input = ({
  label,
  error,
  id,
  type = 'text',
  className = '',
  value='',
  ...props
}) => {
  // Dynamically attach the error styling if an error message is present
  const inputClasses = [
    styles.input,
    error ? styles.errorInput : '',
    className
  ].join(' ');

  //console.log(label, value);

  return (
    <div className={styles.container}>
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
