import React, { createContext, useState, useEffect } from 'react';

export const UIContext = createContext(undefined);

export const UIProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  // Helper to determine device type based on standard breakpoints
  const getDeviceType = (width) => {
    if (width < 768) return 'mobile';
    if (width >= 768 && width < 1024) return 'tablet';
    return 'desktop';
  };

  // State to hold the current device type
  const [device, setDevice] = useState(() => getDeviceType(window.innerWidth));

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      // Debounce the update to optimize performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDevice(getDeviceType(window.innerWidth));
      }, 150); // Updates 150ms after the user stops resizing
    };

    window.addEventListener('resize', handleResize);
    
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <UIContext.Provider value={{ theme, setTheme, device }}>
      {children}
    </UIContext.Provider>
  );
};
