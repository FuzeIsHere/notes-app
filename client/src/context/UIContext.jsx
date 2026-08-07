import React, { createContext, useState, useEffect } from 'react';

export const UIContext = createContext(undefined);

export const UIProvider = ({ children }) => {

  const DEFAULT_THEME = 'light';
  const [theme, setTheme] = useState(localStorage.getItem('theme'));
  if (theme === null) {
    setTheme(DEFAULT_THEME)
    localStorage.setItem('theme', theme);
  }

  const changeTheme = (curr) => {
    if(typeof curr === 'function') localStorage.setItem('theme', curr(theme));
    else if(curr === 'dark' || curr === 'light') localStorage.setItem('theme', theme)
    else return;
    setTheme(curr)
  }

  const getDeviceType = (width) => {
    if (width < 768) return 'mobile';
    if (width >= 768 && width < 1024) return 'tablet';
    return 'desktop';
  };

  const [device, setDevice] = useState(() => getDeviceType(window.innerWidth));

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDevice(getDeviceType(window.innerWidth));
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <UIContext.Provider value={{ theme, setTheme : changeTheme, device }}>
      {children}
    </UIContext.Provider>
  );
};
