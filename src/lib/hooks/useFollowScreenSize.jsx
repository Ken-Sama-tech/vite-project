import React, { useEffect, useState } from 'react';
import throttle from '../utils/throttle';

function useFollowScreenSize() {
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = throttle(() => {
      setScreenSize(window.innerWidth);
    }, 400);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // console.log('Screen size changed', screenSize);
  return screenSize;
}

export default useFollowScreenSize;
