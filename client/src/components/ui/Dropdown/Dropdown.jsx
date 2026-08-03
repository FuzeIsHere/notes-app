import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useUI } from '../../../hooks/useUI';
import styles from './Dropdown.module.css';

export const Dropdown = ({
  options = [],
  triggerRect = null,
  popupCorner = 'top-left',
  triggerCorner = 'bottom-left',
  onClose,
}) => {
  const { theme } = useUI(); // "light" or "dark"
  const popupRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [visibility, setVisibility] = useState('hidden');

  useEffect(() => {
    if (!triggerRect || !popupRef.current) return;

    const computePosition = () => {
      const popup = popupRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 1. Find starting anchor coordinates based on the trigger element's corners
      let anchorX = triggerRect.left;
      let anchorY = triggerRect.top;

      if (triggerCorner.includes('right')) anchorX = triggerRect.right;
      if (triggerCorner.includes('bottom')) anchorY = triggerRect.bottom;

      // 2. Initial placement based on preferred popup corner alignments
      let finalTop = anchorY;
      let finalLeft = anchorX;

      if (popupCorner.includes('bottom')) finalTop = anchorY - popup.height;
      if (popupCorner.includes('right')) finalLeft = anchorX - popup.width;

      // 3. Viewport Collision Overrides (Smart Flipping)
      // Check Horizontal Overflow
      if (finalLeft + popup.width > viewportWidth) {
        // Overflows right -> Push to fit or flip left
        finalLeft = Math.max(10, viewportWidth - popup.width - 10);
      } else if (finalLeft < 0) {
        // Overflows left -> Push right
        finalLeft = 10;
      }

      // Check Vertical Overflow
      if (finalTop + popup.height > viewportHeight) {
        // Overflows bottom -> Flip upwards relative to the trigger bounds
        finalTop = triggerRect.top - popup.height;
        // Ultimate fallback if it still doesn't fit upwards
        if (finalTop < 0) {
          finalTop = Math.max(10, viewportHeight - popup.height - 10);
        }
      } else if (finalTop < 0) {
        // Overflows top -> Flip downwards relative to trigger bounds
        finalTop = triggerRect.bottom;
      }

      setCoords({ top: finalTop, left: finalLeft });
      setVisibility('visible');
    };

    // Execute alignment after DOM positioning shifts finish
    const timeoutId = setTimeout(computePosition, 0);

    // Close dropdown on click outside
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('resize', computePosition);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('resize', computePosition);
    };
  }, [triggerRect, popupCorner, triggerCorner, onClose]);

  if (!triggerRect) return null;

  return (
    <div
      ref={popupRef}
      className={`${styles.popupContainer} ${styles[theme]}`}
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        visibility: visibility,
      }}
      role="menu"
    >
      {options.map((option, index) => (
        <button
          key={index}
          type="button"
          className={styles.optionItem}
          onClick={() => {
            option.action();
            onClose();
          }}
          role="menuitem"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired,
    })
  ).isRequired,
  triggerRect: PropTypes.object,
  popupCorner: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  triggerCorner: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  onClose: PropTypes.func.isRequired,
};
