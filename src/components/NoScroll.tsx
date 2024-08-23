import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NoScrollWrapper = ({ children }) => {
  const location = useLocation();
  const [isNoScroll, setIsNoScroll] = useState(false);

  useEffect(() => {
    const noScrollRoutes = ['/', '/knowledge'];
    setIsNoScroll(noScrollRoutes.includes(location.pathname));
  }, [location]);

  useEffect(() => {
    if (isNoScroll) {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, [isNoScroll]);

  return children;
};

export default NoScrollWrapper;